'use server'

import { clerkClient, currentUser } from '@clerk/nextjs/server'
import { db } from './db'
import { redirect } from 'next/navigation'
import {
    Workspace,
    Lane,
    Plan,
    Prisma,
    Role,
    Project,
    Tag,
    Ticket,
    User,
} from '@prisma/client'
import { v4 } from 'uuid'
import {
    CreateSiteFormSchema,
    CreateMediaType,
    UpsertSitePage,
} from './types'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

export const getAuthUserDetails = async () => {
    const user = await currentUser()
    if (!user) {
        return
    }

    const userData = await db.user.findUnique({
        where: {
            email: user.emailAddresses[0].emailAddress,
        },
        include: {
            Workspace: {
                include: {
                    SidebarOption: true,
                    Project: {
                        include: {
                            SidebarOption: true,
                        },
                    },
                },
            },
            Permissions: true,
        },
    })

    return userData
}

export const saveActivityLogsNotification = async ({
    workspaceId,
    description,
    projectId,
}: {
    workspaceId?: string
    description: string
    projectId?: string
}) => {
    const authUser = await currentUser()
    let userData
    if (!authUser) {
        const response = await db.user.findFirst({
            where: {
                Workspace: {
                    Project: {
                        some: { id: projectId },
                    },
                },
            },
        })
        if (response) {
            userData = response
        }
    } else {
        userData = await db.user.findUnique({
            where: { email: authUser?.emailAddresses[0].emailAddress },
        })
    }

    if (!userData) {
        console.log('Could not find a user')
        return
    }

    let foundWorkspaceId = workspaceId
    if (!foundWorkspaceId) {
        if (!projectId) {
            throw new Error(
                'You need to provide atleast an workspace Id or project Id'
            )
        }
        const response = await db.project.findUnique({
            where: { id: projectId },
        })
        if (response) foundWorkspaceId = response.workspaceId
    }
    if (projectId) {
        await db.notification.create({
            data: {
                notification: `${userData.name} | ${description}`,
                User: {
                    connect: {
                        id: userData.id,
                    },
                },
                Workspace: {
                    connect: {
                        id: foundWorkspaceId,
                    },
                },
                Project: {
                    connect: { id: projectId },
                },
            },
        })
    } else {
        await db.notification.create({
            data: {
                notification: `${userData.name} | ${description}`,
                User: {
                    connect: {
                        id: userData.id,
                    },
                },
                Workspace: {
                    connect: {
                        id: foundWorkspaceId,
                    },
                },
            },
        })
    }
}

export const createTeamUser = async (workspaceId: string, user: User) => {
    if (user.role === 'WORKSPACE_OWNER') return null
    const response = await db.user.create({ data: { ...user } })
    return response
}

export const verifyAndAcceptInvitation = async () => {
    const user = await currentUser()
    if (!user) return redirect('/sign-in')
    const invitationExists = await db.invitation.findUnique({
        where: {
            email: user.emailAddresses[0].emailAddress,
            status: 'PENDING',
        },
    })

    if (invitationExists) {
        const userDetails = await createTeamUser(invitationExists.workspaceId, {
            email: invitationExists.email,
            workspaceId: invitationExists.workspaceId,
            avatarUrl: user.imageUrl,
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            role: invitationExists.role,
            createdAt: new Date(),
            updatedAt: new Date(),
        })
        await saveActivityLogsNotification({
            workspaceId: invitationExists?.workspaceId,
            description: `Joined`,
            projectId: undefined,
        })

        if (userDetails) {
            await clerkClient.users.updateUserMetadata(user.id, {
                privateMetadata: {
                    role: userDetails.role || 'PROJECT_USER',
                },
            })

            await db.invitation.delete({
                where: { email: userDetails.email },
            })

            return userDetails.workspaceId
        } else return null
    } else {
        const workspace = await db.user.findUnique({
            where: {
                email: user.emailAddresses[0].emailAddress,
            },
        })
        return workspace ? workspace.workspaceId : null
    }
}

export const updateWorkspaceDetails = async (
    workspaceId: string,
    workspaceDetails: Partial<Workspace>
) => {
    const response = await db.workspace.update({
        where: { id: workspaceId },
        data: { ...workspaceDetails },
    })
    return response
}

export const deleteWorkspace = async (workspaceId: string) => {
    const response = await db.workspace.delete({ where: { id: workspaceId } })
    return response
}

export const initUser = async (newUser: Partial<User>) => {
    const user = await currentUser()
    if (!user) return

    const userData = await db.user.upsert({
        where: {
            email: user.emailAddresses[0].emailAddress,
        },
        update: newUser,
        create: {
            id: user.id,
            avatarUrl: user.imageUrl,
            email: user.emailAddresses[0].emailAddress,
            name: `${user.firstName} ${user.lastName}`,
            role: newUser.role || 'PROJECT_USER',
        },
    })

    await clerkClient.users.updateUserMetadata(user.id, {
        privateMetadata: {
            role: newUser.role || 'PROJECT_USER',
        },
    })

    return userData
}

export const upsertWorkspace = async (workspace: Workspace, price?: Plan) => {
    if (!workspace.companyEmail) return null
    try {
        const workspaceDetails = await db.workspace.upsert({
            where: {
                id: workspace.id,
            },
            update: workspace,
            create: {
                users: {
                    connect: { email: workspace.companyEmail },
                },
                ...workspace,
                SidebarOption: {
                    create: [
                        {
                            name: 'Dashboard',
                            icon: 'category',
                            link: `/workspace/${workspace.id}`,
                        },
                        {
                            name: 'Launchpad',
                            icon: 'clipboardIcon',
                            link: `/workspace/${workspace.id}/launchpad`,
                        },
                        {
                            name: 'Billing',
                            icon: 'payment',
                            link: `/workspace/${workspace.id}/billing`,
                        },
                        {
                            name: 'Settings',
                            icon: 'settings',
                            link: `/workspace/${workspace.id}/settings`,
                        },
                        {
                            name: 'Sub Accounts',
                            icon: 'person',
                            link: `/workspace/${workspace.id}/all-projects`,
                        },
                        {
                            name: 'Team',
                            icon: 'shield',
                            link: `/workspace/${workspace.id}/team`,
                        },
                    ],
                },
            },
        })
        return workspaceDetails
    } catch (error) {
        console.log(error)
    }
}

export const getNotificationAndUser = async (workspaceId: string) => {
    try {
        const response = await db.notification.findMany({
            where: { workspaceId },
            include: { User: true },
            orderBy: {
                createdAt: 'desc',
            },
        })
        return response
    } catch (error) {
        console.log(error)
    }
}

export const upsertProject = async (project: Project) => {
    if (!project.companyEmail) return null
    const workspaceOwner = await db.user.findFirst({
        where: {
            Workspace: {
                id: project.workspaceId,
            },
            role: 'WORKSPACE_OWNER',
        },
    })
    if (!workspaceOwner) return console.log('🔴Erorr could not create project')
    const permissionId = v4()
    const response = await db.project.upsert({
        where: { id: project.id },
        update: project,
        create: {
            ...project,
            Permissions: {
                create: {
                    access: true,
                    email: workspaceOwner.email,
                    id: permissionId,
                },
                connect: {
                    projectId: project.id,
                    id: permissionId,
                },
            },
            Pipeline: {
                create: { name: 'Lead Cycle' },
            },
            SidebarOption: {
                create: [
                    {
                        name: 'Launchpad',
                        icon: 'clipboardIcon',
                        link: `/project/${project.id}/launchpad`,
                    },
                    {
                        name: 'Settings',
                        icon: 'settings',
                        link: `/project/${project.id}/settings`,
                    },
                    {
                        name: 'Sites',
                        icon: 'pipelines',
                        link: `/project/${project.id}/sites`,
                    },
                    {
                        name: 'Media',
                        icon: 'database',
                        link: `/project/${project.id}/media`,
                    },
                    {
                        name: 'Automations',
                        icon: 'chip',
                        link: `/project/${project.id}/automations`,
                    },
                    {
                        name: 'Pipelines',
                        icon: 'flag',
                        link: `/project/${project.id}/pipelines`,
                    },
                    {
                        name: 'Contacts',
                        icon: 'person',
                        link: `/project/${project.id}/contacts`,
                    },
                    {
                        name: 'Dashboard',
                        icon: 'category',
                        link: `/project/${project.id}`,
                    },
                ],
            },
        },
    })
    return response
}

export const getUserPermissions = async (userId: string) => {
    const response = await db.user.findUnique({
        where: { id: userId },
        select: { Permissions: { include: { Project: true } } },
    })

    return response
}

export const updateUser = async (user: Partial<User>) => {
    const response = await db.user.update({
        where: { email: user.email },
        data: { ...user },
    })

    await clerkClient.users.updateUserMetadata(response.id, {
        privateMetadata: {
            role: user.role || 'PROJECT_USER',
        },
    })

    return response
}

export const changeUserPermissions = async (
    permissionId: string | undefined,
    userEmail: string,
    projectId: string,
    permission: boolean
) => {
    try {
        const response = await db.permissions.upsert({
            where: { id: permissionId },
            update: { access: permission },
            create: {
                access: permission,
                email: userEmail,
                projectId: projectId,
            },
        })
        return response
    } catch (error) {
        console.log('🔴Could not change persmission', error)
    }
}

export const getProjectDetails = async (projectId: string) => {
    const response = await db.project.findUnique({
        where: {
            id: projectId,
        },
    })
    return response
}

export const deleteProject = async (projectId: string) => {
    const response = await db.project.delete({
        where: {
            id: projectId,
        },
    })
    return response
}

export const deleteUser = async (userId: string) => {
    await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
            role: undefined,
        },
    })
    const deletedUser = await db.user.delete({ where: { id: userId } })

    return deletedUser
}

export const getUser = async (id: string) => {
    const user = await db.user.findUnique({
        where: {
            id,
        },
    })

    return user
}

export const sendInvitation = async (
    role: Role,
    email: string,
    workspaceId: string
) => {
    const resposne = await db.invitation.create({
        data: { email, workspaceId, role },
    })

    try {
        // const invitation = await clerkClient.invitations.createInvitation({
        //     emailAddress: email,
        //     redirectUrl: process.env.NEXT_PUBLIC_URL,
        //     publicMetadata: {
        //         throughInvitation: true,
        //         role,
        //     },
        // })
    } catch (error) {
        console.log(error)
        throw error
    }

    return resposne
}

export const getMedia = async (projectId: string) => {
    const mediafiles = await db.project.findUnique({
        where: {
            id: projectId,
        },
        include: { Media: true },
    })
    return mediafiles
}

export const createMedia = async (
    projectId: string,
    mediaFile: CreateMediaType
) => {
    const response = await db.media.create({
        data: {
            link: mediaFile.link,
            name: mediaFile.name,
            projectId: projectId,
        },
    })

    return response
}

export const deleteMedia = async (mediaId: string) => {
    const response = await db.media.delete({
        where: {
            id: mediaId,
        },
    })
    return response
}

export const getPipelineDetails = async (pipelineId: string) => {
    const response = await db.pipeline.findUnique({
        where: {
            id: pipelineId,
        },
    })
    return response
}

export const getLanesWithTicketAndTags = async (pipelineId: string) => {
    const response = await db.lane.findMany({
        where: {
            pipelineId,
        },
        orderBy: { order: 'asc' },
        include: {
            Tickets: {
                orderBy: {
                    order: 'asc',
                },
                include: {
                    Tags: true,
                    Assigned: true,
                    Customer: true,
                },
            },
        },
    })
    return response
}

export const upsertSite = async (
    projectId: string,
    site: z.infer<typeof CreateSiteFormSchema> & { liveProducts: string },
    siteId: string
) => {
    const response = await db.site.upsert({
        where: { id: siteId },
        update: site,
        create: {
            ...site,
            id: siteId || v4(),
            projectId: projectId,
        },
    })

    return response
}

export const upsertPipeline = async (
    pipeline: Prisma.PipelineUncheckedCreateWithoutLaneInput
) => {
    const response = await db.pipeline.upsert({
        where: { id: pipeline.id || v4() },
        update: pipeline,
        create: pipeline,
    })

    return response
}

export const deletePipeline = async (pipelineId: string) => {
    const response = await db.pipeline.delete({
        where: { id: pipelineId },
    })
    return response
}

export const updateLanesOrder = async (lanes: Lane[]) => {
    try {
        const updateTrans = lanes.map((lane) =>
            db.lane.update({
                where: {
                    id: lane.id,
                },
                data: {
                    order: lane.order,
                },
            })
        )

        await db.$transaction(updateTrans)
        console.log('🟢 Done reordered 🟢')
    } catch (error) {
        console.log(error, 'ERROR UPDATE LANES ORDER')
    }
}

export const updateTicketsOrder = async (tickets: Ticket[]) => {
    try {
        const updateTrans = tickets.map((ticket) =>
            db.ticket.update({
                where: {
                    id: ticket.id,
                },
                data: {
                    order: ticket.order,
                    laneId: ticket.laneId,
                },
            })
        )

        await db.$transaction(updateTrans)
        console.log('🟢 Done reordered 🟢')
    } catch (error) {
        console.log(error, '🔴 ERROR UPDATE TICKET ORDER')
    }
}

export const upsertLane = async (lane: Prisma.LaneUncheckedCreateInput) => {
    let order: number

    if (!lane.order) {
        const lanes = await db.lane.findMany({
            where: {
                pipelineId: lane.pipelineId,
            },
        })

        order = lanes.length
    } else {
        order = lane.order
    }

    const response = await db.lane.upsert({
        where: { id: lane.id || v4() },
        update: lane,
        create: { ...lane, order },
    })

    return response
}

export const deleteLane = async (laneId: string) => {
    const resposne = await db.lane.delete({ where: { id: laneId } })
    return resposne
}

export const getTicketsWithTags = async (pipelineId: string) => {
    const response = await db.ticket.findMany({
        where: {
            Lane: {
                pipelineId,
            },
        },
        include: { Tags: true, Assigned: true, Customer: true },
    })
    return response
}

export const _getTicketsWithAllRelations = async (laneId: string) => {
    const response = await db.ticket.findMany({
        where: { laneId: laneId },
        include: {
            Assigned: true,
            Customer: true,
            Lane: true,
            Tags: true,
        },
    })
    return response
}

export const getProjectTeamMembers = async (projectId: string) => {
    const projectUsersWithAccess = await db.user.findMany({
        where: {
            Workspace: {
                Project: {
                    some: {
                        id: projectId,
                    },
                },
            },
            role: 'PROJECT_USER',
            Permissions: {
                some: {
                    projectId: projectId,
                    access: true,
                },
            },
        },
    })
    return projectUsersWithAccess
}

export const searchContacts = async (searchTerms: string) => {
    const response = await db.contact.findMany({
        where: {
            name: {
                contains: searchTerms,
            },
        },
    })
    return response
}

export const upsertTicket = async (
    ticket: Prisma.TicketUncheckedCreateInput,
    tags: Tag[]
) => {
    let order: number
    if (!ticket.order) {
        const tickets = await db.ticket.findMany({
            where: { laneId: ticket.laneId },
        })
        order = tickets.length
    } else {
        order = ticket.order
    }

    const response = await db.ticket.upsert({
        where: {
            id: ticket.id || v4(),
        },
        update: { ...ticket, Tags: { set: tags } },
        create: { ...ticket, Tags: { connect: tags }, order },
        include: {
            Assigned: true,
            Customer: true,
            Tags: true,
            Lane: true,
        },
    })

    return response
}

export const deleteTicket = async (ticketId: string) => {
    const response = await db.ticket.delete({
        where: {
            id: ticketId,
        },
    })

    return response
}

export const upsertTag = async (
    projectId: string,
    tag: Prisma.TagUncheckedCreateInput
) => {
    const response = await db.tag.upsert({
        where: { id: tag.id || v4(), projectId: projectId },
        update: tag,
        create: { ...tag, projectId: projectId },
    })

    return response
}

export const getTagsForProject = async (projectId: string) => {
    const response = await db.project.findUnique({
        where: { id: projectId },
        select: { Tags: true },
    })
    return response
}

export const deleteTag = async (tagId: string) => {
    const response = await db.tag.delete({ where: { id: tagId } })
    return response
}

export const upsertContact = async (
    contact: Prisma.ContactUncheckedCreateInput
) => {
    const response = await db.contact.upsert({
        where: { id: contact.id || v4() },
        update: contact,
        create: contact,
    })
    return response
}

export const getSites = async (subacountId: string) => {
    const sites = await db.site.findMany({
        where: { projectId: subacountId },
        include: { SitePages: true },
    })

    return sites
}

export const getSite = async (siteId: string) => {
    const site = await db.site.findUnique({
        where: { id: siteId },
        include: {
            SitePages: {
                orderBy: {
                    order: 'asc',
                },
            },
        },
    })

    return site
}

export const updateSiteProducts = async (
    products: string,
    siteId: string
) => {
    const data = await db.site.update({
        where: { id: siteId },
        data: { liveProducts: products },
    })
    return data
}

export const upsertSitePage = async (
    projectId: string,
    sitePage: UpsertSitePage,
    siteId: string
) => {
    if (!projectId || !siteId) return
    const response = await db.sitePage.upsert({
        where: { id: sitePage.id || '' },
        update: { ...sitePage },
        create: {
            ...sitePage,
            content: sitePage.content
                ? sitePage.content
                : JSON.stringify([
                    {
                        content: [],
                        id: '__body',
                        name: 'Body',
                        styles: { backgroundColor: 'white' },
                        type: '__body',
                    },
                ]),
            siteId,
        },
    })

    revalidatePath(`/project/${projectId}/sites/${siteId}`, 'page')
    return response
}

export const deleteSiteePage = async (sitePageId: string) => {
    const response = await db.sitePage.delete({ where: { id: sitePageId } })

    return response
}

export const getSitePageDetails = async (sitePageId: string) => {
    const response = await db.sitePage.findUnique({
        where: {
            id: sitePageId,
        },
    })

    return response
}

export const getDomainContent = async (subDomainName: string) => {
    const response = await db.site.findUnique({
        where: {
            subDomainName,
        },
        include: { SitePages: true },
    })
    return response
}

export const getPipelines = async (projectId: string) => {
    const response = await db.pipeline.findMany({
        where: { projectId: projectId },
        include: {
            Lane: {
                include: { Tickets: true },
            },
        },
    })
    return response
}
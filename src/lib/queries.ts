'use server'

import { clerkClient, currentUser } from '@clerk/nextjs/server'
import { db } from './db'
import { redirect } from 'next/navigation'
import {
    Workspace,
    Plan,
    Prisma,
    Role,
    Project,
    User,
    Form,
    Field,
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
    if (!workspace.workEmail) return null
    try {
        const workspaceDetails = await db.workspace.upsert({
            where: {
                id: workspace.id,
            },
            update: workspace,
            create: {
                users: {
                    connect: { email: workspace.workEmail },
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
                            name: 'Settings',
                            icon: 'settings',
                            link: `/workspace/${workspace.id}/settings`,
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
    if (!project.workEmail) return null
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
                        name: 'Forms',
                        icon: 'star',
                        link: `/project/${project.id}/forms`,
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

export const upsertSite = async (
    projectId: string,
    site: z.infer<typeof CreateSiteFormSchema> & { liveProducts: string },
    siteId: string
) => {
    const response = await db.project.update({
        where: { id: projectId },
        data: {
            Site: {
                upsert: {
                    update: site,
                    create: {
                        ...site,
                        id: siteId,
                    },
                },
            },
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

export const getProjectSite = async (projectId: string) => {
    const site = await db.site.findUnique({
        where: { projectId: projectId },
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
    revalidatePath(`/project/${projectId}/sites`)
    return response
}

export const deleteSitePage = async (sitePageId: string) => {
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

export const getForms = async (projectId: string) => {
    const forms = await db.form.findMany({
        where: {
            projectId,
        },
        include: {
            Fields: {
                orderBy: {
                    order: 'asc',
                },
                include: {
                    Responses: true,
                }
            }
        },
    })
    return forms
}

export type FormWithFields = Form & {
    Fields: Field[];
};
export async function getFormById(formId: string): Promise<FormWithFields | null> {
    try {
        const form = await db.form.findUnique({
            where: { id: formId },
            include: {
                Fields: {
                    orderBy: {
                        order: 'asc',
                    },
                },
            },
        });

        return form;
    } catch (error) {
        console.error('Error getting form:', error);
        throw new Error('Failed to get form');
    }
}

export async function getFormWithResponses(formId: string) {
    try {
        const form = await db.form.findUnique({
            where: { id: formId },
            include: {
                Fields: {
                    orderBy: {
                        order: 'asc',
                    },
                    include: {
                        Responses: true
                    }
                },
            }
        });

        return form;
    } catch (error) {
        console.error('Error getting form with responses:', error);
        throw new Error('Failed to get form with responses');
    }
}
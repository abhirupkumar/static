import ProjectDetails from '@/components/forms/project-details'
import SiteForm from '@/components/forms/site-form'
import UserDetails from '@/components/forms/user-details'
import BlurPage from '@/components/global/blur-page'
import { db } from '@/lib/db'
import { currentUser } from '@clerk/nextjs/server'
import React from 'react'

type Props = {
    params: Promise<{ projectId: string }>
}

const ProjectSettingPage = async (props: Props) => {
    const params = await props.params;
    const authUser = await currentUser()
    if (!authUser) return
    const userDetails = await db.user.findUnique({
        where: {
            email: authUser.emailAddresses[0].emailAddress,
        },
    })
    if (!userDetails) return

    const project = await db.project.findUnique({
        where: { id: params.projectId },
        include: { Site: true }
    })
    if (!project) return

    const workspaceDetails = await db.workspace.findUnique({
        where: { id: project.workspaceId },
        include: { Project: true },
    })

    if (!workspaceDetails) return
    const projects = workspaceDetails.Project

    return (
        <BlurPage>
            <div className="flex lg:!flex-row flex-col gap-4">
                {project?.Site && <SiteForm defaultData={project?.Site} projectId={params.projectId} />}
                <ProjectDetails
                    workspaceDetails={workspaceDetails}
                    details={project}
                    userId={userDetails.id}
                    userName={userDetails.name}
                />
                <UserDetails
                    type="project"
                    id={params.projectId}
                    projects={projects}
                    userData={userDetails}
                />
            </div>
        </BlurPage>
    )
}

export default ProjectSettingPage
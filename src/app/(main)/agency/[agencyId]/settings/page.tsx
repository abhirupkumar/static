import WorkspaceDetails from '@/components/forms/workspace-details'
import UserDetails from '@/components/forms/user-details'
import { db } from '@/lib/db'
import { currentUser } from '@clerk/nextjs/server'
import React from 'react'

type Props = {
    params: { workspaceId: string }
}

const SettingsPage = async ({ params }: Props) => {
    const authUser = await currentUser()
    if (!authUser) return null

    const userDetails = await db.user.findUnique({
        where: {
            email: authUser.emailAddresses[0].emailAddress,
        },
    })

    if (!userDetails) return null
    const workspaceDetails = await db.workspace.findUnique({
        where: {
            id: params.workspaceId,
        },
        include: {
            Project: true,
        },
    })

    if (!workspaceDetails) return null

    const projects = workspaceDetails.Project

    return (
        <div className="flex lg:!flex-row flex-col gap-4">
            <WorkspaceDetails data={workspaceDetails} />
            <UserDetails
                type="workspace"
                id={params.workspaceId}
                projects={projects}
                userData={userDetails}
            />
        </div>
    )
}

export default SettingsPage
import ProjectDetails from '@/components/forms/project-details'
import UserDetails from '@/components/forms/user-details'
import { db } from '@/lib/db'
import { currentUser } from '@clerk/nextjs/server'
import React from 'react'

type Props = {
    params: { projectId: string }
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
    const projectDetails = await db.project.findUnique({
        where: {
            id: params.projectId,
        },
        include: {
            SubAccount: true,
        },
    })

    if (!projectDetails) return null

    const subAccounts = projectDetails.SubAccount

    return (
        <div className="flex lg:!flex-row flex-col gap-4">
            <ProjectDetails data={projectDetails} />
            <UserDetails
                type="project"
                id={params.projectId}
                subAccounts={subAccounts}
                userData={userDetails}
            />
        </div>
    )
}

export default SettingsPage
import InfoBar from '@/components/global/infobar'
import Sidebar from '@/components/sidebar'
import Unauthorized from '@/components/unauthorized'
import {
    getAuthUserDetails,
    getNotificationAndUser,
    verifyAndAcceptInvitation,
} from '@/lib/queries'
import { currentUser } from '@clerk/nextjs/server'
import { Role } from '@prisma/client'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
    children: React.ReactNode
    params: { projectId: string }
}

const ProjectLayout = async ({ children, params }: Props) => {
    const workspaceId = await verifyAndAcceptInvitation()
    if (!workspaceId) return <Unauthorized />
    const user = await currentUser()
    if (!user) {
        return redirect('/')
    }

    let notifications: any = []

    if (!user.privateMetadata.role) {
        return <Unauthorized />
    } else {
        const allPermissions = await getAuthUserDetails()
        const hasPermission = allPermissions?.Permissions.find(
            (permissions) =>
                permissions.access && permissions.projectId === params.projectId
        )
        if (!hasPermission) {
            return <Unauthorized />
        }

        const allNotifications = await getNotificationAndUser(workspaceId)

        if (
            user.privateMetadata.role === 'WORKSPACE_ADMIN' ||
            user.privateMetadata.role === 'WORKSPACE_OWNER'
        ) {
            notifications = allNotifications
        } else {
            const filteredNoti = allNotifications?.filter(
                (item) => item.projectId === params.projectId
            )
            if (filteredNoti) notifications = filteredNoti
        }
    }

    return (
        <div className="h-screen overflow-hidden">
            <Sidebar
                id={params.projectId}
                type="project"
            />

            <div className="md:pl-[300px]">
                <InfoBar
                    notifications={notifications}
                    role={user.privateMetadata.role as Role}
                    projectId={params.projectId as string}
                />
                <div className="relative">{children}</div>
            </div>
        </div>
    )
}

export default ProjectLayout
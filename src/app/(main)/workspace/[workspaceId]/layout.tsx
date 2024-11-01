import BlurPage from '@/components/global/blur-page'
import InfoBar from '@/components/global/infobar'
import Sidebar from '@/components/sidebar'
import Unauthorized from '@/components/unauthorized'
import {
    getNotificationAndUser,
    verifyAndAcceptInvitation,
} from '@/lib/queries'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
    children: React.ReactNode
    params: Promise<{ workspaceId: string }>
}

const layout = async (props: Props) => {
    const params = await props.params;

    const {
        children
    } = props;

    const workspaceId = await verifyAndAcceptInvitation()
    const user = await currentUser()

    if (!user) {
        return redirect('/')
    }

    if (!workspaceId) {
        return redirect('/workspace')
    }

    if (
        user.privateMetadata.role !== 'WORKSPACE_OWNER' &&
        user.privateMetadata.role !== 'WORKSPACE_ADMIN'
    )
        return <Unauthorized />

    let allNoti: any = []
    const notifications = await getNotificationAndUser(workspaceId)
    if (notifications) allNoti = notifications



    return (
        <div className="h-screen overflow-hidden">
            <Sidebar
                id={params.workspaceId}
                type="workspace"
            />
            <div className="md:pl-[300px]">
                <InfoBar
                    notifications={allNoti}
                    role={allNoti.User?.role}
                />
                <div className="relative">
                    <BlurPage>{children}</BlurPage>
                </div>
            </div>
        </div>
    )
}

export default layout
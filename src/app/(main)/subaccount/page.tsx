import Unauthorized from '@/components/unauthorized'
import { getAuthUserDetails, verifyAndAcceptInvitation } from '@/lib/queries'
import { constructMetadata } from '@/lib/utils'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
    searchParams: { state: string; code: string }
}

const ProjectMainPage = async ({ searchParams }: Props) => {
    const workspaceId = await verifyAndAcceptInvitation();
    if (!workspaceId) {
        return <Unauthorized />
    }

    const user = await getAuthUserDetails();
    if (!user) return

    const getFirstProjectWithAccess = user.Permissions.find(
        (permission) => permission.access === true
    )

    if (searchParams.state) {
        const statePath = searchParams.state.split('___')[0]
        const stateProjectId = searchParams.state.split('___')[1]
        if (!stateProjectId) return <Unauthorized />
        return redirect(
            `/project/${stateProjectId}/${statePath}?code=${searchParams.code}`
        )
    }

    if (getFirstProjectWithAccess) {
        return redirect(`/project/${getFirstProjectWithAccess.projectId}`)
    }

    return <Unauthorized />
}

export default ProjectMainPage


export const metadata = constructMetadata({
    title: "Subaacount - Zyper",
});
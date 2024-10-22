import { getAuthUserDetails } from '@/lib/queries'
import { off } from 'process'
import React from 'react'
import MenuOptions from './menu-options'

type Props = {
    id: string
    type: 'workspace' | 'project'
}

const Sidebar = async ({ id, type }: Props) => {
    const user = await getAuthUserDetails()
    if (!user) return null

    if (!user.Workspace) return

    const details =
        type === 'workspace'
            ? user?.Workspace
            : user?.Workspace.Project.find((project) => project.id === id)

    const isWhiteLabeledWorkspace = user.Workspace.whiteLabel
    if (!details) return

    let sideBarLogo = '/assets/logo.png'

    if (!isWhiteLabeledWorkspace) {
        if (type === 'project') {
            sideBarLogo =
                user?.Workspace.Project.find((project) => project.id === id)
                    ?.projectLogo || '/assets/logo.png'
        }
    }

    const sidebarOpt =
        type === 'workspace'
            ? user.Workspace.SidebarOption || []
            : user.Workspace.Project.find((project) => project.id === id)
                ?.SidebarOption || []

    const projects = user.Workspace.Project.filter((project) =>
        user.Permissions.find(
            (permission) =>
                permission.projectId === project.id && permission.access
        )
    )

    return (
        <>
            <MenuOptions
                defaultOpen={true}
                details={details}
                id={id}
                sidebarLogo={sideBarLogo}
                sidebarOpt={sidebarOpt}
                projects={projects}
                user={user}
            />
            <MenuOptions
                defaultOpen={false}
                details={details}
                id={id}
                sidebarLogo={sideBarLogo}
                sidebarOpt={sidebarOpt}
                projects={projects}
                user={user}
            />
        </>
    )
}

export default Sidebar
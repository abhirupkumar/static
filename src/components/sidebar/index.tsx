import { getAuthUserDetails } from '@/lib/queries'
import { off } from 'process'
import React from 'react'
import MenuOptions from './menu-options'

type Props = {
    id: string
    type: 'project' | 'subaccount'
}

const Sidebar = async ({ id, type }: Props) => {
    const user = await getAuthUserDetails()
    if (!user) return null

    if (!user.Project) return

    const details =
        type === 'project'
            ? user?.Project
            : user?.Project.SubAccount.find((subaccount) => subaccount.id === id)

    const isWhiteLabeledProject = user.Project.whiteLabel
    if (!details) return

    let sideBarLogo = user.Project.projectLogo || '/assets/plura-logo.svg'

    if (!isWhiteLabeledProject) {
        if (type === 'subaccount') {
            sideBarLogo =
                user?.Project.SubAccount.find((subaccount) => subaccount.id === id)
                    ?.subAccountLogo || user.Project.projectLogo
        }
    }

    const sidebarOpt =
        type === 'project'
            ? user.Project.SidebarOption || []
            : user.Project.SubAccount.find((subaccount) => subaccount.id === id)
                ?.SidebarOption || []

    const subaccounts = user.Project.SubAccount.filter((subaccount) =>
        user.Permissions.find(
            (permission) =>
                permission.subAccountId === subaccount.id && permission.access
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
                subAccounts={subaccounts}
                user={user}
            />
            <MenuOptions
                defaultOpen={false}
                details={details}
                id={id}
                sidebarLogo={sideBarLogo}
                sidebarOpt={sidebarOpt}
                subAccounts={subaccounts}
                user={user}
            />
        </>
    )
}

export default Sidebar
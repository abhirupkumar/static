import { db } from '@/lib/db'
import React from 'react'
import DataTable from './data-table'
import { Plus } from 'lucide-react'
import { currentUser } from '@clerk/nextjs/server'
import { columns } from './columns'
import SendInvitation from '@/components/forms/send-invitation'

type Props = {
    params: Promise<{ workspaceId: string }>
}

const TeamPage = async (props: Props) => {
    const params = await props.params;
    const authUser = await currentUser()
    const teamMembers = await db.user.findMany({
        where: {
            Workspace: {
                id: params.workspaceId,
            },
        },
        include: {
            Workspace: { include: { Project: true } },
            Permissions: { include: { Project: true } },
        },
    })

    if (!authUser) return null
    const workspaceDetails = await db.workspace.findUnique({
        where: {
            id: params.workspaceId,
        },
        include: {
            Project: true,
        },
    })

    if (!workspaceDetails) return

    return (
        <DataTable
            actionButtonText={
                <>
                    <Plus size={15} />
                    Add
                </>
            }
            modalChildren={<SendInvitation workspaceId={workspaceDetails.id} />}
            filterValue="name"
            columns={columns}
            data={teamMembers}
        ></DataTable>
    )
}

export default TeamPage
import { db } from '@/lib/db'
import React from 'react'
import DataTable from './data-table'
import { Plus } from 'lucide-react'
import { currentUser } from '@clerk/nextjs/server'
import { columns } from './columns'
import SendInvitation from '@/components/forms/send-invitation'

type Props = {
    params: { projectId: string }
}

const TeamPage = async ({ params }: Props) => {
    const authUser = await currentUser()
    const teamMembers = await db.user.findMany({
        where: {
            Project: {
                id: params.projectId,
            },
        },
        include: {
            Project: { include: { SubAccount: true } },
            Permissions: { include: { SubAccount: true } },
        },
    })

    if (!authUser) return null
    const projectDetails = await db.project.findUnique({
        where: {
            id: params.projectId,
        },
        include: {
            SubAccount: true,
        },
    })

    if (!projectDetails) return

    return (
        <DataTable
            actionButtonText={
                <>
                    <Plus size={15} />
                    Add
                </>
            }
            modalChildren={<SendInvitation projectId={projectDetails.id} />}
            filterValue="name"
            columns={columns}
            data={teamMembers}
        ></DataTable>
    )
}

export default TeamPage
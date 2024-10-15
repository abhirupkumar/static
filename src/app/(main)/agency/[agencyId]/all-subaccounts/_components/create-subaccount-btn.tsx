'use client'
import ProjectDetails from '@/components/forms/project-details'
import CustomModal from '@/components/global/custom-modal'
import { Button } from '@/components/ui/button'
import { useModal } from '@/providers/modal-provider'
import { Workspace, WorkspaceSidebarOption, Project, User } from '@prisma/client'
import { PlusCircleIcon } from 'lucide-react'
import React from 'react'
import { twMerge } from 'tailwind-merge'

type Props = {
    user: User & {
        Workspace:
        | (
            | Workspace
            | (null & {
                Project: Project[]
                SideBarOption: WorkspaceSidebarOption[]
            })
        )
        | null
    }
    id: string
    className: string
}

const CreateProjectButton = ({ className, id, user }: Props) => {
    const { setOpen } = useModal()
    const workspaceDetails = user.Workspace

    if (!workspaceDetails) return

    return (
        <Button
            className={twMerge('w-full flex gap-4', className)}
            onClick={() => {
                setOpen(
                    <CustomModal
                        title="Create a Project"
                        subheading="You can switch bettween"
                    >
                        <ProjectDetails
                            workspaceDetails={workspaceDetails}
                            userId={user.id}
                            userName={user.name}
                        />
                    </CustomModal>
                )
            }}
        >
            <PlusCircleIcon size={15} />
            Create Sub Account
        </Button>
    )
}

export default CreateProjectButton
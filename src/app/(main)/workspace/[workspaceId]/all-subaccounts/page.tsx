import { AlertDescription } from '@/components/ui/alert'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command'
import { getAuthUserDetails } from '@/lib/queries'
import { Project } from '@prisma/client'
import Image from 'next/image'
import Link from 'next/link'

import React from 'react'
import DeleteButton from './_components/delete-button'
import CreateProjectButton from './_components/create-project-btn'

type Props = {
    params: { workspaceId: string }
}

const AllProjectsPage = async ({ params }: Props) => {
    const user = await getAuthUserDetails()
    if (!user) return

    return (
        <AlertDialog>
            <div className="flex flex-col ">
                <CreateProjectButton
                    user={user}
                    id={params.workspaceId}
                    className="w-[200px] self-end m-6"
                />
                <Command className="rounded-lg bg-transparent">
                    <CommandInput placeholder="Search Account..." />
                    <CommandList>
                        <CommandEmpty>No Results Found.</CommandEmpty>
                        <CommandGroup heading="Sub Accounts">
                            {!!user.Workspace?.Project.length ? (
                                user.Workspace.Project.map((project: Project) => (
                                    <CommandItem
                                        key={project.id}
                                        className="h-32 !bg-background my-2 text-primary border-[1px] border-border p-4 rounded-lg hover:!bg-background cursor-pointer transition-all"
                                    >
                                        <Link
                                            href={`/project/${project.id}`}
                                            className="flex gap-4 w-full h-full"
                                        >
                                            <div className="relative w-32">
                                                <Image
                                                    src={project.projectLogo}
                                                    alt="project logo"
                                                    fill
                                                    className="rounded-md object-contain bg-muted/50 p-4"
                                                />
                                            </div>
                                            <div className="flex flex-col justify-between">
                                                <div className="flex flex-col">
                                                    {project.name}
                                                    <span className="text-muted-foreground text-xs">
                                                        {project.address}
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                size={'sm'}
                                                variant={'destructive'}
                                                className="w-20 hover:bg-red-600 hover:text-white !text-white"
                                            >
                                                Delete
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle className="text-left">
                                                    Are your absolutely sure
                                                </AlertDialogTitle>
                                                <AlertDescription className="text-left">
                                                    This action cannot be undon. This will delete the
                                                    project and all data related to the project.
                                                </AlertDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter className="flex items-center">
                                                <AlertDialogCancel className="mb-2">
                                                    Cancel
                                                </AlertDialogCancel>
                                                <AlertDialogAction className="bg-destructive hover:bg-destructive">
                                                    <DeleteButton projectId={project.id} />
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </CommandItem>
                                ))
                            ) : (
                                <div className="text-muted-foreground text-center p-4">
                                    No Sub accounts
                                </div>
                            )}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </div>
        </AlertDialog>
    )
}

export default AllProjectsPage
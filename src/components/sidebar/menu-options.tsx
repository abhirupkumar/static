'use client'

import {
    Workspace,
    WorkspaceSidebarOption,
    Project,
    ProjectSidebarOption,
} from '@prisma/client'
import React, { useEffect, useMemo, useState } from 'react'
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from '../ui/sheet'
import { Button } from '../ui/button'
import { ChevronsUpDown, Compass, Menu, PlusCircleIcon } from 'lucide-react'
import clsx from 'clsx'
import { AspectRatio } from '../ui/aspect-ratio'
import Image from 'next/image'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '../ui/command'
import Link from 'next/link'
import { twMerge } from 'tailwind-merge'
import { useModal } from '@/providers/modal-provider'
import CustomModal from '../global/custom-modal'
import ProjectDetails from '../forms/project-details'
import { Separator } from '../ui/separator'
import { icons } from '@/lib/constants'

type Props = {
    defaultOpen: boolean
    projects: Project[]
    sidebarOpt: WorkspaceSidebarOption[] | ProjectSidebarOption[]
    sidebarLogo: string
    details: any
    user: any
    id: string
}

const MenuOptions = ({
    details,
    id,
    sidebarLogo,
    sidebarOpt,
    projects,
    user,
    defaultOpen,
}: Props) => {
    const { setOpen } = useModal()
    const [isMounted, setIsMounted] = useState(false)

    const openState = useMemo(
        () => (defaultOpen ? { open: true } : {}),
        [defaultOpen]
    )

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) return

    const truncate = (str: string) => {
        return str.length > 20 ? str.substring(0, 20) + '...' : str
    }

    return (
        <Sheet
            modal={false}
            {...openState}
        >
            <SheetTrigger
                asChild
                className="absolute left-4 top-4 z-[100] md:!hidden felx"
            >
                <Button
                    variant="outline"
                    size={'icon'}
                >
                    <Menu />
                </Button>
            </SheetTrigger>

            <SheetContent
                showX={!defaultOpen}
                side={'left'}
                className={clsx(
                    'bg-background/80 backdrop-blur-xl fixed top-0 border-r-[1px] p-6',
                    {
                        'hidden md:inline-block z-0 w-[300px]': defaultOpen,
                        'inline-block md:hidden z-[100] w-full': !defaultOpen,
                    }
                )}
            >
                <SheetTitle>
                    <AspectRatio ratio={16 / 5}>
                        <Image
                            src={sidebarLogo}
                            alt="Sidebar Logo"
                            fill
                            className="rounded-md object-contain"
                        />
                    </AspectRatio>
                </SheetTitle>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            className="w-full my-4 flex items-center justify-between py-8"
                            variant="ghost"
                        >
                            <div className="flex items-center text-left gap-2">
                                <Compass />
                                <div className="flex flex-col">
                                    {details.name}
                                    {details.address ? <span className="text-muted-foreground">
                                        {truncate(details.address)}
                                    </span> : <span className="text-muted-foreground">
                                        {truncate(details.workEmail)}
                                    </span>}
                                </div>
                            </div>
                            <div>
                                <ChevronsUpDown
                                    size={16}
                                    className="text-muted-foreground"
                                />
                            </div>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 h-80 mt-4 z-[200]">
                        <Command className="rounded-lg">
                            <CommandInput placeholder="Search Projects..." />
                            <CommandList className="pb-16">
                                <CommandEmpty> No results found</CommandEmpty>
                                {(user?.role === 'WORKSPACE_OWNER' ||
                                    user?.role === 'WORKSPACE_ADMIN') &&
                                    user?.Workspace && (
                                        <CommandGroup heading="Workspace">
                                            <CommandItem className="!bg-transparent my-2 text-primary broder-[1px] border-border p-2 rounded-md hover:!bg-muted cursor-pointer transition-all">
                                                {defaultOpen ? (
                                                    <Link
                                                        href={`/workspace/${user?.Workspace?.id}`}
                                                        className="flex gap-4 w-full h-full"
                                                    >
                                                        <div className="relative w-16">
                                                            <Compass />
                                                        </div>
                                                        <div className="flex flex-col flex-1">
                                                            {user?.Workspace?.name}
                                                            <span className="text-muted-foreground">
                                                                {user?.Workspace?.address}
                                                            </span>
                                                        </div>
                                                    </Link>
                                                ) : (
                                                    <SheetClose asChild>
                                                        <Link
                                                            href={`/workspace/${user?.Workspace?.id}`}
                                                            className="flex gap-4 w-full h-full"
                                                        >
                                                            <div className="relative w-16">
                                                                <Image
                                                                    src={user?.Workspace?.workspaceLogo}
                                                                    alt="Workspace Logo"
                                                                    fill
                                                                    className="rounded-md object-contain"
                                                                />
                                                            </div>
                                                            <div className="flex flex-col flex-1">
                                                                {user?.Workspace?.name}
                                                                <span className="text-muted-foreground">
                                                                    {user?.Workspace?.address}
                                                                </span>
                                                            </div>
                                                        </Link>
                                                    </SheetClose>
                                                )}
                                            </CommandItem>
                                        </CommandGroup>
                                    )}
                                <CommandGroup heading="Projects">
                                    {!!projects
                                        ? projects.map((project) => (
                                            <CommandItem key={project.id}>
                                                {defaultOpen ? (
                                                    <Link
                                                        href={`/project/${project.id}`}
                                                        className="flex gap-4 w-full h-full"
                                                    >
                                                        <div className="relative w-16">
                                                            <Image
                                                                src={project.projectLogo || '/assets/logo.png'}
                                                                alt="project Logo"
                                                                fill
                                                                className="rounded-md object-contain"
                                                            />
                                                        </div>
                                                        <div className="flex flex-col flex-1">
                                                            {project.name}
                                                            <span className="text-muted-foreground">
                                                                {project.address}
                                                            </span>
                                                        </div>
                                                    </Link>
                                                ) : (
                                                    <SheetClose asChild>
                                                        <Link
                                                            href={`/project/${project.id}`}
                                                            className="flex gap-4 w-full h-full"
                                                        >
                                                            <div className="relative w-16">
                                                                <Image
                                                                    src={project.projectLogo || '/assets/logo.png'}
                                                                    alt="project Logo"
                                                                    fill
                                                                    className="rounded-md object-contain"
                                                                />
                                                            </div>
                                                            <div className="flex flex-col flex-1">
                                                                {project.name}
                                                                <span className="text-muted-foreground">
                                                                    {project.address}
                                                                </span>
                                                            </div>
                                                        </Link>
                                                    </SheetClose>
                                                )}
                                            </CommandItem>
                                        ))
                                        : 'No Projects'}
                                </CommandGroup>
                            </CommandList>
                            {(user?.role === 'WORKSPACE_OWNER' ||
                                user?.role === 'WORKSPACE_ADMIN') && (
                                    // <SheetClose>
                                    <Button
                                        className="w-full flex gap-2"
                                        onClick={() => setOpen(
                                            <CustomModal
                                                title="Create A Project"
                                                subheading="You can switch between your workspace and the project from the sidebar"
                                            >
                                                <ProjectDetails
                                                    isCreatingProject={true}
                                                    workspaceDetails={user?.Workspace as Workspace}
                                                    userId={user?.id as string}
                                                    userName={user?.name}
                                                />
                                            </CustomModal>
                                        )
                                        }
                                    >
                                        <PlusCircleIcon size={15} />
                                        Create Project
                                    </Button>
                                    // </SheetClose>
                                )}
                        </Command>
                    </PopoverContent>
                </Popover>
                <p className="text-muted-foreground text-xs mb-2">MENU LINKS</p>
                <Separator className="mb-4" />
                <nav className="relative">
                    <Command className="rounded-lg overflow-visible bg-transparent">
                        <CommandInput placeholder="Search..." />
                        <CommandList className="py-4 overflow-visible">
                            <CommandEmpty>No Results Found</CommandEmpty>
                            <CommandGroup className="overflow-visible">
                                {sidebarOpt.map((sidebarOptions) => {
                                    let val
                                    const result = icons.find(
                                        (icon) => icon.value === sidebarOptions.icon
                                    )
                                    if (result) {
                                        val = <result.path />
                                    }
                                    return (
                                        <CommandItem
                                            key={sidebarOptions.id}
                                            className="md:w-[320px] w-full"
                                        >
                                            <Link
                                                href={sidebarOptions.link}
                                                className="flex items-center gap-2 hover:bg-transparent rounded-md transition-all md:w-full w-[320px]"
                                            >
                                                {val}
                                                <span>{sidebarOptions.name}</span>
                                            </Link>
                                        </CommandItem>
                                    )
                                })}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </nav>
            </SheetContent>
        </Sheet>
    )
}

export default MenuOptions
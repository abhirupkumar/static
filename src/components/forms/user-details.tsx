'use client'
import {
    AuthUserWithWorkspaceSigebarOptionsProjects,
    UserWithPermissionsAndProjects,
} from '@/lib/types'
import { useModal } from '@/providers/modal-provider'
import { Project, User } from '@prisma/client'
import React, { useEffect, useState } from 'react'
import { useToast } from '../ui/use-toast'
import { useRouter } from 'next/navigation'
import {
    changeUserPermissions,
    getAuthUserDetails,
    getUserPermissions,
    saveActivityLogsNotification,
    updateUser,
} from '@/lib/queries'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '../ui/card'

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import FileUpload from '../global/file-upload'
import { Input } from '../ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select'
import { Button } from '../ui/button'
import Loading from '../global/loading'
import { Separator } from '../ui/separator'
import { Switch } from '../ui/switch'
import { v4 } from 'uuid'

type Props = {
    id: string | null
    type: 'workspace' | 'project'
    userData?: Partial<User>
    projects?: Project[]
}

const UserDetails = ({ id, type, projects, userData }: Props) => {
    const [projectPermissions, setProjectsPermissions] =
        useState<UserWithPermissionsAndProjects | null>(null)

    const { data, setClose } = useModal()
    const [roleState, setRoleState] = useState('')
    const [loadingPermissions, setLoadingPermissions] = useState(false)
    const [authUserData, setAuthUserData] =
        useState<AuthUserWithWorkspaceSigebarOptionsProjects | null>(null)
    const { toast } = useToast()
    const router = useRouter()

    //Get authUserDtails

    useEffect(() => {
        if (data.user) {
            const fetchDetails = async () => {
                const response = await getAuthUserDetails()
                if (response) setAuthUserData(response)
            }
            fetchDetails()
        }
    }, [data])

    const userDataSchema = z.object({
        name: z.string().min(1),
        email: z.string().email(),
        avatarUrl: z.string(),
        role: z.enum([
            'WORKSPACE_OWNER',
            'WORKSPACE_ADMIN',
            'PROJECT_USER',
            'PROJECT_GUEST',
        ]),
    })

    const form = useForm<z.infer<typeof userDataSchema>>({
        resolver: zodResolver(userDataSchema),
        mode: 'onChange',
        defaultValues: {
            name: userData ? userData.name : data?.user?.name,
            email: userData ? userData.email : data?.user?.email,
            avatarUrl: userData ? userData.avatarUrl : data?.user?.avatarUrl,
            role: userData ? userData.role : data?.user?.role,
        },
    })

    useEffect(() => {
        if (!data.user) return
        const getPermissions = async () => {
            if (!data.user) return
            const permission = await getUserPermissions(data.user.id)
            setProjectsPermissions(permission)
        }
        getPermissions()
    }, [data, form])

    useEffect(() => {
        if (data.user) {
            form.reset(data.user)
        }
        if (userData) {
            form.reset(userData)
        }
    }, [userData, data])

    const onChangePermission = async (
        projectId: string,
        val: boolean,
        permissionsId: string | undefined
    ) => {
        if (!data.user?.email) return
        setLoadingPermissions(true)
        const response = await changeUserPermissions(
            permissionsId ? permissionsId : v4(),
            data.user.email,
            projectId,
            val
        )
        if (type === 'workspace') {
            await saveActivityLogsNotification({
                workspaceId: authUserData?.Workspace?.id,
                description: `Gave ${userData?.name} access to | ${projectPermissions?.Permissions.find(
                    (p) => p.projectId === projectId
                )?.Project.name
                    } `,
                projectId: projectPermissions?.Permissions.find(
                    (p) => p.projectId === projectId
                )?.Project.id,
            })
        }

        if (response) {
            toast({
                title: 'Success',
                description: 'The request was successfull',
            })
            if (projectPermissions) {
                projectPermissions.Permissions.find((perm) => {
                    if (perm.projectId === projectId) {
                        return { ...perm, access: !perm.access }
                    }
                    return perm
                })
            }
        } else {
            toast({
                variant: 'destructive',
                title: 'Failed',
                description: 'Could not update permissions',
            })
        }
        router.refresh()
        setLoadingPermissions(false)
    }

    const onSubmit = async (values: z.infer<typeof userDataSchema>) => {
        if (!id) return
        if (userData || data?.user) {
            const updatedUser = await updateUser(values)
            authUserData?.Workspace?.Project.filter((subacc) =>
                authUserData.Permissions.find(
                    (p) => p.projectId === subacc.id && p.access
                )
            ).forEach(async (project) => {
                await saveActivityLogsNotification({
                    workspaceId: undefined,
                    description: `Updated ${userData?.name} information`,
                    projectId: project.id,
                })
            })

            if (updatedUser) {
                toast({
                    title: 'Success',
                    description: 'Update User Information',
                })
                setClose()
                router.refresh()
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Oppse!',
                    description: 'Could not update user information',
                })
            }
        } else {
            console.log('Error could not submit')
        }
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>User Details</CardTitle>
                <CardDescription>Add or update your information</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <FormField
                            disabled={form.formState.isSubmitting}
                            control={form.control}
                            name="avatarUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Profile picture</FormLabel>
                                    <FormControl>
                                        <FileUpload
                                            apiEndpoint="avatar"
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            disabled={form.formState.isSubmitting}
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel>User full name</FormLabel>
                                    <FormControl>
                                        <Input
                                            required
                                            placeholder="Full Name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            disabled={form.formState.isSubmitting}
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            readOnly={
                                                userData?.role === 'WORKSPACE_OWNER' ||
                                                form.formState.isSubmitting
                                            }
                                            placeholder="Email"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            disabled={form.formState.isSubmitting}
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel> User Role</FormLabel>
                                    <Select
                                        disabled={field.value === 'WORKSPACE_OWNER'}
                                        onValueChange={(value) => {
                                            if (
                                                value === 'PROJECT_USER' ||
                                                value === 'PROJECT_GUEST'
                                            ) {
                                                setRoleState(
                                                    'You need to have projects to assign Project access to team members.'
                                                )
                                            } else {
                                                setRoleState('')
                                            }
                                            field.onChange(value)
                                        }}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select user role..." />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="WORKSPACE_ADMIN">
                                                Workspace Admin
                                            </SelectItem>
                                            {(data?.user?.role === 'WORKSPACE_OWNER' ||
                                                userData?.role === 'WORKSPACE_OWNER') && (
                                                    <SelectItem value="WORKSPACE_OWNER">
                                                        Workspace Owner
                                                    </SelectItem>
                                                )}
                                            <SelectItem value="PROJECT_USER">
                                                Project User
                                            </SelectItem>
                                            <SelectItem value="PROJECT_GUEST">
                                                Project Guest
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-muted-foreground">{roleState}</p>
                                </FormItem>
                            )}
                        />

                        <Button
                            disabled={form.formState.isSubmitting}
                            type="submit"
                        >
                            {form.formState.isSubmitting ? <Loading /> : 'Save User Details'}
                        </Button>
                        {authUserData?.role === 'WORKSPACE_OWNER' && (
                            <div>
                                <Separator className="my-4" />
                                <FormLabel> User Permissions</FormLabel>
                                <FormDescription className="mb-4">
                                    You can give Project access to team member by turning on
                                    access control for each Project. This is only visible to
                                    workspace owners
                                </FormDescription>
                                <div className="flex flex-col gap-4">
                                    {projects?.map((project) => {
                                        const projectPermissionsDetails =
                                            projectPermissions?.Permissions.find(
                                                (p) => p.projectId === project.id
                                            )
                                        return (
                                            <div
                                                key={project.id}
                                                className="flex items-center justify-between rounded-lg border p-4"
                                            >
                                                <div>
                                                    <p>{project.name}</p>
                                                </div>
                                                <Switch
                                                    disabled={loadingPermissions}
                                                    checked={projectPermissionsDetails?.access}
                                                    onCheckedChange={(permission) => {
                                                        onChangePermission(
                                                            project.id,
                                                            permission,
                                                            projectPermissionsDetails?.id
                                                        )
                                                    }}
                                                />
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

export default UserDetails
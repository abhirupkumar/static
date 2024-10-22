"use client";

import { useToast } from '@/hooks/use-toast';
import { Workspace } from '@prisma/client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import Loading from '../global/loading';
import { NumberInput } from '@tremor/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod';
import FileUpload from '../global/file-upload';
import { v4 } from 'uuid'
import {
    deleteWorkspace,
    initUser,
    saveActivityLogsNotification,
    updateWorkspaceDetails,
    upsertWorkspace,
} from '@/lib/queries';

type Props = {
    data?: Partial<Workspace>
}

const FormSchema = z.object({
    name: z.string().min(2, { message: 'Workspace name must be atleast 2 chars.' }),
    workEmail: z.string().min(1),
    whiteLabel: z.boolean(),
})

const WorkspaceDetails = ({ data }: Props) => {
    const { toast } = useToast()
    const router = useRouter()
    const [deletingWorkspace, setDeletingWorkspace] = useState(false)
    const form = useForm<z.infer<typeof FormSchema>>({
        mode: 'onChange',
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: data?.name,
            workEmail: data?.workEmail,
            whiteLabel: data?.whiteLabel || true,
        },
    })

    const isLoading = form.formState.isSubmitting

    useEffect(() => {
        if (data) {
            form.reset(data)
        }
    }, [data])

    const handleSubmit = async (values: z.infer<typeof FormSchema>) => {
        try {
            let newUserData
            let custId
            if (!data?.id) {
                const bodyData = {
                    email: values.workEmail,
                    name: values.name,
                }

                // const customerResponse = await fetch('/api/stripe/create-customer', {
                //     method: 'POST',
                //     headers: {
                //         'Content-Type': 'application/json',
                //     },
                //     body: JSON.stringify(bodyData),
                // })
                // const customerData: { customerId: string } =
                //     await customerResponse.json()
                // custId = customerData.customerId
            }

            newUserData = await initUser({ role: 'WORKSPACE_OWNER' })
            // if (!data?.customerId && !custId) return

            const response = await upsertWorkspace({
                id: data?.id ? data.id : v4(),
                customerId: data?.customerId || custId || '',
                name: values.name,
                whiteLabel: values.whiteLabel,
                createdAt: new Date(),
                updatedAt: new Date(),
                workEmail: values.workEmail,
                connectAccountId: '',
            })
            toast({
                title: 'Created Workspace',
            })
            if (data?.id) return router.refresh()
            if (response) {
                return router.refresh()
            }
        } catch (error) {
            console.log(error)
            toast({
                variant: 'destructive',
                title: 'Oppse!',
                description: 'could not create your workspace',
            })
        }
    }
    const handleDeleteWorkspace = async () => {
        if (!data?.id) return
        setDeletingWorkspace(true)
        //WIP: discontinue the subscription
        try {
            const response = await deleteWorkspace(data.id)
            toast({
                title: 'Deleted Workspace',
                description: 'Deleted your workspace and all projects',
            })
            router.refresh()
        } catch (error) {
            console.log(error)
            toast({
                variant: 'destructive',
                title: 'Oppse!',
                description: 'could not delete your workspace ',
            })
        }
        setDeletingWorkspace(false)
    }

    return (
        <AlertDialog>
            <Card className="w-full my-10">
                <CardHeader>
                    <CardTitle>Create an Workspace</CardTitle>
                    <CardDescription>
                        Lets create an workspace for you business. You can edit workspace settings
                        later from the workspace settings tab.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(handleSubmit)}
                            className="space-y-4"
                        >
                            <div className="flex md:flex-row gap-4">
                                <FormField
                                    disabled={isLoading}
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Workspace Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Your workspace name"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="workEmail"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Workspace Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    readOnly
                                                    placeholder="Email"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                disabled={isLoading}
                                control={form.control}
                                name="whiteLabel"
                                render={({ field }) => {
                                    return (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border gap-4 p-4">
                                            <div>
                                                <FormLabel>Whitelabel Workspace</FormLabel>
                                                <FormDescription>
                                                    Turning on whilelabel mode will show your workspace logo
                                                    to all projects by default. You can overwrite this
                                                    functionality through project settings.
                                                </FormDescription>
                                            </div>

                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )
                                }}
                            />
                            <Button
                                type="submit"
                                disabled={isLoading}
                            >
                                {isLoading ? <Loading /> : 'Save Workspace Information'}
                            </Button>
                        </form>
                    </Form>

                    {data?.id && (
                        <div className="flex flex-row items-center justify-between rounded-lg border border-destructive gap-4 p-4 mt-4">
                            <div>
                                <div>Danger Zone</div>
                            </div>
                            <div className="text-muted-foreground">
                                Deleting your workspace cannpt be undone. This will also delete all
                                projects and all data related to your projects. Sub
                                accounts will no longer have access to sites, contacts etc.
                            </div>
                            <AlertDialogTrigger
                                disabled={isLoading || deletingWorkspace}
                                className="text-red-600 p-2 text-center mt-2 rounded-md hove:bg-red-600 hover:text-white whitespace-nowrap"
                            >
                                {deletingWorkspace ? 'Deleting...' : 'Delete Workspace'}
                            </AlertDialogTrigger>
                        </div>
                    )}
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-left">
                                Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-left">
                                This action cannot be undone. This will permanently delete the
                                Workspace account and all related projects.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex items-center">
                            <AlertDialogCancel className="mb-2">Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                disabled={deletingWorkspace}
                                className="bg-destructive hover:bg-destructive"
                                onClick={handleDeleteWorkspace}
                            >
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </CardContent>
            </Card>
        </AlertDialog>
    )
}

export default WorkspaceDetails

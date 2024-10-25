'use client'
import React, { useEffect } from 'react'
import { z } from 'zod'
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
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '../ui/input'

import { Button } from '../ui/button'
import Loading from '../global/loading'
import { useToast } from '../ui/use-toast'
import { SitePage } from '@prisma/client'
import { SitePageSchema } from '@/lib/types'
import {
    deleteSitePage,
    getProjectSite,
    saveActivityLogsNotification,
    upsertSitePage,
} from '@/lib/queries'
import { useRouter } from 'next/navigation'
import { v4 } from 'uuid'
import { CopyPlusIcon, Trash } from 'lucide-react'
import { useModal } from '@/providers/modal-provider'

interface CreateSitePageProps {
    defaultData?: SitePage
    siteId: string
    order: number
    projectId: string
}

const CreateSitePage: React.FC<CreateSitePageProps> = ({
    defaultData,
    siteId,
    order,
    projectId,
}) => {
    const { toast } = useToast()
    const { setClose } = useModal()
    const router = useRouter()
    //ch
    const form = useForm<z.infer<typeof SitePageSchema>>({
        resolver: zodResolver(SitePageSchema),
        mode: 'onChange',
        defaultValues: {
            name: '',
            pathName: '',
        },
    })

    useEffect(() => {
        if (defaultData) {
            form.reset({ name: defaultData.name, pathName: defaultData.pathName })
        }
    }, [defaultData])

    const onSubmit = async (values: z.infer<typeof SitePageSchema>) => {
        if (order !== 0 && !values.pathName)
            return form.setError('pathName', {
                message:
                    "Pages other than the first page in the site require a path name example 'secondstep'.",
            })
        try {
            const response = await upsertSitePage(
                projectId,
                {
                    ...values,
                    id: defaultData?.id || v4(),
                    order: defaultData?.order || order,
                    pathName: values.pathName || '',
                },
                siteId
            )

            await saveActivityLogsNotification({
                workspaceId: undefined,
                description: `Updated a site page | ${response?.name}`,
                projectId: projectId,
            })

            toast({
                title: 'Success',
                description: 'Saves Site Page Details',
            })

            window.location.reload()
            setClose()
        } catch (error) {
            console.log(error)
            toast({
                variant: 'destructive',
                title: 'Oppse!',
                description: 'Could Save Site Page Details',
            })
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Site Page</CardTitle>
                <CardDescription>
                    Site pages are flow in the order they are created by default. You
                    can move them around to change their order.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex flex-col gap-6"
                    >
                        <FormField
                            disabled={form.formState.isSubmitting}
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            disabled={form.formState.isSubmitting || order === 0}
                            control={form.control}
                            name="pathName"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel>Path Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Path for the page, default: /"
                                            {...field}
                                            value={field.value?.toLowerCase()}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center gap-2">
                            <Button
                                className="w-22 self-end"
                                disabled={form.formState.isSubmitting}
                                type="submit"
                            >
                                {form.formState.isSubmitting ? <Loading /> : 'Save Page'}
                            </Button>

                            {defaultData?.id && (
                                <Button
                                    variant={'outline'}
                                    className="w-22 self-end border-destructive text-destructive hover:bg-destructive"
                                    disabled={form.formState.isSubmitting}
                                    type="button"
                                    onClick={async () => {
                                        const response = await deleteSitePage(defaultData.id)
                                        await saveActivityLogsNotification({
                                            workspaceId: undefined,
                                            description: `Deleted a site page | ${response?.name}`,
                                            projectId: projectId,
                                        })
                                        toast({
                                            title: 'Success',
                                            description: 'Deleted Site Page',
                                        })
                                        window.location.reload()

                                    }}
                                >
                                    {form.formState.isSubmitting ? <Loading /> : <Trash />}
                                </Button>
                            )}
                            {defaultData?.id && (
                                <Button
                                    variant={'outline'}
                                    size={'icon'}
                                    disabled={form.formState.isSubmitting}
                                    type="button"
                                    onClick={async () => {
                                        const projectSite = await getProjectSite(projectId)
                                        const lastSitePage = projectSite?.SitePages.length

                                        await upsertSitePage(
                                            projectId,
                                            {
                                                ...defaultData,
                                                id: v4(),
                                                order: lastSitePage ? lastSitePage : 0,
                                                visits: 0,
                                                name: `${defaultData.name} Copy`,
                                                pathName: `${defaultData.pathName}copy`,
                                                content: defaultData.content,
                                            },
                                            siteId
                                        )
                                        toast({
                                            title: 'Success',
                                            description: 'Saves Site Page Details',
                                        })
                                        window.location.reload();
                                    }}
                                >
                                    {form.formState.isSubmitting ? <Loading /> : <CopyPlusIcon />}
                                </Button>
                            )}
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

export default CreateSitePage
'use client'
import React, { useEffect } from 'react'
import { z } from 'zod'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useForm } from 'react-hook-form'
import { Site } from '@prisma/client'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'

import { Button } from '../ui/button'
import Loading from '../global/loading'
import { CreateSiteFormSchema } from '@/lib/types'
import { saveActivityLogsNotification, upsertSite } from '@/lib/queries'
import { v4 } from 'uuid'
import { toast } from '../ui/use-toast'
import { useModal } from '@/providers/modal-provider'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import FileUpload from '../global/file-upload'

interface CreateSiteProps {
    defaultData?: Site
    projectId: string
}

//CHALLENGE: Use favicons

const SiteForm: React.FC<CreateSiteProps> = ({
    defaultData,
    projectId,
}) => {
    const { setClose } = useModal()
    const router = useRouter()
    const form = useForm<z.infer<typeof CreateSiteFormSchema>>({
        mode: 'onChange',
        resolver: zodResolver(CreateSiteFormSchema),
        defaultValues: {
            name: defaultData?.name || '',
            description: defaultData?.description || '',
            favicon: defaultData?.favicon || '',
            subDomainName: defaultData?.subDomainName || '',
        },
    })

    useEffect(() => {
        if (defaultData) {
            form.reset({
                description: defaultData.description || '',
                favicon: defaultData.favicon || '',
                name: defaultData.name || '',
                subDomainName: defaultData.subDomainName || '',
            })
        }
    }, [defaultData])

    const isLoading = form.formState.isLoading

    const onSubmit = async (values: z.infer<typeof CreateSiteFormSchema>) => {
        if (!projectId) return
        const response = await upsertSite(
            projectId,
            { ...values, liveProducts: defaultData?.liveProducts || '[]' },
            defaultData?.id || v4()
        )
        await saveActivityLogsNotification({
            workspaceId: undefined,
            description: `Update site | ${response.name}`,
            projectId: projectId,
        })
        if (response)
            toast({
                title: 'Success',
                description: 'Saved site details',
            })
        else
            toast({
                variant: 'destructive',
                title: 'Oppse!',
                description: 'Could not save site details',
            })
        setClose()
        router.refresh()
    }
    return (
        <Card className="flex-1">
            <CardHeader>
                <CardTitle>Site Details</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex flex-col gap-4"
                    >
                        <FormField
                            disabled={isLoading}
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Site Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Name"
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            disabled={isLoading}
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Site Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Tell us a little bit more about this site."
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            disabled={isLoading}
                            control={form.control}
                            name="subDomainName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Sub domain</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Sub domain for site"
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            disabled={isLoading}
                            control={form.control}
                            name="favicon"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Favicon</FormLabel>
                                    <FormControl>
                                        <FileUpload
                                            apiEndpoint="projectLogo"
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            className="w-20 mt-4"
                            disabled={isLoading}
                            type="submit"
                        >
                            {form.formState.isSubmitting ? <Loading /> : 'Save'}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

export default SiteForm
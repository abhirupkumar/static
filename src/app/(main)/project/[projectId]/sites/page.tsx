import { getProjectSite } from '@/lib/queries'
import React from 'react'
import SiteForm from '@/components/forms/site-form'
import SiteSettings from './_components/site-settings'
import SiteSteps from './_components/site-steps'
import BlurPage from '@/components/global/blur-page'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'

const Sites = async ({ params }: { params: { projectId: string } }) => {
    const site = await getProjectSite(params.projectId)
    if (!site) return <BlurPage>
        <SiteForm projectId={params.projectId}></SiteForm>
    </BlurPage>

    return (
        <BlurPage>
            <Link
                href={`/subaccount/${params.projectId}/sites`}
                className="flex justify-between gap-4 mb-4 text-muted-foreground"
            >
                Back
            </Link>
            <Tabs
                defaultValue="steps"
                className="w-full"
            >
                <TabsList className="grid  grid-cols-2 w-[50%] bg-transparent ">
                    <TabsTrigger value="steps">Steps</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                <TabsContent value="steps">
                    <SiteSteps
                        site={site}
                        projectId={params.projectId}
                        pages={site.SitePages}
                        siteId={params.projectId}
                    />
                </TabsContent>
                <TabsContent value="settings">
                    <SiteSettings
                        projectId={params.projectId}
                        defaultData={site}
                    />
                </TabsContent>
            </Tabs>
        </BlurPage>
    )

}

export default Sites
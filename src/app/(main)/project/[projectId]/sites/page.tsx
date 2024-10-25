import { getProjectSite } from '@/lib/queries'
import React from 'react'
import SiteForm from '@/components/forms/site-form'
import SiteSettings from './_components/site-settings'
import SiteSteps from './_components/site-steps'
import BlurPage from '@/components/global/blur-page'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export const revalidate = 0;

const Sites = async ({ params }: { params: { projectId: string } }) => {
    const site = await getProjectSite(params.projectId)
    if (!site) return <BlurPage>
        <SiteForm projectId={params.projectId}></SiteForm>
    </BlurPage>

    return (
        <BlurPage>
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
                        siteId={site.id}
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
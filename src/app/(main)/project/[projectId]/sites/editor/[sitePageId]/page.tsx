import { db } from '@/lib/db'
import EditorProvider from '@/providers/editor/editor-provider'
import { redirect } from 'next/navigation'
import React from 'react'
import SiteEditorNavigation from './_components/site-editor-navigation'
import SiteEditorSidebar from './_components/site-editor-sidebar'
import SiteEditor from './_components/site-editor'
import { getSitePageDetails } from '@/lib/queries'

type Props = {
    params: {
        projectId: string
        sitePageId: string
    }
}

const Page = async ({ params }: Props) => {

    const sitePageDetails = await getSitePageDetails(params.sitePageId)
    if (!sitePageDetails) {
        return redirect(
            `/project/${params.projectId}/sites`
        )
    }

    return (
        <div className="fixed top-0 bottom-0 left-0 right-0 z-[20] bg-background overflow-hidden">
            <EditorProvider
                projectId={params.projectId}
                siteId={sitePageDetails.siteId}
                pageDetails={sitePageDetails}
            >
                <SiteEditorNavigation
                    siteId={sitePageDetails.siteId}
                    sitePageDetails={sitePageDetails}
                    projectId={params.projectId}
                />
                <div className="h-full flex justify-center">
                    <SiteEditor sitePageData={sitePageDetails} sitePageId={params.sitePageId} />
                </div>
                <SiteEditorSidebar projectId={params.projectId} />
            </EditorProvider>
        </div>
    )
}

export default Page;
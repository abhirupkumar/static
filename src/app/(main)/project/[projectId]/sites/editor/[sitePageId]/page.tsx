import { db } from '@/lib/db'
import EditorProvider from '@/providers/editor/editor-provider'
import { redirect } from 'next/navigation'
import React from 'react'
import SiteEditorNavigation from './_components/site-editor-navigation'

type Props = {
    params: {
        projectId: string
        siteId: string
        sitePageId: string
    }
}

const Page = async ({ params }: Props) => {

    const sitePageDetails = await db.sitePage.findFirst({
        where: {
            id: params.sitePageId,
        },
    })
    if (!sitePageDetails) {
        return redirect(
            `/project/${params.projectId}/sites`
        )
    }

    return (
        <div className="fixed top-0 bottom-0 left-0 right-0 z-[20] bg-background overflow-hidden">
            <EditorProvider
                projectId={params.projectId}
                siteId={params.siteId}
                pageDetails={sitePageDetails}
            >
                <SiteEditorNavigation
                    siteId={params.siteId}
                    sitePageDetails={sitePageDetails}
                    projectId={params.projectId}
                />
            </EditorProvider>
        </div>
    )
}

export default Page;
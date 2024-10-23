import { getProjectSite } from '@/lib/queries'
import React from 'react'
import SiteForm from '@/components/forms/site-form'
import BlurPage from '@/components/global/blur-page'

const Sites = async ({ params }: { params: { projectId: string } }) => {
    const site = await getProjectSite(params.projectId)
    if (!site) return <BlurPage>
        <SiteForm projectId={params.projectId}></SiteForm>
    </BlurPage>

    return <BlurPage>
        <div>site</div>
    </BlurPage>

}

export default Sites
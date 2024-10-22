import { getProjectSite } from '@/lib/queries'
import React from 'react'
import SiteForm from '@/components/forms/site-form'
import CustomModal from '@/components/global/custom-modal'
import BlurPage from '@/components/global/blur-page'

const Sites = async ({ params }: { params: { projectId: string } }) => {
    const site = await getProjectSite(params.projectId)
    if (!site) return <BlurPage>
        <div className='w-full mx-auto'>
            <SiteForm projectId={params.projectId}></SiteForm>
        </div>
    </BlurPage>

    return <div>
        sites
    </div>

}

export default Sites
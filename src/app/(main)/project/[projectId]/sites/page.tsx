import { getProjectSite } from '@/lib/queries'
import React from 'react'
import SiteForm from '@/components/forms/site-form'
import CustomModal from '@/components/global/custom-modal'
import { redirect } from 'next/navigation'

const Sites = async ({ params }: { params: { projectId: string } }) => {
    const site = await getProjectSite(params.projectId)
    if (!site) return <CustomModal
        title="Create A Site"
        subheading="Sites are a like websites, but better! Try creating one!"
    >
        <SiteForm projectId={params.projectId}></SiteForm>
    </CustomModal>

    return <>Site</>

}

export default Sites
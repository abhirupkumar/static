import { getSites } from '@/lib/queries'
import React from 'react'
import SitesDataTable from './data-table'
import { Plus } from 'lucide-react'
import { columns } from './columns'
import SiteForm from '@/components/forms/site-form'
import BlurPage from '@/components/global/blur-page'

const Sites = async ({ params }: { params: { projectId: string } }) => {
    const sites = await getSites(params.projectId)
    if (!sites) return null

    return (
        <BlurPage>
            <SitesDataTable
                actionButtonText={
                    <>
                        <Plus size={15} />
                        Create Site
                    </>
                }
                modalChildren={
                    <SiteForm projectId={params.projectId}></SiteForm>
                }
                filterValue="name"
                columns={columns}
                data={sites}
            />
        </BlurPage>
    )
}

export default Sites
import BlurPage from '@/components/global/blur-page';
import { getForms } from '@/lib/queries';
import React from 'react'
import MainForms from './_components/MainForms';

const Page = async ({ params }: { params: { projectId: string } }) => {

    const forms = await getForms(params.projectId);

    return (
        <BlurPage>
            <MainForms forms={forms} projectId={params.projectId} />
        </BlurPage>
    )
}

export default Page;
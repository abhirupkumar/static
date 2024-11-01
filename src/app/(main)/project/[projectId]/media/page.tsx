import BlurPage from '@/components/global/blur-page'
import MediaComponent from '@/components/media'
import { getMedia } from '@/lib/queries'
import React from 'react'

type Props = {
    params: Promise<{ projectId: string }>
}

const MediaPage = async (props: Props) => {
    const params = await props.params;
    const data = await getMedia(params.projectId)

    return (
        <BlurPage>
            <MediaComponent
                data={data}
                projectId={params.projectId}
            />
        </BlurPage>
    )
}

export default MediaPage
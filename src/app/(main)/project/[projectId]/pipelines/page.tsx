import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
    params: { projectId: string }
}

const Pipelines = async ({ params }: Props) => {
    const pipelineExists = await db.pipeline.findFirst({
        where: { projectId: params.projectId },
    })

    if (pipelineExists)
        return redirect(
            `/project/${params.projectId}/pipelines/${pipelineExists.id}`
        )

    try {
        const response = await db.pipeline.create({
            data: { name: 'First Pipeline', projectId: params.projectId },
        })

        return redirect(
            `/project/${params.projectId}/pipelines/${response.id}`
        )
    } catch (error) {
        console.log()
    }
}

export default Pipelines
'use client'
import { useModal } from '@/providers/modal-provider'
import React from 'react'
import { Button } from '@/components/ui/button'
import CustomModal from '@/components/global/custom-modal'
import UploadMediaForm from '@/components/forms/upload-media'

type Props = {
    projectId: string
}

const MediaUploadButton = ({ projectId }: Props) => {
    const { isOpen, setOpen, setClose } = useModal()

    return (
        <Button
            onClick={() => {
                setOpen(
                    <CustomModal
                        title="Upload Media"
                        subheading="Upload a file to your media bucket"
                    >
                        <UploadMediaForm projectId={projectId}></UploadMediaForm>
                    </CustomModal>
                )
            }}
        >
            Upload
        </Button>
    )
}

export default MediaUploadButton
'use client'
import ContactForm from '@/components/forms/contact-form'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/components/ui/use-toast'
import { EditorBtns } from '@/lib/constants'
import {
    getSite,
    saveActivityLogsNotification,
    upsertContact,
} from '@/lib/queries'

import { ContactUserFormSchema } from '@/lib/types'
import { EditorElement, useEditor } from '@/providers/editor/editor-provider'
import clsx from 'clsx'
import { Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'

import React from 'react'
import { z } from 'zod'

type Props = {
    element: EditorElement
}

const ContactFormComponent = (props: Props) => {
    const { dispatch, state, projectId, siteId, pageDetails } = useEditor()
    const router = useRouter()

    const getStyles = () => {
        const styles = props.element.styles as { [key: string]: React.CSSProperties }
        const deviceType = state.editor.device;
        if (deviceType === 'Tablet') {
            return { ...styles, ...styles['@media (max-width: 768px)'] };
        }
        if (deviceType === 'Mobile') {
            return { ...styles, ...styles['@media (max-width: 480px)'] };
        }
        return styles;
    }

    const handleDragStart = (e: React.DragEvent, type: EditorBtns) => {
        if (state.editor.previewMode || state.editor.liveMode) return;
        if (type === null) return
        e.dataTransfer.setData('componentType', type)
    }

    const handleOnClickBody = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (state.editor.previewMode || state.editor.liveMode) return;
        dispatch({
            type: 'CHANGE_CLICKED_ELEMENT',
            payload: {
                elementDetails: props.element,
            },
        })
    }

    const goToNextPage = async () => {
        if (!state.editor.liveMode) return
        const sitePages = await getSite(siteId)
        if (!sitePages || !pageDetails) return
        if (sitePages.SitePages.length > pageDetails.order + 1) {
            const nextPage = sitePages.SitePages.find(
                (page) => page.order === pageDetails.order + 1
            )
            if (!nextPage) return
            router.replace(
                `${process.env.NEXT_PUBLIC_SCHEME}${sitePages.subDomainName}.${process.env.NEXT_PUBLIC_DOMAIN}/${nextPage.pathName}`
            )
        }
    }

    const handleDeleteElement = () => {
        if (state.editor.previewMode || state.editor.liveMode) return;
        dispatch({
            type: 'DELETE_ELEMENT',
            payload: { elementDetails: props.element },
        })
    }

    const onFormSubmit = async (
        values: z.infer<typeof ContactUserFormSchema>
    ) => {
        if (!state.editor.liveMode) return

        try {
            const response = await upsertContact({
                ...values,
                projectId: projectId,
            })
            //WIP Call trigger endpoint
            await saveActivityLogsNotification({
                workspaceId: undefined,
                description: `A New contact signed up | ${response?.name}`,
                projectId: projectId,
            })
            toast({
                title: 'Success',
                description: 'Successfully Saved your info',
            })
            await goToNextPage()
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Failed',
                description: 'Could not save your information',
            })
        }
    }

    return (
        <div
            draggable={!state.editor.previewMode || !state.editor.liveMode}
            onDragStart={(e) => handleDragStart(e, 'contactForm')}
            onClick={handleOnClickBody}
            className={clsx(
                'p-[2px] w-full m-[5px] relative text-[16px] transition-all flex items-center justify-center',
                {
                    '!border-blue-600':
                        state.editor.selectedElement.id === props.element.id,

                    '!border-solid': state.editor.selectedElement.id === props.element.id,
                    'border-dashed border-[1px] border-slate-300': !state.editor.liveMode,
                }
            )}
        >
            {state.editor.selectedElement.id === props.element.id &&
                !state.editor.liveMode && (
                    <Badge className="absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg bg-blue-600 text-white">
                        {state.editor.selectedElement.name}
                    </Badge>
                )}
            {!Array.isArray(props.element.content) && (<ContactForm
                title={props.element.content.formTitle as string}
                subTitle={props.element.content.formDescription as string}
                buttonText={props.element.content.formButton as string}
                styles={getStyles()}
                apiCall={onFormSubmit}
            />)}
            {state.editor.selectedElement.id === props.element.id &&
                !state.editor.liveMode && (
                    <div className="absolute bg-red-500 px-2.5 py-1 text-xs font-bold  -top-[25px] -right-[1px] rounded-none rounded-t-lg !text-white">
                        <Trash
                            className="cursor-pointer"
                            size={16}
                            onClick={handleDeleteElement}
                        />
                    </div>
                )}
        </div>
    )
}

export default ContactFormComponent
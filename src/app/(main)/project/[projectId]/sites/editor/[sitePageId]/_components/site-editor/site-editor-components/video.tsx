'use client'
import { Badge } from '@/components/ui/badge'
import { EditorBtns } from '@/lib/constants'
import { EditorElement, useEditor } from '@/providers/editor/editor-provider'
import clsx from 'clsx'
import { Trash } from 'lucide-react'
import React, { CSSProperties } from 'react'

type Props = {
    element: EditorElement
}

const VideoComponent = (props: Props) => {
    const { dispatch, state } = useEditor()
    const styles = props.element.styles as { [key: string]: CSSProperties }

    const getStyles = () => {
        const deviceType = state.editor.device;
        if (deviceType === 'Tablet') {
            return styles['@media (max-width: 768px)'] || styles;
        }
        if (deviceType === 'Mobile') {
            return styles['@media (max-width: 480px)'] || styles;
        }
        return styles;
    }

    const getStyleValue = (styleName: keyof CSSProperties) => {
        const deviceType = state.editor.device

        if (deviceType === 'Tablet') {
            return styles['@media (max-width: 768px)']?.[styleName] || styles[styleName] || "";
        }
        if (deviceType === 'Mobile') {
            return styles['@media (max-width: 480px)']?.[styleName] || styles[styleName] || "";
        }
        return styles[styleName] || "";
    };

    const handleDragStart = (e: React.DragEvent, type: EditorBtns) => {
        if (type === null) return
        if (state.editor.previewMode || state.editor.liveMode) return;
        e.dataTransfer.setData('componentType', type)
    }

    const handleOnClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (state.editor.previewMode || state.editor.liveMode) return;
        dispatch({
            type: 'CHANGE_CLICKED_ELEMENT',
            payload: {
                elementDetails: props.element,
            },
        })
    }

    const handleDeleteElement = () => {
        if (state.editor.previewMode || state.editor.liveMode) return;
        dispatch({
            type: 'DELETE_ELEMENT',
            payload: { elementDetails: props.element },
        })
    }

    return (
        <div
            style={getStyles()}
            draggable={!state.editor.previewMode || !state.editor.liveMode}
            onDragStart={(e) => handleDragStart(e, 'video')}
            onClick={handleOnClick}
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

            {!Array.isArray(props.element.content) && (
                <iframe
                    width={getStyleValue("width").toString() || '560'}
                    height={getStyleValue("height").toString() || '315'}
                    src={props.element.content.src}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                />
            )}

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

export default VideoComponent
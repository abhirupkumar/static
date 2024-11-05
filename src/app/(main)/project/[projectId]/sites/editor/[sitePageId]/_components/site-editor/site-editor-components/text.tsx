'use client'
import { Badge } from '@/components/ui/badge'
import { EditorElement, useEditor } from '@/providers/editor/editor-provider'
import clsx from 'clsx'
import { Trash } from 'lucide-react'
import React, { CSSProperties } from 'react'

type Props = {
    element: EditorElement
}

const TextComponent = (props: Props) => {
    const { dispatch, state } = useEditor()

    const handleDeleteElement = () => {
        if (state.editor.previewMode || state.editor.liveMode) return;
        dispatch({
            type: 'DELETE_ELEMENT',
            payload: { elementDetails: props.element },
        })
    }
    const styles = props.element.styles as { [key: string]: CSSProperties }

    const getStyles = () => {
        const deviceType = state.editor.device;
        if (deviceType === 'Tablet') {
            return { ...styles, ...styles['@media (max-width: 768px)'] };
        }
        if (deviceType === 'Mobile') {
            return { ...styles, ...styles['@media (max-width: 480px)'] };
        }
        return styles;
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
    const Tagtype = (!Array.isArray(props.element.content) && props.element.content.tagType) || 'div'
    return (
        <div
            style={getStyles()}
            className={clsx(
                'p-[2px] w-full m-[5px] relative text-[16px] transition-all',
                {
                    '!border-blue-600':
                        state.editor.selectedElement.id === props.element.id,

                    '!border-solid': state.editor.selectedElement.id === props.element.id,
                    'border-dashed border-[1px] border-slate-300': !state.editor.liveMode,
                }
            )}
            onClick={handleOnClickBody}
        >
            {state.editor.selectedElement.id === props.element.id &&
                !state.editor.liveMode && (
                    <Badge className="absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg bg-blue-600 text-white">
                        {state.editor.selectedElement.name}
                    </Badge>
                )}
            {React.createElement(
                Tagtype,
                {
                    contentEditable: !state.editor.liveMode,
                    onBlur: (e: any) => {
                        if (!state.editor.liveMode) {
                            const selectedElement = e.target
                            dispatch({
                                type: 'UPDATE_ELEMENT',
                                payload: {
                                    elementDetails: {
                                        ...props.element,
                                        content: {
                                            innerText: selectedElement.innerText,
                                            tagType: selectedElement.tagName.toLowerCase(),
                                        },
                                    },
                                },
                            })
                        }
                    },
                    suppressContentEditableWarning: true,
                    suppressHydrationWarning: true,
                    suppressUncontrolledWarning: true,
                },
                !Array.isArray(props.element.content) && props.element.content.innerText
            )}
            {state.editor.selectedElement.id === props.element.id &&
                !state.editor.liveMode && (
                    <div className="absolute bg-red-500 px-2.5 py-1 text-xs font-bold -top-[25px] -right-[1px] rounded-none rounded-t-lg !text-white">
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

export default TextComponent
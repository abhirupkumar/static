'use client'
import { Badge } from '@/components/ui/badge'
import { EditorBtns, defaultStyles } from '@/lib/constants'
import { EditorElement, useEditor } from '@/providers/editor/editor-provider'
import clsx from 'clsx'
import React from 'react'
import { v4 } from 'uuid'
import Recursive from './recursive'
import { Trash } from 'lucide-react'

type Props = { element: EditorElement }

const Container = ({ element }: Props) => {
    const { id, content, name, styles, type } = element
    const { dispatch, state } = useEditor()

    const handleOnDrop = (e: React.DragEvent, type: string) => {
        e.stopPropagation()
        const componentType = e.dataTransfer.getData('componentType') as EditorBtns

        switch (componentType) {
            case 'text':
                dispatch({
                    type: 'ADD_ELEMENT',
                    payload: {
                        containerId: id,
                        elementDetails: {
                            content: { innerText: 'Text Element' },
                            id: v4(),
                            name: 'Text',
                            styles: {
                                ...defaultStyles,
                            },
                            type: 'text',
                        },
                    },
                })
                break
            case 'link':
                dispatch({
                    type: 'ADD_ELEMENT',
                    payload: {
                        containerId: id,
                        elementDetails: {
                            content: {
                                innerText: 'Link Element',
                                href: '#',
                            },
                            id: v4(),
                            name: 'Link',
                            styles: {
                                ...defaultStyles,
                            },
                            type: 'link',
                        },
                    },
                })
                break
            case 'video':
                dispatch({
                    type: 'ADD_ELEMENT',
                    payload: {
                        containerId: id,
                        elementDetails: {
                            content: {
                                src: 'https://www.youtube.com/embed/A3l6YYkXzzg?si=zbcCeWcpq7Cwf8W1',
                            },
                            id: v4(),
                            name: 'Video',
                            styles: {},
                            type: 'video',
                        },
                    },
                })
                break
            case 'image':
                dispatch({
                    type: 'ADD_ELEMENT',
                    payload: {
                        containerId: id,
                        elementDetails: {
                            content: {
                                src: 'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?ixlib=rb-4.0.3',
                                alt: 'Unsplash Picture',
                            },
                            id: v4(),
                            name: 'Image',
                            styles: {},
                            type: 'image',
                        },
                    },
                })
                break
            case 'container':
                dispatch({
                    type: 'ADD_ELEMENT',
                    payload: {
                        containerId: id,
                        elementDetails: {
                            content: [],
                            id: v4(),
                            name: 'Container',
                            styles: { ...defaultStyles },
                            type: 'container',
                        },
                    },
                })
                break
            case 'contactForm':
                dispatch({
                    type: 'ADD_ELEMENT',
                    payload: {
                        containerId: id,
                        elementDetails: {
                            content: {
                                formTitle: 'Want a free quote? We can help you',
                                formDescription: 'Contact Us',
                                formButton: 'Submit',
                            },
                            id: v4(),
                            name: 'Contact Form',
                            styles: {},
                            type: 'contactForm',
                        },
                    },
                })
                break
            case '2Col':
                dispatch({
                    type: 'ADD_ELEMENT',
                    payload: {
                        containerId: id,
                        elementDetails: {
                            content: [
                                {
                                    content: [],
                                    id: v4(),
                                    name: 'Container',
                                    styles: { ...defaultStyles, width: '100%' },
                                    type: 'container',
                                },
                                {
                                    content: [],
                                    id: v4(),
                                    name: 'Container',
                                    styles: { ...defaultStyles, width: '100%' },
                                    type: 'container',
                                },
                            ],
                            id: v4(),
                            name: 'Two Columns',
                            styles: { ...defaultStyles, display: 'flex' },
                            type: '2Col',
                        },
                    },
                })
                break;
            case '3Col':
                dispatch({
                    type: 'ADD_ELEMENT',
                    payload: {
                        containerId: id,
                        elementDetails: {
                            content: [
                                {
                                    content: [],
                                    id: v4(),
                                    name: 'Container',
                                    styles: { ...defaultStyles, width: '100%' },
                                    type: 'container',
                                },
                                {
                                    content: [],
                                    id: v4(),
                                    name: 'Container',
                                    styles: { ...defaultStyles, width: '100%' },
                                    type: 'container',
                                },
                                {
                                    content: [],
                                    id: v4(),
                                    name: 'Container',
                                    styles: { ...defaultStyles, width: '100%' },
                                    type: 'container',
                                },
                            ],
                            id: v4(),
                            name: 'Two Columns',
                            styles: { ...defaultStyles, display: 'flex' },
                            type: '3Col',
                        },
                    },
                })
                break
        }
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
    }

    const handleDragStart = (e: React.DragEvent, type: string) => {
        if (type === '__body') return
        e.dataTransfer.setData('componentType', type)
    }

    const handleOnClickBody = (e: React.MouseEvent) => {
        e.stopPropagation()
        dispatch({
            type: 'CHANGE_CLICKED_ELEMENT',
            payload: {
                elementDetails: element,
            },
        })
    }

    const handleDeleteElement = () => {
        dispatch({
            type: 'DELETE_ELEMENT',
            payload: {
                elementDetails: element,
            },
        })
    }

    return (
        <div
            style={styles}
            className={clsx('relative p-4 transition-all group', {
                'max-w-full w-full': type === 'container' || type === '2Col',
                'h-fit': type === 'container',
                'h-full': type === '__body',
                'overflow-scroll ': type === '__body',
                'flex flex-col md:!flex-row': type === '2Col',
                '!border-blue-500':
                    state.editor.selectedElement.id === id &&
                    !state.editor.liveMode &&
                    state.editor.selectedElement.type !== '__body',
                '!border-yellow-400 !border-4':
                    state.editor.selectedElement.id === id &&
                    !state.editor.liveMode &&
                    state.editor.selectedElement.type === '__body',
                '!border-solid':
                    state.editor.selectedElement.id === id && !state.editor.liveMode,
                'border-dashed border-[1px] border-slate-300': !state.editor.liveMode,
            })}
            onDrop={(e) => handleOnDrop(e, id)}
            onDragOver={handleDragOver}
            draggable={type !== '__body'}
            onClick={handleOnClickBody}
            onDragStart={(e) => handleDragStart(e, 'container')}
        >
            <Badge
                className={clsx(
                    'absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg hidden',
                    {
                        block:
                            state.editor.selectedElement.id === element.id &&
                            !state.editor.liveMode,
                    }
                )}
            >
                {element.name}
            </Badge>

            {Array.isArray(content) &&
                content.map((childElement) => (
                    <Recursive
                        key={childElement.id}
                        element={childElement}
                    />
                ))}

            {state.editor.selectedElement.id === element.id &&
                !state.editor.liveMode &&
                state.editor.selectedElement.type !== '__body' && (
                    <div className="absolute bg-red-500 px-2.5 py-1 text-xs font-bold  -top-[25px] -right-[1px] rounded-none rounded-t-lg ">
                        <Trash
                            size={16}
                            onClick={handleDeleteElement}
                        />
                    </div>
                )}
        </div>
    )
}

export default Container
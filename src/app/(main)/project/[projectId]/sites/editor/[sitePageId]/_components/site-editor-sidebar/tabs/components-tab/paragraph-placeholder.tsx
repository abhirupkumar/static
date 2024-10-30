import { EditorBtns } from '@/lib/constants'
import { Heading1Icon, HeadingIcon, PlayIcon, TypeIcon } from 'lucide-react'
import React from 'react'

const ParagraphPlaceholder = () => {
    const handleDragState = (e: React.DragEvent, type: EditorBtns) => {
        if (type === null) return
        e.dataTransfer.setData('componentType', type)
    }

    return (
        <div
            draggable
            onDragStart={(e) => {
                handleDragState(e, 'paragraph')
            }}
            className="h-14 w-14 bg-muted rounded-lg flex items-center justify-center"
        >
            <span className='text-muted-foreground text-4xl'>P</span>
        </div>
    )
}

export default ParagraphPlaceholder;
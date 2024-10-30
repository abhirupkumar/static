import { EditorBtns } from '@/lib/constants'
import { Heading1Icon, HeadingIcon, TypeIcon } from 'lucide-react'
import React from 'react'

const HeadingPlaceholder = () => {
    const handleDragState = (e: React.DragEvent, type: EditorBtns) => {
        if (type === null) return
        e.dataTransfer.setData('componentType', type)
    }

    return (
        <div
            draggable
            onDragStart={(e) => {
                handleDragState(e, 'heading')
            }}
            className="h-14 w-14 bg-muted rounded-lg flex items-center justify-center"
        >
            <HeadingIcon
                size={40}
                className="text-muted-foreground"
            />
        </div>
    )
}

export default HeadingPlaceholder;
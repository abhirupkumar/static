import { EditorBtns } from '@/lib/constants'
import { Sidebar, TypeIcon } from 'lucide-react'
import React from 'react'

type Props = {}

const ButtonPlaceholder = (props: Props) => {
    const handleDragState = (e: React.DragEvent, type: EditorBtns) => {
        if (type === null) return
        e.dataTransfer.setData('componentType', type)
    }

    return (
        <div
            draggable
            onDragStart={(e) => {
                handleDragState(e, 'button')
            }}
            className=" h-14 w-14 bg-muted rounded-lg flex items-center justify-center"
        >
            <span className='text-muted-foreground text-4xl'>B</span>
        </div>
    )
}

export default ButtonPlaceholder

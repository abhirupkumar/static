/* eslint-disable @next/next/no-img-element */
"use client";

import React, { CSSProperties } from "react";
import { Trash } from "lucide-react";

import { Badge } from "@/components/ui/badge";

import { cn } from "@/lib/utils";
import { EditorElement, useEditor } from "@/providers/editor/editor-provider";

interface ImageProps {
    element: EditorElement;
}

const ImageComponent: React.FC<ImageProps> = ({ element }) => {
    const { dispatch, state } = useEditor();
    const { editor } = state;

    const styles = element.styles as { [key: string]: CSSProperties }

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
        e.stopPropagation();
        if (state.editor.previewMode || state.editor.liveMode) return;

        dispatch({
            type: "CHANGE_CLICKED_ELEMENT",
            payload: {
                elementDetails: element,
            },
        });
    };

    const handleDeleteElement = () => {
        if (state.editor.previewMode || state.editor.liveMode) return;
        dispatch({
            type: "DELETE_ELEMENT",
            payload: { elementDetails: element },
        });
    };

    return (
        <div
            style={getStyles()}
            draggable={!state.editor.previewMode || !state.editor.liveMode}
            onClick={handleOnClickBody}
            className={cn("p-0.5 w-full m-1 relative min-h-7 transition-all", {
                "border-blue-600 border-solid":
                    editor.selectedElement.id === element.id,
                "border-dashed border": !editor.liveMode,
            })}
        >
            {editor.selectedElement.id === element.id && !editor.liveMode && (
                <Badge className="absolute -top-6 -left-0.5 rounded-none rounded-t-md bg-blue-600 text-white z-[100]">
                    {editor.selectedElement.name}
                </Badge>
            )}
            {!Array.isArray(element.content) && element.content.src && (
                <img
                    src={element.content.src}
                    alt={element.content.alt as string}
                    width={element.content.width || "auto"}
                    height={element.content.height || "auto"}
                    loading={element.content.imageLoading as "lazy" | "eager" || "lazy"}
                    style={getStyles()}
                />
            )}
            {editor.selectedElement.id === element.id && !editor.liveMode && (
                <div className="absolute bg-red-500 px-2.5 py-1 text-xs font-bold -top-[25px] -right-[1px] rounded-none rounded-t-lg !text-white">
                    <Trash
                        className="cursor-pointer"
                        size={16}
                        onClick={handleDeleteElement}
                    />
                </div>
            )}
        </div>
    );
};

export default ImageComponent;
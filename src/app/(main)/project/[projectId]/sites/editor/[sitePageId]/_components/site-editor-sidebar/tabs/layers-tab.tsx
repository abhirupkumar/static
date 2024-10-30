"use client";

import { SitePage } from "@prisma/client";
import React from "react";
import {
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import LayersTree from "./layers-component/LayersTree";
import { EditorElement, useEditor } from "@/providers/editor/editor-provider";

interface LayersTabProps { }

const LayersTab: React.FC<LayersTabProps> = () => {
    const { pageDetails, dispatch, state } = useEditor();
    const [elements, setElements] = React.useState<EditorElement[]>(
        (JSON.parse(pageDetails?.content || "[]")[0].content as EditorElement[]) ||
        []
    );

    const handleSelectElement = (element: EditorElement | undefined) => {
        if (element) {
            dispatch({
                type: "CHANGE_CLICKED_ELEMENT",
                payload: {
                    elementDetails: element,
                },
            });
        }
    };

    React.useEffect(() => {
        if (state.editor.elements.length) {
            setElements(state.editor.elements);
        }
    }, [state.editor.elements]);

    return (
        <div className="min-h-[900px] overflow-auto px-6">
            <SheetHeader className="text-left py-6">
                <SheetTitle>Layers</SheetTitle>
                <SheetDescription>
                    View the editor in a tree like structure.
                </SheetDescription>
            </SheetHeader>
            <LayersTree
                data={elements}
                className="flex-shrink-0"
                onSelectChange={handleSelectElement}
            />
        </div>
    );
};

export default LayersTab;
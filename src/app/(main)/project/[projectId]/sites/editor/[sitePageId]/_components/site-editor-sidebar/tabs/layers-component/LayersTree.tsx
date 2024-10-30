"use client";

import React from "react";

import { ScrollArea } from "@/components/ui/scroll-area";
import EditorLayersTreeItem from "./LayersTreeItem";

import { cn } from "@/lib/utils";
import { EditorElement } from "@/providers/editor/editor-provider";

export type LayersTreeProps = React.HTMLAttributes<HTMLDivElement> & {
    data: EditorElement[] | EditorElement;
    onSelectChange?: (item: EditorElement | undefined) => void;
    expandAll?: boolean;
};

const LayersTree: React.FC<LayersTreeProps> = ({
    data,
    onSelectChange,
    expandAll,
    className,
    ...props
}) => {
    const handleSelectChange = React.useCallback(
        (item: EditorElement | undefined) => {
            if (onSelectChange) {
                onSelectChange(item);
            }
        },
        [onSelectChange]
    );

    const expandedItemIds = React.useMemo(() => {
        const ids: string[] = [];

        function walkTreeItems(items: EditorElement[] | EditorElement) {
            if (items instanceof Array) {
                for (let i = 0; i < items.length; i++) {
                    ids.push(items[i]!.id);

                    if (walkTreeItems(items[i]!) && !expandAll) {
                        return true;
                    }

                    if (!expandAll) ids.pop();
                }
            } else if (!expandAll) {
                return true;
            } else if (Array.isArray(items.content)) {
                return walkTreeItems(items.content);
            }
        }

        walkTreeItems(data);

        return ids;
    }, [data]);

    return (
        <div className={cn("overflow-hidden", className)}>
            <ScrollArea scrollShadow={false}>
                <div className="relative">
                    <EditorLayersTreeItem
                        data={data}
                        handleSelectChange={handleSelectChange}
                        expandedItemIds={expandedItemIds}
                        {...props}
                    />
                </div>
            </ScrollArea>
        </div>
    );
};

LayersTree.displayName = LayersTree.name;

export default LayersTree;
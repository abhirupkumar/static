"use client";

import React from "react";
import {
    AppWindowIcon,
    BoxIcon,
    BoxSelectIcon,
    Columns2Icon,
    Columns3Icon,
    CreditCardIcon,
    LucideIcon,
} from "lucide-react";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

import { cn } from "@/lib/utils";
import { LayersTreeProps } from "./LayersTree";
import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import LayersTreeLeaf from "./LayersTreeLeaf";

type LayersTreeItemProps = LayersTreeProps & {
    handleSelectChange: (item: EditorElement | undefined) => void;
    expandedItemIds: string[];
};

const LayersTreeItem: React.FC<LayersTreeItemProps> = ({
    className,
    data,
    handleSelectChange,
    expandedItemIds,
    ...props
}) => {
    const { state } = useEditor();

    return (
        <div role="tree" className={className} {...props}>
            <ul>
                {data instanceof Array ? (
                    data.map((item, index) => {
                        let Icon: LucideIcon | undefined = undefined;

                        switch (item.type) {
                            case "container":
                                Icon = BoxIcon;
                                break;
                            case "__body":
                                Icon = AppWindowIcon;
                                break;
                            case "2Col":
                                Icon = Columns2Icon;
                                break;
                            case "3Col":
                                Icon = Columns3Icon;
                                break;
                            case "section":
                                Icon = BoxSelectIcon;
                                break;
                            case "paymentForm":
                                Icon = CreditCardIcon;
                                break;
                        }

                        return (
                            <li key={item.id}>
                                {Array.isArray(item.content) ? (
                                    <Accordion type="multiple" defaultValue={expandedItemIds}>
                                        <AccordionItem
                                            className={cn("border-b-0 border-l")}
                                            value={item.id}
                                        >
                                            <AccordionTrigger
                                                onClick={() => handleSelectChange(item)}
                                                className="p-3 w-full"
                                            >
                                                <div className="flex items-center gap-2 w-full pr-2">
                                                    {Icon && (
                                                        <Icon
                                                            className="h-5 w-5 text-muted-foreground flex-grow"
                                                            aria-hidden="true"
                                                        />
                                                    )}
                                                    <span className="text-sm truncate inline-flex items-center justify-between gap-2 w-full">
                                                        {item.name}
                                                        {item.id === state.editor.selectedElement.id && (
                                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                        )}
                                                    </span>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="pl-4">
                                                {Array.isArray(item.content) &&
                                                    !!item.content.length ? (
                                                    <LayersTreeItem
                                                        data={item.content ? item.content : item}
                                                        handleSelectChange={handleSelectChange}
                                                        expandedItemIds={expandedItemIds}
                                                    />
                                                ) : (
                                                    <p className="text-muted-foreground text-sm text-center w-full">
                                                        No content inside.
                                                    </p>
                                                )}
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                ) : (
                                    <LayersTreeLeaf
                                        item={item}
                                        isSelected={item.id === state.editor.selectedElement.id}
                                        type={item.type}
                                        onClick={() => handleSelectChange(item)}
                                    />
                                )}
                            </li>
                        );
                    })
                ) : (
                    <li>
                        <LayersTreeLeaf
                            item={data}
                            isSelected={data.id === state.editor.selectedElement.id}
                            type={data.type}
                            onClick={() => handleSelectChange(data)}
                        />
                    </li>
                )}
            </ul>
        </div>
    );
};

LayersTreeItem.displayName = LayersTreeItem.name;

export default LayersTreeItem;
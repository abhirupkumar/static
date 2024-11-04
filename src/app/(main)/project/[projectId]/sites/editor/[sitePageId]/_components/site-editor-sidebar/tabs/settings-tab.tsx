'use client'
import React, { ChangeEventHandler, useEffect } from 'react'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    AlignCenter,
    AlignEndHorizontal,
    AlignHorizontalJustifyCenterIcon,
    AlignHorizontalJustifyEndIcon,
    AlignHorizontalJustifyStart,
    AlignHorizontalSpaceAround,
    AlignHorizontalSpaceBetween,
    AlignJustify,
    AlignLeft,
    AlignRight,
    AlignVerticalJustifyCenter,
    AlignVerticalJustifyStart,
    ChevronsLeftRightIcon,
    LucideImageDown,
} from 'lucide-react'
import { Tabs, TabsTrigger, TabsList } from '@/components/ui/tabs'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { useEditor } from '@/providers/editor/editor-provider'
import { Slider } from '@/components/ui/slider'

const SettingsTab = () => {

    const { state, dispatch } = useEditor();

    const handleOnChanges = (e: any) => {
        const styleSettings = e.target.id
        let value = e.target.value
        const styleObject = {
            [styleSettings]: value,
        }

        dispatch({
            type: 'UPDATE_ELEMENT',
            payload: {
                elementDetails: {
                    ...state.editor.selectedElement,
                    styles: {
                        ...state.editor.selectedElement.styles,
                        ...styleObject,
                    },
                },
            },
        })
    }

    const handleChangeCustomValues = (e: any) => {
        const settingProperty = e.target.id
        let value = e.target.value
        const styleObject = {
            [settingProperty]: value,
        }

        dispatch({
            type: 'UPDATE_ELEMENT',
            payload: {
                elementDetails: {
                    ...state.editor.selectedElement,
                    content: {
                        ...state.editor.selectedElement.content,
                        ...styleObject,
                    },
                },
            },
        })
    }

    return (
        <Accordion
            type="multiple"
            className="w-full"
            defaultValue={['Typography', 'Dimensions', 'Decorations', 'Layout']}
        >
            <AccordionItem
                value="Custom"
                className="px-6 py-0  "
            >
                <AccordionTrigger className="!no-underline">Custom</AccordionTrigger>
                <AccordionContent>
                    {(state.editor.selectedElement.type === 'heading') &&
                        !Array.isArray(state.editor.selectedElement.content) && (
                            <div className="flex flex-col gap-2">
                                <p className="text-muted-foreground">Tag Type</p>
                                <Tabs
                                    onValueChange={(e) =>
                                        handleChangeCustomValues({
                                            target: {
                                                id: 'tagType',
                                                value: e,
                                            },
                                        })
                                    }
                                    value={state.editor.selectedElement.content.tagType}
                                >
                                    <TabsList className="flex items-center flex-row justify-evenly border-[1px] rounded-md bg-transparent h-fit gap-4">
                                        <TabsTrigger
                                            value="h1"
                                            className="w-5 h-10 p-0 data-[state=active]:bg-muted"
                                        >
                                            H1
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="h2"
                                            className="w-5 h-10 p-0 data-[state=active]:bg-muted"
                                        >
                                            H2
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="h3"
                                            className="w-5 h-10 p-0 data-[state=active]:bg-muted"
                                        >
                                            H3
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="h4"
                                            className="w-5 h-10 p-0 data-[state=active]:bg-muted"
                                        >
                                            H4
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="h5"
                                            className="w-5 h-10 p-0 data-[state=active]:bg-muted"
                                        >
                                            H5
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="h6"
                                            className="w-5 h-10 p-0 data-[state=active]:bg-muted"
                                        >
                                            H6
                                        </TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </div>
                        )}
                    {(state.editor.selectedElement.type === 'text') &&
                        !Array.isArray(state.editor.selectedElement.content) && (
                            <div className="flex flex-col gap-2">
                                <p className="text-muted-foreground">Tag Type</p>
                                <Tabs
                                    onValueChange={(e) =>
                                        handleChangeCustomValues({
                                            target: {
                                                id: 'tagType',
                                                value: e,
                                            },
                                        })
                                    }
                                    value={state.editor.selectedElement.content.tagType}
                                >
                                    <TabsList className="flex items-center flex-row justify-evenly border-[1px] rounded-md bg-transparent h-fit gap-4">
                                        <TabsTrigger
                                            value="div"
                                            className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                                        >
                                            Div
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="span"
                                            className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                                        >
                                            Span
                                        </TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </div>
                        )}
                    {state.editor.selectedElement.type === 'link' &&
                        !Array.isArray(state.editor.selectedElement.content) && (
                            <div className="flex flex-col gap-2">
                                <p className="text-muted-foreground">Link Path</p>
                                <Input
                                    id="href"
                                    placeholder="https:domain.example.com/pathname"
                                    onChange={handleChangeCustomValues}
                                    value={state.editor.selectedElement.content.href || ""}
                                />
                            </div>
                        )}
                    {state.editor.selectedElement.type === "video" && !Array.isArray(state.editor.selectedElement.content) && (
                        <div className="flex flex-col gap-2">
                            <Label>Video Path</Label>
                            <Input
                                id="src"
                                placeholder="https://domain.example.com/pathname"
                                onChange={handleChangeCustomValues}
                                value={state.editor.selectedElement.content.src || ""}
                            />
                        </div>
                    )}
                    {state.editor.selectedElement.type === "contactForm" && !Array.isArray(state.editor.selectedElement.content) && (
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <Label>Form title</Label>
                                <Input
                                    id="formTitle"
                                    placeholder="Want a free quote? We can help you"
                                    onChange={handleChangeCustomValues}
                                    value={state.editor.selectedElement.content.formTitle || ""}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label>Form description</Label>
                                <Input
                                    id="formDescription"
                                    placeholder="Get in touch with our team"
                                    onChange={handleChangeCustomValues}
                                    value={
                                        state.editor.selectedElement.content.formDescription || ""
                                    }
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label>Form button</Label>
                                <Input
                                    id="formButton"
                                    placeholder="Submit"
                                    onChange={handleChangeCustomValues}
                                    value={state.editor.selectedElement.content.formButton || ""}
                                />
                            </div>
                        </div>
                    )}
                    {state.editor.selectedElement.type === "image" && !Array.isArray(state.editor.selectedElement.content) && (
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <Label>Image Path</Label>
                                <Input
                                    id="src"
                                    placeholder="https://domain.example.com/pathname"
                                    onChange={handleChangeCustomValues}
                                    value={state.editor.selectedElement.content.src || ""}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label>Image alt description</Label>
                                <Input
                                    id="alt"
                                    placeholder="Image description"
                                    onChange={handleChangeCustomValues}
                                    value={
                                        state.editor.selectedElement.content.alt || ""
                                    }
                                />
                            </div>
                        </div>
                    )}
                </AccordionContent>
            </AccordionItem>
            <AccordionItem
                value="Typography"
                className="px-6 py-0  border-y-[1px]"
            >
                <AccordionTrigger className="!no-underline">
                    Typography
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-2">
                    <div className="flex flex-col gap-2 ">
                        <p className="text-muted-foreground">Text Align</p>
                        <Tabs
                            onValueChange={(e) =>
                                handleOnChanges({
                                    target: {
                                        id: 'textAlign',
                                        value: e,
                                    },
                                })
                            }
                            value={state.editor.selectedElement.styles.textAlign || ""}
                        >
                            <TabsList className="flex items-center flex-row justify-between border-[1px] rounded-md bg-transparent h-fit gap-4">
                                <TabsTrigger
                                    value="left"
                                    className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                                >
                                    <AlignLeft size={18} />
                                </TabsTrigger>
                                <TabsTrigger
                                    value="right"
                                    className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                                >
                                    <AlignRight size={18} />
                                </TabsTrigger>
                                <TabsTrigger
                                    value="center"
                                    className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                                >
                                    <AlignCenter size={18} />
                                </TabsTrigger>
                                <TabsTrigger
                                    value="justify"
                                    className="w-10 h-10 p-0 data-[state=active]:bg-muted "
                                >
                                    <AlignJustify size={18} />
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className="text-muted-foreground">Font Family</p>
                        <Input
                            id="DM Sans"
                            onChange={handleOnChanges}
                            value={state.editor.selectedElement.styles.fontFamily || ""}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className="text-muted-foreground">Color</p>
                        <Input
                            id="color"
                            onChange={handleOnChanges}
                            value={state.editor.selectedElement.styles.color || ""}
                        />
                    </div>
                    <div className="flex gap-4">
                        <div>
                            <Label className="text-muted-foreground">Font Weight</Label>
                            <Select
                                onValueChange={(e) =>
                                    handleOnChanges({
                                        target: {
                                            id: 'font-weight',
                                            value: e,
                                        },
                                    })
                                }
                            >
                                <SelectTrigger className="w-[180px] font-">
                                    <SelectValue placeholder="Select a weight" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Font Weights</SelectLabel>
                                        <SelectItem value="100">Thin</SelectItem>
                                        <SelectItem value="200">Extralight</SelectItem>
                                        <SelectItem value="300">Light</SelectItem>
                                        <SelectItem value="400">Regular</SelectItem>
                                        <SelectItem value="500">Medium</SelectItem>
                                        <SelectItem value="600">Semibold</SelectItem>
                                        <SelectItem value="700">Bold</SelectItem>
                                        <SelectItem value="800">Extrabold</SelectItem>
                                        <SelectItem value="900">Black</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label className="text-muted-foreground">Font Size</Label>
                            <Input
                                placeholder="px"
                                id="fontSize"
                                onChange={handleOnChanges}
                                value={state.editor.selectedElement.styles.fontSize || ""}
                            />
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem
                value="Dimensions"
                className=" px-6 py-0 "
            >
                <AccordionTrigger className="!no-underline">
                    Dimensions
                </AccordionTrigger>
                <AccordionContent>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <div className="flex gap-4 flex-col">
                                <div className="flex gap-4">
                                    <div>
                                        <Label className="text-muted-foreground">Height</Label>
                                        <Input
                                            id="height"
                                            placeholder="px"
                                            onChange={handleOnChanges}
                                            value={state.editor.selectedElement.styles.height || ""}
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground">Width</Label>
                                        <Input
                                            placeholder="px"
                                            id="width"
                                            onChange={handleOnChanges}
                                            value={state.editor.selectedElement.styles.width || ""}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-4 flex-col">
                                <div className="flex gap-4">
                                    <div>
                                        <Label className="text-muted-foreground">Max Height</Label>
                                        <Input
                                            id="maxHeight"
                                            placeholder="px"
                                            onChange={handleOnChanges}
                                            value={state.editor.selectedElement.styles.maxHeight || ""}
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground">Max Width</Label>
                                        <Input
                                            placeholder="px"
                                            id="maxWidth"
                                            onChange={handleOnChanges}
                                            value={state.editor.selectedElement.styles.maxWidth || ""}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-4 flex-col">
                                <div className="flex gap-4">
                                    <div>
                                        <Label className="text-muted-foreground">Min Height</Label>
                                        <Input
                                            id="minHeight"
                                            placeholder="px"
                                            onChange={handleOnChanges}
                                            value={state.editor.selectedElement.styles.minHeight || ""}
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground">Min Width</Label>
                                        <Input
                                            placeholder="px"
                                            id="minWidth"
                                            onChange={handleOnChanges}
                                            value={state.editor.selectedElement.styles.minWidth || ""}
                                        />
                                    </div>
                                </div>
                            </div>
                            <p>Margin px</p>
                            <div className="flex gap-4 flex-col">
                                <div className="flex gap-4">
                                    <div>
                                        <Label className="text-muted-foreground">Top</Label>
                                        <Input
                                            id="marginTop"
                                            placeholder="px"
                                            onChange={handleOnChanges}
                                            value={state.editor.selectedElement.styles.marginTop || ""}
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground">Bottom</Label>
                                        <Input
                                            placeholder="px"
                                            id="marginBottom"
                                            onChange={handleOnChanges}
                                            value={state.editor.selectedElement.styles.marginBottom || ""}
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div>
                                        <Label className="text-muted-foreground">Left</Label>
                                        <Input
                                            placeholder="px"
                                            id="marginLeft"
                                            onChange={handleOnChanges}
                                            value={state.editor.selectedElement.styles.marginLeft || ""}
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground">Right</Label>
                                        <Input
                                            placeholder="px"
                                            id="marginRight"
                                            onChange={handleOnChanges}
                                            value={state.editor.selectedElement.styles.marginRight || ""}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <p>Padding px</p>
                            <div className="flex gap-4 flex-col">
                                <div className="flex gap-4">
                                    <div>
                                        <Label className="text-muted-foreground">Top</Label>
                                        <Input
                                            placeholder="px"
                                            id="paddingTop"
                                            onChange={handleOnChanges}
                                            value={state.editor.selectedElement.styles.paddingTop || ""}
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground">Bottom</Label>
                                        <Input
                                            placeholder="px"
                                            id="paddingBottom"
                                            onChange={handleOnChanges}
                                            value={state.editor.selectedElement.styles.paddingBottom || ""}
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div>
                                        <Label className="text-muted-foreground">Left</Label>
                                        <Input
                                            placeholder="px"
                                            id="paddingLeft"
                                            onChange={handleOnChanges}
                                            value={state.editor.selectedElement.styles.paddingLeft || ""}
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground">Right</Label>
                                        <Input
                                            placeholder="px"
                                            id="paddingRight"
                                            onChange={handleOnChanges}
                                            value={state.editor.selectedElement.styles.paddingRight || ""}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <p>Overflow</p>
                            <div>
                                <Label className="text-muted-foreground">Overflow X</Label>
                                <Select
                                    onValueChange={(e) =>
                                        handleOnChanges({
                                            target: {
                                                id: 'overflowX',
                                                value: e,
                                            },
                                        })
                                    }
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select Overflow" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Overflow</SelectLabel>
                                            <SelectItem value="auto">auto</SelectItem>
                                            <SelectItem value="scroll">scroll</SelectItem>
                                            <SelectItem value="visible">visible</SelectItem>
                                            <SelectItem value="hidden">hidden</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label className="text-muted-foreground">Overflow Y</Label>
                                <Select
                                    onValueChange={(e) =>
                                        handleOnChanges({
                                            target: {
                                                id: 'overflowY',
                                                value: e,
                                            },
                                        })
                                    }
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select Overflow" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Overflow</SelectLabel>
                                            <SelectItem value="auto">auto</SelectItem>
                                            <SelectItem value="scroll">scroll</SelectItem>
                                            <SelectItem value="visible">visible</SelectItem>
                                            <SelectItem value="hidden">hidden</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem
                value="Position"
                className="px-6 py-0"
            >
                <AccordionTrigger className="!no-underline">Position</AccordionTrigger>
                <AccordionContent className='flex flex-col gap-y-4'>
                    <Select
                        onValueChange={(e) =>
                            handleOnChanges({
                                target: {
                                    id: 'position',
                                    value: e,
                                },
                            })
                        }
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select a Position" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Position</SelectLabel>
                                <SelectItem value="static">Static</SelectItem>
                                <SelectItem value="relative">Relative</SelectItem>
                                <SelectItem value="absolute">Absolute</SelectItem>
                                <SelectItem value="sticky">Sticky</SelectItem>
                                <SelectItem value="fixed">Fixed</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <div className="flex flex-col gap-2">
                        <div className="flex gap-4 flex-col">
                            <div className="flex gap-4">
                                <div>
                                    <Label className="text-muted-foreground">Top</Label>
                                    <Input
                                        placeholder="px"
                                        id="top"
                                        onChange={handleOnChanges}
                                        value={state.editor.selectedElement.styles.top || ""}
                                    />
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Bottom</Label>
                                    <Input
                                        placeholder="px"
                                        id="bottom"
                                        onChange={handleOnChanges}
                                        value={state.editor.selectedElement.styles.bottom || ""}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div>
                                    <Label className="text-muted-foreground">Left</Label>
                                    <Input
                                        placeholder="px"
                                        id="left"
                                        onChange={handleOnChanges}
                                        value={state.editor.selectedElement.styles.left || ""}
                                    />
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Right</Label>
                                    <Input
                                        placeholder="px"
                                        id="right"
                                        onChange={handleOnChanges}
                                        value={state.editor.selectedElement.styles.right || ""}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <Label className="text-muted-foreground">Z Index</Label>
                        <Input
                            placeholder="0"
                            id="zIndex"
                            onChange={handleOnChanges}
                            value={state.editor.selectedElement.styles.zIndex || ""}
                        />
                    </div>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem
                value="Decorations"
                className="px-6 py-0 "
            >
                <AccordionTrigger className="!no-underline">
                    Decorations
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4">
                    <div>
                        <Label className="text-muted-foreground">Opacity</Label>
                        <div className="flex items-center justify-end">
                            <small className="p-2">
                                {typeof state.editor.selectedElement.styles?.opacity ===
                                    'number'
                                    ? state.editor.selectedElement.styles?.opacity
                                    : parseFloat(
                                        (
                                            state.editor.selectedElement.styles?.opacity || '0'
                                        ).replace('%', '')
                                    ) || 0}
                                %
                            </small>
                        </div>
                        <Slider
                            onValueChange={(e) => {
                                handleOnChanges({
                                    target: {
                                        id: 'opacity',
                                        value: `${e[0]}%`,
                                    },
                                })
                            }}
                            defaultValue={[
                                typeof state.editor.selectedElement.styles?.opacity === 'number'
                                    ? state.editor.selectedElement.styles?.opacity
                                    : parseFloat(
                                        (
                                            state.editor.selectedElement.styles?.opacity || '0'
                                        ).replace('%', '')
                                    ) || 0,
                            ]}
                            max={100}
                            step={1}
                        />
                    </div>
                    <div>
                        <Label className="text-muted-foreground">Border Radius</Label>
                        <div className="flex items-center justify-end">
                            <small className="">
                                {typeof state.editor.selectedElement.styles?.borderRadius ===
                                    'number'
                                    ? state.editor.selectedElement.styles?.borderRadius
                                    : parseFloat(
                                        (
                                            state.editor.selectedElement.styles?.borderRadius || '0'
                                        ).replace('px', '')
                                    ) || 0}
                                px
                            </small>
                        </div>
                        <Slider
                            onValueChange={(e) => {
                                handleOnChanges({
                                    target: {
                                        id: 'borderRadius',
                                        value: `${e[0]}px`,
                                    },
                                })
                            }}
                            defaultValue={[
                                typeof state.editor.selectedElement.styles?.borderRadius ===
                                    'number'
                                    ? state.editor.selectedElement.styles?.borderRadius
                                    : parseFloat(
                                        (
                                            state.editor.selectedElement.styles?.borderRadius || '0'
                                        ).replace('%', '')
                                    ) || 0,
                            ]}
                            max={100}
                            step={1}
                        />
                    </div>
                    <div className="flex flex-col gap-2 mt-2">
                        <p>Border Width</p>
                        <div className="flex gap-4 flex-col">
                            <div className="flex gap-4">
                                <div>
                                    <Label className="text-muted-foreground">Top</Label>
                                    <Input
                                        placeholder="px"
                                        id="borderTopWidth"
                                        onChange={handleOnChanges}
                                        value={state.editor.selectedElement.styles.borderTopWidth || ""}
                                    />
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Bottom</Label>
                                    <Input
                                        placeholder="px"
                                        id="borderBottomWidth"
                                        onChange={handleOnChanges}
                                        value={state.editor.selectedElement.styles.borderBottomWidth || ""}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div>
                                    <Label className="text-muted-foreground">Left</Label>
                                    <Input
                                        placeholder="px"
                                        id="borderLeftWidth"
                                        onChange={handleOnChanges}
                                        value={state.editor.selectedElement.styles.borderLeftWidth || ""}
                                    />
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Right</Label>
                                    <Input
                                        placeholder="px"
                                        id="borderRightWidth"
                                        onChange={handleOnChanges}
                                        value={state.editor.selectedElement.styles.borderRightWidth || ""}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <Label className="text-muted-foreground">Aspect Ratio</Label>
                        <Input
                            placeholder="16/9 | 4/3 ..."
                            id="aspectRatio"
                            onChange={handleOnChanges}
                            value={state.editor.selectedElement.styles.aspectRatio || ""}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label className="text-muted-foreground">Background Color</Label>
                        <div className="flex  border-[1px] rounded-md overflow-clip">
                            <div
                                className="w-12 "
                                style={{
                                    backgroundColor:
                                        state.editor.selectedElement.styles.backgroundColor || "",
                                }}
                            />
                            <Input
                                placeholder="#HFI245"
                                className="!border-y-0 rounded-none !border-r-0 mr-2"
                                id="backgroundColor"
                                onChange={handleOnChanges}
                                value={state.editor.selectedElement.styles.backgroundColor || ""}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label className="text-muted-foreground">Background Image</Label>
                        <div className="flex  border-[1px] rounded-md overflow-clip">
                            <div
                                className="w-12 "
                                style={{
                                    backgroundImage:
                                        state.editor.selectedElement.styles.backgroundImage || "",
                                }}
                            />
                            <Input
                                placeholder="url()"
                                className="!border-y-0 rounded-none !border-r-0 mr-2"
                                id="backgroundImage"
                                onChange={handleOnChanges}
                                value={state.editor.selectedElement.styles.backgroundImage || ""}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label className="text-muted-foreground">Image Position</Label>
                        <Tabs
                            onValueChange={(e) =>
                                handleOnChanges({
                                    target: {
                                        id: 'backgroundSize',
                                        value: e,
                                    },
                                })
                            }
                            value={state.editor.selectedElement.styles.backgroundSize?.toString() || ""}
                        >
                            <TabsList className="flex items-center flex-row justify-between border-[1px] rounded-md bg-transparent h-fit gap-4">
                                <TabsTrigger
                                    value="cover"
                                    className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                                >
                                    <ChevronsLeftRightIcon size={18} />
                                </TabsTrigger>
                                <TabsTrigger
                                    value="contain"
                                    className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                                >
                                    <AlignVerticalJustifyCenter size={22} />
                                </TabsTrigger>
                                <TabsTrigger
                                    value="auto"
                                    className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                                >
                                    <LucideImageDown size={18} />
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label className="text-muted-foreground">Cursor</Label>
                        <Select
                            onValueChange={(e) =>
                                handleOnChanges({
                                    target: {
                                        id: 'cursor',
                                        value: e,
                                    },
                                })
                            }
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select a Cursore type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Cursor Type</SelectLabel>
                                    <SelectItem value="default">Default</SelectItem>
                                    <SelectItem value="pointer">Pointer</SelectItem>
                                    <SelectItem value="none">None</SelectItem>
                                    <SelectItem value="context-menu">Context Menu</SelectItem>
                                    <SelectItem value="help">Help</SelectItem>
                                    <SelectItem value="progress">Progress</SelectItem>
                                    <SelectItem value="wait">Wait</SelectItem>
                                    <SelectItem value="cell">Cell</SelectItem>
                                    <SelectItem value="crosshair">Crosshair</SelectItem>
                                    <SelectItem value="text">Text</SelectItem>
                                    <SelectItem value="vertical-text">Vertical Text</SelectItem>
                                    <SelectItem value="alias">Alias</SelectItem>
                                    <SelectItem value="copy">Copy</SelectItem>
                                    <SelectItem value="move">Move</SelectItem>
                                    <SelectItem value="no-drop">No Drop</SelectItem>
                                    <SelectItem value="not-allowed">Not Allowed</SelectItem>
                                    <SelectItem value="grab">Grab</SelectItem>
                                    <SelectItem value="grabbing">Grabbing</SelectItem>
                                    <SelectItem value="zoom-in">Zoom In</SelectItem>
                                    <SelectItem value="zoom-out">Zoom Out</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label className="text-muted-foreground">Image Repeat</Label>
                        <Select
                            onValueChange={(e) =>
                                handleOnChanges({
                                    target: {
                                        id: 'backgroundRepeat',
                                        value: e,
                                    },
                                })
                            }
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select a Repeat Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Image Repeat</SelectLabel>
                                    <SelectItem value="repeat-x">Repeat Horizontally</SelectItem>
                                    <SelectItem value="repeat">Repeat</SelectItem>
                                    <SelectItem value="space">Space</SelectItem>
                                    <SelectItem value="round">Round</SelectItem>
                                    <SelectItem value="no-repeat">No Repeat</SelectItem>
                                    <SelectItem value="space repeat">Repeat with Space</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem
                value="Layout"
                className="px-6 py-0"
            >
                <AccordionTrigger className="!no-underline">Layout</AccordionTrigger>
                <AccordionContent className='flex flex-col gap-y-4'>
                    <div className="flex flex-col gap-2">
                        <Label>Display Mode</Label>
                        <Select
                            onValueChange={(e) =>
                                handleOnChanges({
                                    target: {
                                        id: "display",
                                        value: e,
                                    },
                                })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select display" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Display Mode</SelectLabel>
                                    <SelectItem value="flex">Flex</SelectItem>
                                    <SelectItem value="inline-flex">Inline Flex</SelectItem>
                                    <SelectItem value="inline">Inline</SelectItem>
                                    <SelectItem value="block">Block</SelectItem>
                                    <SelectItem value="inline-block">Inline Block</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <Label className="text-muted-foreground">Justify Content</Label>
                    <Tabs
                        onValueChange={(e) =>
                            handleOnChanges({
                                target: {
                                    id: 'justifyContent',
                                    value: e,
                                },
                            })
                        }
                        value={state.editor.selectedElement.styles.justifyContent}
                    >
                        <TabsList className="flex items-center flex-row justify-between border-[1px] rounded-md bg-transparent h-fit gap-4">
                            <TabsTrigger
                                value="space-between"
                                className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                            >
                                <AlignHorizontalSpaceBetween size={18} />
                            </TabsTrigger>
                            <TabsTrigger
                                value="space-evenly"
                                className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                            >
                                <AlignHorizontalSpaceAround size={18} />
                            </TabsTrigger>
                            <TabsTrigger
                                value="center"
                                className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                            >
                                <AlignHorizontalJustifyCenterIcon size={18} />
                            </TabsTrigger>
                            <TabsTrigger
                                value="start"
                                className="w-10 h-10 p-0 data-[state=active]:bg-muted "
                            >
                                <AlignHorizontalJustifyStart size={18} />
                            </TabsTrigger>
                            <TabsTrigger
                                value="end"
                                className="w-10 h-10 p-0 data-[state=active]:bg-muted "
                            >
                                <AlignHorizontalJustifyEndIcon size={18} />
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                    <Label className="text-muted-foreground">Align Items</Label>
                    <Tabs
                        onValueChange={(e) =>
                            handleOnChanges({
                                target: {
                                    id: 'alignItems',
                                    value: e,
                                },
                            })
                        }
                        value={state.editor.selectedElement.styles.alignItems}
                    >
                        <TabsList className="flex items-center flex-row justify-between border-[1px] rounded-md bg-transparent h-fit gap-4">
                            <TabsTrigger
                                value="center"
                                className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                            >
                                <AlignVerticalJustifyCenter size={18} />
                            </TabsTrigger>
                            <TabsTrigger
                                value="start"
                                className="w-10 h-10 p-0 data-[state=active]:bg-muted "
                            >
                                <AlignVerticalJustifyStart size={18} />
                            </TabsTrigger>
                            <TabsTrigger
                                value="end"
                                className="w-10 h-10 p-0 data-[state=active]:bg-muted "
                            >
                                <AlignEndHorizontal size={18} />
                            </TabsTrigger>
                            <TabsTrigger
                                value="normal"
                                className="w-10 h-10 p-0 data-[state=active]:bg-muted "
                            >
                                <AlignJustify size={18} />
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                    <div className='gap-y-2'>
                        <Label className="text-muted-foreground">Flex Direction</Label>
                        <Select
                            onValueChange={(e) =>
                                handleOnChanges({
                                    target: {
                                        id: 'flexDirection',
                                        value: e,
                                    },
                                })
                            }
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select a Direction" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Flex Direction</SelectLabel>
                                    <SelectItem value="row">Row</SelectItem>
                                    <SelectItem value="row-reverse">Row Reverse</SelectItem>
                                    <SelectItem value="column">Column</SelectItem>
                                    <SelectItem value="column-reverse">Column Reverse</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className='gap-y-2'>
                        <div className="flex gap-4">
                            <div>
                                <Label className="text-muted-foreground">Column Gap</Label>
                                <Input
                                    id="columnGap"
                                    placeholder="px"
                                    onChange={handleOnChanges}
                                    value={state.editor.selectedElement.styles.columnGap || ""}
                                />
                            </div>
                            <div>
                                <Label className="text-muted-foreground">Row Gap</Label>
                                <Input
                                    placeholder="px"
                                    id="rowGap"
                                    onChange={handleOnChanges}
                                    value={state.editor.selectedElement.styles.rowGap || ""}
                                />
                            </div>
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}

export default SettingsTab;
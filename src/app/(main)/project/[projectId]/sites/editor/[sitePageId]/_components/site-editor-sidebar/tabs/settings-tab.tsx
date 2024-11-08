'use client'
import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsTrigger, TabsList } from '@/components/ui/tabs'
import { useEditor } from '@/providers/editor/editor-provider'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'

const SettingsTab = () => {

    const { state, dispatch } = useEditor();

    const handleChangeCustomValues = (e: any) => {
        const settingProperty = e.target.id
        let value = e.target.value
        const object = {
            [settingProperty]: value,
        }

        dispatch({
            type: 'UPDATE_ELEMENT',
            payload: {
                elementDetails: {
                    ...state.editor.selectedElement,
                    content: {
                        ...state.editor.selectedElement.content,
                        ...object,
                    },
                },
            },
        })
    }

    return (
        <section className='w-full flex flex-col'>
            <div className="px-6 py-0">
                <div className='my-2 space-y-4'>
                    {(state.editor.selectedElement.type === 'heading') &&
                        !Array.isArray(state.editor.selectedElement.content) && (
                            <div className="flex flex-col gap-2">
                                <Label>Tag Type</Label>
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
                                <Label>Tag Type</Label>
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
                                <Label>Link Path</Label>
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
                            <div className="flex flex-col gap-2">
                                <Label>Width</Label>
                                <Input
                                    id="width"
                                    placeholder="Image Width"
                                    onChange={handleChangeCustomValues}
                                    value={
                                        state.editor.selectedElement.content.width || "auto"
                                    }
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label>Height</Label>
                                <Input
                                    id="height"
                                    placeholder="Image Height"
                                    onChange={handleChangeCustomValues}
                                    value={
                                        state.editor.selectedElement.content.height || "auto"
                                    }
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label>Loading</Label>
                                <Select
                                    onValueChange={(e) =>
                                        handleChangeCustomValues({
                                            target: {
                                                id: 'imageLoading',
                                                value: e,
                                            },
                                        })
                                    }
                                    value={state.editor.selectedElement.content.imageLoading || "lazy"}
                                >
                                    <SelectTrigger className="w-[180px] font-">
                                        <SelectValue placeholder="Select a Loading Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Loading</SelectLabel>
                                            <SelectItem value="lazy">Lazy: loads text from asset</SelectItem>
                                            <SelectItem value="eager">Eager: loads wth page</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}
                    {!Array.isArray(state.editor.selectedElement.content) && (state.editor.selectedElement.type === "text" || state.editor.selectedElement.type === "heading" || state.editor.selectedElement.type === "paragraph" || state.editor.selectedElement.type === "link" || state.editor.selectedElement.type === "button") && (
                        <div className="flex flex-col gap-2">
                            <Label>Text</Label>
                            <Textarea
                                id="innerText"
                                placeholder="Inner Text"
                                onChange={handleChangeCustomValues}
                                value={state.editor.selectedElement.content.innerText || ""}
                                className='min-h-[100px]'
                            />
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}

export default SettingsTab;
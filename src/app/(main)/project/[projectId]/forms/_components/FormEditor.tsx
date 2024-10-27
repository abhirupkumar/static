// components/FormBuilder/FormEditor.tsx
'use client';

import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Field, FieldType } from '@prisma/client';

interface FormEditorProps {
    initialFields?: Field[];
    onSave: (fields: Field[]) => void;
}

export default function FormEditor({ initialFields = [], onSave }: FormEditorProps) {
    const [fields, setFields] = useState<Field[]>(initialFields);

    const fieldTypes: { value: FieldType; label: string }[] = [
        { value: 'TEXT', label: 'Text Input' },
        { value: 'TEXTAREA', label: 'Text Area' },
        { value: 'NUMBER', label: 'Number' },
        { value: 'PASSWORD', label: 'Password' },
        { value: 'EMAIL', label: 'Email' },
        { value: 'IMAGE', label: 'Image Upload' },
        { value: 'SELECT', label: 'Dropdown' },
        { value: 'RADIO', label: 'Radio Group' },
        { value: 'CHECKBOX', label: 'Checkbox Group' },
        { value: 'DATE', label: 'Date Picker' },
    ];

    const addField = () => {
        const newField: Field = {
            id: `temp-${Date.now()}`,
            formId: '',
            label: 'New Field',
            type: 'TEXT',
            required: false,
            order: fields.length,
            options: [],
            placeholder: '',
        };
        setFields([...fields, newField]);
    };

    const updateField = (index: number, updates: Partial<Field>) => {
        const newFields = [...fields];
        newFields[index] = { ...newFields[index], ...updates };
        setFields(newFields);
    };

    const removeField = (index: number) => {
        const newFields = fields.filter((_, i) => i !== index);
        setFields(newFields);
    };

    const onDragEnd = (result: any) => {
        if (!result.destination) return;

        const items = Array.from(fields);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setFields(items.map((item, index) => ({ ...item, order: index })));
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Form Fields</h2>
                <Button onClick={addField}>Add Field</Button>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="fields">
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="space-y-4"
                        >
                            {fields.map((field, index) => (
                                <Draggable
                                    key={field.id}
                                    draggableId={field.id}
                                    index={index}
                                >
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className="p-4 border rounded-lg shadow-sm"
                                        >
                                            <div className="grid gap-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <Label>Field Label</Label>
                                                        <Input
                                                            value={field.label}
                                                            onChange={(e) =>
                                                                updateField(index, { label: e.target.value })
                                                            }
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label>Field Type</Label>
                                                        <Select
                                                            value={field.type}
                                                            onValueChange={(value: FieldType) =>
                                                                updateField(index, { type: value })
                                                            }
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {fieldTypes.map((type) => (
                                                                    <SelectItem
                                                                        key={type.value}
                                                                        value={type.value}
                                                                    >
                                                                        {type.label}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>

                                                {(field.type === 'SELECT' ||
                                                    field.type === 'RADIO' ||
                                                    field.type === 'CHECKBOX') && (
                                                        <div>
                                                            <Label>Options (comma-separated)</Label>
                                                            <Input
                                                                value={field.options.join(',')}
                                                                onChange={(e) =>
                                                                    updateField(index, {
                                                                        options: e.target.value.split(','),
                                                                    })
                                                                }
                                                            />
                                                        </div>
                                                    )}

                                                <div className="flex justify-end">
                                                    <Button
                                                        variant="destructive"
                                                        onClick={() => removeField(index)}
                                                    >
                                                        Remove
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            <div className="flex justify-end">
                <Button onClick={() => onSave(fields)}>Save Form</Button>
            </div>
        </div>
    );
}
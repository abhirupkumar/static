
// app/api/forms/[formId]/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PUT(
    request: Request,
    { params }: { params: { formId: string } }
) {
    try {
        const { formId } = params;
        const data = await request.json();

        // Delete existing fields
        await db.field.deleteMany({
            where: { formId },
        });

        // Update form and create new fields
        const updatedForm = await db.form.update({
            where: { id: formId },
            data: {
                name: data.name,
                description: data.description,
                published: data.published,
                Fields: {
                    create: data.Fields.map((field: any, index: number) => ({
                        label: field.label,
                        type: field.type,
                        required: field.required,
                        order: index,
                        options: field.options || [],
                        placeholder: field.placeholder,
                        layout: field.layout,
                        width: field.width,
                    })),
                },
            },
            include: {
                Fields: true,
            },
        });

        return NextResponse.json(updatedForm);
    } catch (error) {
        console.error('Error in PUT /api/forms/[formId]:', error);
        return NextResponse.json(
            { error: 'Failed to update form' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    _request: Request,
    { params }: { params: { formId: string } }
) {
    try {
        const { formId } = params;

        await db.form.delete({
            where: { id: formId },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error in DELETE /api/forms/[formId]:', error);
        return NextResponse.json(
            { error: 'Failed to delete form' },
            { status: 500 }
        );
    }
}
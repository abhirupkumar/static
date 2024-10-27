// app/api/forms/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getFormById, getFormWithResponses } from '@/lib/queries';

interface RouteParams {
    params: {
        formId: string;
    };
}

export async function GET(request: Request, { params }: RouteParams) {
    try {
        const { formId } = params;
        const { searchParams } = new URL(request.url);
        const includeResponses = searchParams.get('responses') === 'true';

        const form = includeResponses
            ? await getFormWithResponses(formId)
            : await getFormById(formId);

        if (!form) {
            return NextResponse.json(
                { error: 'Form not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(form);
    } catch (error) {
        console.error('Error in GET /api/forms/[formId]:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();

        const form = await db.form.create({
            data: {
                name: data.name,
                description: data.description,
                published: data.published || false,
                projectId: data.projectId,
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

        return NextResponse.json(form);
    } catch (error) {
        console.error('Error in POST /api/forms:', error);
        return NextResponse.json(
            { error: 'Failed to create form' },
            { status: 500 }
        );
    }
}
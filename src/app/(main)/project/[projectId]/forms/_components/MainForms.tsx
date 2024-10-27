// app/forms/page.tsx
'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useRouter } from 'next/navigation';

export default function MainForms({ forms, projectId }: { forms: any[], projectId: string }) {
    const router = useRouter();

    const handleCreateForm = () => {
        router.push(`${process.env.NEXT_PUBLIC_URL}project/${projectId}/forms/create`);
    };

    const handleEditForm = (id: string) => {
        router.push(`project/${projectId}/forms/${id}/edit`);
    };

    const handleViewResponses = (id: string) => {
        router.push(`project/${projectId}/forms/${id}/responses`);
    };

    const handleDeleteForm = async (id: string) => {
        if (confirm('Are you sure you want to delete this form?')) {
            try {
                await fetch(`/api/forms/${id}`, {
                    method: 'DELETE',
                });
                router.refresh();
            } catch (error) {
                console.error('Error deleting form:', error);
            }
        }
    };

    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Forms</h1>
                <Button onClick={handleCreateForm}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Form
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Form Name</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead>Responses</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {forms.map((form) => (
                            <TableRow key={form.id}>
                                <TableCell>{form.name}</TableCell>
                                <TableCell>
                                    {new Date(form.createdAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell>{form?.Fields?.Responses.length || 0}</TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleEditForm(form.id)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleViewResponses(form.id)}
                                    >
                                        Results
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDeleteForm(form.id)}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
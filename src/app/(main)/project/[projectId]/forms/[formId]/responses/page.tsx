// app/forms/[formId]/responses/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Field, FieldResponse, Form } from '@prisma/client';

interface ResponseData {
  timestamp: Date;
  responses: { [key: string]: string };
}

interface FormWithFieldsAndResponses extends Form {
  Fields: (Field & {
    Responses: FieldResponse[];
  })[];
}

interface ResponsesPageProps {
  params: {
    formId: string;
  };
}

export default function ResponsesPage({ params }: ResponsesPageProps) {
  const router = useRouter();
  const [form, setForm] = useState<FormWithFieldsAndResponses | null>(null);
  const [loading, setLoading] = useState(true);
  const [responses, setResponses] = useState<ResponseData[]>([]);

  useEffect(() => {
    const fetchFormWithResponses = async () => {
      try {
        const response = await fetch(`/api/forms/${params.formId}?responses=true`);
        if (!response.ok) throw new Error('Failed to fetch form responses');
        const data: FormWithFieldsAndResponses = await response.json();
        setForm(data);

        // Process responses to group them by timestamp
        const responseMap = new Map<string, ResponseData>();

        data.Fields.forEach(field => {
          field.Responses.forEach(response => {
            const timestamp = response.createdAt;
            const timeKey = timestamp.toString();

            if (!responseMap.has(timeKey)) {
              responseMap.set(timeKey, {
                timestamp: new Date(timestamp),
                responses: {},
              });
            }

            const existingResponse = responseMap.get(timeKey)!;
            existingResponse.responses[field.label] = response.value;
          });
        });

        // Convert map to array and sort by timestamp
        const sortedResponses = Array.from(responseMap.values()).sort(
          (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
        );

        setResponses(sortedResponses);
      } catch (error) {
        console.error('Error fetching form responses:', error);
        toast.error('Failed to load responses');
      } finally {
        setLoading(false);
      }
    };

    fetchFormWithResponses();
  }, [params.formId]);

  const downloadResponses = () => {
    if (!form || !responses.length) return;

    // Create CSV content
    const headers = ['Submitted At', ...form.Fields.map(field => field.label)];
    const rows = responses.map(response => {
      const row = [response.timestamp.toLocaleString()];
      form.Fields.forEach(field => {
        row.push(response.responses[field.label] || '');
      });
      return row;
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${form.name}-responses.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!form) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Form not found</h1>
          <Button onClick={() => router.push('/forms')}>
            Back to Forms
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.push('/forms')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold">{form.name} - Responses</h1>
          </div>
          {responses.length > 0 && (
            <Button onClick={downloadResponses}>
              <Download className="mr-2 h-4 w-4" />
              Download CSV
            </Button>
          )}
        </div>

        {responses.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">No responses yet</p>
          </div>
        ) : (
          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">Submitted At</TableHead>
                  {form.Fields.map(field => (
                    <TableHead key={field.id} className="whitespace-nowrap">
                      {field.label}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {responses.map((response, idx) => (
                  <TableRow key={response.timestamp.toString()}>
                    <TableCell className="whitespace-nowrap">
                      {response.timestamp.toLocaleString()}
                    </TableCell>
                    {form.Fields.map(field => (
                      <TableCell key={field.id}>
                        {field.type === 'IMAGE' ? (
                          response.responses[field.label] ? (
                            <img
                              src={response.responses[field.label]}
                              alt={field.label}
                              className="w-20 h-20 object-cover rounded"
                            />
                          ) : (
                            'No image'
                          )
                        ) : field.type === 'CHECKBOX' ? (
                          response.responses[field.label] ? (
                            response.responses[field.label]
                              .split(',')
                              .map((item: string) => (
                                <div key={item} className="whitespace-nowrap">
                                  {item.trim()}
                                </div>
                              ))
                          ) : (
                            '-'
                          )
                        ) : (
                          response.responses[field.label] || '-'
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
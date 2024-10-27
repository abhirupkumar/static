'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { FormWithFields } from '@/lib/queries';
import FormEditor from '../_components/FormEditor';
import BlurPage from '@/components/global/blur-page';

interface FormManagePageProps {
  params: {
    formId?: string;
  };
}

export default function FormCreatePage({ params }: FormManagePageProps) {
  const router = useRouter();
  const [form, setForm] = useState<Partial<FormWithFields>>({
    name: '',
    description: '',
    Fields: [],
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async (fields: any) => {
    setSaving(true);
    try {
      const url = '/api/forms';

      const method = 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...form,
          fields,
        }),
      });

      if (!response.ok) throw new Error('Failed to save form');

      toast.success(`Form created successfully`);
      router.push('/forms');
    } catch (error) {
      console.error('Error saving form:', error);
      toast.error('Failed to save form');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <BlurPage>
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </BlurPage>
    );
  }

  return (
    <BlurPage>
      <div className="container mx-auto py-10 bg-black">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">
              Create Form
            </h1>
            <div className="space-x-2">
              <Button
                onClick={() => router.push('/forms')}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleSave(form.Fields)}
                disabled={!form.name || !form.Fields?.length}
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Form'
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Form Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="max-w-md"
                placeholder="Enter form name"
                required
              />
            </div>
          </div>

          <FormEditor
            initialFields={form.Fields || []}
            onSave={handleSave}
          />
        </div>
      </div>
    </BlurPage>
  );
}
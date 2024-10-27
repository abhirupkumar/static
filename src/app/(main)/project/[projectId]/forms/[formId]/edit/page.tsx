import { getFormById } from '@/lib/queries';
import React from 'react'
import FormEditPage from './_components/FormEditPage';

const Page = async ({ params }: { params: { projectId: string, formId: string } }) => {
  const forms = await getFormById(params.formId);
  return (
    <FormEditPage form={forms!} params={params} />
  )
}

export default Page;
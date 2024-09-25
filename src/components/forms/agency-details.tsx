"use client";

import { useToast } from '@/hooks/use-toast';
import { Agency } from '@prisma/client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { AlertDialog } from '@/components/ui/alert-dialog'

type Props = {
    data?: Partial<Agency>
}

const AgencyDetails = ({ data }: Props) => {
    const { toast } = useToast()
    const router = useRouter()
    const [deletingAgency, setDeletingAgency] = useState(false)
    return (
        <AlertDialog ></AlertDialog>
    )
}

export default AgencyDetails

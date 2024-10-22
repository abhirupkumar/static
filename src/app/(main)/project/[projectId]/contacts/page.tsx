import BlurPage from '@/components/global/blur-page'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { db } from '@/lib/db'
import { Contact, Project } from '@prisma/client'
import { format } from 'date-fns/format'
import React from 'react'
import CraeteContactButton from './_components/create-contact-btn'

type Props = {
    params: { projectId: string }
}

const ContactPage = async ({ params }: Props) => {

    const contacts = (await db.project.findUnique({
        where: {
            id: params.projectId,
        },
    }))

    const allContacts = contacts.Contact ?? []

    return (
        <BlurPage>
            <h1 className="text-4xl p-4">Contacts</h1>
            <CraeteContactButton projectId={params.projectId} />
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[200px]">Name</TableHead>
                        <TableHead className="w-[300px]">Email</TableHead>
                        <TableHead>Created Date</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="font-medium truncate">
                    {allContacts.map((contact) => (
                        <TableRow key={contact.id}>
                            <TableCell>
                                <Avatar>
                                    <AvatarImage alt="@shadcn" />
                                    <AvatarFallback className="bg-primary text-white">
                                        {contact.name.slice(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            </TableCell>
                            <TableCell>{contact.email}</TableCell>
                            <TableCell>{format(contact.createdAt, 'MM/dd/yyyy')}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </BlurPage>
    )
}

export default ContactPage
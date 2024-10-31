import {
    Contact,
    Notification,
    Prisma,
    Role,
    User,
} from '@prisma/client'
import {
    getAuthUserDetails,
    getProjectSite,
    getMedia,
    getUserPermissions,
} from './queries'
import { db } from './db'
import { z } from 'zod'

import Stripe from 'stripe'
import { title } from 'process'

export type NotificationWithUser =
    | ({
        User: {
            id: string
            name: string
            avatarUrl: string
            email: string
            createdAt: Date
            updatedAt: Date
            role: Role
            workspaceId: string | null
        }
    } & Notification)[]
    | undefined

export type UserWithPermissionsAndProjects = Prisma.PromiseReturnType<
    typeof getUserPermissions
>

export const SitePageSchema = z.object({
    name: z.string().min(1),
    title: z.string().optional(),
    description: z.string().optional(),
    keywords: z.string().optional(),
    pathName: z.string().optional(),
    isPublished: z.boolean().optional(),
})

const __getUsersWithWorkspaceProjectPermissionsSidebarOptions = async (
    workspaceId: string
) => {
    return await db.user.findFirst({
        where: { Workspace: { id: workspaceId } },
        include: {
            Workspace: { include: { Project: true } },
            Permissions: { include: { Project: true } },
        },
    })
}

export type AuthUserWithWorkspaceSigebarOptionsProjects =
    Prisma.PromiseReturnType<typeof getAuthUserDetails>

export type UsersWithWorkspaceProjectPermissionsSidebarOptions =
    Prisma.PromiseReturnType<
        typeof __getUsersWithWorkspaceProjectPermissionsSidebarOptions
    >

export type GetMediaFiles = Prisma.PromiseReturnType<typeof getMedia>

export type CreateMediaType = Prisma.MediaCreateWithoutProjectInput

export const CreatePipelineFormSchema = z.object({
    name: z.string().min(1),
})

export const CreateSiteFormSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    keywords: z.string().optional(),
    domain: z.string().optional(),
    subDomainName: z.string().min(1),
    favicon: z.string().optional(),
})

export const LaneFormSchema = z.object({
    name: z.string().min(1),
})

const currencyNumberRegex = /^\d+(\.\d{1,2})?$/

export const ContactUserFormSchema = z.object({
    name: z.string().min(1, 'Required'),
    email: z.string().email(),
})

export type Address = {
    city: string
    country: string
    line1: string
    postal_code: string
    state: string
}

export type ShippingInfo = {
    address: Address
    name: string
}

export type StripeCustomerType = {
    email: string
    name: string
    shipping: ShippingInfo
    address: Address
}

export type PricesList = Stripe.ApiList<Stripe.Price>

export type SitesForProject = Prisma.PromiseReturnType<
    typeof getProjectSite
>

export type UpsertSitePage = Prisma.SitePageCreateWithoutSiteInput
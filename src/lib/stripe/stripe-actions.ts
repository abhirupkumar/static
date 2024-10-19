'use server'
import Stripe from 'stripe'
import { db } from '../db'
import { stripe } from '.'

export const subscriptionCreated = async (
    subscription: Stripe.Subscription,
    customerId: string
) => {
    try {
        const workspace = await db.workspace.findFirst({
            where: {
                customerId,
            },
            include: {
                Project: true,
            },
        })
        if (!workspace) {
            throw new Error('Could not find and workspace to upsert the subscription')
        }

        const data = {
            active: subscription.status === 'active',
            workspaceId: workspace.id,
            customerId,
            currentPeriodEndDate: new Date(subscription.current_period_end * 1000),
            //@ts-ignore
            priceId: subscription.plan.id,
            subscritiptionId: subscription.id,
            //@ts-ignore
            plan: subscription.plan.id,
        }

        const res = await db.subscription.upsert({
            where: {
                workspaceId: workspace.id,
            },
            create: data,
            update: data,
        })
        console.log(`🟢 Created Subscription for ${subscription.id}`)
    } catch (error) {
        console.log('🔴 Error from Create action', error)
    }
}

export const getConnectAccountProducts = async (stripeAccount: string) => {
    const products = await stripe.products.list(
        {
            limit: 50,
            expand: ['data.default_price'],
        },
        {
            stripeAccount,
        }
    )
    return products.data
}
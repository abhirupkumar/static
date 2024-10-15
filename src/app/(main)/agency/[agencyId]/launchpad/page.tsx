import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { db } from '@/lib/db'
// import { getStripeOAuthLink } from '@/lib/utils'
import { CheckCircleIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
// import { stripe } from '@/lib/stripe'

type Props = {
    params: {
        workspaceId: string
    }
    searchParams: { code: string }
}

const LaunchPadPage = async ({ params, searchParams }: Props) => {
    const workspaceDetails = await db.workspace.findUnique({
        where: { id: params.workspaceId },
    })

    if (!workspaceDetails) return

    const allDetailsExist =
        workspaceDetails.address &&
        workspaceDetails.address &&
        workspaceDetails.workspaceLogo &&
        workspaceDetails.city &&
        workspaceDetails.companyEmail &&
        workspaceDetails.companyPhone &&
        workspaceDetails.country &&
        workspaceDetails.name &&
        workspaceDetails.state &&
        workspaceDetails.zipCode

    // const stripeOAuthLink = getStripeOAuthLink(
    //     'workspace',
    //     `launchpad___${workspaceDetails.id}`
    // )

    let connectedStripeAccount = false

    if (searchParams.code) {
        // if (!workspaceDetails.connectAccountId) {
        //     try {
        //         const response = await stripe.oauth.token({
        //             grant_type: 'authorization_code',
        //             code: searchParams.code,
        //         })
        //         await db.workspace.update({
        //             where: { id: params.workspaceId },
        //             data: { connectAccountId: response.stripe_user_id },
        //         })
        //         connectedStripeAccount = true
        //     } catch (error) {
        //         console.log('🔴 Could not connect stripe account')
        //     }
        // }
    }

    return (
        <div className="flex flex-col justify-center items-center">
            <div className="w-full h-full max-w-[800px]">
                <Card className="border-none">
                    <CardHeader>
                        <CardTitle>Lets get started!</CardTitle>
                        <CardDescription>
                            Follow the steps below to get your account setup.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <div className="flex justify-between items-center w-full border p-4 rounded-lg gap-2">
                            <div className="flex md:items-center gap-4 flex-col md:!flex-row">
                                <Image
                                    src="/appstore.png"
                                    alt="app logo"
                                    height={80}
                                    width={80}
                                    className="rounded-md object-contain"
                                />
                                <p> Save the website as a shortcut on your mobile device</p>
                            </div>
                            <Button>Start</Button>
                        </div>
                        <div className="flex justify-between items-center w-full border p-4 rounded-lg gap-2">
                            <div className="flex md:items-center gap-4 flex-col md:!flex-row">
                                <Image
                                    src="/stripelogo.png"
                                    alt="app logo"
                                    height={80}
                                    width={80}
                                    className="rounded-md object-contain"
                                />
                                <p>
                                    Connect your stripe account to accept payments and see your
                                    dashboard.
                                </p>
                            </div>
                            {workspaceDetails.connectAccountId || connectedStripeAccount ? (
                                <CheckCircleIcon
                                    size={50}
                                    className=" text-green-500 p-2 flex-shrink-0"
                                />
                            ) : (
                                // <Link
                                //     className="bg-primary py-2 px-4 rounded-md text-white"
                                //     href={stripeOAuthLink}
                                // >
                                //     Start
                                // </Link>
                                <Link
                                    className="bg-primary py-2 px-4 rounded-md text-white"
                                    href={'#'}
                                >
                                    Start
                                </Link>
                            )}
                        </div>
                        <div className="flex justify-between items-center w-full border p-4 rounded-lg gap-2">
                            <div className="flex md:items-center gap-4 flex-col md:!flex-row">
                                <Image
                                    src={workspaceDetails.workspaceLogo}
                                    alt="app logo"
                                    height={80}
                                    width={80}
                                    className="rounded-md object-contain"
                                />
                                <p> Fill in all your bussiness details</p>
                            </div>
                            {allDetailsExist ? (
                                <CheckCircleIcon
                                    size={50}
                                    className="text-green-500 p-2 flex-shrink-0"
                                />
                            ) : (
                                <Link
                                    className="bg-primary py-2 px-4 rounded-md text-white"
                                    href={`/workspace/${params.workspaceId}/settings`}
                                >
                                    Start
                                </Link>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default LaunchPadPage
import { constructMetadata } from '@/lib/utils'
import { SignIn } from '@clerk/nextjs'
import React from 'react'

const Page = () => {
    return (
        <SignIn />
    )
}

export default Page

export const metadata = constructMetadata({
    title: "Sign In - Zyper",
});
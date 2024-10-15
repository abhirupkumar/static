import { constructMetadata } from '@/lib/utils'
import { SignUp } from '@clerk/nextjs'
import React from 'react'

const Page = () => {
    return (
        <SignUp />
    )
}

export default Page

export const metadata = constructMetadata({
    title: "Sign Up - Zyper",
});
import ProjectDetails from '@/components/forms/project-details';
import { getAuthUserDetails, verifyAndAcceptInvitation } from '@/lib/queries'
import { currentUser } from '@clerk/nextjs/server';
import { Plan } from '@prisma/client'
import { redirect } from 'next/navigation'
import React from 'react'
import { constructMetadata } from "@/lib/utils";

const Page = async ({
    searchParams,
}: {
    searchParams: { plan: Plan; state: string; code: string }
}) => {
    const projectId = await verifyAndAcceptInvitation()

    //get the users details
    const user = await getAuthUserDetails()
    if (projectId) {
        if (user?.role === 'SUBACCOUNT_GUEST' || user?.role === 'SUBACCOUNT_USER') {
            return redirect('/subaccount')
        } else if (user?.role === 'PROJECT_OWNER' || user?.role === 'PROJECT_ADMIN') {
            if (searchParams.plan) {
                return redirect(`/project/${projectId}/billing?plan=${searchParams.plan}`)
            }
            if (searchParams.state) {
                const statePath = searchParams.state.split('___')[0]
                const stateProjectId = searchParams.state.split('___')[1]
                if (!stateProjectId) return <div>Not authorized</div>
                return redirect(
                    `/project/${stateProjectId}/${statePath}?code=${searchParams.code}`
                )
            } else return redirect(`/project/${projectId}`)
        } else {
            return <div>Not authorized</div>
        }
    }

    const authUser = await currentUser();

    return (
        <div className="flex justify-center items-center mt-4">
            <div className="max-w-[850px] flex flex-col">
                <ProjectDetails
                    data={{ companyEmail: authUser?.emailAddresses[0].emailAddress }}
                />
            </div>
        </div>
    )
}

export default Page;


export const metadata = constructMetadata({
    title: "Project - Zyper",
});
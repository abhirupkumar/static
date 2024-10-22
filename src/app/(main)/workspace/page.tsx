import WorkspaceDetails from '@/components/forms/workspace-details';
import { getAuthUserDetails, verifyAndAcceptInvitation } from '@/lib/queries'
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation'
import React from 'react'
import { constructMetadata } from "@/lib/utils";

const Page = async ({
    searchParams,
}: {
    searchParams: { state: string; code: string }
}) => {
    const workspaceId = await verifyAndAcceptInvitation()

    //get the users details
    const user = await getAuthUserDetails()
    if (workspaceId) {
        if (user?.role === 'PROJECT_GUEST' || user?.role === 'PROJECT_USER') {
            return redirect('/project')
        } else if (user?.role === 'WORKSPACE_OWNER' || user?.role === 'WORKSPACE_ADMIN') {
            if (searchParams.state) {
                const statePath = searchParams.state.split('___')[0]
                const stateWorkspaceId = searchParams.state.split('___')[1]
                if (!stateWorkspaceId) return <div>Not authorized</div>
                return redirect(
                    `/workspace/${stateWorkspaceId}/${statePath}?code=${searchParams.code}`
                )
            } else return redirect(`/workspace/${workspaceId}`)
        } else {
            return <div>Not authorized</div>
        }
    }

    const authUser = await currentUser();

    return (
        <div className="flex justify-center items-center mt-4">
            <div className="max-w-[850px] flex flex-col">
                <WorkspaceDetails
                    data={{ workEmail: authUser?.emailAddresses[0].emailAddress }}
                />
            </div>
        </div>
    )
}

export default Page;


export const metadata = constructMetadata({
    title: "Workspace - Zyper",
});
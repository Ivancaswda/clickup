import React from 'react'
import {getCurrent} from "@/features/auth/queries";
import {redirect} from "next/navigation";
import {getWorkspaceInfo} from "@/features/workspaces/queries";
import {JoinWorkspaceForm} from "@/features/workspaces/components/join-workspace-form";
import {WorkspaceIdJoinClient} from "@/app/(standalone)/workspaces/[workspaceId]/join/[inviteCode]/client";

interface WorkspaceIdJoinPageProps {
    params: {
        workspaceId: string,
        code: string,
        name: string
    }
}

const WorkspaceIdJoinPage = async ({params}: WorkspaceIdJoinPageProps) => {

    const user = await getCurrent()

    if (!user) redirect('/sign-in')



    return (
        <WorkspaceIdJoinClient/>
    )
}
export default WorkspaceIdJoinPage

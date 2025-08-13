import React from 'react'
import {getCurrent} from "@/features/auth/queries";
import {redirect} from "next/navigation";
import {EditWorkspaceForm} from "@/features/workspaces/components/edit-workspace-form";
import {getWorkspace} from "@/features/workspaces/queries";
import WorkspaceIdSettingsClient from "@/app/(standalone)/workspaces/[workspaceId]/settings/client";

interface WorkspaceIdSettingsPageProps {
    params: {
        workspaceId: string
    }
}


const WorkspaceIdSettingsPage = async ({params}: WorkspaceIdSettingsPageProps) => {

    const user = await getCurrent()
    if (!user) redirect('/sign-in')




    return (
     <WorkspaceIdSettingsClient/>
    )
}
export default WorkspaceIdSettingsPage

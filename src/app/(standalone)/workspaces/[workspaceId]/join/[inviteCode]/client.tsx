'use client'

import {JoinWorkspaceForm} from "@/features/workspaces/components/join-workspace-form";
import {useWorkspaceId} from "@/features/workspaces/hooks/use-workspace-id";
import {useGetWorkspaceInfo} from "@/features/workspaces/api/use-get-workspace-info";
import PageLoader from "@/components/PageLoader";
import PageError from "@/components/page-error";

export const WorkspaceIdJoinClient = () => {
    const workspaceId = useWorkspaceId()
    const {data: initialValues, isLoading} = useGetWorkspaceInfo({workspaceId})

    console.log(initialValues)
    if (isLoading) {
        return <PageLoader/>
    }

    if (!initialValues) {
        return  <PageError message='project not found'/>
    }

    return (
        <div className='w-full lg:max-w-4xl'>
            <JoinWorkspaceForm initialValues={initialValues}/>
        </div>
    )
}
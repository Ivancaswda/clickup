'use client'
import React from 'react'
import {EditProjectForm} from "@/features/projects/components/edit-project-form";
import {useGetProject} from "@/features/projects/api/use-get-project";
import {useProjectId} from "@/features/projects/hooks/use-project-id";
import PageLoader from "@/components/PageLoader";
import PageError from "@/components/page-error";

const ProjectIdSettingsClient = () => {
    const projectId = useProjectId()
    const {data: initialValues, isLoading} = useGetProject({projectId})

    if (isLoading) {
return <PageLoader/>
    }

    if (!initialValues) {
        return  <PageError message='project not found'/>
    }



    return (
        <div className='w-full lg:max-w-xl'>
            <EditProjectForm initialValues={initialValues}/>
        </div>
    )
}
export default ProjectIdSettingsClient

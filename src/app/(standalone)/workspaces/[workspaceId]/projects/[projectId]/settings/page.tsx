
import React from 'react'
import {getCurrent} from "@/features/auth/queries";
import {getProject} from "@/features/projects/queries";
import {redirect} from "next/navigation";

import {EditProjectForm} from "@/features/projects/components/edit-project-form";
import ProjectIdSettingsClient from "@/app/(standalone)/workspaces/[workspaceId]/projects/[projectId]/settings/client";



const ProjectIdSettingsPage = async () => {

    const user = await getCurrent()

    if (!user) redirect('/sign-in')



    return (
        <div className='w-full lg:max-w-xl'>
            <ProjectIdSettingsClient/>
        </div>
    )
}
export default ProjectIdSettingsPage

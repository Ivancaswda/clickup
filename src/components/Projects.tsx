'use client'

import React from 'react'
import {usePathname} from "next/navigation";
import {RiAddCircleFill} from "react-icons/ri";
import {useGetProjects} from "@/features/projects/api/use-get-projects";
import {useWorkspaceId} from "@/features/workspaces/hooks/use-workspace-id";
import Link from "next/link";
import {cn} from "@/lib/utils";
import {useCreateProjectModal} from "@/features/projects/hooks/use-create-project-modal";
import ProjectAvatar from "@/features/projects/components/project-avatar";



const Projects = () => {

    const workspaceId = useWorkspaceId()
    const {open} = useCreateProjectModal()
    const {data} = useGetProjects({workspaceId})
    const pathname = usePathname()

    console.log(data)
    return (
        <div className='flex flex-col gap-y-2 h-[170px]'>
            <div className='flex items-center justify-between'>
                <p className='text-xs uppercase text-neutral-500'>Projects</p>
                <RiAddCircleFill onClick={open} className='size-5 text-neutral-500'/>
            </div>
            {data?.documents.map((project) => {
                const href = `/workspaces/${workspaceId}/projects/${project.$id}`
                const isActive = pathname === href

                return (
                    <Link href={href} key={project.$id}>
                        <div className={cn('flex items-center gap-2.5 p-2.5 rounded-sm hover:opacity-75 transition cursor-pointer text-neutral-500', isActive && 'bg-white dark:bg-gray-700 shadow-sm hover:opacity-100 text-primary')}>
                            <ProjectAvatar image={project.imageUrl} name={project.name} fallbackClassName={project.name} />
                            <span className='truncate'>{project.name}</span>
                        </div>
                    </Link>
                )
            })}
        </div>
    )
}
export default Projects

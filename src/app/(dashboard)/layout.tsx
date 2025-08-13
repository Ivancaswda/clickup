'use client'
import React from 'react'

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import {CreateProjectModal} from "@/features/projects/components/create-project-modal";
import {CreateWorkspaceModal} from "@/features/workspaces/components/create-workspace-modal";
import {CreateTaskModal} from "@/features/tasks/components/create-task-modal";
import {EditTaskModal} from "@/features/tasks/components/edit-task-modal";
import {useCurrent} from "@/features/auth/api/use-current";
import GlobalPage from "@/components/GlobalPage";

interface DashboardLayoutProps {
    children: React.ReactNode
}
const DashboardLayout = ({children}: DashboardLayoutProps) => {

    const {data:user, isLoading: isLoadingUser} = useCurrent()


    return user ?  (
        <div className='min-h-screen pt-4'>

                <CreateProjectModal/>
                <CreateWorkspaceModal/>
                <CreateTaskModal/>
                <EditTaskModal/>
                <div className='flex w-full h-full'>
                    <div className='fixed left-0 top-0 hidden lg:block lg:w-[264px] h-full overflow-y-auto'>
                        <Sidebar/>
                    </div>
                    <div className='lg:pl-[264px] w-full'>
                        <div className='mx-auto max-w-screen-2xl h-full'>
                            <Navbar/>
                            <main className='h-full py-8 px-6 flex flex-col'>
                                {children}
                            </main>
                        </div>
                    </div>
                </div>
           
        </div>
    ) : <GlobalPage/>
}
export default DashboardLayout

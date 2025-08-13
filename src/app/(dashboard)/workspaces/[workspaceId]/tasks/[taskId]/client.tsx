'use client'

import React from 'react'
import {useTaskId} from "@/features/tasks/hooks/use-task-id";
import {useGetTask} from "@/features/tasks/api/use-get-task";
import PageLoader from "@/components/PageLoader";
import PageError from "@/components/page-error";
import TaskBreadCrumbs from "@/features/tasks/components/TaskBreadCrumbs";
import {DottedSeparator} from "@/components/ui/dotted-separator";
import TaskOverview from "@/features/tasks/components/TaskOverview";
import TaskDescription from "@/features/tasks/components/TaskDescription";

const TaskIdClient = () => {
    const taskId = useTaskId()
    const {data, isLoading} = useGetTask({taskId})

    if (isLoading) {
        return <PageLoader/>
    }
    if (!data) {
        return <PageError message='task not found'/>
    }

    return (
        <div className='flex flex-col'>
            <TaskBreadCrumbs project={data.project} task={data}/>
            <DottedSeparator className='my-6'/>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                <TaskOverview task={data}/>
                <TaskDescription task={data}/>
            </div>
        </div>
    )
}
export default TaskIdClient

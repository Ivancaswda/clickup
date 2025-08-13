'use client'
import React, {useCallback} from 'react'
import {useQueryState} from "nuqs";
import {TabsContent, Tabs, TabsTrigger, TabsList} from "@/components/ui/tabs";
import {Loader2Icon, PlusIcon} from "lucide-react";
import {Button} from "@/components/ui/button";
import {DottedSeparator} from "@/components/ui/dotted-separator";
import {useCreateTaskModal} from "@/features/tasks/hooks/use-create-task-modal";
import {useGetTasks} from "@/features/tasks/api/use-get-tasks";
import {useWorkspaceId} from "@/features/workspaces/hooks/use-workspace-id";
import {DataFilters} from "@/features/tasks/components/data-filters";
import {useTaskFilters} from "@/features/tasks/hooks/use-task-filters";
import {DataTable} from "@/features/tasks/components/data-table";
import {columns} from "@/features/tasks/components/columns";
import {DataKanban} from "@/features/tasks/components/data-kanban";
import {TaskStatus} from "@/features/tasks/types";
import {useBulkUpdateTasks} from "@/features/tasks/api/use-bulk-update-tasks";
import {DataCalendar} from "@/features/tasks/components/data-calendar";
import {useProjectId} from "@/features/projects/hooks/use-project-id";

interface TaskViewSwitcherProps {
    hideProjectFilter?:  boolean
}

const TaskViewSwitcher = ({hideProjectFilter} : TaskViewSwitcherProps ) => {
    const workspaceId = useWorkspaceId()
    const paramProjectId = useProjectId()
    const [{status, assigneeId, projectId, dueDate}] = useTaskFilters()
    const {open} = useCreateTaskModal()

    const { mutate: bulkUpdate} = useBulkUpdateTasks()

    const {data: tasks, isLoading: isLoadingTasks} = useGetTasks({
        workspaceId,
        projectId: paramProjectId || projectId,
        assigneeId,
        status,
        dueDate
    })

    const [view, setView] = useQueryState('task-view', {
        defaultValue: 'table'
    })

    const onKanbanChange = useCallback((tasks: {$id: string, status: TaskStatus, position: number}[]) => {
        bulkUpdate({
            json: {tasks}
        })
    }, [bulkUpdate])

    return (
        <Tabs
            defaultValue={view}
            onValueChange={setView}
            className='flex-1 w-full border border-gray-200 rounded-lg shadow-sm '>
            <div className='h-full flex flex-col overflow-auto p-4'>
                <div className='flex flex-col gap-y-2 lg:flex-row justify-between items-center'>
                    <TabsList className='w-full lg:w-auto'>
                        <TabsTrigger className='h-8 w-full lg:w-auto text-sm font-medium dark:text-black text-white focus:' value='table'>
                            Таблица
                        </TabsTrigger>
                        <TabsTrigger className='h-8 w-full lg:w-auto text-sm font-medium dark:text-black text-white' value='kanban'>
                            Канбан
                        </TabsTrigger>
                        <TabsTrigger className='h-8 w-full lg:w-auto text-sm  font-medium dark:text-black text-white' value='calendar'>
                            Календарь
                        </TabsTrigger>
                    </TabsList>
                    <Button onClick={open} size='sm' className='w-full lg:w-auto' variant="primary">
                        <PlusIcon className='mr-1'/>
                        Создать
                    </Button>
                </div>
                <DottedSeparator className='my-4'/>
                <DataFilters hideProjectFilter={hideProjectFilter}/>
                <DottedSeparator className='my-4'/>
                {isLoadingTasks ? (
                    <div className='w-full border border-gray-200 rounded-lg h-[200px] flex flex-col items-center justify-center '>
                        <Loader2Icon className='size-5 text-gray-400 animate-spin'/>
                    </div>
                ) : (
                    <>
                        <TabsContent value='table' className='mt-0'>
                            <DataTable columns={columns} data={tasks?.documents ?? []}/>
                        </TabsContent>
                        <TabsContent value='kanban' className='mt-0'>
                            <DataKanban onChange={onKanbanChange} data={tasks?.documents ?? []}/>
                        </TabsContent>
                        <TabsContent value='calendar' className='mt-0 h-full pb-4'>
                            <DataCalendar data={tasks?.documents ?? []}/>
                        </TabsContent>
                    </>
                )}
            </div>
        </Tabs>
    )
}

export default TaskViewSwitcher

import React from 'react'
import {Task} from "@/features/tasks/types";
import {Button} from "@/components/ui/button";
import {PencilIcon} from "lucide-react";
import {DottedSeparator} from "@/components/ui/dotted-separator";
import OverviewProperty from "@/features/tasks/components/overview-property";
import MemberAvatar from "@/features/members/components/member-avatar";
import {TaskDate} from "@/features/tasks/components/task-date";
import {Badge} from "@/components/ui/badge";
import {snakeCaseToTitleCase} from "@/lib/utils";
import {useEditTaskModal} from "@/features/tasks/hooks/use-edit-task-modal";

interface TaskOverviewProps {
    task: Task
}

const TaskOverview = ({task}: TaskOverviewProps) => {
    const {open} = useEditTaskModal()
    return (
        <section className=" rounded-xl shadow-md p-6 w-full max-w-md">
            <header className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-semibold">Обзор</h2>
                <Button onClick={() => open(task.$id)} variant="ghost" size="sm" className="flex items-center gap-2  hover:bg-pink-50">
                    <PencilIcon className="w-4 h-4" />
                    Редактировать
                </Button>
            </header>
            <DottedSeparator className="mb-5"/>
            <div className="flex flex-col gap-5">
                <OverviewProperty label="Исполнитель">
                    <div className="flex items-center gap-3">
                        <MemberAvatar name={task.assignee.name} className="w-10 h-10 rounded-full" />
                        <p className="text-base font-medium ">{task.assignee.name}</p>
                    </div>
                </OverviewProperty>

                <OverviewProperty label="Срок выполнения">
                    <TaskDate value={task.dueDate} className="text-base font-medium text-gray-200" />
                </OverviewProperty>

                <OverviewProperty label="Статус">
                    <Badge variant={task.status} className="capitalize px-3 py-1 text-sm font-semibold">
                        {snakeCaseToTitleCase(task.status)}
                    </Badge>
                </OverviewProperty>
            </div>
        </section>
    )
}

export default TaskOverview

import React from 'react'
import {Project} from "@/features/projects/types";
import {Task} from "@/features/tasks/types";
import ProjectAvatar from "@/features/projects/components/project-avatar";
import Link from "next/link";
import {useWorkspaceId} from "@/features/workspaces/hooks/use-workspace-id";
import {ChevronRightIcon, TrashIcon} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useDeleteTask} from "@/features/tasks/api/use-delete-task";
import {useConfirm} from "@/hooks/use-confirm";
import {useRouter} from "next/navigation";

interface TaskBreadCrumbsProps  {
    project: Project,
    task: Task
}

const TaskBreadCrumbs = ({project, task}: TaskBreadCrumbsProps) => {
    const workspaceId = useWorkspaceId()
    const {mutate, isPending} = useDeleteTask()
    const [ConfirmDialog, confirm] = useConfirm(
        'Удалить задачу?',
        'Это действие нельзя отменить',
        'destructive'
    )
    const router = useRouter()

    const handleDeleteTask = async () => {
        const ok = await confirm()
        if (!ok) return

        mutate({param: {taskId: task.$id}}, {
            onSuccess: () => {
                router.push(`/workspaces/${workspaceId}/tasks`)
            }
        })
    }

    return (
        <nav className="flex items-center gap-3  p-4 rounded-lg shadow-sm max-w-full overflow-auto">
            <ConfirmDialog />
            <ProjectAvatar name={project.name} image={project.imageUrl} className="w-8 h-8 rounded-md" />
            <Link className="text-sm font-semibold text-gray-100 hover:text-pink-600 whitespace-nowrap" href={`/workspaces/${workspaceId}/projects/${project.$id}`}>
                {project.name}
            </Link>
            <ChevronRightIcon className="w-5 h-5"/>
            <p className="text-sm font-semibold whitespace-nowrap">
                {task.name}
            </p>
            <Button
                onClick={handleDeleteTask}
                disabled={isPending}
                variant="destructive"
                size="sm"
                className="ml-auto flex items-center gap-2"
            >
                <TrashIcon className="w-4 h-4" />
                Удалить
            </Button>
        </nav>
    )
}

export default TaskBreadCrumbs

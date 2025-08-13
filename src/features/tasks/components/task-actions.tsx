import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {ExternalLinkIcon, PencilIcon, TrashIcon} from "lucide-react";
import {useDeleteTask} from "@/features/tasks/api/use-delete-task";
import {useConfirm} from "@/hooks/use-confirm";
import {useRouter} from "next/navigation";
import {useWorkspaceId} from "@/features/workspaces/hooks/use-workspace-id";
import {useEditTaskModal} from "@/features/tasks/hooks/use-edit-task-modal";

interface TaskActionsProps {
    id:string,
    projectId: string;
    children: React.ReactNode
}

export const TaskActions = ({id, projectId, children}: TaskActionsProps) => {
    const workspaceId = useWorkspaceId()
    const router = useRouter()
    const [ConfirmDialog, confirm] = useConfirm(
        'Удалить задачу?',
        'Это действие нельзя отменить',
        'destructive'
    );

    const {open} = useEditTaskModal()
    const {mutate, isPending} = useDeleteTask()

    const onDelete = async () => {
        const ok = await confirm()
        if (!ok) return
        mutate({param: {taskId: id}})
    }

    const onOpenTask = () => {
        router.push(`/workspaces/${workspaceId}/tasks/${id}`)
    }

    const onOpenProject = () => {
        router.push(`/workspaces/${workspaceId}/projects/${projectId}`)
    }

    return (
        <div className="flex justify-end">
            <ConfirmDialog />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    {children}
                </DropdownMenuTrigger>
                <DropdownMenuContent sideOffset={5} className="w-48 bg-white rounded-md shadow-lg border border-gray-200">
                    <DropdownMenuItem onClick={onOpenTask} className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-pink-50 cursor-pointer">
                        <ExternalLinkIcon className="w-4 h-4" />
                        Открыть задачу
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onOpenProject} className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-pink-50 cursor-pointer">
                        <ExternalLinkIcon className="w-4 h-4" />
                        Открыть проект
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => open(id)} className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-pink-50 cursor-pointer">
                        <PencilIcon className="w-4 h-4" />
                        Редактировать задачу
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onDelete} disabled={isPending} className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 cursor-pointer">
                        <TrashIcon className="w-4 h-4" />
                        Удалить задачу
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

'use client'
import ResponsiveModal from "@/components/ResponsiveModal";
import {useCreateTaskModal} from "@/features/tasks/hooks/use-create-task-modal";
import {CreateTaskFormWrapper} from "@/features/tasks/components/create-task-form-wrapper";
import {useEditTaskModal} from "@/features/tasks/hooks/use-edit-task-modal";
import {EditTaskFormWrapper} from "@/features/tasks/components/edit-task-form-wrapper";

export const EditTaskModal = () => {
    const {taskId, close} = useEditTaskModal()

    return (
        <ResponsiveModal open={!!taskId} onOpenChange={close}>
            {taskId &&  <EditTaskFormWrapper id={taskId} onCancel={close}/>}
        </ResponsiveModal>
    )
}
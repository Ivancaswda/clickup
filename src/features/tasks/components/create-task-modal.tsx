'use client'
import ResponsiveModal from "@/components/ResponsiveModal";
import {useCreateTaskModal} from "@/features/tasks/hooks/use-create-task-modal";
import {CreateTaskFormWrapper} from "@/features/tasks/components/create-task-form-wrapper";

export const CreateTaskModal = () => {
    const {isOpen, setIsOpen, close} = useCreateTaskModal()



    return (
        <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
            <CreateTaskFormWrapper  onCancel={close}/>
        </ResponsiveModal>
    )
}
'use client'
import {useQueryState, parseAsBoolean} from "nuqs";
import {TaskStatus} from "@/features/tasks/types";


export const useCreateTaskModal = () => {
    const [isOpen, setIsOpen] = useQueryState(
        "create-task",
        parseAsBoolean.withDefault(false).withOptions({clearOnDefault: true})
    )
    const open = () => setIsOpen(true)
    const close = () => setIsOpen(false)
    return {
        isOpen: !!isOpen,
        open,
        close,
        setIsOpen
    }
}
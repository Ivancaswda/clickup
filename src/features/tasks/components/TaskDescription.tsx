import React, {useState} from 'react'
import {Task} from "@/features/tasks/types";
import {Textarea} from "@/components/ui/textarea";
import {useUpdateTask} from "@/features/tasks/api/use-update-task";
import {PencilIcon, XIcon} from "lucide-react";
import {Button} from "@/components/ui/button";
import {DottedSeparator} from "@/components/ui/dotted-separator";

interface TaskDescriptionProps {
    task: Task
}

const TaskDescription = ({task}: TaskDescriptionProps) => {
    const [isEditing, setIsEditing] = useState(false)
    const [value, setValue] = useState(task.description)
    const {mutate, isPending} = useUpdateTask()

    const handleSave = () => {
        mutate({
            json: {description: value},
            param: {taskId: task.$id}
        }, {
            onSuccess: () => {
                setIsEditing(false)
            }
        })
    }

    return (
        <section className=" rounded-xl shadow-md p-6 max-w-md w-full">
            <header className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-semibold ">Описание</h2>
                <Button
                    onClick={() => setIsEditing(prev => !prev)}
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2  hover:bg-blue-50"
                >
                    {isEditing ? <><XIcon className="w-4 h-4"/> Отмена</> : <><PencilIcon className="w-4 h-4"/> Редактировать</>}
                </Button>
            </header>
            <DottedSeparator className="mb-5"/>
            {isEditing ? (
                <>
                    <Textarea
                        placeholder="Добавьте описание..."
                        value={value}
                        rows={5}
                        onChange={e => setValue(e.target.value)}
                        disabled={isPending}
                        className="resize-none border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500"
                    />
                    <div className="flex justify-end mt-4">
                        <Button
                            size="sm"
                            onClick={handleSave}
                            disabled={isPending}
                            className="px-6"
                        >
                            {isPending ? 'Сохранение...' : 'Сохранить'}
                        </Button>
                    </div>
                </>
            ) : (
                <p className={` ${task.description ? '' : 'italic '}`}>
                    {task.description || 'Описание не добавлено'}
                </p>
            )}
        </section>
    )
}

export default TaskDescription

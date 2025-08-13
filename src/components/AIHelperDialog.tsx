'use client'

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useCreateWorkspace } from "@/features/workspaces/api/use-create-workspace"
import { toast } from "sonner"
import { AiHelperTrigger } from "@/components/AIHelperTrigger";
import { Button } from "@/components/ui/button"
import {useCreateProject} from "@/features/projects/api/use-create-project";
import {useCreateTask} from "@/features/tasks/api/use-create-task";
import {Loader, Loader2Icon} from "lucide-react";

import {useWorkspaceId} from "@/features/workspaces/hooks/use-workspace-id";
import {useGetProjects} from "@/features/projects/api/use-get-projects";
import {useGetMembers} from "@/features/members/api/use-get-members";
import DatePicker from "@/components/DatePicker";
import {TaskStatus} from "@/features/tasks/types";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import {generateNamesFromAI} from "@/lib/ai/generate-names";
import {Label} from '@/components/ui/label'

const OPENROUTER_API_KEY = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || ''


const AIHelperDialog = () => {
    const { mutate: mutateWorkspace, isPending: isWorkspacePending } = useCreateWorkspace()
    const { mutate: mutateProject, isPending: isProjectPending } = useCreateProject()
    const { mutate: mutateTask, isPending: isTaskPending } = useCreateTask()
    const workspaceId = useWorkspaceId()
    const {data: projects, isLoading: isLoadingProjects} = useGetProjects({workspaceId})

    const {data: members, isLoading: isLoadingMembers} = useGetMembers({workspaceId})
    const [taskDefaults, setTaskDefaults] = useState({
        dueDate: new Date(),
        status: TaskStatus.TODO,
        assigneeId: "",
        projectId: ""
    })
    const projectOptions = projects?.documents.map((project) => ({
        id: project.$id,
        name: project.name,
        imageUrl: project.imageUrl
    }))
    const memberOptions = members?.documents.map((project) => ({
        id: project.$id,
        name: project.name,
    }))
    const [count, setCount] = useState(1)
    const [names, setNames] = useState([""])
    const [isOpen, setIsOpen] = useState(false)
    const [type, setType] = useState<"workspace" | "task" | "project" | null>(null)

    const handleCountChange = (value: number) => {
        setCount(value)
        setNames(Array(value).fill(""))
    }

    const handleNameChange = (index: number, value: string) => {
        const updated = [...names]
        updated[index] = value
        setNames(updated)
    }

    const generateRandomNames = async () => {
        if (!type) return;

        try {
            const aiNames = await generateNamesFromAI({
                type,
                count,
                apiKey: OPENROUTER_API_KEY,
            });

            setNames(aiNames);
        } catch (e) {
            console.error('Ошибка генерации AI-имен:', e)
            toast.error("Не удалось сгенерировать имена через ИИ. Используйте простые названия.")
        }
    }

    const createAll = async () => {
        if (type === 'workspace') {
            for (const name of names) {
                if (!name.trim()) continue
                try {
                    await mutateWorkspace({ name })
                } catch (e) {
                    toast.error(`Ошибка при создании "${name}"`)
                }
            }
            toast.success("Все рабочие пространства созданы!")
        } else if (type === 'project') {
            for (const name of names) {
                if (!name.trim()) continue
                try {
                    await mutateProject({
                        form: {
                            name: name,
                            workspaceId: workspaceId,
                            image: undefined,
                        }
                    })
                } catch (e) {
                    toast.error(`Ошибка при создании "${name}"`)
                }
            }
            toast.success("Все проекты созданы!")
        } else if (type === 'task') {
            if (!taskDefaults.projectId || !taskDefaults.assigneeId) {
                toast.error("Выберите проект и участника перед созданием заданий.")
                return
            }

            for (const name of names) {
                if (!name.trim()) continue
                try {
                    await mutateTask({
                        json: {
                            name,
                            workspaceId,
                            dueDate: taskDefaults.dueDate,
                            status: taskDefaults.status,
                            assigneeId: taskDefaults.assigneeId,
                            projectId: taskDefaults.projectId
                        }
                    })
                } catch (e) {
                    toast.error(`Ошибка при создании "${name}"`)
                }
            }

            toast.success("Все задания созданы!")
        }

        setIsOpen(false)
    }
    const isPending = isTaskPending || isProjectPending || isWorkspacePending ||  isLoadingProjects || isLoadingMembers
    if (isPending) {
        return  <div className='flex items-center justify-center w-full h-full'>
            <Loader2Icon className='animate-spin text-violet-500'/>
        </div>
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <AiHelperTrigger onSelect={(selectedType) => {
                setType(selectedType)
                setIsOpen(true)
                setCount(1)
                setNames([""])
            }} />
            <DialogContent className="max-w-lg space-y-4">
                <h2 className="text-lg font-semibold">
                    Сколько {type === 'workspace' && 'рабочих пространств'  || type === 'task' && 'заданий' || type === 'project' && 'проектов'} создать?

                </h2>

                <Input
                    type="number"
                    min={1}
                    max={20}
                    value={count}
                    onChange={(e) => handleCountChange(Number(e.target.value))}
                />

                <div className="space-y-2 max-h-[300px] overflow-auto">
                    {names.map((name, idx) => (
                        <Input
                            key={idx}
                            placeholder={`Название для ${type} ${idx + 1}`}
                            value={name}
                            onChange={(e) => handleNameChange(idx, e.target.value)}
                        />
                    ))}

                    {type === 'task' && (
                        <div className="space-y-4 pt-4">

                            <div>
                                <Label className="block text-sm font-medium mb-1">Срок выполнения</Label>
                                <DatePicker
                                    selected={taskDefaults.dueDate}
                                    onChange={(date) =>
                                        setTaskDefaults((prev) => ({ ...prev, dueDate: date ?? new Date() }))
                                    }
                                />
                            </div>


                            <div>
                                <Label className="block text-sm font-medium mb-1">Статус</Label>
                                <Select
                                    value={taskDefaults.status}
                                    onValueChange={(value) =>
                                        setTaskDefaults((prev) => ({ ...prev, status: value as TaskStatus }))
                                    }
                                >
                                    <SelectTrigger className="w-full" />
                                    <SelectContent>
                                        <SelectItem value={TaskStatus.TODO}>Todo</SelectItem>
                                        <SelectItem value={TaskStatus.IN_PROGRESS}>В процессе</SelectItem>
                                        <SelectItem value={TaskStatus.IN_REVIEW}>В рассмотре</SelectItem>
                                        <SelectItem value={TaskStatus.BACKLOG}>Поддержка</SelectItem>
                                        <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>


                            <div>
                                <Label className="block text-sm font-medium mb-1">Проект</Label>
                                <Select
                                    value={taskDefaults.projectId || undefined}
                                    onValueChange={(value) =>
                                        setTaskDefaults((prev) => ({ ...prev, projectId: value }))
                                    }
                                >
                                    <SelectTrigger className="w-full" />
                                    <SelectContent>

                                        {projectOptions?.map((project) => (
                                            <SelectItem key={project.id} value={project.id}>
                                                {project.name}
                                            </SelectItem>
                                        ))}
                                        {!projectOptions && <h2 className='text-sm text-neutral-100'>Создайте сначало проект перед тем как создавать задание!</h2>}
                                    </SelectContent>
                                </Select>
                            </div>


                            <div>
                                <Label className="block text-sm font-medium mb-1">Участник</Label>
                                <Select
                                    value={taskDefaults.assigneeId || undefined}
                                    onValueChange={(value) =>
                                        setTaskDefaults((prev) => ({ ...prev, assigneeId: value }))
                                    }
                                >
                                    <SelectTrigger className="w-full" />
                                    <SelectContent>
                                        <h2 value="">Выберите участника</h2>
                                        {memberOptions?.map((member) => (
                                            <SelectItem key={member.id} value={member.id}>
                                                {member.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-between items-center pt-2">
                    <Button type="button" variant="secondary" onClick={generateRandomNames}>
                        Авто-сгенерировать
                    </Button>
                    <Button type="button" disabled={isPending} onClick={createAll}>
                        Создать все
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
export default AIHelperDialog

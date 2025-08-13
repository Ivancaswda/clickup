'use client'
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";

import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import React, {useRef} from "react";
import {Card, CardContent, CardTitle, CardHeader} from "@/components/ui/card";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form'
import {DottedSeparator} from "@/components/ui/dotted-separator";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";
import {cn} from "@/lib/utils";
import {useWorkspaceId} from "@/features/workspaces/hooks/use-workspace-id";
import {createTaskSchema} from "@/features/tasks/schemas";
import {useCreateTask} from "@/features/tasks/api/use-create-task";
import DatePicker from "@/components/DatePicker";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import MemberAvatar from "@/features/members/components/member-avatar";
import {Task, TaskStatus} from "@/features/tasks/types";
import ProjectAvatar from "@/features/projects/components/project-avatar";
import {useUpdateTask} from "@/features/tasks/api/use-update-task";


interface EditTaskFormProps {
    onCancel?: () => void;
    projectOptions: {id: string, name: string, imageUrl: string}[];
    memberOptions: {id: string, name: string}[];
    initialValues: Task
}
export const EditTaskForm = ({onCancel, projectOptions, memberOptions, initialValues}: EditTaskFormProps) => {
    const router = useRouter()
    const workspaceId = useWorkspaceId()
    const {mutate, isPending} = useUpdateTask()

    const form = useForm<z.infer<typeof  createTaskSchema>>({
        resolver: zodResolver(createTaskSchema.omit({workspaceId: true, description: true})),
        defaultValues: {
            ...initialValues,
            dueDate: initialValues.dueDate ? new Date(initialValues.dueDate) : undefined
        }
    })

    const onSubmit = (values: z.infer<typeof createTaskSchema>) => {
        const payload = {
            ...values,
            dueDate: values.dueDate ? (values.dueDate instanceof Date ? values.dueDate.toISOString() : values.dueDate) : undefined,
        }
        console.log(payload)

        mutate({ json: payload, param: {taskId: initialValues.$id} }, {
            onSuccess: ({data}) => {
                form.reset()
                router.push(`/workspaces/${workspaceId}/projects/${data.$id}`)
                onCancel?.()
            }
        })
    }


    return (
        <Card className='w-full h-full border-none shadow-none'>
            <CardHeader className='flex p-7'>
                <CardTitle className='text-xl font-semibold'>
                  Редактировать задание
                </CardTitle>
            </CardHeader>

            <div className='px-7'>
                <DottedSeparator className='p-7'/>
            </div>
            <CardContent className='p-7'>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className='flex flex-col gap-y-4'>
                            <FormField control={form.control} name='name' render={({field}) => (
                                <FormItem>
                                    <FormLabel>
                                        Название задания
                                    </FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder='enter task name' />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )} />

                            <FormField control={form.control} name='dueDate' render={({field}) => (
                                <FormItem>
                                    <FormLabel>
                                        Срок выполнения
                                    </FormLabel>
                                    <FormControl>
                                        <DatePicker {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )} />

                            <FormField control={form.control} name='assigneeId' render={({field}) => (
                                <FormItem>
                                    <FormLabel>
                                       Уполномоченный
                                    </FormLabel>
                                    <Select defaultValue={field.value}
                                            onValueChange={field.onChange}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder='select assignee'/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <FormMessage/>
                                        <SelectContent>
                                            {memberOptions.map((member) => (
                                                <SelectItem key={member.id} value={member.id}>
                                                    <MemberAvatar
                                                        className='size-6'
                                                        name={member.name}
                                                    />
                                                    {member.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>

                                    </Select>

                                </FormItem>
                            )} />

                            <FormField control={form.control} name='status' render={({field}) => (
                                <FormItem>
                                    <FormLabel>
                                      Статус
                                    </FormLabel>
                                    <Select defaultValue={field.value}
                                            onValueChange={field.onChange}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder='select status'/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <FormMessage/>
                                        <SelectContent>
                                            <SelectItem value={TaskStatus.BACKLOG}>
                                               Поддержка
                                            </SelectItem>
                                            <SelectItem value={TaskStatus.IN_PROGRESS}>
                                                В процессе
                                            </SelectItem>
                                            <SelectItem value={TaskStatus.IN_REVIEW}>
                                               В рассмотре
                                            </SelectItem>
                                            <SelectItem value={TaskStatus.TODO}>Todo</SelectItem>
                                            <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
                                        </SelectContent>

                                    </Select>

                                </FormItem>
                            )} />

                            <FormField control={form.control} name='projectId' render={({field}) => (
                                <FormItem>
                                    <FormLabel>
                                        Project
                                    </FormLabel>
                                    <Select defaultValue={field.value}
                                            onValueChange={field.onChange}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder='select project'/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <FormMessage/>
                                        <SelectContent>
                                            {projectOptions.map((project) => (
                                                <SelectItem key={project.id} value={project.id}>
                                                    <ProjectAvatar
                                                        className='size-6'
                                                        name={project.name}
                                                        image={project.imageUrl}
                                                    />
                                                    {project.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>

                                    </Select>

                                </FormItem>
                            )} />
                        </div>
                        <DottedSeparator className='py-7'/>
                        <div className='flex items-center justify-between'>
                            <Button className={cn(!onCancel && 'invisible')} disabled={isPending} type='button' size='lg' variant='secondary' onClick={onCancel}>
                                Cancel
                            </Button>
                            <Button type='submit' disabled={isPending}  size='lg'  >
                                Save changes
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>

        </Card>
    )
}
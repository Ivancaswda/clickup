'use client'
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {createWorkspaceSchema} from "@/features/workspaces/schemas";
import {z} from "zod";
import Image from "next/image";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import React, {useRef} from "react";
import {Card, CardContent, CardTitle, CardHeader} from "@/components/ui/card";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form'
import {DottedSeparator} from "@/components/ui/dotted-separator";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useCreateWorkspace} from "@/features/workspaces/api/use-create-workspace";
import {ImageIcon} from "lucide-react";
import {useRouter} from "next/navigation";
import {cn} from "@/lib/utils";
import {toast} from "sonner";

import {useCreateProject} from "@/features/projects/api/use-create-project";
import {createProjectSchema} from "@/features/projects/schemas";
import {useWorkspaceId} from "@/features/workspaces/hooks/use-workspace-id";

interface CreateProjectFormProps {
    onCancel?: () => void;
}
export const CreateProjectForm = ({onCancel}: CreateProjectFormProps) => {
    const router = useRouter()
    const workspaceId = useWorkspaceId()
    const {mutate, isPending} = useCreateProject()
    const inputRef = useRef<HTMLInputElement>(null)
    const form = useForm<z.infer<typeof  createProjectSchema>>({
        resolver: zodResolver(createProjectSchema.omit({workspaceId: true})),
        defaultValues: {
            name: '',
            image: undefined,
            workspaceId: workspaceId,
        }
    })

    const onSubmit = (values: z.infer<typeof  createProjectSchema>) => {
        console.log(values)
        const finalValues = {
            ...values,
            workspaceId,
            image: values.image instanceof File ? values.image : ""
        }
        mutate({ form: finalValues }, {
            onSuccess: ({data}) => {
                form.reset()
                router.push(`/workspaces/${workspaceId}/projects/${data.$id}`)
            },
            onError: (err) => {
                toast.error(`Failed: ${err.message}`)
                console.error("Error creating project:", err)
            }
        })

    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            form.setValue('image', file)
        }
    }

    return (
        <Card className='w-full h-full border-none shadow-none'>
            <CardHeader className='flex p-7'>
                <CardTitle className='text-xl font-semibold'>
                   Создать новый проект
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
                                        Название проекта
                                    </FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder='введите название проекта' />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )} />
                            <FormField control={form.control} name='image' render={({field}) => (
                                <FormItem>
                                    <FormLabel>Картинка проекта</FormLabel>
                                    <FormControl>
                                        <div className='flex items-center gap-x-5'>
                                            {field.value ? (
                                                <div className='size-[72px] relative rounded-md overflow-hidden'>
                                                    <Image alt='logo' fill
                                                           className='object-cover'
                                                           src={field.value instanceof File ? URL.createObjectURL(field.value) : field.value}/>
                                                </div>
                                            ) : (
                                                <Avatar className='size-[72px]'>
                                                    <AvatarFallback>
                                                        <ImageIcon className='size-[36px] text-neutral-400'/>
                                                    </AvatarFallback>
                                                </Avatar>
                                            )}
                                            <div className='flex flex-col'>
                                                <p className='text-sm'>картинка проекта</p>
                                                <p className='text-sm text-muted-foreground'>
                                                    JPG, PNG, SVG or JPEG, max 1mb
                                                </p>
                                                <input
                                                    type='file'
                                                    className='hidden'
                                                    ref={inputRef}
                                                    accept='.jpg, .png, .jpeg, .svg'
                                                    disabled={isPending}
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) field.onChange(file);
                                                    }}
                                                />
                                                {field.value ? (
                                                    <Button type='button' disabled={isPending} variant='destructive' size='sm'
                                                            className='w-fit mt-2'
                                                            onClick={() => {
                                                                field.onChange(null)
                                                                if (inputRef.current) inputRef.current.value = ""
                                                            }}>
                                                       Удалить изображение
                                                    </Button>
                                                ) : (
                                                    <Button type='button' disabled={isPending} variant='secondary' size='sm'
                                                            className='w-fit mt-2'
                                                            onClick={() => inputRef.current?.click()}>
                                                       Загрузить изображение
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                        </div>
                        <DottedSeparator className='py-7'/>
                        <div className='flex items-center justify-between'>
                            <Button className={cn(!onCancel && 'invisible')} disabled={isPending} type='button' size='lg' variant='secondary' onClick={onCancel}>
                                Отменить
                            </Button>
                            <Button type='submit' disabled={isPending}  size='lg'  >
                                Создать проект
                            </Button>
                        </div>


                    </form>
                </Form>
            </CardContent>

        </Card>
    )
}
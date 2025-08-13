'use client'
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {updateWorkspaceSchema} from "@/features/workspaces/schemas";
import {z} from "zod";
import Image from "next/image";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import React, {useRef} from "react";
import {Card, CardContent, CardTitle, CardHeader} from "@/components/ui/card";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form'
import {DottedSeparator} from "@/components/ui/dotted-separator";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {ArrowLeftIcon, CopyIcon, ImageIcon} from "lucide-react";
import {useRouter} from "next/navigation";
import {cn} from "@/lib/utils";
import {Workspace} from "@/features/workspaces/types";
import {useConfirm} from "@/hooks/use-confirm";
import {useUpdateProject} from "@/features/projects/api/use-update-project";
import {updateProjectSchema} from "@/features/projects/schemas";
import {useDeleteProject} from "@/features/projects/api/use-delete-project";


interface EditProjectFormProps {
    onCancel?: () => void;
    initialValues: Workspace
}


export const EditProjectForm = ({onCancel, initialValues}: EditProjectFormProps) => {
    const router = useRouter()
    const {mutate, isPending} = useUpdateProject()
    const {mutate: deleteProject, isPending: isDeletingProject} = useDeleteProject()

    const [DeleteDialog, confirmDelete] = useConfirm(
        "Удалить проект",
        "Это действие не получится восстановить",
        "destructive"
    )


    const inputRef = useRef<HTMLInputElement>(null)

    const form = useForm<z.infer<typeof  updateProjectSchema>>({
        resolver: zodResolver(updateProjectSchema),
        defaultValues: {
            ...initialValues,
            image: initialValues.imageUrl ?? ''
        }
    })

    const handleDelete = async () => {
        const ok = await confirmDelete()

        if (!ok) return

        deleteProject({
            param: { projectId: initialValues.$id}
        }, {
            onSuccess: () => {
                   window.location.href = `/workspaces/${initialValues.workspaceId}`
            }}
            )
    }

    const onSubmit = (values: z.infer<typeof  updateProjectSchema>) => {
        const finalValues = {
            ...values,
            image: values.image instanceof File ? values.image : ''
        }
        mutate({
            form:finalValues,
            param: {projectId: initialValues.$id}
        })
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            form.setValue('image', file)
        }
    }


    return (
        <div className='flex flex-col gap-y-4'>
            <DeleteDialog/>

            <Card className='w-full h-full border-none shadow-none'>
                <CardHeader className='flex flex-row items-center gap-x-4 space-y-0'>
                    <Button size='sm' variant='secondary' onClick={onCancel ? onCancel : () => router.push(`/workspaces/${initialValues.workspaceId}/projects/${initialValues.$id}`)}>
                        <ArrowLeftIcon className='size-4 mr-2'/>
                        Назад
                    </Button>
                    <CardTitle className='text-xl font-semibold'>
                        {initialValues.name}
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
                                            <Input {...field} placeholder='enter workspace name' />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name='image' render={({field}) => (
                                    <div className='flex flex-col gap-y-2'>
                                        <div className='flex items-center gap-x-5'>
                                            {field.value ? (
                                                <div className='size-[72px] relative rounded-md overflow-hidden'>
                                                    <Image alt='logo' fill
                                                           className='object-cover' src={field.value instanceof File ? URL.createObjectURL(field.value) : field.value}/>
                                                </div>
                                            ) : (
                                                <Avatar className='size-[72px]'>
                                                    <AvatarFallback>
                                                        <ImageIcon className='size-[36px] '/>
                                                    </AvatarFallback>
                                                </Avatar>
                                            )}
                                            <div className='flex flex-col'>
                                                <p className='text-sm'>Workspace icon</p>
                                                <p className='text-sm '>
                                                    JPG, PNG, SVG or JPEG, max 1mb
                                                </p>
                                                <input type='file' className='hidden' ref={inputRef}
                                                       disabled={isPending}
                                                       accept='.jpg, .png, .jpeg, .svg'
                                                       onChange={handleImageChange}

                                                />
                                                {field.value ? (    <Button type='button' disabled={isPending} variant='destructive' size='sm'
                                                                            className='w-fit mt-2' onClick={() => {
                                                    field.onChange(null)
                                                    if (inputRef?.current) {
                                                        inputRef.current.value = ""
                                                    }
                                                }}
                                                > Удалить изображение
                                                </Button>) : (    <Button type='button' disabled={isPending} variant='secondary' size='sm'
                                                                          className='w-fit mt-2' onClick={() => inputRef.current?.click()}
                                                > Загрузить изображение
                                                </Button>)}
                                            </div>
                                        </div>
                                    </div>
                                )}>
                                </FormField>
                            </div>
                            <DottedSeparator className='py-7'/>
                            <div className='flex items-center pt-4 justify-between  gap-y-2 flex-col lg:flex-row  gap-x-2 items-center justify-end'>
                                <Button className={cn(!onCancel && 'invisible')} disabled={isPending} type='button' size='lg' variant='secondary' onClick={onCancel}>
                                    Cancel
                                </Button>
                                <Button disabled={isPending}  size='lg' type='submit'  onClick={onCancel}>
                                    Save changes
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>

            </Card>

            <Card className='w-full h-full border-none shadow-none'>
                <CardContent className='p-7'>
                    <div className='flex flex-col'>
                        <h3 className='font-bold'>Danger zode</h3>
                        <p className='text-sm '>
                            Deleting a project is irreversible and will remove all associated data.
                        </p>
                        <Button className='mt-6 w-fit ml-auto'
                        size='sm' variant='destructive' type='button'
                                disabled={isPending || isDeletingProject }
                                onClick={handleDelete}
                        >
                            Delete Project
                        </Button>
                    </div>

                </CardContent>
            </Card>
        </div>
    )
}
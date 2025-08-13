'use client'
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {updateWorkspaceSchema} from "@/features/workspaces/schemas";
import {z} from "zod";
import Image from "next/image";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import React, {useEffect, useRef} from "react";
import {Card, CardContent, CardTitle, CardHeader} from "@/components/ui/card";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form'
import {DottedSeparator} from "@/components/ui/dotted-separator";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {ArrowLeftIcon, CopyIcon, ImageIcon} from "lucide-react";
import {useRouter} from "next/navigation";
import {cn} from "@/lib/utils";
import {Workspace} from "@/features/workspaces/types";
import {useUpdateWorkspace} from "@/features/workspaces/api/use-update-workspace";
import {useConfirm} from "@/hooks/use-confirm";
import {useDeleteWorkspace} from "@/features/workspaces/api/use-delete-workspace";
import {toast} from "sonner";
import {useResetInviteCode} from "@/features/workspaces/api/use-reset-invite-code";




interface EditWorkspaceFormProps {
    onCancel?: () => void;
    initialValues: Workspace
}


export const EditWorkspaceForm = ({onCancel, initialValues}: EditWorkspaceFormProps) => {
    const router = useRouter()
    const {mutate, isPending} = useUpdateWorkspace()
    const {mutate: deleteWorkspace, isPending: isDeletingWorkspace} = useDeleteWorkspace()
    const {mutate: resetInviteCode, isPending: isResettingInviteCode} = useResetInviteCode()
    const [DeleteDialog, confirmDelete] = useConfirm(
        "Удалить работу",
        "Это дествие безвозвратное",
        "destructive"
    )
    const [ResetDialog, confirmReset] = useConfirm(
        "Обновить ссылку приглашения",
        "Это испортит текущию ссылку приглашения",
        "destructive"
    )

    const inputRef = useRef<HTMLInputElement>(null)

    const form = useForm<z.infer<typeof updateWorkspaceSchema>>({
        resolver: zodResolver(updateWorkspaceSchema),
        defaultValues: {
            ...initialValues,
            image: initialValues.imageUrl ?? ''
        }
    });



    const handleDelete = async () => {
        const ok = await confirmDelete()

        if (!ok) return

        deleteWorkspace({
            param: { workspaceId: initialValues.$id}
        }, {
                onSuccess: () => {
                    router.push('/')
                    window.location.href = '/'
                }}
        )
    }

    const handleResetInviteCode = async () => {
        const ok = await confirmReset()

        if (!ok) return

        resetInviteCode({
                param: { workspaceId: initialValues.$id}
            })
    }

    const onSubmit = async (values) => {
        let imageUrl = initialValues.imageUrl;

        if (values.image instanceof File) {
            // Загрузить файл отдельно, получить URL
            const formData = new FormData();
            formData.append('file', values.image);

            const uploadRes = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            const uploadData = await uploadRes.json();
            imageUrl = uploadData.url;  // предположим так возвращается URL
        }

        mutate({
            json: {
                name: values.name,
                imageUrl,
            },
            param: { workspaceId: initialValues.$id }
        });


    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            form.setValue('image', file)
        }
    }
    useEffect(() => {
        form.reset({
            ...initialValues,
            image: initialValues.imageUrl ?? ''
        });
    }, [initialValues, form]);
    const fullInviteLink = `${window.location.origin}/workspaces/${initialValues.$id}/join/${initialValues.inviteCode}`


    const handleCopyInviteLink = () => {
        navigator.clipboard.writeText(fullInviteLink).then(() => toast.success('Invite link copied to clipboard'))
    }

    return (
        <div className='flex flex-col gap-y-4'>
            <DeleteDialog/>
            <ResetDialog/>
            <Card className='w-full h-full border-none shadow-none'>
                <CardHeader className='flex flex-row items-center gap-x-4 space-y-0'>
                    <Button size='sm' variant='secondary' onClick={onCancel ? onCancel : () => router.push(`/workspaces/${initialValues.$id}`)}>
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
                                           Название работы
                                        </FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder='Введите название работы' />
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
                                                        <ImageIcon className='size-[36px] text-neutral-400'/>
                                                    </AvatarFallback>
                                                </Avatar>
                                            )}
                                            <div className='flex flex-col'>
                                                <p className='text-sm'>Картинка работы</p>
                                                <p className='text-sm text-muted-foreground'>
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
                                                > Remove image
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
                                    Отменить
                                </Button>
                                <Button disabled={isPending}  size='lg' type='submit'  onClick={onCancel}>
                                    Сохранить изменения
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>

            </Card>
            <Card className='w-full h-full border-none shadow-none'>
                <CardContent className='p-7'>
                    <div className='flex flex-col'>
                        <h3 className='font-bold'>Пригласить участников</h3>
                        <p className='text-sm text-muted-foreground'>
                           Используй эту ссылку чтобы пригласить участников
                        </p>
                        <DottedSeparator className='py-7'/>
                        <div className='mt-4'>
                                <div className='flex items-center gap-x-2'>
                                    <Input disabled value={fullInviteLink}/>
                                    <Button onClick={handleCopyInviteLink}
                                    variant='secondary' className='size-12'
                                    >
                                        <CopyIcon className='size-5'/>
                                    </Button>
                                </div>
                        </div>
                        <DottedSeparator className='py-7'/>
                        <Button className='mt-6 w-fit ml-auto'
                                size='sm' variant='destructive' type='button'
                                disabled={isPending || isResettingInviteCode }
                                onClick={handleResetInviteCode}
                        >
                            Обновить ссылку
                        </Button>
                    </div>

                </CardContent>
            </Card>
            <Card className='w-full h-full border-none shadow-none'>
                <CardContent className='p-7'>
                    <div className='flex flex-col'>
                        <h3 className='font-bold'>Удалить навсегда</h3>
                        <p className='text-sm text-muted-foreground'>
                            Удаляя рабочее место, вы навсегда лишаетесь его
                        </p>
                        <Button className='mt-6 w-fit ml-auto'
                        size='sm' variant='destructive' type='button'
                                disabled={isPending || isDeletingWorkspace }
                                onClick={handleDelete}
                        >
                            Удалить рабочее место
                        </Button>
                    </div>

                </CardContent>
            </Card>
        </div>
    )
}
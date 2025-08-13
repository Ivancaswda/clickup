'use client'
import React from 'react'
import ResponsiveModal from "@/components/ResponsiveModal";
import {Card, CardTitle, CardContent} from "@/components/ui/card";
import {DottedSeparator} from "@/components/ui/dotted-separator";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {useWorkspaceId} from "@/features/workspaces/hooks/use-workspace-id";
import {useGetWorkspace} from "@/features/workspaces/api/use-get-workspace";
import {toast} from "sonner";
import {useConfirm} from "@/hooks/use-confirm";
import {useResetInviteCode} from "@/features/workspaces/api/use-reset-invite-code";
import {Dialog, DialogContent, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {CopyIcon, FolderArchive, UserPlus2Icon, UsersIcon} from "lucide-react";

const InviteMember = () => {

    const workspaceId = useWorkspaceId()
    const {data: initialValues, isLoading} = useGetWorkspace({workspaceId})
    const {mutate: resetInviteCode, isPending: isResettingInviteCode} = useResetInviteCode()
    const [ResetDialog, confirmReset] = useConfirm(
        "Сбросить ссылку приглашения",
        "Это сделает текущую ссылку приглашения недействительной",
        "destructive"
    )

    if (!initialValues) {
        return  null
    }

    const handleResetInviteCode = async () => {
        const ok = await confirmReset()
        console.log(ok)
        if (!ok) return

        resetInviteCode({
            param: { workspaceId: initialValues?.$id}
        })
    }

    const fullInviteLink = `${window.location.origin}/workspaces/${initialValues?.$id}/join/${initialValues?.inviteCode}`

    const handleCopyInviteLink = () => {
        navigator.clipboard.writeText(fullInviteLink).then(() => toast.success('Ссылка приглашения скопирована в буфер обмена'))
    }

    return (
        <div>
            <ResetDialog/>
            <Dialog>
                <DialogTrigger>
                    <div className='flex items-center justify-center gap-2 mt-10 text-sm cursor-pointer px-2 text-pink-700'>
                        <UserPlus2Icon/>
                        Пригласить участников
                    </div>
                </DialogTrigger>
                <DialogContent>
                    <DialogTitle><h3 className='font-bold'>Пригласить участников</h3></DialogTitle>
                    <Card className='w-full h-full border-none shadow-none'>
                        <CardContent className='p-7'>
                            <div className='flex flex-col'>

                                <p className='text-sm text-muted-foreground'>
                                    Используйте ссылку приглашения, чтобы добавить участников в рабочее пространство
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
                                        size='sm' variant='destructive'
                                        onClick={handleResetInviteCode}
                                >
                                    Сбросить ссылку приглашения
                                </Button>
                            </div>

                        </CardContent>
                    </Card>
                </DialogContent>
            </Dialog>
        </div>

    )
}

export default InviteMember

'use client'
import React, {Fragment} from 'react'
import {useWorkspaceId} from "@/features/workspaces/hooks/use-workspace-id";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {ArrowLeftIcon, MoreVertical, MoreVerticalIcon} from "lucide-react";
import Link from "next/link";
import {DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem} from "@/components/ui/dropdown-menu";
import {DottedSeparator} from "@/components/ui/dotted-separator";
import {useGetMembers} from "@/features/members/api/use-get-members";
import MemberAvatar from "@/features/members/components/member-avatar";
import {Separator} from "@/components/ui/separator";

import {useDeleteMember} from "@/features/members/api/use-delete-member";
import {useUpdateMember} from "@/features/members/api/use-update-member";
import {useConfirm} from "@/hooks/use-confirm";
import {MemberRole} from "@/features/members/types";

const MembersList =() => {

    const workspaceId = useWorkspaceId()

    const [ConfirmDialog, dialog] = useConfirm(
        'Удалить участника',
        'Участник будет удален из работы',
        'destructive'
    )

    const {data} = useGetMembers({workspaceId})

    const {
        mutate: deleteMember,
        isPending: isDeletingMember
    } = useDeleteMember()

    const {
        mutate: updateMember,
        isPending: isUpdatingMember
    } = useUpdateMember()

    const handleUpdateMember = (memberId: string, role: MemberRole) =>  {
        updateMember({
            json: {role},
            param: {memberId}
        })
    }

    const handleDeleteMember = async (memberId: string) => {
        const ok = await confirm()
        if (!ok) return

        deleteMember({ param: {memberId}}, {
            onSuccess: () => {
                window.location.reload()
            }
        })
    }

    return (
        <Card className='w-full h-full shadow-none border-none '>
            <ConfirmDialog/>
            <CardHeader className='flex flex-row items-center gap-x-4 p-7 space-y-0'>
                <Button asChild variant='secondary'>
                    <Link href={`/workspaces/${workspaceId}`}>
                        <ArrowLeftIcon className='size-4 mr-2'/>
                        Назад
                    </Link>
                </Button>
                <CardTitle className='text-xl font-semibold'>
                    Список участников
                </CardTitle>
            </CardHeader>
            <div className='px-7'>
                <DottedSeparator/>
            </div>
            <CardContent className='px-7'>
                {data?.documents.map((member, index) => (
                    <Fragment key={member.$id}>
                        <div className='flex items-center gap-2'>
                            <MemberAvatar className='size-10' fallbackClassName='text-lg' name={member.name}/>
                            <div className='flex flex-col'>
                                <p className='text-sm font-medium'>{member.name}</p>
                                <p className='text-sm text-muted-foreground'>{member.email}</p>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button className='ml-auto' variant='secondary' size='icon'>
                                        <MoreVerticalIcon className='size-4 text-muted-foreground'/>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent side='bottom' align='end'>
                                    <DropdownMenuItem disabled={isUpdatingMember}  onClick={() => handleUpdateMember(member.$id, MemberRole.ADMIN)} className='font-medium'>
                                           Сделать админом
                                    </DropdownMenuItem>
                                    <DropdownMenuItem disabled={isUpdatingMember} onClick={() => handleUpdateMember(member.$id, MemberRole.MEMBER)} className='font-medium'>
                                        Сделать участником
                                    </DropdownMenuItem>
                                    <DropdownMenuItem  disabled={isDeletingMember} onClick={() => handleDeleteMember(member.$id)} className='font-medium text-amber-700'>
                                        Удалить {member.name}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                        </div>
                        {index < data.documents.length - 1 && (
                                <Separator className='my-2.5'/>
                        )}
                    </Fragment>
                ))}
            </CardContent>
        </Card>
    )
}
export default MembersList

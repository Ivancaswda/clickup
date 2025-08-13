'use client'
import React, { useState } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuContent
} from "@/components/ui/dropdown-menu";
import { useCurrent } from '@/features/auth/api/use-current'
import { useLogout } from '@/features/auth/api/use-logout'
import { Loader2Icon, LogOut, UserCircle } from "lucide-react";
import { DottedSeparator } from "@/components/ui/dotted-separator";
import { toast } from "sonner";
import { useGetWorkspaces } from '@/features/workspaces/api/use-get-workspaces'
import { useGetProjects } from '@/features/projects/api/use-get-projects'
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id'
import { useRouter } from "next/navigation";

const UserButton = () => {
    const { data: user, isLoading } = useCurrent()
    const { mutate: logout } = useLogout()
    const [loggingOut, setLoggingOut] = useState(false)
    const router = useRouter()

    const workspaceId = useWorkspaceId()
    const { data: projects } = useGetProjects({ workspaceId })

    const handleLogout = async () => {
        try {
            setLoggingOut(true)
            await logout()
            setLoggingOut(false)
        } catch (error) {
            setLoggingOut(false)
            toast.error('Ошибка при выходе из аккаунта')
        }
    }

    if (isLoading || loggingOut) {
        return (
            <div className='size-10 rounded-full flex items-center justify-center'>
                <Loader2Icon className='size-4 animate-spin text-muted-foreground' />
            </div>
        )
    }

    if (!user) return null

    const { name, email } = user
    const avatarFallback = name ? name.charAt(0).toUpperCase() : email.charAt(0).toUpperCase()

    const firstProject = projects?.documents?.[0]
    console.log(projects)

    const handleViewProfile = () => {
        if (!firstProject) return
        router.push(`/workspaces/${workspaceId}/projects/${firstProject.$id}/profile`)
    }

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger className='outline-none relative'>
                <Avatar className='size-10 hover:opacity-15 border-neutral-300 transition border'>
                    <AvatarFallback className='bg-neutral-200 font-medium text-neutral-500 flex items-center justify-center'>
                        {avatarFallback}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent align='end' side='bottom' className='w-60'>
                <div className='flex flex-col items-center justify-center gap-2 px-2.5 py-1'>
                    <Avatar className='size-[52px] border-neutral-300 border'>
                        <AvatarFallback className='bg-neutral-200 font-medium text-neutral-500 text-xl flex items-center justify-center'>
                            {avatarFallback}
                        </AvatarFallback>
                    </Avatar>

                    <div className='flex flex-col items-center justify-center'>
                        <p className='text-sm font-medium'>{name || 'User'}</p>
                        <p className='text-xs text-neutral-500'>{email}</p>
                    </div>

                    <DottedSeparator className='mb-1' />

                    {firstProject && (
                        <DropdownMenuItem
                            onClick={handleViewProfile}
                            className='h-10 flex items-center justify-start w-full gap-2 cursor-pointer'
                        >
                            <UserCircle className='size-4 text-violet-600' />
                            Профиль
                        </DropdownMenuItem>
                    )}

                    <DropdownMenuItem
                        onClick={handleLogout}
                        className='h-10 flex items-center justify-start w-full gap-2 text-amber-700 font-medium cursor-pointer'
                    >
                        <LogOut className='size-4' />
                        Выйти
                    </DropdownMenuItem>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserButton

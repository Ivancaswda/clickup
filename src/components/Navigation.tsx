'use client'

import { GoCheckCircle, GoCheckCircleFill, GoHome, GoHomeFill } from "react-icons/go";
import { Settings, UsersIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { BsMagic } from "react-icons/bs";
import { DialogContent, DialogTrigger, Dialog } from "@/components/ui/dialog";
import AIHelperDialog from "@/components/AIHelperDialog";

export const routes = [
    {
        label: 'Главная',
        href: '/',
        icon: GoHome,
        activeIcon: GoHomeFill
    },
    {
        label: 'Мои задания',
        href: '/tasks',
        icon: GoCheckCircle,
        activeIcon: GoCheckCircleFill
    },
    {
        label: 'Настройки',
        href: '/settings',
        icon: Settings,
        activeIcon: Settings
    },
    {
        label: 'Участники',
        href: '/members',
        icon: UsersIcon,
        activeIcon: UsersIcon
    },
];

export const Navigation = () => {

    const workspaceId = useWorkspaceId()
    const pathname = usePathname()


    return (
        <ul className='flex flex-col'>
            {routes.map((item, idx) => {

                const fullHref = `${pathname}${item.href}`


                const isActive = pathname === fullHref
                const Icon = isActive ? item.activeIcon : item.icon
                return (
                    <Link key={idx} href={fullHref}>
                        <div className={cn('flex items-center p-2.5 rounded-md gap-2.5 text-gray-600 transition cursor-pointer hover:text-primary font-medium ',
                            isActive && 'bg-white dark:bg-gray-800 shadow-sm hover:opacity-100 text-primary')}>
                            <Icon className='size-5 text-muted-500'/>
                            {item.label}
                        </div>
                    </Link>
                )
            })}
            <Dialog>
                <DialogTrigger>
                    <div
                        className={cn('flex items-center p-2.5 rounded-md gap-2.5 text-gray-600 transition cursor-pointer hover:text-primary font-medium ',
                        )}>
                        <BsMagic className='size-5 text-muted-500'/>
                        AI Помогатор
                    </div>
                </DialogTrigger>

                <DialogContent>
                    <AIHelperDialog/>
                </DialogContent>
            </Dialog>


        </ul>
    )
}

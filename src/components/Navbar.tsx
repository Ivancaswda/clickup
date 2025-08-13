'use client'
import React from 'react'
import UserButton from "@/components/userButton";
import MobileSidebar from "@/components/MobileSidebar";
import {usePathname} from "next/navigation";
import {ModeToggle} from "@/components/ModeToggle";

const pathnameMap = {
    'tasks': {
        title: 'Мои задания',
        description: 'Тут вы можете увидеть все ваши задания'
    },
    'projects': {
        title: 'Мои проекты',
        description: 'Тут вы можете увидеть все ваши проекты'
    },
    'profile': {
        title: 'Мой профиль',
        description: 'Тут вы можете вас самих и ваши достижения!'
    },

}

const defaultMap = {
    title: 'Главная',
    description: 'Следите за вашими проектами и заданиями тут'
}

const Navbar = () => {

    const pathname = usePathname()
    const pathnameParts = pathname.split('/')

    const pathnameKey = pathnameParts[3] as keyof  typeof  pathnameMap

    const {title, description} = pathnameMap[pathnameKey] || defaultMap
    const isProfilePage = pathnameParts.includes('profile')
    return !isProfilePage && (

        <nav className='flex items-center justify-between gap-4 px-12'>

                <div className='flex flex-col hidden lg:flex'>
                    <h1 className='text-2xl font-semibold'>{title}</h1>
                    <p className='text-muted-foreground'>{description}</p>
                </div>

            <MobileSidebar/>
            <div className='flex items-center justify-center gap-4'>
                <UserButton/>
                <ModeToggle/>
            </div>

        </nav>
    )
}
export default Navbar

'use client'
import React from 'react'
import Image from "next/image";
import {Button} from "@/components/ui/button";
import { usePathname} from "next/navigation";
import Link from "next/link";

import {AuthLayoutProps} from "@/app/(auth)/Sign";



const SignLayout = ({children}: AuthLayoutProps) => {
    const pathname = usePathname()
    return (
        <main className='bg-white min-h-screen'>
            <div className='mx-auto max-w-screen-2xl p-4'>
                <nav className='flex justify-between items-center'>
                    <div className='flex flex-col items-start '>
                        <Image src='/clickup.png' alt='logo' width={152} height={56}/>
                        <p className='text-black bg-white font-semibold cursor-pointer hover:text-neutral-600 transition'>Everything is up to work</p>
                    </div>


                    <div className='flex items-center gap-2'>
                        <Link href={pathname === '/sign-in' ? '/sign-up' : '/sign-in'}>
                            <p className='text-neutral-500 font-semibold cursor-pointer hover:text-neutral-600 transition'>{pathname === '/sign-in' ? 'Нету аккаунта?' : 'Уже были у нас?'}</p>
                        </Link>

                        <Button variant='secondary'>
                            <Link href={pathname === '/sign-in' ? '/sign-up' : '/sign-in'}>

                            {pathname === '/sign-in' ? 'Регистрация' :  'Авторизация'}
                    </Link>


                        </Button>
                    </div>
                </nav>

                <div className='flex items-center flex-col justify-center '>
                    {children}
                </div>

            </div>
        </main>
    )
}
export default SignLayout

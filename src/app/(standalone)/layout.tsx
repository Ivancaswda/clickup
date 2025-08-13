import React from 'react'
import Link from "next/link";
import Image from "next/image";
import UserButton from "@/components/userButton";

interface StandaloneLayoutProps {
    children: React.ReactNode
}

const StandaloneLayout = ({children}: StandaloneLayoutProps) => {
    return (
        <main className='bg-neutral-100 min-h-screen'>
            <div className='mx-auto max-w-screen-2xl p-4'>
                <nav className='flex justify-between items-center h-[73px]'>
                    <Link href='/'>
                        <Image src='/logo.png' alt='logo' height={56} width={152}/>
                    </Link>
                    <UserButton/>
                </nav>
                <div className='flex items-center flex-col justify-center py-4'>
                    {children}
                </div>
            </div>

        </main>
    )
}
export default StandaloneLayout

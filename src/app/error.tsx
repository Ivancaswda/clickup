'use client'
import React from 'react'
import {AlertTriangle} from "lucide-react";
import {Button} from "@/components/ui/button";
import Link from "next/link";

const ErrorPage = () => {
    return (
        <div className='h-screen flex flex-col gap-y-4 items-center justify-center'>
            <AlertTriangle className='size-6'/>
            <p className='text-sm text-muted-foreground'>
                Что-то пошло не так
            </p>
            <Button variant='secondary' size='sm'>
                <Link href='/'>
                     Назад на главную
                </Link>
            </Button>
        </div>
    )
}
export default ErrorPage

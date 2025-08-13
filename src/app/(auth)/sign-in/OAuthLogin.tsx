
import React from 'react'
import {CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {FaDiscord, FaGithub, FaGoogle, FaYandex} from "react-icons/fa";
import {signUpWithDiscord, signUpWithGithub, signUpWithGoogle, signUpWithYandex} from "@/lib/oauth";
import {Loader2Icon} from "lucide-react";

const OAuthLogin = ({isPending}) => {
    return (
        <CardContent className='p-7 flex flex-col gap-y-4'>
            <Button onClick={() => signUpWithGithub()}  disabled={isPending} className='w-full bg-muted hover:bg-muted-foreground cursor-pointer transition' size='lg' variant='secondary'>
                {isPending ? <Loader2Icon className='text-gray-500 animate-spin'/>
                    : <FaGithub className='mr-2 size-5'/>}
                Войти с Github
            </Button>
            <Button onClick={() => signUpWithDiscord()}  disabled={isPending} className='w-full bg-muted hover:bg-muted-foreground cursor-pointer transition' size='lg' variant='secondary'>
                {isPending ? <Loader2Icon className='text-gray-500 animate-spin'/>
                    : <FaDiscord className='mr-2 size-5'/>}
                Войти с Discord
            </Button>
            <Button onClick={() => signUpWithYandex()}  disabled={isPending} className='w-full bg-muted hover:bg-muted-foreground cursor-pointer transition' size='lg' variant='secondary'>
                {isPending ? <Loader2Icon className='text-gray-500 animate-spin'/>
                    : <FaYandex className='mr-2 size-5'/>}
                Войти с Yandex
            </Button>
        </CardContent>
    )
}
export default OAuthLogin

'use client'
import {Input} from '@/components/ui/input'
import {Button} from '@/components/ui/button'
import { zodResolver} from '@hookform/resolvers/zod'
import React, {useEffect} from 'react'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {DottedSeparator} from "@/components/ui/dotted-separator";
import {FaGithub, FaGoogle} from "react-icons/fa";
import Link from "next/link";
import {useForm} from 'react-hook-form'
import { z} from 'zod'
import {FormItem, FormMessage, FormField, FormControl, Form} from "@/components/ui/form";
import {loginSchema, registerSchema} from "@/features/auth/server/schema";
import {useLogin} from "@/features/auth/api/use-login";
import {useRouter} from "next/navigation";
import {signUpWithGithub} from "@/lib/oauth";
import OAuthLogin from "@/app/(auth)/sign-in/OAuthLogin";
import {useCurrent} from "@/features/auth/api/use-current";

const SignInPage = () => {
    const { mutate, isPending } = useLogin()
    const { data: user, isLoading } = useCurrent()
    const router = useRouter()

    useEffect(() => {
        if (!isLoading && user) {
            router.replace('/')
        }
    }, [user, isLoading, router])



    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: ""
        }
    })

    const onSubmit = (values: z.infer<typeof loginSchema>) => {
        mutate(
            { json: values },
            {

                onError: (error) => {
                    console.error('Login error:', error)
                }
            }
        )
    }




    return (
        <Card className='w-full h-full md:w-[487px] border-none shadow-none'>
            <CardHeader className='flex items-center justify-center text-center p-7'>
                <CardTitle className='text-2xl'>
                    Добро пожаловать!
                </CardTitle>
                <CardDescription className='text-center'>
                    Входя вы соглашаетесь с нашей
                    <Link href='/privacy'>
                        <span className='text-pink-400'> Политикой конфиденциальности</span>
                    </Link>
                    {' '}  и {' '}
                    <Link href='/terms'>
                        <span className='text-pink-400'> Условиями сервиса</span>
                    </Link>
                </CardDescription>
            </CardHeader>

            <div className='px-7'>
                <DottedSeparator/>
            </div>
            <CardContent className='p-7'>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>

                        {/* Email Field */}
                        <FormField
                            control={form.control}
                            name='email'
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input {...field} type='email' placeholder='Введите вашу почту' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Password Field */}
                        <FormField
                            control={form.control}
                            name='password'
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input {...field} type='password' placeholder='Введите ваш пароль' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button  disabled={isPending} type='submit'>Войти</Button>
                    </form>
                </Form>
            </CardContent>
            <div className='px-7'>
                <DottedSeparator/>
            </div>
            <OAuthLogin isPending={isPending}/>

            <div className='px-7 flex items-center justify-center'>
                <p className='text-sm'>
                    нету аккаунта ?
                    <Link href='/sign-up'>
                        <span className='text-pink-600'>&nbsp; Создать аккаунт</span>
                    </Link>
                </p>
                <DottedSeparator/>
            </div>
        </Card>
    )
}

export default SignInPage
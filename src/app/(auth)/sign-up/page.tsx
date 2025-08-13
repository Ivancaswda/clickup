'use client'
import {Input} from '@/components/ui/input'
import {Button} from '@/components/ui/button'
import { zodResolver} from '@hookform/resolvers/zod'
import React from 'react'
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {DottedSeparator} from "@/components/ui/dotted-separator";
import Link from "next/link";
import {useForm} from 'react-hook-form'
import { z} from 'zod'
import {FormItem, FormMessage, FormField, FormControl, Form} from "@/components/ui/form";
import {registerSchema} from "@/features/auth/server/schema";
import {useRegister} from "@/features/auth/api/use-register";
import {useRouter} from "next/navigation";
import OAuthLogin from "@/app/(auth)/sign-in/OAuthLogin";


const SignUpPage = () => {
    const {mutate, isPending} = useRegister()
    const router = useRouter()
    const form = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: '',
            email: '',
            password: ""
        }
    })

    const onSubmit = (values: z.infer<typeof registerSchema>) => {
        mutate(
            { json: values },
            {
                onError: (error) => {
                    console.error('Registration error:', error)
                }
            }
        )
    }

    return (
        <Card className='w-full h-full md:w-[487px] border-none shadow-none'>
            <CardHeader className='flex items-center justify-center text-center p-7'>
                <CardTitle className='text-2xl'>
                    Welcome back!
                </CardTitle>
            </CardHeader>

            <div className='px-7'>
                <DottedSeparator/>
            </div>
            <CardContent className='p-7'>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                        <FormField
                            control={form.control}
                            name='name'
                            render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                        <Input {...field} type='text' placeholder='Enter your name'/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='email'
                            render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                        <Input {...field} type='email' placeholder='Enter your email'/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />


                        <FormField
                            control={form.control}
                            name='password'
                            render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                        <Input {...field} type='password' placeholder='Enter your password'/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <Button  disabled={isPending} type='submit'>Зарегистрироваться</Button>
                    </form>
                </Form>
            </CardContent>
            <div className='px-7'>
                <DottedSeparator/>
            </div>
            <OAuthLogin isPending={isPending}/>

            <div className='px-7 flex items-center justify-center'>
                <p>
                    Уже есть аккаунт
                    <Link href='/sign-up'>
                        <span>&nbsp; Войти</span>
                    </Link>
                </p>
                <DottedSeparator/>
            </div>

        </Card>
    )
}
export default SignUpPage

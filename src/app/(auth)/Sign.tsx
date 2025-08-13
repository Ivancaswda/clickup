import React from 'react'
import {getCurrent} from "@/features/auth/queries";
import {redirect} from "next/navigation";
import SignLayout from "@/app/(auth)/layout";
export interface AuthLayoutProps {
    children: React.ReactNode;
}
const Sign = async ({children}: AuthLayoutProps) => {
    const user = await getCurrent()
    if (user) redirect('/')
    return (
       <SignLayout>
           {children}
       </SignLayout>
    )
}
export default Sign

'use client'
import React from 'react'
import Image from "next/image";
import Link from 'next/link'
import {DottedSeparator} from "@/components/ui/dotted-separator";
import {Navigation} from "@/components/Navigation";
import {WorkspaceSwitcher} from "@/components/WorkspaceSwitcher";
import Projects from "@/components/Projects";
import InviteMember from "@/components/InviteMember";
import JoinInviteLink from "@/components/JoinInviteLink";
import {useTheme} from "next-themes";

const Sidebar = () => {

    const {theme} = useTheme()

    return (
        <aside className='h-full p-4 w-full flex flex-col'>

            <div>
                <Link href='/'>
                    {theme === 'dark' ?  <Image src='/clickup-dark.png' alt='logo' width={450} height={120}/> :  <Image src='/clickup.png' alt='logo' width={450} height={120}/>}

                </Link>
                <DottedSeparator className='my-4'/>
                <WorkspaceSwitcher/>
                <DottedSeparator className='my-4'/>
                <Navigation/>
                <InviteMember/>

            </div>


            <div className='max-h-[170px] overflow-y-auto '>
                <Projects/>
            </div>




            <div className="mt-4 shrink-0">
                <JoinInviteLink/>
            </div>
        </aside>
    )
}
export default Sidebar

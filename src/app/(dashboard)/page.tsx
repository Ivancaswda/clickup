
import {redirect} from "next/navigation";
import React from 'react'
import {getCurrent} from "@/features/auth/queries";

import {getWorkspaces} from "@/features/workspaces/queries";
import GlobalPage from "@/components/GlobalPage";


const Page = async () => {
    const user = await getCurrent()

    if (!user) return (
        redirect('/sign-in')
    );

    const workspaces = await  getWorkspaces()
    if (workspaces.total === 0) {
        redirect('/workspaces/create')
    } else {
        redirect(`/workspaces/${workspaces.documents[0].$id}`)
    }


}
export default Page

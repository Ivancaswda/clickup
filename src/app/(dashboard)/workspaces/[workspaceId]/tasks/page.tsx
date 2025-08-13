import React from 'react'
import {getCurrent} from "@/features/auth/queries";
import {redirect} from "next/navigation";
import TaskViewSwitcher from "@/features/tasks/components/task-view-switcher";


const TaskPage = async () => {

    const user = await getCurrent()
    if (!user) redirect('/sign-in')

    return (
        <div className='h-full flex flex-col'>
            <TaskViewSwitcher/>
        </div>
    )
}
export default TaskPage

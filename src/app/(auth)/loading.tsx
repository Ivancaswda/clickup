import React from 'react'
import {Loader2Icon} from "lucide-react";

const Loading = () => {
    return (
        <div className='min-h-screen flex items-center justify-center'>
            <Loader2Icon className='size-6 animate-spin'/>
        </div>
    )
}
export default Loading

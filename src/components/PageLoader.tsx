import React from 'react'
import {Loader2Icon} from "lucide-react";

const PageLoader = () => {
    return (
        <div className='flex items-center justify-center h-full'>
            <Loader2Icon className='text-muted-foreground size-6 animate-spin'/>
        </div>
    )
}
export default PageLoader

import React from 'react'
import {cn} from "@/lib/utils";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import Image from "next/image";


interface WorkspaceAvatarProps {
    image?: string;
    name: string;
    className?: string
}

const WorkspaceAvatar = ({image, name, className}: WorkspaceAvatarProps) => {

    if (image) {
        return (
            <div className={cn('size-10 relative rounded-md overflow-hidden', className)}>
                <Image src={image} alt={name} fill className='object-cover'/>
            </div>
        )
    }

    return  (
        <Avatar className={cn('size-10 rounded-sm', className)}>
            <AvatarFallback className='text-white bg-pink-600 font-semibold text-lg uppercase rounded-sm'>
                {name[0]}
            </AvatarFallback>
        </Avatar>
    )


}
export default WorkspaceAvatar

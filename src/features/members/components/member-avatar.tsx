import React from 'react'
import {cn} from "@/lib/utils";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";



interface MemberAvatarProps {
    fallbackClassName?: string;
    name: string;
    className?: string
}

const MemberAvatar = ({ name, className, fallbackClassName}: MemberAvatarProps) => {



    return  (
        <Avatar className={cn('size-5 ', className)}>
            <AvatarFallback  className={cn('bg-neutral-200 font-medium text-neutral-500 flex items-center justify-center', fallbackClassName)}>
                {name.charAt(0).toUpperCase()}
            </AvatarFallback>
        </Avatar>
    )


}
export default MemberAvatar

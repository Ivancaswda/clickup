'use client'
import React, {useState} from 'react'
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

const JoinInviteLink = () => {

    const [url, setUrl] = useState("")

    const handleGo = () => {
        if (!url) return
        let finalUrl = url.trim()
        if (!/^https?:\/\//i.test(finalUrl)) {
            finalUrl = `https://${finalUrl}`
        }
        window.open(finalUrl, "_blank")
    }

    return (
        <div className='flex mt-4 flex-col gap-2 absolute bottom-2' >
            <h2 className='text-sm font-semibold text-center '>Присоединись к чужой работе!</h2>
            <div className="mt-2 flex gap-2">
                <Input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Вставьте ссылку"
                />
                <Button onClick={handleGo}>
                    Join
                </Button>
            </div>

        </div>
    )
}
export default JoinInviteLink

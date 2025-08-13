'use client'
import {useGetWorkspaces} from "@/features/workspaces/api/use-get-workspaces";
import {RiAddCircleFill} from "react-icons/ri";
import {Select, SelectItem, SelectContent, SelectValue, SelectTrigger} from '@/components/ui/select'
import WorkspaceAvatar from "@/features/workspaces/components/workspace-avatar";
import {useRouter} from "next/navigation";
import {useWorkspaceId} from "@/features/workspaces/hooks/use-workspace-id";

import {useCreateWorkspaceModal} from "@/features/workspaces/hooks/use-create-workspace-modal";
import {Input} from "@/components/ui/input";
import {useState} from "react";
export const WorkspaceSwitcher = () => {
    const workspaceId = useWorkspaceId()
    const [search, setSearch] = useState("")
    const router = useRouter()
    const {open} = useCreateWorkspaceModal()
    const {data: workspaces} = useGetWorkspaces()
    const {isOpen, setIsOpen} = useCreateWorkspaceModal()
    const onSelect = (id: string) => {
        router.push(`/workspaces/${id}`)
    }
    const currentWorkspace = workspaces?.documents.find(ws => ws.$id === workspaceId)

    const filteredWorkspaces = workspaces?.documents.filter(ws =>
        ws.name.toLowerCase().includes(search.toLowerCase())
    )

    console.log(workspaces)


    return (
        <div className='flex flex-col gap-y-2'>
            <div className='flex items-center justify-between'>
                <p className='text-xs uppercase '>Работы</p>
                <RiAddCircleFill onClick={open} className='size-5 cursor-pointer hover:opacity-75 transition'/>
            </div>
            <Select onValueChange={onSelect} value={workspaceId}>
                <SelectTrigger className='w-full font-medium p-1 flex items-center gap-3'>
                    {currentWorkspace ? (
                        <>
                            <WorkspaceAvatar name={currentWorkspace.name} image={currentWorkspace.imageUrl}/>
                            <span className='truncate'>{currentWorkspace.name}</span>
                        </>
                    ) : (
                        <SelectValue placeholder='Работа не выбрана'/>
                    )}
                </SelectTrigger>
                <SelectContent>
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder='Введите название работы'
                    />
                    {filteredWorkspaces?.map((workspace) => (
                        <SelectItem key={workspace.$id} value={workspace.$id}>
                            <div className='flex justify-start items-center gap-3 font-medium'>
                                <WorkspaceAvatar name={workspace.name} image={workspace.imageUrl}/>
                                <span className='truncate'>{workspace.name}</span>
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}











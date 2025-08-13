'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { DialogTrigger } from '@/components/ui/dialog'
import {BotIcon, Building2Icon, CheckCircle, CheckIcon, FolderKanban, PlusCircle} from 'lucide-react'
import { cn } from '@/lib/utils'

interface AiHelperTriggerProps {
    onSelect: (type: 'workspace' | 'task' | 'project') => void;
}

export const AiHelperTrigger = ({ onSelect }: AiHelperTriggerProps) => {
    const [selected, setSelected] = useState<null | string>(null)

    const handleSelect = (type: 'workspace' | 'task' | 'project') => {
        setSelected(type)
        onSelect(type)
    }

    return (
        <DialogTrigger asChild>
            <>
                <div
                    className="p-4 rounded-md border border-muted bg-background shadow-sm cursor-pointer hover:shadow transition flex items-center gap-3"

                >
                    <BotIcon className="text-primary"/>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium">AI-помогатор</span>
                        <span className="text-xs text-muted-foreground">Что хотите создать?</span>
                    </div>
                </div>
                <div onClick={() => onSelect('workspace')} className='flex items-center gap-2 hover:bg-muted-foreground/40 p-3 rounded-md cursor-pointer transition'>
                    <Building2Icon className="text-primary"/>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium">Рабочие места</span>
                        <span className="text-xs text-muted-foreground">Нажмите чтобы выбрать и продолжить</span>
                    </div>
                </div>
                <div onClick={() => onSelect('project')} className='flex items-center gap-2 hover:bg-muted-foreground/40 p-3 rounded-md cursor-pointer transition'>
                    <FolderKanban className="text-primary"/>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium">Проекты</span>
                        <span className="text-xs text-muted-foreground">Нажмите чтобы выбрать и продолжить</span>
                    </div>
                </div>
                <div onClick={() => onSelect('task')} className='flex items-center gap-2 hover:bg-muted-foreground/40 p-3 rounded-md cursor-pointer transition'>
                    <CheckCircle className="text-primary"/>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium">Задания</span>
                        <span className="text-xs text-muted-foreground">Нажмите чтобы выбрать и продолжить</span>
                    </div>
                </div>
            </>
        </DialogTrigger>
    )
}

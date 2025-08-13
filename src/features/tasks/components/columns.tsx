'use client'

import { ArrowUpDown, Badge, MoreVertical } from 'lucide-react'
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import ProjectAvatar from '@/features/projects/components/project-avatar'
import MemberAvatar from '@/features/members/components/member-avatar'
import { TaskDate } from '@/features/tasks/components/task-date'
import { snakeCaseToTitleCase } from '@/lib/utils'
import { Task } from '@/features/tasks/types'
import { TaskActions } from '@/features/tasks/components/task-actions'

export const columns: ColumnDef<Task>[] = [
    {
        accessorKey: 'name',
        header: ({ column }) => (
            <Button
                variant='ghost'
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
                Имя
                <ArrowUpDown className='ml-2 size-4' />
            </Button>
        ),
        cell: ({ row }) => {
            const name = row.original.name
            return <p className='line-clamp-1'>{name}</p>
        },
    },
    {
        accessorKey: 'project',
        header: ({ column }) => (
            <Button
                variant='ghost'
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
                Проект
                <ArrowUpDown className='ml-2 size-4' />
            </Button>
        ),
        cell: ({ row }) => {
            const project = row.original.project

            if (!project) return <p className='text-muted-foreground'>—</p>

            return (
                <div className='flex items-center gap-x-2 text-sm font-medium'>
                    <ProjectAvatar className='size-6' name={project.name} />
                    <p className='line-clamp-1'>{project.name}</p>
                </div>
            )
        },
    },
    {
        accessorKey: 'assignee',
        header: ({ column }) => (
            <Button
                variant='ghost'
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
                Уполномоченный
                <ArrowUpDown className='ml-2 size-4' />
            </Button>
        ),
        cell: ({ row }) => {
            const assignee = row.original.assignee

            if (!assignee) return <p className='text-muted-foreground'>—</p>

            return (
                <div className='flex items-center gap-x-2 text-sm font-medium'>
                    <MemberAvatar fallbackClassName='text-xs' className='size-6' name={assignee.name} />
                    <p className='line-clamp-1'>{assignee.name}</p>
                </div>
            )
        },
    },
    {
        accessorKey: 'dueDate',
        header: ({ column }) => (
            <Button
                variant='ghost'
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
               Срок
                <ArrowUpDown className='ml-2 size-4' />
            </Button>
        ),
        cell: ({ row }) => {
            const dueDate = row.original.dueDate
            return <TaskDate value={dueDate} />
        },
    },
    {
        accessorKey: 'status',
        header: ({ column }) => (
            <Button
                variant='ghost'
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
                Статус
                <ArrowUpDown className='ml-2 size-4' />
            </Button>
        ),
        cell: ({ row }) => {
            const status = row.original.status
            return <Badge variant={status}>{snakeCaseToTitleCase(status)}</Badge>
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const id = row.original.$id
            const projectId = row.original.projectId
            return (
                <TaskActions id={id} projectId={projectId}>
                    <Button variant='default' className='size-8 p-0'>
                        <MoreVertical className='size-4' />
                    </Button>
                </TaskActions>
            )
        },
    },
]

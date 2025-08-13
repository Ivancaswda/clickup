import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import {useQuery} from "@tanstack/react-query";
import {TaskStatus} from "@/features/tasks/types";
import {client} from "@/lib/rpc";

export const useGetTasks = ({
                                workspaceId,
                                projectId,
                                assigneeId,
                                status,
                                dueDate,
                                search,
                            }: {
    workspaceId: string
    projectId?: string
    assigneeId?: string
    status?: TaskStatus
    dueDate?: string
    search?: string
}) => {
    return useQuery({
        queryKey: ['tasks', workspaceId, projectId, assigneeId, status, dueDate, search],
        queryFn: async () => {
            if (!workspaceId) throw new Error('workspaceId is required')


            const query: Record<string, string> = { workspaceId }
            if (projectId) query.projectId = projectId
            if (assigneeId) query.assigneeId = assigneeId
            if (status) query.status = status
            if (dueDate) query.dueDate = dueDate
            if (search) query.search = search

            const response = await client.api.tasks.$get({ query })

            if (!response.ok) {
                const errorText = await response.text()
                console.error('Error from server:', errorText)
                throw new Error('Failed to fetch tasks')
            }

            const { data } = await response.json()
            return data
        },
    })
}



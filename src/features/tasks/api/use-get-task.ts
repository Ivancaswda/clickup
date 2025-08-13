import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import {useQuery} from "@tanstack/react-query";
import {TaskStatus} from "@/features/tasks/types";
import {client} from "@/lib/rpc";

interface UseGetTask {
    taskId: string
}

export const useGetTask = ({taskId}: {
    taskId: string
}) => {
    return useQuery({
        queryKey: ['tasks', taskId],
        queryFn: async () => {


            const response = await client.api.tasks[':taskId'].$get({ param: {
                    taskId
                }})

            if (!response.ok) {
                const errorText = await response.text()
                console.error('Error from server:', errorText)
                throw new Error('Failed to fetch task')
            }

            const { data } = await response.json()
            return data
        },
    })
}



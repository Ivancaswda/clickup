import {useMutation, useQueryClient} from "@tanstack/react-query";
import {InferRequestType, InferResponseType} from "hono";
import {client} from "@/lib/rpc";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {Task} from "@/features/tasks/types";

type ResponseType  = InferResponseType<typeof  client.api.tasks[':taskId']["$patch"], 200>

type RequestType = InferRequestType<typeof client.api.tasks[':taskId']['$patch']>

export const useUpdateTask = () => {

    const queryClient = useQueryClient()
    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({json, param}) => {
            const response = await client.api.tasks[':taskId']['$patch']({json, param})
            console.log(response)
            console.log(json)
            if (!response.ok) {
                throw new Error('Failed to update task')
            }
            return await response.json()
        },
        onSuccess: ({data}) => {
            toast.success('Задание обновлено!')
            queryClient.invalidateQueries({queryKey: ['project-analytics']})
            queryClient.invalidateQueries({queryKey: ['workspace-analytics']})
            queryClient.invalidateQueries({queryKey: ['tasks']})
            queryClient.invalidateQueries({queryKey: ['task', data.$id]})
        },
        onError: (error) => {
            console.log(error)
            toast.error('Failed to update task')
        }
    })
    return mutation!
}

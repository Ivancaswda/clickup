import {useMutation, useQueryClient} from "@tanstack/react-query";
import {InferRequestType, InferResponseType} from "hono";
import {client} from "@/lib/rpc";
import {toast} from "sonner";
import {useRouter} from "next/navigation";

type ResponseType  = InferResponseType<typeof  client.api.workspaces[':workspaceId']["$patch"], 200>

type RequestType = InferRequestType<typeof client.api.workspaces[':workspaceId']["$patch"]>

export const useUpdateWorkspace = () => {
    const router = useRouter()
    const queryClient = useQueryClient()
    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({json, param}) => {
            const response = await client.api.workspaces[':workspaceId']["$patch"]({json, param})
            if (!response.ok) {
                throw  new Error('Failed to update workspace')
            }
            return await response.json()
        },
        onSuccess: ({data}) => {
            toast.success('Рабочее место обновлено!')
            router.refresh()
            queryClient.invalidateQueries({queryKey: ['workspaces']})
            queryClient.invalidateQueries({queryKey: ['workspace', data.$id]})
        },
        onError: () => {
            toast.error('Failed to update workspace')
        }
    })
    return mutation!
}
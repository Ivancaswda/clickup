import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";
import {InferResponseType} from "hono";
import {InferRequestType} from "hono";
import {client} from "@/lib/rpc";

type ResponseType  = InferResponseType<typeof  client.api.members[':memberId']["$patch"], 200>

type RequestType = InferRequestType<typeof client.api.members[':memberId']['$patch']>

export const useUpdateMember = () => {

    const queryClient = useQueryClient()
    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({param, json}) => {
            const response = await client.api.members[':memberId']['$patch']({param, json})

            if (!response.ok) {
                throw  new Error('Failed to updated member')
            }

            return await response.json()
        },
        onSuccess: () => {
            toast.success('Ранг участника обновлен!')
            queryClient.invalidateQueries({queryKey: ['members']})

        },
        onError: () => {
            toast.error('Failed to update member')
        }
    })
    return mutation!
}
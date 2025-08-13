
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { client } from "@/lib/rpc"
import { toast } from "sonner"
import {InferRequestType, InferResponseType} from "hono";

type UpdateProfileArgs = {
    name: string
    desc?: string
}
type ResponseType  = InferResponseType<typeof  client.api.auth['update-profile']["$patch"], 200>

type RequestType = InferRequestType<typeof client.api.auth['update-profile']['$patch']>

export const useUpdateProfile = () => {
    const queryClient = useQueryClient()

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({ name, desc }: UpdateProfileArgs) => {
            const res = await client.api.auth['update-profile'].$patch({
                json: { name, desc },
            })

            if (!res.ok) {
                throw new Error("Ошибка обновления профиля")
            }

            return res.json()
        },
        onSuccess: () => {
            toast.success("Профиль обновлён!")
            queryClient.invalidateQueries({ queryKey: ["current"] }) // обновляем кэш
        },
        onError: () => {
            toast.error("Не удалось обновить профиль")
        },
    })

    return mutation!
}

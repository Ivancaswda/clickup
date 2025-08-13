import {useMutation, useQueryClient} from "@tanstack/react-query";
import {InferRequestType, InferResponseType} from "hono";
import {client} from "@/lib/rpc";
import {useRouter} from "next/navigation";
import {toast} from "sonner";

type ResponseType  = InferResponseType<typeof  client.api.auth.login["$post"]>

type RequestType = InferRequestType<typeof client.api.auth.login['$post']>

export const useLogin = () => {

    const router = useRouter()
    const queryClient = useQueryClient()
    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({json}) => {
            const response = await client.api.auth.login["$post"]({json})

            if (!response.ok) {
                throw  new Error('Не удалось войти')
            }

            return await response.json()
        },
        onSuccess: async () => {

            await  queryClient.invalidateQueries({queryKey: ['current']})
            toast.success('Вы успешно вошли')
            router.refresh()
            router.push('/')
        },
        onError: (error) => {
            toast.error('Не удалось войти')
            console.log(error)
        }
    })
    return mutation!
}
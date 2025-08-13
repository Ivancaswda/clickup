import {useMutation, useQueryClient} from "@tanstack/react-query";
import {InferRequestType, InferResponseType} from "hono";
import {client} from "@/lib/rpc";
import {useRouter} from "next/navigation";
import {toast} from "sonner";

type ResponseType  = InferResponseType<typeof  client.api.auth.logout["$post"]>



export const useLogout = () => {
    const router = useRouter()
    const queryClient = useQueryClient()

    const mutation = useMutation<ResponseType, Error>({
        mutationFn: async () => {
            const response = await client.api.auth.logout["$post"]()

            if (!response.ok) {
                throw  new Error('Не удалось войти')
            }
            return await response.json()
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries()
            router.refresh()
            toast.success('Вы успешно вышли')
            router.push('/sign-in')
        },
        onError: (error) => {
            toast.error('failed to logout')
            console.log(error)
        }
    })
    return mutation!
}
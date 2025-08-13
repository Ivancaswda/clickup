import {useQuery} from "@tanstack/react-query";
import {client} from "@/lib/rpc";

export const useGetWorkspaces = () => {
    return useQuery({
        queryKey: ['workspaces'],
        queryFn: async () => {
            const response = await client.api.workspaces.$get({ query: { limit: 100 } })
            console.log('response.ok:', response.ok)

            if (!response.ok) {
                const errorText = await response.text()
                console.error('Error from server:', errorText)
                throw new Error('failed to fetch workspaces')
            }

            const { data } = await response.json()
            console.log('workspaces from server:', data)
            return data
        }
    })
}
import {useQuery} from "@tanstack/react-query";
import {client} from "@/lib/rpc";

export const useGetProjects = ({workspaceId}: {workspaceId: string}) => {
    return useQuery({
        queryKey: ['projects'],
        queryFn: async () => {
            const response = await client.api.projects.$get({
                query: {workspaceId}
            })
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

import {useQuery} from "@tanstack/react-query";
import {client} from "@/lib/rpc";

export const useGetWorkspace = ({workspaceId}: {workspaceId: string}) => {
    return useQuery({
        queryKey: ['project', workspaceId],
        queryFn: async () => {
            const response = await client.api.workspaces[':workspaceId'].$get({
                param: {workspaceId}
            })
            console.log('response.ok:', response.ok)

            if (!response.ok) {
                const errorText = await response.text()
                console.error('Error from server:', errorText)
                throw new Error('failed to fetch workspace')
            }

            const { data } = await response.json()
            console.log('workspace from server:', data)
            return data
        }
    })
}

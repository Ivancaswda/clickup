import {useQuery} from "@tanstack/react-query";
import {client} from "@/lib/rpc";

export const useGetWorkspaceAnalytics = ({workspaceId}: {workspaceId: string}) => {
    return useQuery({
        queryKey: ['workspace-analytics', workspaceId],
        queryFn: async () => {
            const response = await client.api.workspaces[':workspaceId']['analytics'].$get({
                param: {workspaceId}
            })
            console.log('response.ok:', response.ok)

            if (!response.ok) {
                const errorText = await response.text()
                console.error('Error from server:', errorText)
                throw new Error('failed to fetch workspace analytics')
            }

            const { data } = await response.json()
            console.log('workspace analytics from server:', data)
            return data
        }
    })
}

import {useQuery} from "@tanstack/react-query";
import {client} from "@/lib/rpc";

export const useGetWorkspaceInfo = ({workspaceId}: {workspaceId: string}) => {
    return useQuery({
        queryKey: ['workspace-info', workspaceId],
        queryFn: async () => {
            const response = await client.api.workspaces[':workspaceId']['info'].$get({
                param: {workspaceId}
            })
            console.log('response.ok:', response.ok)

            if (!response.ok) {
                const errorText = await response.text()
                console.error('Error from server:', errorText)
                throw new Error('failed to fetch workspace info')
            }

            const { data } = await response.json()
            console.log('workspace info from server:', data)
            return data
        }
    })
}

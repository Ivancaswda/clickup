import {useQuery} from "@tanstack/react-query";
import {client} from "@/lib/rpc";

export const useGetProjectAnalytics = ({projectId}: {projectId: string}) => {
    return useQuery({
        queryKey: ['project-analytics', projectId],
        queryFn: async () => {
            const response = await client.api.projects[':projectId']['analytics'].$get({
                param: {projectId}
            })
            console.log('response.ok:', response.ok)

            if (!response.ok) {
                const errorText = await response.text()
                console.error('Error from server:', errorText)
                throw new Error('failed to fetch project analytics')
            }

            const { data } = await response.json()
            console.log('project analytics from server:', data)
            return data
        }
    })
}

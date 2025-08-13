import {useQuery} from "@tanstack/react-query";
import {client} from "@/lib/rpc";

export const useGetProject = ({projectId}: {projectId: string}) => {
    return useQuery({
        queryKey: ['project', projectId],
        queryFn: async () => {
            const response = await client.api.projects[':projectId'].$get({
                param: {projectId}
            })
            console.log('response.ok:', response.ok)

            if (!response.ok) {
                const errorText = await response.text()
                console.error('Error from server:', errorText)
                throw new Error('failed to fetch project')
            }

            const { data } = await response.json()
            console.log('project from server:', data)
            return data
        }
    })
}

import {useGetProjects} from "@/features/projects/api/use-get-projects";
import {useWorkspaceId} from "@/features/workspaces/hooks/use-workspace-id";
import {useGetMembers} from "@/features/members/api/use-get-members";
import {Loader, Loader2Icon} from "lucide-react";
import {Card, CardContent} from "@/components/ui/card";
import {CreateTaskForm} from "@/features/tasks/components/create-task-form";

interface CreateTaskFormWrapperProps {
    onCancel: () => void;
}

export const CreateTaskFormWrapper = ({onCancel}: CreateTaskFormWrapperProps) => {
    const workspaceId = useWorkspaceId()

    const {data: projects, isLoading: isLoadingProjects} = useGetProjects({workspaceId})

    const {data: members, isLoading: isLoadingMembers} = useGetMembers({workspaceId})

    const projectOptions = projects?.documents.map((project) => ({
        id: project.$id,
        name: project.name,
        imageUrl: project.imageUrl
    }))
    const memberOptions = members?.documents.map((project) => ({
        id: project.$id,
        name: project.name,
    }))

    const isLoading = isLoadingProjects || isLoadingMembers

    if (isLoading) {
        return <Card className='w-full h-[714px] border shadow-none'>
            <CardContent className='flex items-center justify-center h-full'>
                    <Loader2Icon className='size-5 animate-spin text-muted-foreground'/>
            </CardContent>
        </Card>
    }

    return (
        <CreateTaskForm memberOptions={memberOptions ?? []} onCancel={onCancel}  projectOptions={projectOptions ?? []}  />
    )

}
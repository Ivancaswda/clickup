import {useGetProjects} from "@/features/projects/api/use-get-projects";
import {useWorkspaceId} from "@/features/workspaces/hooks/use-workspace-id";
import {useGetMembers} from "@/features/members/api/use-get-members";
import {Loader, Loader2Icon} from "lucide-react";
import {Card, CardContent} from "@/components/ui/card";
import {CreateTaskForm} from "@/features/tasks/components/create-task-form";
import {useGetTasks} from "@/features/tasks/api/use-get-tasks";
import {EditTaskForm} from "@/features/tasks/components/edit-task-form";
import {useGetTask} from "@/features/tasks/api/use-get-task";

interface EditTaskFormWrapperProps {
    onCancel: () => void;
    id:string
}

export const EditTaskFormWrapper = ({onCancel, id}: EditTaskFormWrapperProps) => {
    const workspaceId = useWorkspaceId()

    const {data: initialValues, isLoading: isLoadingTask} = useGetTask({
        taskId: id
    })


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

    const isLoading = isLoadingProjects || isLoadingMembers || isLoadingTask

    if (isLoading) {
        return <Card className='w-full h-[714px] border shadow-none'>
            <CardContent className='flex items-center justify-center h-full'>
                    <Loader2Icon className='size-5 animate-spin text-muted-foreground'/>
            </CardContent>
        </Card>
    }

    if (!initialValues) {
        return  null
    }

    return (
        <EditTaskForm initialValues={initialValues} memberOptions={memberOptions ?? []} onCancel={onCancel}  projectOptions={projectOptions ?? []}  />
    )

}
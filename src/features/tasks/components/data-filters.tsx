import {useGetProjects} from "@/features/projects/api/use-get-projects";
import {useWorkspaceId} from "@/features/workspaces/hooks/use-workspace-id";
import {useGetMembers} from "@/features/members/api/use-get-members";
import DatePicker from "@/components/DatePicker";
import {Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue} from "@/components/ui/select";
import {FolderIcon, ListCheckIcon, UserIcon} from "lucide-react";
import {TaskStatus} from "@/features/tasks/types";
import {useTaskFilters} from "@/features/tasks/hooks/use-task-filters";


interface DataFiltersProps {
    hideProjectFilter?: boolean
}

export const DataFilters = ({hideProjectFilter}: DataFiltersProps) => {
    const workspaceId = useWorkspaceId()

    const {data: projects, isLoading: isLoadingProjects} = useGetProjects({workspaceId})
    const {data: members, isLoading: isLoadingMembers} = useGetMembers({workspaceId})

    const  isLoading = isLoadingProjects || isLoadingMembers

    const projectOptions = projects?.documents.map((project) => ({
        value: project.$id,
        label: project.name
    }))
    const memberOptions = members?.documents.map((member) => ({
        value: member.$id,
        label: member.name
    }))

    const [{
        status,
        assigneeId,
        projectId,
        dueDate
    }, setFilters] = useTaskFilters()

    const onStatusChange = (value: string) => {
        if (value === 'all') {
           setFilters({status: null})
        } else {
            setFilters({status:value as TaskStatus})
        }
    }
    const onAssigneeChange = (value: string) => {
        if (value === 'all') {
            setFilters({assigneeId: null})
        } else {
            setFilters({assigneeId:value as string})
        }
    }


    const onProjectChange = (value: string) => {
        if (value === 'all') {
            setFilters({projectId: null})
        } else {
            setFilters({projectId:value as string})
        }
    }

    if (isLoading) return null

    return  (
        <div className='flex flex-col lg:flex-row gap-2'>
            <Select defaultValue={status ?? undefined}
                onValueChange={(val) => onStatusChange(val)}
            >
                <SelectTrigger className='w-full lg:w-auto h-8'>
                    <div className='flex items-center pr-2'>
                        <ListCheckIcon className='size-4 mr-2'/>
                        <SelectValue placeholder='all statuses'/>
                    </div>
                </SelectTrigger>

                <SelectContent>
                    <SelectItem value='all'>All statuses</SelectItem>
                    <SelectSeparator/>
                    <SelectItem value={TaskStatus.BACKLOG}>Поддержка</SelectItem>
                    <SelectItem value={TaskStatus.IN_PROGRESS}>В процессе</SelectItem>
                    <SelectItem value={TaskStatus.IN_REVIEW}>В рассмотре</SelectItem>
                    <SelectItem value={TaskStatus.TODO}>Доделать</SelectItem>
                    <SelectItem value={TaskStatus.DONE}>Сделано</SelectItem>

                </SelectContent>
            </Select>

            <Select defaultValue={assigneeId ?? undefined}
                    onValueChange={(val) => onAssigneeChange(val)}
            >
                <SelectTrigger className='w-full lg:w-auto h-8'>
                    <div className='flex items-center pr-2'>
                        <UserIcon className='size-4 mr-2'/>
                        <SelectValue placeholder='all assignees'/>
                    </div>
                </SelectTrigger>

                <SelectContent>
                    <SelectItem value='all'>All assignees</SelectItem>
                    <SelectSeparator/>
                    {memberOptions?.map((member) => (
                        <SelectItem  key={member.value} value={member.value}>
                            {member.label}
                        </SelectItem>
                    ))}


                </SelectContent>
            </Select>
            {!hideProjectFilter &&  <Select defaultValue={projectId ?? undefined}
                                            onValueChange={(val) => onProjectChange(val)}
            >
                <SelectTrigger className='w-full lg:w-auto h-8'>
                    <div className='flex items-center pr-2'>
                        <FolderIcon className='size-4 mr-2'/>
                        <SelectValue placeholder='all projects'/>
                    </div>
                </SelectTrigger>

                <SelectContent>
                    <SelectItem value='all'>All projects</SelectItem>
                    <SelectSeparator/>
                    {projectOptions?.map((project) => (
                        <SelectItem  key={project.value} value={project.value}>
                            {project.label}
                        </SelectItem>
                    ))}


                </SelectContent>
            </Select>}

            <DatePicker placeholder='Срок задания'
                        value={dueDate ? new Date(dueDate) : undefined}
                        onChange={(date) => {
                            setFilters({dueDate: date ? date.toISOString() : null})
                        }}
                        className='h-8 w-full lg:w-auto'
            />
        </div>
    )

}
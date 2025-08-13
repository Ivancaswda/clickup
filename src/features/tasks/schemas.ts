import {z} from 'zod'
import {TaskStatus} from "@/features/tasks/types";

export const createTaskSchema = z.object({
    name: z.string().min(1, 'Required'),
    status: z.nativeEnum(TaskStatus, {error: 'Required'}),
    workspaceId: z.string().trim().min(1, 'Required'),  // required here
    projectId: z.string().trim().min(1, 'Required'),
    dueDate: z.coerce.date().optional(),
    assigneeId: z.string().trim().min(1, 'Required'),
    description: z.string().optional()
})
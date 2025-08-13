import {z} from 'zod'
export const createProjectSchema = z.object({
    name: z.string().trim().min(1, 'Required'),
    image: z.any().optional(),
    workspaceId: z.string(),
    desc: z.string().optional()
})


export const updateProjectSchema = z.object({
    name: z.string().trim().min(1, 'min 1 character Required').optional(),
    image: z.any().optional(),
    desc: z.string().optional()
})

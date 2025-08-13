import {z} from 'zod'

const FileType = typeof File !== 'undefined' ? File : class {}

export const createWorkspaceSchema = z.object({
    name: z.string().trim().min(1, 'Required'),
    imageUrl: z.any().optional(),
})

export const updateWorkspaceSchema = z.object({
    name: z.string().trim().min(1, 'Must be 1 or more characters').optional(),
    imageUrl: z.any().optional(),
})
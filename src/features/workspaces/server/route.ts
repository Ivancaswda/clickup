import {Hono} from 'hono'
import {Readable} from "node:stream";
import {zValidator} from "@hono/zod-validator";
import {createWorkspaceSchema, updateWorkspaceSchema} from "@/features/workspaces/schemas";
import {sessionMiddleware} from "@/lib/session-middleware";
import {DATABASE_ID, IMAGES_BUCKET_ID, MEMBERS_ID, PROJECTS_ID, TASKS_ID, WORKSPACES_ID} from "@/config";
import {ID, Query} from "node-appwrite";
import {MemberRole} from "@/features/members/types";
import {generateInviteCode} from "@/lib/utils";
import {getMember} from "@/features/members/utils";
import {Workspace} from "@/features/workspaces/types";
import {z} from 'zod'
import {Project} from "@/features/projects/types";
import {endOfMonth, startOfMonth, subMonths} from "date-fns";
import {TaskStatus} from "@/features/tasks/types";

function isFileLike(obj: unknown): obj is { arrayBuffer: () => Promise<ArrayBuffer>, name?: string, type?: string } {
    return (
        obj !== null &&
        typeof obj === 'object' &&
        typeof (obj as any).arrayBuffer === 'function'
    );
}

const app = new Hono()
    .get('/', sessionMiddleware, async (c) => {
        const databases = c.get('databases')
        const user = c.get('user')
        const memberships = await databases.listDocuments(
            DATABASE_ID,
            MEMBERS_ID,
            [Query.equal('userId', user.$id)]
        )
        const workspaceIds = memberships.documents.map(m => m.workspaceId)
        if (workspaceIds.length === 0) {
            return c.json({ data: { documents: [], total: 0 } })
        }
        const workspaces = await databases.listDocuments(
            DATABASE_ID,
            WORKSPACES_ID,
            [Query.equal('$id', workspaceIds)]
        )
        return c.json({ data: workspaces })
    })
    .post('/', sessionMiddleware, async (c) => {
        const databases = c.get('databases');
        const storage = c.get('storage');
        const user = c.get('user');

        const formData = await c.req.formData();
        const name = formData.get('name') as string;
        const file = formData.get('image');

        if (!name) {
            return c.json({ error: 'Name is required' }, 400);
        }

        let uploadedImageUrl = '';
        console.log(file)


        if (file) {
            try {
                const arrayBuffer = await (file as any).arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                const stream = new Readable();
                stream.push(buffer);
                stream.push(null);

                const uploadedFile = await storage.createFile(
                    IMAGES_BUCKET_ID,
                    ID.unique(),
                    stream,
                    {
                        contentType: file.type ,
                        filename: file.name ,
                    }
                );

                console.log('Uploaded file:', uploadedFile);

                uploadedImageUrl = `https://cloud.appwrite.io/v1/storage/buckets/${IMAGES_BUCKET_ID}/files/${uploadedFile.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}`;

                console.log('Image URL:', uploadedImageUrl);
            } catch (err) {
                console.error('Failed to upload file:', err);
            }
        } else {
            console.log('No valid file found');
        }

        const workspace = await databases.createDocument(
            DATABASE_ID,
            WORKSPACES_ID,
            ID.unique(),
            {
                name,
                userId: user.$id,
                imageUrl: uploadedImageUrl,
                inviteCode: generateInviteCode(6),
            }
        );


        await databases.createDocument(
            DATABASE_ID,
            MEMBERS_ID,
            ID.unique(),
            {
                name,
                userId: user.$id,
                workspaceId: workspace.$id,
                role: MemberRole.ADMIN,
            }
        );

        return c.json({ data: workspace });
    }).patch('/:workspaceId',
        sessionMiddleware,
        zValidator('json', updateWorkspaceSchema),
        async (c) => {
            const databases = c.get('databases')
            const storage = c.get('storage')
            const user = c.get('user')

            const { workspaceId } = c.req.param()
            const { name, imageUrl } = c.req.valid('json')

            const member = await getMember({
                databases,
                workspaceId,
                userId: user.$id
            })

            if (!member || member.role !== MemberRole.ADMIN) {
                return c.json({ error: 'Unauthorized' }, 401)
            }

            let uploadedImageUrl: string | undefined

            if (isFileLike(imageUrl)) {
                const buffer = Buffer.from(await imageUrl.arrayBuffer());
                const stream = new Readable();
                stream.push(buffer);
                stream.push(null);

                const uploadedFile = await storage.createFile(
                    IMAGES_BUCKET_ID,
                    ID.unique(),
                    stream,
                    {
                        contentType: imageUrl.type,
                        filename: imageUrl.name,
                    }
                );

                uploadedImageUrl = `https://cloud.appwrite.io/v1/storage/buckets/${IMAGES_BUCKET_ID}/files/${uploadedFile.$id}/preview?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}`
            } else {
                uploadedImageUrl = imageUrl
            }

            const workspace = await databases.updateDocument(
                DATABASE_ID,
                WORKSPACES_ID,
                workspaceId,
                {
                    name,
                    imageUrl: uploadedImageUrl
                }
            )

            return c.json({ data: workspace })
        }
    ).delete('/:workspaceId', sessionMiddleware, async (c) => {
        const databases = c.get('databases')
        const user = c.get('user')

        const {workspaceId} = c.req.param()
        const member = await getMember({
            databases,
            workspaceId,
            userId: user.$id
        })

        if (!member || member.role !== MemberRole.ADMIN) {
            return c.json({error: 'Unauthorized'}, 401)
        }


        await databases.deleteDocument(
            DATABASE_ID,
            WORKSPACES_ID,
            workspaceId
        )

        return c.json({data: { $id: workspaceId }})

    }).post('/:workspaceId/reset-invite-code', sessionMiddleware, async (c) => {
        const databases = c.get('databases')
        const user = c.get('user')

        const {workspaceId} = c.req.param()
        const member = await getMember({
            databases,
            workspaceId,
            userId: user.$id
        })

        if (!member || member.role !== MemberRole.ADMIN) {
            return c.json({error: 'Unauthorized'}, 401)
        }


        const workspace = await databases.updateDocument(
            DATABASE_ID,
            WORKSPACES_ID,
            workspaceId,
            {
                inviteCode: generateInviteCode(6)
            }
        )

        return c.json({data: workspace})

    }).post('/:workspaceId/join', sessionMiddleware, zValidator('json', z.object({code: z.string()})),
        async (c) => {
            const {workspaceId} = c.req.param()
            const {code} = c.req.valid('json')

            const databases = c.get('databases')
            const user = c.get('user')
            const  member = await getMember({
                workspaceId,
                userId: user.$id,
                databases
            })

            if (member) {
                return c.json({error: 'Already a member'}, 400)
            }
            const workspace = await databases.getDocument<Workspace>(
                DATABASE_ID,
                WORKSPACES_ID,
                workspaceId
            );

            if (workspace.inviteCode !== code) {
                return  c.json({error: 'Invalid invite code'}, 400)
            }

            await databases.createDocument(
                DATABASE_ID,
                MEMBERS_ID,
                ID.unique(),
                {
                    workspaceId,
                    userId: user.$id,
                    role: MemberRole.MEMBER
                }
            )
            return  c.json({data:workspace})
        })
    .get('/:workspaceId', sessionMiddleware,
        async (c) => {
            const user = c.get('user')
            const databases = c.get('databases')
            const {workspaceId} = c.req.param()

            const member = await getMember({
                databases,
                workspaceId,
                userId: user.$id
            })

            if (!member) {
                return c.json({error: 'Unauthorized'}, 401)
            }

            const workspace = await databases.getDocument<Workspace>(
                DATABASE_ID,
                WORKSPACES_ID,
                workspaceId
            );

            return c.json({data: workspace})

        })
    .get('/:workspaceId/info', sessionMiddleware,
        async (c) => {
            const user = c.get('user')
            const databases = c.get('databases')
            const {workspaceId} = c.req.param()


            const workspace = await databases.getDocument<Workspace>(
                DATABASE_ID,
                WORKSPACES_ID,
                workspaceId
            );

            return c.json( { data: {
                $id: workspace.$id,
                name: workspace.name,
                imageUrl: workspace.imageUrl}
            })

        })
    .get('/:workspaceId/analytics', sessionMiddleware, async (c) => {
        const user = c.get('user')
        const databases = c.get('databases')
        const {workspaceId} = c.req.param()

        const member = await getMember({
            databases,
            workspaceId,
            userId: user.$id
        })

        if (!member) {
            return  c.json({error: 'Unauthorized'}, 401)
        }

        const now = new Date()
        const thisMonthStart = startOfMonth(now)
        const thisMonthEnd = endOfMonth(now)
        const lastMonthStart = startOfMonth(subMonths(now, 1))
        const lastMonthEnd = endOfMonth(subMonths(now, 1))

        const thisMonthTasks = await databases.listDocuments(
            DATABASE_ID,
            TASKS_ID,
            [
                Query.equal('workspaceId', workspaceId),
                Query.greaterThanEqual('$createdAt', thisMonthStart.toISOString()),
                Query.lessThanEqual('$createdAt', thisMonthEnd.toISOString())
            ]
        )

        const lastMonthTasks = await databases.listDocuments(
            DATABASE_ID,
            TASKS_ID,
            [
                Query.equal('workspaceId', workspaceId),
                Query.greaterThanEqual('$createdAt', lastMonthStart.toISOString()),
                Query.lessThanEqual('$createdAt', lastMonthEnd.toISOString())
            ]
        )
        const taskCount = thisMonthTasks.total
        const taskDifference = taskCount - lastMonthTasks.total

        const thisMonthAssignedTasks = await databases.listDocuments(
            DATABASE_ID,
            TASKS_ID,
            [
                Query.equal('workspaceId', workspaceId),
                Query.equal('assigneeId', member.$id),
                Query.greaterThanEqual('$createdAt', thisMonthStart.toISOString()),
                Query.lessThanEqual('$createdAt', thisMonthEnd.toISOString())
            ]
        )
        const lastMonthAssignedTasks = await databases.listDocuments(
            DATABASE_ID,
            TASKS_ID,
            [
                Query.equal('workspaceId', workspaceId),
                Query.equal('assigneeId', member.$id),
                Query.greaterThanEqual('$createdAt', lastMonthStart.toISOString()),
                Query.lessThanEqual('$createdAt', lastMonthEnd.toISOString())
            ]
        )
        const assignedTaskCount = thisMonthAssignedTasks.total;

        const assignedTaskDifference = assignedTaskCount - lastMonthAssignedTasks.total;


        const thisMonthIncompleteTasks = await databases.listDocuments(
            DATABASE_ID,
            TASKS_ID,
            [
                Query.equal('workspaceId', workspaceId),
                Query.notEqual('status', TaskStatus.DONE),
                Query.greaterThanEqual('$createdAt', thisMonthStart.toISOString()),
                Query.lessThanEqual('$createdAt', thisMonthEnd.toISOString())
            ]
        )
        const lastMonthIncompleteTasks = await databases.listDocuments(
            DATABASE_ID,
            TASKS_ID,
            [
                Query.equal('workspaceId', workspaceId),
                Query.notEqual('status', TaskStatus.DONE),
                Query.greaterThanEqual('$createdAt', lastMonthStart.toISOString()),
                Query.lessThanEqual('$createdAt', lastMonthEnd.toISOString())
            ]
        )
        const incompleteTaskCount = thisMonthIncompleteTasks.total;

        const incompleteTaskDifference = incompleteTaskCount - lastMonthIncompleteTasks.total;


        const thisMonthCompletedTasks = await databases.listDocuments(
            DATABASE_ID,
            TASKS_ID,
            [
                Query.equal('workspaceId', workspaceId),
                Query.equal('status', TaskStatus.DONE),
                Query.greaterThanEqual('$createdAt', thisMonthStart.toISOString()),
                Query.lessThanEqual('$createdAt', thisMonthEnd.toISOString())
            ]
        )
        const lastMonthcompletedTasks = await databases.listDocuments(
            DATABASE_ID,
            TASKS_ID,
            [
                Query.equal('workspaceId', workspaceId),
                Query.equal('status', TaskStatus.DONE),
                Query.greaterThanEqual('$createdAt', lastMonthStart.toISOString()),
                Query.lessThanEqual('$createdAt', lastMonthEnd.toISOString())
            ]
        )
        const completedTaskCount = thisMonthCompletedTasks.total;

        const completedTaskDifference = completedTaskCount - lastMonthcompletedTasks.total;


        const thisMonthOverdueTasks = await databases.listDocuments(
            DATABASE_ID,
            TASKS_ID,
            [
                Query.equal('workspaceId', workspaceId),
                Query.notEqual('status', TaskStatus.DONE),
                Query.lessThan('dueDate', now.toISOString()),
                Query.greaterThanEqual('$createdAt', thisMonthStart.toISOString()),
                Query.lessThanEqual('$createdAt', thisMonthEnd.toISOString())
            ]
        )
        const lastMonthOverdueTasks = await databases.listDocuments(
            DATABASE_ID,
            TASKS_ID,
            [
                Query.equal('workspaceId', workspaceId),
                Query.notEqual('status', TaskStatus.DONE),
                Query.lessThan('dueDate', now.toISOString()),
                Query.greaterThanEqual('$createdAt', lastMonthStart.toISOString()),
                Query.lessThanEqual('$createdAt', lastMonthEnd.toISOString())
            ]
        )
        const overdueTaskCount = thisMonthOverdueTasks.total;

        const overdueTaskDifference = overdueTaskCount - lastMonthOverdueTasks.total;

        return c.json({
            data: {
                taskCount,
                taskDifference,
                assignedTaskCount,
                assignedTaskDifference,
                completedTaskCount,
                completedTaskDifference,
                incompleteTaskCount,
                incompleteTaskDifference,
                overdueTaskCount,
                overdueTaskDifference
            }
        })
    })



export default app
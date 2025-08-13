import {Hono} from 'hono'
import {createTaskSchema} from "@/features/tasks/schemas";
import {zValidator} from "@hono/zod-validator";
import {getMember} from "@/features/members/utils";
import {sessionMiddleware} from "@/lib/session-middleware";
import {DATABASE_ID, MEMBERS_ID, PROJECTS_ID, TASKS_ID} from "@/config";
import {Query, ID} from "node-appwrite";
import {z} from 'zod'
import {Task, TaskStatus} from "@/features/tasks/types";
import {createAdminClient} from "@/lib/appwrite";
import {Project} from "@/features/projects/types";

const app = new Hono()
    .delete('/:taskId',
        sessionMiddleware,
        async (c) => {
            const user = c.get('user')
            const databases = c.get('databases')
            const {taskId} = c.req.param()

            const task = await databases.getDocument<Task>(
                DATABASE_ID,
                TASKS_ID,
                taskId
            )
            const member = await getMember({
                databases,
                workspaceId: task.workspaceId,
                userId: user.$id
            })
            if (!member) {
                return c.json({error: 'Unauthorized'}, 401)
            }

            await databases.deleteDocument(
                DATABASE_ID,
                TASKS_ID,
                taskId
            );

            return  c.json({data: {$id: task.$id}})

        })
    .get(
        '/',
        sessionMiddleware,
        zValidator(
            'query',
            z.object({
                workspaceId: z.string(),
                projectId: z.string().nullable().optional(),
                assigneeId: z.string().nullable().optional(),
                status: z.nativeEnum(TaskStatus).nullable().optional(),
                search: z.string().nullable().optional(),
                dueDate: z.string().nullable().optional(),
            })
        ),
        async (c) => {
            const { users } = await createAdminClient();
            const databases = c.get('databases');
            const user = c.get('user');

            const rawQuery = c.req.valid('query');
            const {
                workspaceId,
                projectId,
                status,
                search,
                assigneeId,
                dueDate,
            } = Object.fromEntries(
                Object.entries(rawQuery).map(([key, value]) => [
                    key,
                    value === 'null' ? null : value,
                ])
            );

            const member = await getMember({
                databases,
                workspaceId,
                userId: user.$id,
            });

            if (!member) {
                return c.json({ error: 'Unauthorized' }, 401);
            }

            const query = [
                Query.equal('workspaceId', workspaceId),
                Query.orderDesc('$createdAt'),
            ];

            if (projectId) query.push(Query.equal('projectId', projectId));
            if (status) query.push(Query.equal('status', status));
            if (assigneeId) query.push(Query.equal('assigneeId', assigneeId));
            if (dueDate) query.push(Query.equal('dueDate', dueDate));
            if (search) query.push(Query.equal('name', search));

            const tasks = await databases.listDocuments<Task>(
                DATABASE_ID,
                TASKS_ID,
                query
            );

            const projectIds = tasks.documents.map((task) => task.projectId);
            const assigneeIds = tasks.documents.map((task) => task.assigneeId);

            const projects = await databases.listDocuments<Project>(
                DATABASE_ID,
                PROJECTS_ID,
                projectIds.length > 0
                    ? [Query.contains('$id', projectIds)]
                    : []
            );

            const members = await databases.listDocuments(
                DATABASE_ID,
                MEMBERS_ID,
                assigneeIds.length > 0
                    ? [Query.contains('$id', assigneeIds)]
                    : []
            );

            const assignees = await Promise.all(
                members.documents.map(async (member) => {
                    const user = await users.get(member.userId);
                    return {
                        ...member,
                        name: user.name || user.email.split('@')[0],
                        email: user.email,
                    };
                })
            );

            const populatedTasks = tasks.documents.map((task) => {
                const project = projects.documents.find(
                    (proj) => proj.$id === task.projectId
                );
                const assignee = assignees.find(
                    (assign) => assign.$id === task.assigneeId
                );

                return {
                    ...task,
                    project,
                    assignee,
                };
            });
            console.log(tasks, populatedTasks)

            return c.json({
                data: {
                    ...tasks,
                    documents: populatedTasks,
                },
            });
        }
    ).post('/', sessionMiddleware, zValidator('json', createTaskSchema),
        async (c) => {
            const user = c.get('user')
            const databases = c.get('databases')
            const {name, status, workspaceId, projectId, dueDate, assigneeId} = c.req.valid('json')

            const member = await getMember({
                databases,
                workspaceId,
                userId: user.$id
            })

            if (!member) {
                c.json({error: "Unauthorized"}, 401)
            }

            const highestPositionTask = await databases.listDocuments(
                DATABASE_ID,
                TASKS_ID,
                [
                    Query.equal("status", status),
                    Query.equal('workspaceId', workspaceId),
                    Query.orderAsc('position'),
                    Query.limit(1)
                ]
            );

            const newPosition = highestPositionTask.documents.length > 0 ? highestPositionTask.documents[0].position + 1000 : 1000


            const task = await databases.createDocument(
                DATABASE_ID,
                TASKS_ID,
                ID.unique(),
                {
                    name,
                    status,
                    workspaceId,
                    projectId,
                    dueDate,
                    assigneeId,
                    position: newPosition
                }
            )
            return c.json({data: task})
        }
    )
    .patch('/:taskId', sessionMiddleware, zValidator('json', createTaskSchema.partial()),
        async (c) => {
            const user = c.get('user')
            const databases = c.get('databases')
            const {taskId} = c.req.param()

            // Лог входящего тела
            const json = c.req.valid('json')
            console.log('PATCH /tasks payload:', json)

            const {name, status, projectId, dueDate, assigneeId, description} = json

            const existingTask = await databases.getDocument<Task>(
                DATABASE_ID,
                TASKS_ID,
                taskId
            )

            const member = await getMember({
                databases,
                workspaceId: existingTask.workspaceId,
                userId: user.$id
            })

            if (!member) {
                return c.json({error: "Unauthorized"}, 401)
            }

            try {
                const task = await databases.updateDocument<Task>(
                    DATABASE_ID,
                    TASKS_ID,
                    taskId,
                    {
                        name,
                        status,
                        projectId,
                        dueDate,
                        assigneeId,
                        description
                    }
                )
                console.log('PATCH /tasks updated task:', task)
                return c.json({data: task})
            } catch (error) {
                console.error('PATCH /tasks update error:', error)
                return c.json({error: 'Failed to update task'}, 400)
            }
        }
    )
    .get('/:taskId',
        sessionMiddleware,
        async (c) => {
            const currentUser = c.get('user')
            const databases = c.get('databases')
            const { users } = await createAdminClient()
            const {taskId} = c.req.param()

            const task = await databases.getDocument<Task>(
                DATABASE_ID,
                TASKS_ID,
                taskId
            )

            const currentMember = await getMember({
                databases,
                workspaceId: task.workspaceId,
                userId: currentUser.$id
            });

            if (!currentMember) {
                return c.json({error: 'Unauthorized'}, 401)
            }

            const project = await databases.getDocument<Project>(
                DATABASE_ID,
                PROJECTS_ID,
                task.projectId
            );

            const member = await databases.getDocument(
                DATABASE_ID,
                MEMBERS_ID,
                task.assigneeId
            )
            const user = await users.get(member.userId)

            const assignee = {
                ...member,
                name: user.name || user.email.split('@')[0],
                email: user.email
            }

            return c.json({
                data: {
                    ...task,
                    project,
                    assignee

                }
            })


        })
    .post('/bulk-update', sessionMiddleware, zValidator('json', z.object({
            tasks: z.array(
                z.object({
                    $id: z.string(),
                    status: z.nativeEnum(TaskStatus),
                    position: z.number().int().positive().min(1000).max(1_000_000)
                })
            )
        })),
        async (c) => {
            const databases = c.get('databases')
            const {tasks} = await c.req.valid('json')
            const user = c.get('user')
            const tasksToUpdate = await databases.listDocuments<Task>(
                DATABASE_ID,
                TASKS_ID,
                [Query.contains('$id', tasks.map((task) => task.$id))]
            )

            const workspaceIds = new Set(tasksToUpdate.documents.map(task => task.workspaceId))

            if (workspaceIds.size !== 1) {
                return c.json({error: 'All tasks must belong to the same workspace!'})
            }
            const workspaceId = workspaceIds.values().next().value;

            const member = await getMember({
                databases,
                workspaceId,
                userId: user.$id
            })

            if (!member) {
                return  c.json({error: 'Unauthorized'}, 401)
            }

            const updatedTasks = await Promise.all(
                tasks.map(async (task) => {
                    const { $id, status, position} = task

                    return databases.updateDocument<Task>(
                        DATABASE_ID,
                        TASKS_ID,
                        $id,
                        {status, position}
                    )
                })
            );
            return c.json({ data: updatedTasks})
        }

    )

export default app
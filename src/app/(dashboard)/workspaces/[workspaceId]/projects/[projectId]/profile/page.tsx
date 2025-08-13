'use client'
import React, {useState} from 'react';
import { useGetWorkspaces } from '@/features/workspaces/api/use-get-workspaces';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { useGetTasks } from '@/features/tasks/api/use-get-tasks';
import { useGetProjects } from '@/features/projects/api/use-get-projects';
import { Analytics } from '@/components/analytics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {useCurrent} from "@/features/auth/api/use-current";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import {useProjectId} from "@/features/projects/hooks/use-project-id";
import {useTaskFilters} from "@/features/tasks/hooks/use-task-filters";
import {useGetWorkspaceAnalytics} from "@/features/workspaces/api/use-get-workspace-analytics";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {useUpdateProject} from "@/features/projects/api/use-update-project";
import {Textarea} from "@/components/ui/textarea";
import {ArrowBigDownDashIcon, Loader2Icon, LogOut} from "lucide-react";
import {useLogout} from "@/features/auth/api/use-logout";
import {toast} from "sonner";
import {useUpdateProfile} from "@/features/auth/api/use-update-profile";

interface AnalyticsProps {
    data?: {
        taskCount: number;
        taskDifference: number;
        assignedTaskCount?: number;
        assignedTaskDifference?: number;
        completedTaskCount?: number;
        completedTaskDifference?: number;
        incompleteTaskCount: number;
        incompleteTaskDifference: number;
        overdueTaskCount: number;
        overdueTaskDifference: number;
    };
}


const ProfilePage = () => {
    const workspaceId = useWorkspaceId();
    const { data: workspaces, isLoading: isLoadingWorkspaces } = useGetWorkspaces();
    const { data: projects, isLoading: isLoadingProjects } = useGetProjects({ workspaceId });
    const {data:analytics, isLoading:isLoadingAnalytics} = useGetWorkspaceAnalytics({workspaceId})
    const [{status, assigneeId, projectId, dueDate}] = useTaskFilters()
    const paramProjectId = useProjectId()
    const {data: tasks, isLoading: isLoadingTasks} = useGetTasks({
        workspaceId,
        projectId: paramProjectId || projectId,
        assigneeId,
        status,
        dueDate
    })

    const {mutate: logout} = useLogout()
    const [loggingOut, setLoggingOut] = useState<boolean>(false)
    const handleLogout = async () => {
        try {
            setLoggingOut(true)
            await logout()
            setLoggingOut(false)
        }catch (error) {
            setLoggingOut(false)
            toast.error('error whilst logging out')
        }
    }

    const {data: user, isLoading: isLoadingUser} = useCurrent()
    console.log(workspaces)
    console.log(projects)
  console.log(tasks)
    const { mutate: updateProject, isPending: isUpdating } = useUpdateProject();

    const [editProjectId, setEditProjectId] = React.useState<string | null>(null);
    const [editedName, setEditedName] = React.useState('');
    const [editedDesc, setEditedDesc] = React.useState('');

    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [profileName, setProfileName] = useState(user?.name || '')
    const [profileDesc, setProfileDesc] = useState(user?.prefs?.desc || '')
    const { mutate: updateProfile, isPending: isUpdatingProfile } = useUpdateProfile()

    if (!user) {
        return
    }
    const isLoading = isLoadingAnalytics || isLoadingTasks || isLoadingWorkspaces || isLoadingProjects || isLoadingUser || isUpdating || isUpdatingProfile

    if (isLoading || loggingOut) {
        return  <div className='flex items-center justify-center w-full h-full text-center'>
            <Loader2Icon className='animate-spin text-violet-500 size-6'/>
        </div>
    }

    console.log(user)
    console.log(analytics)
    return (
        <div className="p-6 space-y-8">

            <Card className="flex items-center mx-0 space-x-6 p-6 ">

                <Avatar className='size-[52px] mx-0    border-neutral-300 transition border'>
                    <AvatarFallback>
                        {user?.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>




                <div>
                    <h2 className="text-2xl font-semibold text-center">{user.name}</h2>
                    <p className="text-muted-foreground text-center">{user.email}</p>
                    <p className="mt-2 text-sm text-gray-600 text-center">{user?.prefs?.desc || 'Нет описания'}</p>

                    {!isEditingProfile ? (
                        <Button
                            className="mt-4"
                            variant="outline"
                            onClick={() => {
                                setIsEditingProfile(true)
                                setProfileName(user.name)
                                setProfileDesc(user?.prefs?.desc || '')
                            }}
                        >
                            ✏️ Редактировать профиль
                        </Button>
                    ) : (
                        <form
                            onSubmit={(e) => {
                                e.preventDefault()
                                updateProfile({name: profileName, desc: profileDesc})
                                setIsEditingProfile(false)
                            }}
                            className="mt-4 space-y-2"
                        >
                            <div>
                                <label className="text-sm font-medium text-gray-700">Имя</label>
                                <Input
                                    value={profileName}
                                    onChange={(e) => setProfileName(e.target.value)}
                                    disabled={isUpdatingProfile}
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700">Описание</label>
                                <Textarea
                                    value={profileDesc}
                                    onChange={(e) => setProfileDesc(e.target.value)}
                                    disabled={isUpdatingProfile}
                                    placeholder="О себе"
                                    className="mt-1"
                                />
                            </div>

                            <div className="flex items-center gap-2 mt-5 justify-center">
                                <Button type="submit" disabled={isUpdatingProfile}>
                                    {isUpdatingProfile ? "Сохраняем..." : "Сохранить"}
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setIsEditingProfile(false)}
                                    disabled={isUpdatingProfile}
                                >
                                    Отмена
                                </Button>
                            </div>
                        </form>
                    )}
                </div>
            </Card>

            {/* Analytics */}
            <div>
                <h3 className="text-lg font-semibold mb-2">Аналитика</h3>

                <Analytics data={analytics}/>
            </div>

            {/* Projects */}
            <div>
                <h3 className="text-lg font-semibold mb-4">Проекты</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {projects?.documents.map(project => {
                        const workspace = workspaces?.documents.find(ws => ws.$id === project.workspaceId);
                        const isEditing = editProjectId === project.$id;

                        const startEditing = () => {
                            setEditProjectId(project.$id);
                            setEditedName(project.name);
                            setEditedDesc(project.desc || '');
                        };

                        const cancelEditing = () => {
                            setEditProjectId(null);
                            setEditedName('');
                            setEditedDesc('');
                        };

                        const saveChanges = () => {
                            updateProject({
                                param: {projectId: project.$id},
                                form: {
                                    name: editedName,
                                    desc: editedDesc,
                                },
                            });
                            cancelEditing();
                        };

                        return (
                            <Card className='hover:scale-105 transition cursor-pointer' key={project.$id}>
                            <CardHeader>
                                    <div className="flex justify-between items-start">
                                        {isEditing ? (
                                            <Input
                                                value={editedName}
                                                onChange={e => setEditedName(e.target.value)}
                                                className="font-semibold"
                                            />
                                        ) : (
                                            <CardTitle>{project.name}</CardTitle>
                                        )}
                                        <div className="space-x-2">
                                            {isEditing ? (
                                                <>
                                                    <Button size="sm" onClick={saveChanges} disabled={isUpdating}>
                                                        Сохранить
                                                    </Button>
                                                    <Button size="sm" variant="ghost" onClick={cancelEditing}>
                                                        Отмена
                                                    </Button>
                                                </>
                                            ) : (
                                                <Button size="sm" variant="outline" onClick={startEditing}>
                                                    ✏️ Редактировать
                                                </Button>
                                            )}
                                        </div>
                                    </div>

                                    {workspace && (
                                        <div className="flex items-center gap-2 mt-1">
                                            <h2 className='font-semibold'>Пространство:</h2>
                                            <Avatar className="size-[32px] border border-neutral-300">
                                                <AvatarFallback className="bg-neutral-200 font-medium text-neutral-500 text-sm flex items-center justify-center">
                                                    {workspace.name?.charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <p className="text-sm text-gray-500">{workspace.name}</p>
                                        </div>
                                    )}
                                </CardHeader>
                                <CardContent>
                                    {isEditing ? (
                                        <Textarea
                                            value={editedDesc}
                                            onChange={e => setEditedDesc(e.target.value)}
                                            placeholder="Описание проекта"
                                        />
                                    ) : (
                                        <p className="text-sm text-muted-foreground">
                                            {project.desc || 'Нет описания'}
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>


            <div>
                <h3 className="text-lg font-semibold mb-4">Последние задачи</h3>
                <div className="space-y-3">
                    {tasks?.documents?.map(task => (
                        <Card className='hover:scale-105 transition cursor-pointer' key={task.$id}>
                            <CardContent className="py-4 space-y-1">
                                <h4 className="text-base font-semibold">{task.name}</h4>
                                {task.project?.name && (
                                    <p className="text-sm text-muted-foreground">
                                        Проект: {task.project.name}
                                    </p>
                                )}
                                <p className="text-sm text-gray-500">
                                    Статус: {task.status}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Дедлайн: {new Date(task.dueDate).toLocaleDateString('ru-RU')}
                                </p>
                                {task.assignee?.name && (
                                    <p className="text-sm text-muted-foreground">
                                        Исполнитель: {task.assignee.name}
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Workspaces */}
            <div>
                <h3 className="text-lg font-semibold mb-4">Рабочие пространства</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {workspaces?.documents?.map(workspace => (
                        <Card className='hover:scale-105 transition cursor-pointer' key={workspace.$id}>
                            <CardHeader>
                                <CardTitle>{workspace.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    ID: {workspace.$id}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
            <Button onClick={handleLogout} className='w-full rounded-xl py-6 cursor-pointer hover:bg-red-500/20 transition ' variant='destructive'>
                <LogOut/>
                Выйти с аккаунта
            </Button>
        </div>
    );
};

export default ProfilePage;

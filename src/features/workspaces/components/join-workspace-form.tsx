'use client'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {DottedSeparator} from "@/components/ui/dotted-separator";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {useJoinWorkspace} from "@/features/workspaces/api/use-join-workspace";
import {useInviteCode} from "@/features/workspaces/hooks/use-invite-code";
import {useWorkspaceId} from "@/features/workspaces/hooks/use-workspace-id";
import {useRouter} from "next/navigation";
interface JoinWorkspaceForm {
    code?:string,
    workspaceId?:string,
    name: string
}
export const JoinWorkspaceForm = ({ initialValues}: any) => {
    const router = useRouter()
    const workspaceId = useWorkspaceId()
    const inviteCode = useInviteCode()
    const {mutate, isPending} = useJoinWorkspace()

    const onSubmit = () => {
        mutate({
            param: {workspaceId},
            json: {code: inviteCode}
        }, {
            onSuccess: ({data}) => {
                router.push(`/workspaces/${data.$id}`)
            }
            })
    }
    console.log(name)

    return (
        <Card className='w-full h-full border-none shadown-none'>
            <CardHeader className='p-7'>
                <CardTitle className='text-xl font-bold'>
                    Присоединитесь к работе
                </CardTitle>
                <CardDescription>
                    Вы были приглашены в <strong>{initialValues.name}</strong>
                </CardDescription>
            </CardHeader>
            <div className='px-7'>
                <DottedSeparator/>
            </div>
            <CardContent className='p-7'>
                <div className='flex lg:flex-row gap-2 flex-col items-center justify-between'>
                    <Button size='lg' variant='secondary' type='button' asChild className='w-full lg:w-fit'>

                        <Link href='/'>
                           Отклонить
                        </Link>
                    </Button>
                    <Button size='lg' onClick={onSubmit} disabled={isPending}  type="button"  className='w-full lg:w-fit'>
                        Присоединиться
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
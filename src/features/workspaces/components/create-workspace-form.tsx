'use client'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createWorkspaceSchema } from "@/features/workspaces/schemas";
import { z } from "zod";
import Image from "next/image";
import React, {useRef, useState} from "react";
import {Card, CardContent, CardTitle, CardHeader} from "@/components/ui/card";
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from "@/components/ui/form";
import { DottedSeparator } from "@/components/ui/dotted-separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateWorkspace } from "@/features/workspaces/api/use-create-workspace";
import { ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import {useUploadImage} from "@/features/workspaces/api/use-upload-image";

interface CreateWorkspaceFormProps {
    onCancel?: () => void;
}

export const CreateWorkspaceForm = ({ onCancel }: CreateWorkspaceFormProps) => {
    const router = useRouter();
    const { mutate, isPending } = useCreateWorkspace();
    const { mutate: uploadImage} = useUploadImage();
    const inputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<any>()
    const form = useForm<z.infer<typeof createWorkspaceSchema>>({
        resolver: zodResolver(createWorkspaceSchema),
        defaultValues: {
            name: "",
            imageUrl: "",
        },
    });

    const onSubmit = (values: z.infer<typeof createWorkspaceSchema>) => {
        const formData = new FormData();
        formData.append('name', values.name);
        if (selectedFile) {
            formData.append('image', selectedFile);
        }

        console.log(selectedFile)
        mutate({name: values.name, file: selectedFile}, {
            onSuccess: ({ data }) => {
                form.reset();
                setSelectedFile(undefined);
                router.push(`/workspaces/${data.$id}`);
            },
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const previewUrl = URL.createObjectURL(file);
            form.setValue("imageUrl", previewUrl); // чтобы показать превью
        }
    };










    return (
        <Card className="w-full h-full border-none shadow-none">
            <CardHeader className="flex p-7">
                <CardTitle className="text-xl font-semibold">
                  Создать новую работу
                </CardTitle>
            </CardHeader>

            <div className="px-7">
                <DottedSeparator className="p-7" />
            </div>
            <CardContent className="p-7">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="flex flex-col gap-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Название работы</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Введите название рабочего места" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="imageUrl"
                                render={({ field }) => (
                                    <div className="flex flex-col gap-y-2">
                                        <div className="flex items-center gap-x-5">
                                            {field.value ? (
                                                <div className="size-[72px] relative rounded-md overflow-hidden">
                                                    <Image
                                                        alt="logo"
                                                        fill
                                                        className="object-cover"
                                                        src={field.value}
                                                        unoptimized // если imageUrl не из trusted источника
                                                    />
                                                </div>
                                            ) : (
                                                <Avatar className="size-[72px]">
                                                    <AvatarFallback>
                                                        <ImageIcon className="size-[36px] text-neutral-400" />
                                                    </AvatarFallback>
                                                </Avatar>
                                            )}
                                            <div className="flex flex-col">
                                                <p className="text-sm">Workspace icon</p>
                                                <p className="text-sm text-muted-foreground">
                                                    JPG, PNG, SVG or JPEG, max 1mb
                                                </p>
                                                <input
                                                    type="file"
                                                    ref={inputRef}
                                                    disabled={isPending}
                                                    accept=".jpg,.png,.jpeg,.svg"
                                                    onChange={handleImageChange}
                                                    className="hidden"
                                                />
                                                {field.value ? (
                                                    <Button
                                                        type="button"
                                                        disabled={isPending}
                                                        variant="destructive"
                                                        size="sm"
                                                        className="w-fit mt-2"
                                                        onClick={() => {
                                                            form.setValue("imageUrl", "");
                                                            setSelectedFile(undefined);
                                                            if (inputRef.current) inputRef.current.value = "";
                                                        }}
                                                    >
                                                        Remove image
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        type="button"
                                                        disabled={isPending}
                                                        variant="secondary"
                                                        size="sm"
                                                        className="w-fit mt-2"
                                                        onClick={() => inputRef.current?.click()}
                                                    >
                                                        Upload image
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            />
                        </div>

                        <DottedSeparator className="py-7" />
                        <div className="flex items-center justify-between">
                            <Button
                                className={cn(!onCancel && "invisible")}
                                disabled={isPending}
                                type="button"
                                size="lg"
                                variant="secondary"
                                onClick={onCancel}
                            >
                                Cancel
                            </Button>
                            <Button disabled={isPending} size="lg" type="submit">
                                Create workspace
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};
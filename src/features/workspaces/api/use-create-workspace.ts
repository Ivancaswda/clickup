'use client'
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useCreateWorkspace = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    const mutation = useMutation<
        any, // тип ответа
        Error,
        { name: string; file?: File } // параметры
    >({
        mutationFn: async ({ name, file }) => {
            const formData = new FormData();
            formData.append('name', name);
            if (file) {
                formData.append('image', file);
            }
            console.log(formData.get('name'))
            console.log(formData.get('image'))
            const res = await fetch('/api/workspaces', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                throw new Error("Failed to create workspace");
            }
            return res.json();
        },
        onSuccess: () => {
            toast.success("Рабочее место создано!");
            router.refresh();
            queryClient.invalidateQueries({ queryKey: ["workspaces"] });
        },
        onError: () => {
            toast.error("Failed to create workspace");
        },
    });

    return mutation;
};
'use client';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

type UploadImageResponse = {
    fileUrl: string;
};

export const useUploadImage = () => {
    return useMutation<UploadImageResponse, Error, File>({
        mutationFn: async (file) => {
            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch('/api/workspaces/upload-image', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                throw new Error('Failed to upload image');
            }

            return res.json();
        },
        onError: (error) => {
            toast.error(`Image upload failed: ${error.message}`);
            console.error(error);
        },
    });
};

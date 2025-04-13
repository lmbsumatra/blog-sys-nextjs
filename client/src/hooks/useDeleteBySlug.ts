
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
const deleteBlogBySlug = async (slug: string) => {
    if (!slug) throw new Error("Slug is required");

    const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/blogs/${slug}`,
        { withCredentials: true }
    );
    return response.data;
};

export const useDeleteBlogBySlug = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (slug: string) => deleteBlogBySlug(slug),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['blog'] });
        },
        onError: (error) => {
            console.error("Error deleting blog:", error);
        },
    });
};

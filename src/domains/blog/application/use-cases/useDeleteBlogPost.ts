import { useMutation, useQueryClient } from '@tanstack/react-query';
import { blogApi } from '../../infrastructure/blog.api';
import { toast } from '@/shared/ui/toast/toast.store';

export function useDeleteBlogPost() {
  const queryClient = useQueryClient();

  return useMutation<{ success?: boolean }, Error, string>({
    mutationFn: async (id: string) => {
      return blogApi.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog'] });
      toast.success('Blog post deleted successfully', 'Article Deleted');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete blog post', 'Error');
    },
  });
}

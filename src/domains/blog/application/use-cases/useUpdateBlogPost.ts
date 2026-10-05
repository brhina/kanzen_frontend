import { useMutation, useQueryClient } from '@tanstack/react-query';
import { blogApi } from '../../infrastructure/blog.api';
import { blogMapper } from '../../infrastructure/blog.mapper';
import type { UpdateBlogPostDto } from '../../infrastructure/blog.dto';
import type { BlogPostEntity } from '../../domain/entities/blog-post.entity';
import { toast } from '@/shared/ui/toast/toast.store';

export interface UpdateBlogPostParams {
  id: string;
  dto: UpdateBlogPostDto;
}

export function useUpdateBlogPost() {
  const queryClient = useQueryClient();

  return useMutation<BlogPostEntity, Error, UpdateBlogPostParams>({
    mutationFn: async ({ id, dto }) => {
      const response = await blogApi.update(id, dto);
      return blogMapper.toEntity(response);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['blog'] });
      queryClient.invalidateQueries({ queryKey: ['blog-post'] });
      toast.success(`Post "${data.title}" updated successfully!`, 'Article Saved');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update blog post', 'Error');
    },
  });
}

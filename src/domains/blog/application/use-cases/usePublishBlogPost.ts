import { useMutation, useQueryClient } from '@tanstack/react-query';
import { blogApi } from '../../infrastructure/blog.api';
import { blogMapper } from '../../infrastructure/blog.mapper';
import type { PublishBlogPostDto } from '../../infrastructure/blog.dto';
import type { BlogPostEntity } from '../../domain/entities/blog-post.entity';
import { toast } from '@/shared/ui/toast/toast.store';

export interface PublishBlogPostParams {
  id: string;
  dto: PublishBlogPostDto;
}

export function usePublishBlogPost() {
  const queryClient = useQueryClient();

  return useMutation<BlogPostEntity, Error, PublishBlogPostParams>({
    mutationFn: async ({ id, dto }) => {
      const response = await blogApi.publish(id, dto);
      return blogMapper.toEntity(response);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['blog'] });
      queryClient.invalidateQueries({ queryKey: ['blog-post'] });
      toast.success(
        `Article "${data.title}" status changed to ${data.status}.`,
        'Publication Status Updated',
      );
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update publication status', 'Error');
    },
  });
}

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { blogApi } from '../../infrastructure/blog.api';
import { blogMapper } from '../../infrastructure/blog.mapper';
import type { CreateBlogPostDto } from '../../infrastructure/blog.dto';
import type { BlogPostEntity } from '../../domain/entities/blog-post.entity';
import { toast } from '@/shared/ui/toast/toast.store';

export function useCreateBlogPost() {
  const queryClient = useQueryClient();

  return useMutation<BlogPostEntity, Error, CreateBlogPostDto>({
    mutationFn: async (dto) => {
      const response = await blogApi.create(dto);
      return blogMapper.toEntity(response);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['blog'] });
      toast.success(`Post "${data.title}" created successfully!`, 'Article Created');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create blog post', 'Error');
    },
  });
}

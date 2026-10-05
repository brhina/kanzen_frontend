import { useMutation, useQueryClient } from '@tanstack/react-query';
import { blogApi } from '../../infrastructure/blog.api';
import { blogMapper } from '../../infrastructure/blog.mapper';
import type { CreateBlogCategoryDto, UpdateBlogCategoryDto } from '../../infrastructure/blog.dto';
import type { BlogCategoryEntity } from '../../domain/entities/blog-category.entity';
import { toast } from '@/shared/ui/toast/toast.store';

export function useCreateBlogCategory() {
  const queryClient = useQueryClient();

  return useMutation<BlogCategoryEntity, Error, CreateBlogCategoryDto>({
    mutationFn: async (dto) => {
      const response = await blogApi.createCategory(dto);
      return blogMapper.toCategoryEntity(response);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['blog', 'categories'] });
      toast.success(`Category "${data.name}" created!`, 'Category Created');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create category', 'Error');
    },
  });
}

export function useUpdateBlogCategory() {
  const queryClient = useQueryClient();

  return useMutation<BlogCategoryEntity, Error, { id: string; dto: UpdateBlogCategoryDto }>({
    mutationFn: async ({ id, dto }) => {
      const response = await blogApi.updateCategory(id, dto);
      return blogMapper.toCategoryEntity(response);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['blog', 'categories'] });
      toast.success(`Category "${data.name}" updated!`, 'Category Saved');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update category', 'Error');
    },
  });
}

export function useDeleteBlogCategory() {
  const queryClient = useQueryClient();

  return useMutation<{ success?: boolean }, Error, string>({
    mutationFn: async (id: string) => {
      return blogApi.deleteCategory(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog', 'categories'] });
      toast.success('Category deleted successfully', 'Category Removed');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete category', 'Error');
    },
  });
}

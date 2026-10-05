import { useQuery } from '@tanstack/react-query';
import { blogApi } from '../../infrastructure/blog.api';
import { blogMapper } from '../../infrastructure/blog.mapper';
import type { BlogCategoryEntity } from '../../domain/entities/blog-category.entity';

export function useBlogCategories() {
  return useQuery<BlogCategoryEntity[]>({
    queryKey: ['blog', 'categories'],
    queryFn: async () => {
      const dtos = await blogApi.listCategories();
      return dtos.map((dto) => blogMapper.toCategoryEntity(dto));
    },
    staleTime: 1000 * 60 * 5,
  });
}

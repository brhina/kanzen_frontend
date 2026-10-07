import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/core/cache/query-keys.factory';
import { mediaApi } from '../../infrastructure/media.api';
import { MediaMapper } from '../../infrastructure/media.mapper';
import type { UpdateMediaMetaDto } from '../../infrastructure/media.dto';
import type { MediaFileEntity } from '../../domain/entities/media-file.entity';

export interface UpdateMediaMetaVariables {
  id: string;
  dto: UpdateMediaMetaDto;
}

export function useUpdateMediaMeta() {
  const queryClient = useQueryClient();

  return useMutation<MediaFileEntity, Error, UpdateMediaMetaVariables>({
    mutationFn: async ({ id, dto }) => {
      const response = await mediaApi.updateMeta(id, dto);
      return MediaMapper.toDomain(response);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.media.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.media.detail(variables.id) });
    },
  });
}

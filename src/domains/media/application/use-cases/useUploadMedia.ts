import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/core/cache/query-keys.factory';
import { mediaApi } from '../../infrastructure/media.api';
import { MediaMapper } from '../../infrastructure/media.mapper';
import type { MediaFileEntity } from '../../domain/entities/media-file.entity';

export interface UploadMediaVariables {
  file: File;
  meta?: {
    folder?: string;
    alt?: string;
    caption?: string;
  };
}

export function useUploadMedia() {
  const queryClient = useQueryClient();

  return useMutation<MediaFileEntity, Error, UploadMediaVariables>({
    mutationFn: async ({ file, meta }) => {
      const response = await mediaApi.upload(file, meta);
      return MediaMapper.toDomain(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.media.all });
    },
  });
}

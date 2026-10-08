import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTag, deleteTag } from '../api/tags.api';
import type { CreateTagRequest } from '../types';
import { TAGS_KEY } from './useTagsQuery';

export function useCreateTagMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: CreateTagRequest) => createTag(request),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TAGS_KEY }),
  });
}

export function useDeleteTagMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTag(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TAGS_KEY }),
  });
}

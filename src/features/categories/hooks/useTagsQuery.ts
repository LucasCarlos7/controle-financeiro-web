import { useQuery } from '@tanstack/react-query';
import { listTags } from '../api/tags.api';

export const TAGS_KEY = ['tags'];

export function useTagsQuery() {
  return useQuery({ queryKey: TAGS_KEY, queryFn: listTags });
}

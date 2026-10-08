import { useQuery } from '@tanstack/react-query';
import { listGoals } from '../api/goals.api';

export const GOALS_KEY = ['objetivos'];

export function useGoalsQuery() {
  return useQuery({ queryKey: GOALS_KEY, queryFn: listGoals });
}

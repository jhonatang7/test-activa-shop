import { useQuery } from 'react-query';
import { API_ENDPOINTS } from '@/data/client/endpoints';
import client from '@/data/client';
import { Cause } from '@/types';

export function useCauses() {
  const { data, isLoading, error } = useQuery<Cause[], Error>(
    API_ENDPOINTS.CAUSES,
    () => client.causes.all()
  );

  return {
    causes: data ?? [],
    isLoading,
    error,
  };
}

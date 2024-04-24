import type { Claim, Cause, User, InputClaim } from '@/types';
import { useMutation, useQuery } from 'react-query';
import { API_ENDPOINTS } from '@/data/client/endpoints';
import client from '@/data/client';
import { useMe } from './user';

export function useClaims() {
  const { me } = useMe();
  const { data, isLoading, error } = useQuery<Claim[], Error>(
    API_ENDPOINTS.CLAIMS_BY_USER,
    () => client.claims.getClaimsByUser(me?.id ?? '0')
  );

  return {
    claims: data ?? [],
    isLoading,
    error,
  };
}

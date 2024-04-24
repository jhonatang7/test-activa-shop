import type { Category, Service } from '@/types';
import { useQuery } from 'react-query';
import { API_ENDPOINTS } from '@/data/client/endpoints';
import client from '@/data/client';

export function useServices() {
  const { data, isLoading, error } = useQuery<Service[], Error>(
    API_ENDPOINTS.SERVICES,
    () => client.services.all()
  );

  return {
    services: data ?? [],
    isLoading,
    error,
  };
}

export function useServiceByCategories(services: Service[]) {
  const servicesByCategory = services.reduce((result, service) => {
    const categoryId = service.category.id;
    if (!result[categoryId]) {
      result[categoryId] = { category: service.category, services: [] };
    }
    result[categoryId].services.push(service);
    return result;
  }, {} as { [categoryId: number]: { category: Category; services: Service[] } });

  return servicesByCategory;
}

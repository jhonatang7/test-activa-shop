import { useServiceByCategories, useServices } from '@/data/service';
import Grid from './grid';

function Services() {
  const { services, isLoading } = useServices();
  const serviceByCategories = useServiceByCategories(services);
  return (
    <Grid servicesByCategory={serviceByCategories} isLoading={isLoading} />
  );
}

export default Services;

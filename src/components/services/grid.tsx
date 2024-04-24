import type { Category, Service } from '@/types';
import { motion } from 'framer-motion';
import cn from 'classnames';
import Card from './card';
import ProductCardLoader from '@/components/product/product-loader';
import { useGridSwitcher } from '@/components/product/grid-switcher';
import ItemNotFound from '@/components/ui/item-not-found';
import rangeMap from '@/lib/range-map';
import { staggerTransition } from '@/lib/framer-motion/stagger-transition';
import { useTranslation } from 'next-i18next';

interface GridProps {
  servicesByCategory: {
    [categoryId: number]: { category: Category; services: Service[] };
  };
  isLoading?: boolean;
  limit?: number;
}

export default function Grid({
  servicesByCategory,
  isLoading,
  limit = 15,
}: GridProps) {
  const { isGridCompact } = useGridSwitcher();
  const { t } = useTranslation('common');
  if (!isLoading && !Object.keys(servicesByCategory).length) {
    return (
      <ItemNotFound
        title={t('text-no-products-found')}
        message={t('text-no-products-found-message')}
        className="px-4 pt-5 pb-10 md:px-6 md:pt-6 lg:px-7 lg:pb-12 3xl:px-8"
      />
    );
  }
  return (
    <div>
      {Object.keys(servicesByCategory).map((categoryId: string) => {
        const category = servicesByCategory[+categoryId].category;
        const services = servicesByCategory[+categoryId].services;

        return (
          <div
            key={category.name}
            className="px-4 pt-5 pb-9 md:px-6 md:pb-10 md:pt-6 lg:px-7 lg:pb-12 3xl:px-8"
          >
            <h1
              title={category.name}
              className="mb-3 flex justify-center text-3xl font-bold"
            >
              {category.name.toUpperCase()}
            </h1>
            <motion.div
              variants={staggerTransition(0.025)}
              className={cn(
                'grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-[repeat(auto-fill,minmax(300px,1fr))] lg:gap-6 3xl:gap-7',
                {
                  '2xl:grid-cols-4 3xl:grid-cols-5 4xl:grid-cols-[repeat(auto-fill,minmax(300px,1fr))]':
                    isGridCompact,
                  '2xl:grid-cols-3 3xl:grid-cols-[repeat(auto-fill,minmax(340px,1fr))] 4xl:grid-cols-[repeat(auto-fill,minmax(380px,1fr))]':
                    !isGridCompact,
                }
              )}
            >
              {isLoading && !services.length
                ? rangeMap(limit, (i) => (
                    <ProductCardLoader key={i} uniqueKey={`product-${i}`} />
                  ))
                : services.map((service) => (
                    <Card key={service.name} service={service} />
                  ))}
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}

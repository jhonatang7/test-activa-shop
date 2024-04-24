import type { Product, ProductByService, WalletRechargePlan } from '@/types';
import { motion } from 'framer-motion';
import cn from 'classnames';
import Button from '@/components/ui/button';
import ProductCardLoader from '@/components/product/product-loader';
import { useGridSwitcher } from '@/components/product/grid-switcher';
import ItemNotFound from '@/components/ui/item-not-found';
import rangeMap from '@/lib/range-map';
import { staggerTransition } from '@/lib/framer-motion/stagger-transition';
import { useTranslation } from 'next-i18next';
import Card from '@/components/wallet/recharge/card';

interface GridProps {
  rechargePlan: WalletRechargePlan[];
  onLoadMore?: () => void;
  hasNextPage?: boolean;
  isLoadingMore?: boolean;
  isLoading?: boolean;
  limit?: number;
}

export default function Grid({
  rechargePlan,
  onLoadMore,
  hasNextPage,
  isLoadingMore,
  isLoading,
  limit = 15,
}: GridProps) {
  const { isGridCompact } = useGridSwitcher();
  console.log(isGridCompact);
  const { t } = useTranslation('common');
  if (!isLoading && !rechargePlan.length) {
    return (
      <ItemNotFound
        title={t('text-no-products-found')}
        message={t('text-no-products-found-message')}
        className="px-4 pt-5 pb-10 md:px-6 md:pt-6 lg:px-7 lg:pb-12 3xl:px-8"
      />
    );
  }
  return (
    <div className="px-4 pt-5 pb-9 md:px-6 md:pb-10 md:pt-6 lg:px-7 lg:pb-12 3xl:px-8">
      <motion.div
        variants={staggerTransition(0.025)}
        className="grid grid-cols-1 gap-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-[repeat(auto-fill,minmax(340px,1fr))] 4xl:grid-cols-[repeat(auto-fill,minmax(380px,1fr))]"
      >
        {isLoading && !rechargePlan.length
          ? rangeMap(limit, (i) => (
              <ProductCardLoader key={i} uniqueKey={`product-${i}`} />
            ))
          : rechargePlan.map((plan) => (
              <Card key={plan.id} rechargePlan={plan} />
            ))}
      </motion.div>

      {hasNextPage && (
        <div className="mt-8 grid place-content-center md:mt-10">
          <Button
            onClick={onLoadMore}
            disabled={isLoadingMore}
            isLoading={isLoadingMore}
          >
            {t('text-loadmore')}
          </Button>
        </div>
      )}
    </div>
  );
}

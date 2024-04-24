import type { Product, ProductByService } from '@/types';
import Router, { useRouter } from 'next/router';
import cn from 'classnames';
import { motion } from 'framer-motion';
import Image from '@/components/ui/image';
import AnchorLink from '@/components/ui/links/anchor-link';
import { useModalAction } from '@/components/modal-views/context';
import routes from '@/config/routes';
import usePrice from '@/lib/hooks/use-price';
import { PreviewIcon } from '@/components/icons/preview-icon';
import { DetailsIcon } from '@/components/icons/details-icon';
import placeholder from '@/assets/images/placeholders/netflix.jpg';
import { useGridSwitcher } from '@/components/product/grid-switcher';
import { fadeInBottomWithScaleX } from '@/lib/framer-motion/fade-in-bottom';
import { isFree } from '@/lib/is-free';
import { useTranslation } from 'next-i18next';
import { MouseEventHandler, useEffect } from 'react';
import { useProduct } from './lib/product.context';

export default function Card({ product }: { product: ProductByService }) {
  const { name, image, price, type } = product ?? {};
  const { updateProduct, productByService } = useProduct();
  const router = useRouter();
  const { t } = useTranslation('common');

  const isFreeItem = isFree(product?.price);

  const purchaseProduct = (product: ProductByService) => {
    updateProduct(product);
    router.push('/checkout');
  };

  return (
    <motion.div
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ opacity: 0.8, scale: 0.95 }}
      transition={{ ease: 'easeOut', duration: 0.1 }}
      className="cursor-pointer"
      title={name}
      onClick={() => purchaseProduct(product)}
    >
      <div className="group relative flex aspect-[3/2] w-full justify-center overflow-hidden">
        <Image
          alt={name}
          layout="fill"
          quality={100}
          objectFit="cover"
          src={image}
          className="bg-light-500 dark:bg-dark-400"
        />
      </div>
      <div className="flex items-start justify-between pt-3.5">
        <div className="-mt-[1px] flex flex-col truncate ltr:mr-auto ltr:pl-2.5 rtl:ml-auto rtl:pr-2.5 rtl:text-right">
          <h3
            title={name}
            className="mb-0.5 truncate font-medium text-dark-100 dark:text-light"
          >
            {name}
          </h3>
          <div className="flex">
            <h3 className="mr-2">Tiempo:</h3>
            {type === 'SYNC' ? (
              <h3
                className="rounded-2xl bg-light-500 px-1.5 py-0.5 text-13px font-semibold uppercase text-green-600 dark:bg-dark-300 dark:text-green-400"
                title="Rapido"
              >
                INMEDIATO
              </h3>
            ) : (
              <h3
                className="rounded-2xl bg-light-500 px-1.5 py-0.5 text-13px font-semibold uppercase text-blue-900 dark:bg-dark-300 dark:text-blue-400"
                title="Con Orden"
              >
                Con Orden
              </h3>
            )}
          </div>
        </div>

        <div className="flex flex-shrink-0 flex-col items-end pl-2.5">
          <span className="rounded-2xl bg-light-500 px-1.5 py-0.5 text-13px font-semibold uppercase text-brand dark:bg-dark-300 dark:text-brand-dark">
            &#128176; {isFreeItem ? t('text-free') : price}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

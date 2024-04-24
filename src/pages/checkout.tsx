import type { NextPageWithLayout } from '@/types';
import { useRouter } from 'next/router';
import routes from '@/config/routes';
import GeneralLayout from '@/layouts/_general-layout';
import CartItemList from '@/components/cart/cart-item-list';
import CartEmpty from '@/components/cart/cart-empty';
import Button from '@/components/ui/button';
import Seo from '@/layouts/_seo';
import { LongArrowIcon } from '@/components/icons/long-arrow-icon';
import client from '@/data/client';
import { useMutation } from 'react-query';
import CartCheckout from '@/components/cart/cart-checkout';
import { useMe } from '@/data/user';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { GetStaticProps } from 'next';
import { useProduct } from '@/components/product/lib/product.context';
import { ProductItem } from '@/components/product/product-item';
import CartWallet from '@/components/cart/cart-wallet';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useWallet } from '@/data/wallet';

const CheckoutPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { data } = useWallet();
  const { me } = useMe();
  const { t } = useTranslation('common');
  const [isLoading, setIsLoading] = useState(false);
  let isEmpty = false;

  const { productByService } = useProduct();
  if (!productByService) isEmpty = true;

  const syncPurchaseMutation = useMutation(client.orders.createOrderSync, {
    onSuccess: (res) => {
      router.push(routes.orderUrl(res.id.toString()));
    },
    onError: (err: any) => {
      toast.error(<b>Algo salió mal</b>);
      console.log(err.response.data.message);
    },
  });

  const asyncPurchaseMutation = useMutation(client.orders.createOrderAsync, {
    onSuccess: (res) => {
      router.push(routes.orderUrl(res.id.toString()));
    },
    onError: (err: any) => {
      toast.error(<b>Algo salio mal :(</b>);
      console.log(err.response.data.message);
    },
  });

  const createOrder = () => {
    setIsLoading(true);
    // if (
    //   (use_wallet && Boolean(payableAmount) && !token) ||
    //   (!use_wallet && !token)
    // ) {
    //   toast.error(<b>Please verify payment card</b>, {
    //     className: '-mt-10 xs:mt-0',
    //   });
    //   return;
    // }
    // if (!phoneNumber) {
    //   toast.error(<b>Please enter your contact number</b>);
    //   window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    //   return;
    // }
    if (productByService?.type === 'SYNC') {
      syncPurchaseMutation.mutate({
        customerId: me?.id ? +me.id : 0,
        productId: productByService.id !== undefined ? productByService.id : 0,
      });
    } else if (productByService?.type === 'ASYNC') {
      asyncPurchaseMutation.mutate({
        customerId: me?.id ? +me.id : 0,
        productId: productByService.id !== undefined ? productByService.id : 0,
      });
    } else {
      toast.error(<b>Ocurrio un problema!</b>);
    }
    setIsLoading(false);
  };

  return (
    <>
      <Seo
        title="Checkout"
        description="Fastest digital download template built with React, NextJS, TypeScript, React-Query and Tailwind CSS."
        url={routes?.checkout}
      />
      <div className="mx-auto flex h-full w-full max-w-screen-sm flex-col p-4 pt-6 sm:p-5 sm:pt-8 md:pt-10 3xl:pt-12">
        <div className="bg-light shadow-card dark:bg-dark-250 dark:shadow-none">
          <h2 className="flex items-center justify-between border-b border-light-400 px-5 py-4 text-sm font-medium text-dark dark:border-dark-400 dark:text-light sm:py-5 sm:px-7 md:text-base">
            {'Tu orden'}
            <span className="font-normal text-dark-700">({1})</span>
          </h2>
          <div className="px-5 pt-9 sm:px-7 sm:pt-11">
            {!isEmpty ? (
              <ProductItem item={productByService} /*className="pl-3"*/ />
            ) : (
              <>
                <CartEmpty />
                <div className="sticky bottom-11 z-[5] mt-10 border-t border-light-400 bg-light pt-6 pb-7 dark:border-dark-400 dark:bg-dark-250 sm:bottom-0 sm:mt-12 sm:pt-8 sm:pb-9">
                  <Button
                    onClick={() => router.push(routes.home)}
                    className="w-full md:h-[50px] md:text-sm"
                  >
                    <LongArrowIcon className="h-4 w-4" />
                    {t('404-back-home')}
                  </Button>
                </div>
              </>
            )}

            {!isEmpty && (
              <div className="bg-light pb-7 dark:bg-dark-250 sm:bottom-0 sm:pb-9">
                <div className="mb-6 flex flex-col gap-3 text-dark dark:text-light sm:mb-7">
                  <div className="mt-4 flex justify-between border-t border-light-400 pt-5 dark:border-dark-400">
                    <p>{t('text-total')}</p>
                    <strong className="font-semibold">
                      {productByService?.price} &#128176;
                    </strong>
                  </div>
                </div>

                <CartWallet
                  totalPrice={productByService?.price ?? 0}
                  walletAmount={data?.availablePoints ?? 0}
                  walletCurrency={
                    data?.availablePoints ?? 0
                    //  - (productByService?.price ?? 0) ??
                    // 0
                  }
                />

                <Button
                  disabled={isLoading}
                  isLoading={isLoading}
                  onClick={createOrder}
                  className="w-full md:h-[50px] md:text-sm"
                >
                  {'Comprar'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

CheckoutPage.authorization = true;
CheckoutPage.getLayout = function getLayout(page) {
  return <GeneralLayout>{page}</GeneralLayout>;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, ['common'])),
    },
    revalidate: 60, // In seconds
  };
};

export default CheckoutPage;

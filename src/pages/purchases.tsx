import type { NextPageWithLayout } from '@/types';
import DashboardLayout from '@/layouts/_dashboard';
import Grid from '@/components/purchases/grid';
import { useViewServices } from '@/data/viewServiceUser';
import CartEmpty from '@/components/cart/cart-empty';
import { motion } from 'framer-motion';
import { fadeInBottom } from '@/lib/framer-motion/fade-in-bottom';
import { GetStaticProps } from 'next/types';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const ViewServicesPage: NextPageWithLayout = () => {
  const { viewServices, isLoading } = useViewServices();
  console.log(viewServices);

  return (
    <motion.div
      variants={fadeInBottom()}
      className="flex min-h-full flex-grow flex-col"
    >
      {viewServices.length ? (
        <Grid viewServices={viewServices} isLoading={isLoading} />
      ) : (
        <div>
          <h1 className="col-span-6 mt-3 flex items-center text-15px font-medium text-dark dark:text-light">
            Mi Lista De Compras
            <span className="ml-1 text-light-900">({viewServices.length})</span>
          </h1>
          <CartEmpty
            title="Lista de compras vacía"
            description="No realizaste ninguna compra aún"
          />
        </div>
      )}
    </motion.div>
  );
};

const ViewServices: NextPageWithLayout = () => {
  return (
    <>
      <ViewServicesPage />
    </>
  );
};

ViewServices.authorization = true;

ViewServices.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, ['common'])),
    },
    revalidate: 60, // In seconds
  };
};
export default ViewServices;

{
  /* <CartEmpty
          className="my-auto"
          description={t('text-product-purchase-message')}
        />
      ) */
}

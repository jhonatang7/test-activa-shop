import Layout from '@/layouts/_layout';
import { Claim, NextPageWithLayout } from '@/types';
import Grid from '@/components/claims/grid';
import { useClaims } from '@/data/claim';
import DashboardLayout from '@/layouts/_dashboard';
import { motion } from 'framer-motion';
import { GetStaticProps } from 'next/types';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { fadeInBottom } from '@/lib/framer-motion/fade-in-bottom';

const ClaimPage: NextPageWithLayout = () => {
  const { claims, isLoading } = useClaims();

  return (
    <>
      <Grid claims={claims} isLoading={isLoading} />
    </>
  );
};

const Claims: NextPageWithLayout = () => {
  return (
    <motion.div
      variants={fadeInBottom()}
      className="flex min-h-full flex-grow flex-col"
    >
      <ClaimPage />
    </motion.div>
  );
};

Claims.authorization = true;

Claims.getLayout = function getLayout(page) {
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

export default Claims;

import useAuth from '@/components/auth/use-auth';
import Button from '@/components/ui/button';
import { useMe } from '@/data/user';
import { useWallet } from '@/data/wallet';
import DashboardLayout from '@/layouts/_dashboard';
import { fadeInBottom } from '@/lib/framer-motion/fade-in-bottom';
import {
  NextPageWithLayout,
  User,
  WalletRechargeInput,
  WalletRechargePlan,
} from '@/types';
import { motion } from 'framer-motion';
import client from '@/data/client';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next/types';
import { useMutation } from 'react-query';
import toast from 'react-hot-toast';
import Card from '@/components/wallet/recharge/card';
import Grid from '@/components/wallet/recharge/grid';
import { Recharge } from '@/components/wallet/recharge';
import ErrorMessage from '@/components/ui/error-message';
import { CheckLoaderIcon } from '@/components/icons/check-loader-icon';
import TableLoader from '@/components/ui/loader/table-loader';
import { FiLoader } from 'react-icons/fi';
import ContentLoader from 'react-content-loader';

const WalletPage: NextPageWithLayout = () => {
  //const { data, isLoading, error } = useWallet();
  const { me, isLoading, error } = useMe();

  const dataRechargePlan: WalletRechargePlan[] = [
    {
      id: 1,
      plan: 'Básico',
      point: 15,
      price: 40,
    },
    {
      id: 2,
      plan: 'Medio',
      point: 25,
      price: 70,
    },
    {
      id: 3,
      plan: 'Premium',
      point: 25,
      price: 100,
    },
  ];
  if (isLoading) return <TableLoader />;
  if (error) return <ErrorMessage message={error?.message} />;

  console.log(me);
  const userAccount = me as User | null;
  //return <Grid rechargePlan={dataRechargePlan} isLoading={false} />;
  return <Recharge userAccount={userAccount} />;
};

WalletPage.authorization = true;

WalletPage.getLayout = function getLayout(page) {
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

export default WalletPage;

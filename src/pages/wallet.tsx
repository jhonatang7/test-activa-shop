import useAuth from '@/components/auth/use-auth';
import Button from '@/components/ui/button';
import routes from '@/config/routes';
import { useMe } from '@/data/user';
import { useHistoryWallet, useWallet } from '@/data/wallet';
import DashboardLayout from '@/layouts/_dashboard';
import { fadeInBottom } from '@/lib/framer-motion/fade-in-bottom';
import { NextPageWithLayout } from '@/types';
import { motion } from 'framer-motion';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { GetStaticProps } from 'next/types';
import { useQueryClient } from 'react-query';

const WalletPage: NextPageWithLayout = () => {
  const { data, isLoading, error } = useWallet();
  const router = useRouter();

  var idWallet = '';
  if (!isLoading) {
    console.log(data!.id);
    idWallet = data!.id;
  }
  const { dataHistory } = useHistoryWallet(idWallet);

  console.log(dataHistory);
  return (
    <motion.div
      variants={fadeInBottom()}
      className="flex min-h-full flex-grow flex-col"
    >
      <div className="grid grid-cols-2 ">
        <div className="col-span-2 sm:col-span-2  lg:col-span-1 ">
          <h1 className="mb-5 text-15px font-medium text-dark dark:text-light sm:mb-6">
            Billetera
          </h1>
          <p>Puntos disponibles: {data?.availablePoints}</p>
          <p>Puntos usados: {data?.pointsUsed}</p>
          <p>Puntos totales: {data?.totalPoints} </p>
        </div>
        <div className="relative col-span-2 overflow-x-auto sm:col-span-2  ">
          <br />
          <table className="w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th className="px-6 py-3">Detalle</th>
                <th className="px-6 py-3">Monto</th>
                <th className="px-6 py-3">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {dataHistory != undefined ? (
                dataHistory!.map((item, index) => {
                  const instanceDateTime = new Date(item.transactionDate);
                  return (
                    <tr className="bg-white dark:bg-gray-800" key={index}>
                      <td className="px-3 py-2">{item.operation}</td>
                      <td className="px-3 py-2">
                        {item.operation != 'Recarga'
                          ? '-' + item.amount
                          : '+' + item.amount}
                      </td>
                      <td className="px-3 py-2">
                        {instanceDateTime.toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <h1>...</h1>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-auto flex items-center gap-4 pb-3 lg:justify-end">
        <Button
          onClick={() => {
            router.push(routes.recharge);
          }}
        >
          Recargar saldo
        </Button>
      </div>
    </motion.div>
  );
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

import { motion } from 'framer-motion';
import Image from '@/components/ui/image';
import placeholder from '@/assets/images/placeholders/netflix.jpg';
import { WalletRechargeInput, WalletRechargePlan } from '@/types';
import { useRouter } from 'next/router';
import Button from '@/components/ui/button';
import { useMutation } from 'react-query';
import client from '@/data/client';
import toast from 'react-hot-toast';
import { useMe } from '@/data/user';

export default function Card({
  rechargePlan,
}: {
  rechargePlan: WalletRechargePlan;
}) {
  const { me } = useMe();
  const userId = me?.id ?? '';
  const { id, plan, point, price } = rechargePlan ?? {};
  const inputPoint: WalletRechargeInput = {
    totalPoints: point,
  };
  // const router = useRouter();
  // const handlerRouter = (id: number) => {
  //   router.push(`/productsByService/?id=${id}`);
  // };
  const { mutate, isLoading } = useMutation(
    (data: { id: string; input: WalletRechargeInput }) =>
      client.wallet.rechargeWallet(data.id, data.input),
    {
      onSuccess: (res) => {
        toast.success(<b>Recarga Existosa!</b>);
        console.log(res);
      },
      onError: (err: any) => {
        toast.error(<b>Something went wrong!</b>);
        console.log(err.response.data.message);
      },
    }
  );

  const rechargeMyWallet = (id: string, input: WalletRechargeInput) => {
    mutate({ id, input });
  };

  return (
    <motion.div
      title={plan}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ opacity: 0.8, scale: 0.95 }}
      transition={{ ease: 'easeOut', duration: 0.1 }}
      // onClick={() => handlerRouter(id)}
      className="border-2 border-gray-500"
    >
      <div className="-mt-[1px] flex flex-col items-center truncate pt-3.5 ltr:mr-auto ltr:pl-2.5 ltr:pr-2.5 rtl:ml-auto rtl:pr-2.5 rtl:text-right">
        <h3
          title={plan}
          className="mb-3 flex justify-center text-2xl font-bold text-dark-100 dark:text-light"
        >
          {plan}
        </h3>
        <div className="flex items-center">
          <h2
            title={'' + point}
            className="mb-0.5 mr-2 truncate text-3xl font-bold text-dark-100 dark:text-light"
          >
            {point}
          </h2>
          <h3 className="text-[16px]">Coins</h3>
        </div>
        <Button
          className="my-4 w-full max-w-lg md:h-[50px] md:text-sm"
          disabled={isLoading}
          onClick={() => rechargeMyWallet(userId, inputPoint)}
        >
          Comprar
        </Button>
        <div className="mb-4 flex items-center">
          <h2 className="mb-0.5 mr-2 truncate text-lg font-medium text-dark-100 dark:text-light">
            Precio
          </h2>
          <h2
            title={'' + price}
            className="text-heading mr-0.5 text-xl text-15px font-semibold"
          >
            {price}
          </h2>
          <h2 className="text-lg font-semibold">Bs</h2>
        </div>
      </div>
    </motion.div>
  );
}

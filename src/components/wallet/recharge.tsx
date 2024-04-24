import * as yup from 'yup';
import { staggerTransition } from '@/lib/framer-motion/stagger-transition';
import { motion } from 'framer-motion';
import Input from '../ui/forms/input';
import { useEffect, useState } from 'react';
import Button from '../ui/button';
import { PurchaseIcon } from '../icons/purchase-icon';
import { Form } from '../ui/forms/form';
import { PaymentInput, User } from '@/types';
import { SubmitHandler } from 'react-hook-form';
import { useMutation } from 'react-query';
import client from '@/data/client';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import { useModalAction, useModalState } from '../modal-views/context';
import { fadeInBottom } from '@/lib/framer-motion/fade-in-bottom';

const paymentValidationSchema = yup.object().shape({
  amount: yup.string().required(),
});

export function Recharge({ userAccount }: { userAccount: User | null }) {
  const walletId = userAccount ? userAccount.walletId : 0;
  const email = userAccount ? userAccount.email : '';
  const fullName =
    (userAccount ? userAccount.firstName : '') +
    ' ' +
    (userAccount ? userAccount.lastName : '');
  const [number, setNumber] = useState<number | ''>('');
  let [serverError, setServerError] = useState<PaymentInput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showIFrame, setShowIFrame] = useState({ url: '', state: false });

  const handleChangeNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    let nuevoValor = e.target.value;
    if (parseInt(nuevoValor) > 100000) return;
    if (isNaN(parseInt(nuevoValor)) || parseInt(nuevoValor) < 0) {
      nuevoValor = '';
    }

    setNumber(nuevoValor as number | '');
  };

  const generateUrl = useMutation(client.payment.generateUrl, {
    onError: (err: any) => {
      toast.error(<b>Something went wrong!</b>);
      console.log(err.response.data.message);
    },
  });

  const savePaymentTransaction = useMutation(
    client.payment.savePaymentTransaction,
    {
      onSuccess: (res) => {
        console.log('HOLA');
        console.log(res);
        setShowIFrame({ url: res.url, state: true });
      },
      onError: (err: any) => {
        toast.error(<b>Something went wrong!</b>);
        console.log(err.response.data.message);
      },
    }
  );

  const executePaymentTransaction = async (
    amount: number,
    uniqueId: string
  ) => {
    setIsLoading(true);
    try {
      const responseGenerateUrl = await generateUrl.mutateAsync({
        companyCode: 'ATPG-P8V8-22TK-H43G',
        codeTransaction: uniqueId,
        urlSuccess: 'https://exito.com.bo',
        urlFailed: 'https://falla.com.bo',
        billName: fullName,
        billNit: '123456789',
        email: email,
        generateBill: 1,
        concept: 'PAGO RECARGA',
        currency: 'BOB',
        amount: amount,
        messagePayment: 'Solicitando la Recarga',
        codeExternal: '',
      });
      const url: string = responseGenerateUrl.url;
      const transactionId: string =
        responseGenerateUrl.transactionId.toString();
      if (url && transactionId) {
        await savePaymentTransaction.mutateAsync({
          operation: 'Solicitud de Recarga',
          amount: amount.toString(),
          stateAdjusted: 'Solicitud de Recarga',
          url: url,
          statusPayment: 'PENDIENTE',
          transactionId: transactionId,
          walletId: walletId,
        });
      } else {
        toast.error(<b>No se genero la URL, vuelva a intentarlo</b>);
      }
    } catch (error) {
      toast.error(<b>Algo salió mal en la transacción</b>);
    }
    setIsLoading(false);
  };

  const onSubmit: SubmitHandler<PaymentInput> = (data) => {
    const amount: number = parseInt(data.amount);
    const uniqueId = uuidv4();
    executePaymentTransaction(amount, uniqueId);
    // generateUrl.mutate({
    //   companyCode: 'ATPG-P8V8-22TK-H43G',
    //   codeTransaction: uniqueId,
    //   urlSuccess: 'https://exito.com.bo',
    //   urlFailed: 'https://falla.com.bo',
    //   billName: 'JAIME TEST',
    //   billNit: '123456789',
    //   email: 'prueba@hotmail.com',
    //   generateBill: 1,
    //   concept: 'PAGO PRUEBA',
    //   currency: 'BOB',
    //   amount: 0.1,
    //   messagePayment: 'Prueba Mensaje!!!',
    //   codeExternal: '',
    // });
    // console.log(data);
  };

  return (
    <div className="px-4 pt-5 pb-9 md:px-6 md:pb-10 md:pt-6 lg:px-7 lg:pb-12 3xl:px-8">
      <motion.div variants={fadeInBottom()} className="grid grid-cols-1 gap-2">
        {showIFrame.state ? (
          <div className="flex flex-col">
            <h1 className="mb-0.5 truncate text-center text-2xl font-semibold uppercase text-dark-100 dark:text-light">
              PAGO POR TRANSACION
            </h1>
            <iframe className="grow" src={showIFrame.url} height={600}></iframe>
          </div>
        ) : (
          <>
            {' '}
            <h1 className="mb-0.5 truncate text-center text-2xl font-semibold uppercase text-dark-100 dark:text-light">
              RECARGA TU BILLETERA
            </h1>
            <h2 className="mb-0.5 truncate text-xl font-medium uppercase text-dark-100 dark:text-light ">
              MONTO
            </h2>
            <Form<PaymentInput>
              onSubmit={onSubmit}
              validationSchema={paymentValidationSchema}
              serverError={serverError}
              className="flex flex-col items-stretch space-y-4 lg:space-y-5"
            >
              {({ register, formState: { errors } }) => (
                <>
                  <Input
                    inputClassName="text-center uppercase font-semibold text-lg lg:text-xl xl:text-xl 2xl:text-xl 4xl:text-xl mb-1"
                    label=""
                    type="number"
                    {...register('amount')}
                    error={errors.amount?.message}
                    value={number}
                    placeholder="ESCRIBA EL MONTO EN BOLIVIANOS"
                    onChange={handleChangeNumber}
                  />
                  <Button
                    type="submit"
                    className="self-center uppercase"
                    disabled={isLoading}
                  >
                    <div className="flex space-x-1">
                      <PurchaseIcon className="h-4 w-4" />
                      <p>Continuar el Pago</p>
                    </div>
                  </Button>
                </>
              )}
            </Form>
          </>
        )}
      </motion.div>
    </div>
  );
}

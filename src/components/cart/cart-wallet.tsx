import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import cn from 'classnames';
import usePrice from '@/lib/hooks/use-price';
import CheckBox from '@/components/ui/forms/checkbox';
import { isNegative } from '@/lib/is-negative';
import {
  payableAmountAtom,
  useWalletPointsAtom,
} from '@/components/cart/lib/checkout';
import { useTranslation } from 'next-i18next';

interface Props {
  totalPrice: number;
  walletAmount: number;
  walletCurrency: number;
}

export default function CartWallet({
  totalPrice,
  walletAmount,
  walletCurrency,
}: Props) {
  const { t } = useTranslation('common');
  const [use_wallet, setUseWallet] = useAtom(useWalletPointsAtom);
  const [calculatePayableAmount, setCalculatePayableAmount] =
    useAtom(payableAmountAtom);
  const [calculateCurrentWalletCurrency, setCalculateCurrentWalletCurrency] =
    useState(walletCurrency);

  const { price: currentWalletCurrency } = usePrice({
    amount: Number(calculateCurrentWalletCurrency),
  });
  const { price: payableAmount } = usePrice({
    amount: calculatePayableAmount,
  });
  // console.log(totalPrice);
  // console.log(walletAmount);
  // console.log(walletCurrency);
  // console.log();
  useEffect(() => {
    if (use_wallet) {
      const calculatedCurrentWalletCurrencyAfterPayment =
        walletCurrency - totalPrice;
      if (isNegative(calculatedCurrentWalletCurrencyAfterPayment)) {
        setCalculateCurrentWalletCurrency(0);
        setCalculatePayableAmount(
          Math.abs(calculatedCurrentWalletCurrencyAfterPayment)
        );
      } else {
        setCalculateCurrentWalletCurrency(
          calculatedCurrentWalletCurrencyAfterPayment
        );
        setCalculatePayableAmount(0);
      }
    } else {
      setCalculateCurrentWalletCurrency(walletCurrency);
      setCalculatePayableAmount(0);
    }
  }, [setCalculatePayableAmount, totalPrice, use_wallet, walletCurrency]);

  return (
    <div>
      <div className="mt-2 mb-7 space-y-3">
        <div className="text-body flex justify-between">
          <span>{'Puntos de billetera'}</span>
          <span>&#128179; {walletAmount}</span>
        </div>
        <div className="text-body flex justify-between">
          <span>{'Puntos después de la compra'}</span>
          <span>&#128179; {calculateCurrentWalletCurrency}</span>
        </div>
      </div>

      {/* <CheckBox
        name="use_wallet"
        label="text-wallet-input-label"
        onChange={() => setUseWallet(!use_wallet)}
        checked={use_wallet}
        className={cn(
          'mt-4 mb-7 flex-row-reverse rounded border border-light-400 bg-light-100 py-2.5 hover:bg-transparent ltr:pr-2.5 rtl:pl-2.5 dark:border-dark-500/80 dark:bg-dark-400/80 dark:hover:bg-transparent',
          !walletAmount ? 'cursor-not-allowed' : 'cursor-pointer'
        )}
        disabled={!walletAmount}
      /> */}

      {use_wallet && (
        <div className="mt-1 mb-7 flex justify-between border-t-4 border-double border-light-400 pt-4 dark:border-dark-400">
          <span className="text-heading text-15px font-semibold">
            Monto de pago
          </span>
          <span className="text-heading text-15px font-semibold">
            {totalPrice} &#128176;
          </span>
        </div>
      )}
    </div>
  );
}

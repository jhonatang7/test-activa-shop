import React, { useEffect, useState } from 'react';
import type { Claim } from '@/types';
import Card from './card';
import ItemNotFound from '../ui/item-not-found';
import { useTranslation } from 'next-i18next';
import CreateClaim from './createClaimModal';

interface GridProps {
  claims: Claim[];
  isLoading?: boolean;
}

export default function Grid({ claims, isLoading }: GridProps) {
  const { t } = useTranslation('common');

  const [showModal, setShowModal] = useState(false);

  const handlerShowModal = () => {
    setShowModal(true);
  };
  const handlerHideModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      <div className="mb-3 grid grid-cols-8 gap-4">
        <h1 className="col-span-6 flex items-center text-15px font-medium text-dark dark:text-light">
          Mi Lista De Reclamos
          <span className="ml-1 text-light-900">({claims.length})</span>
        </h1>
        <button
          className="transition-fill-colors pointer-events-auto col-span-2 flex min-h-[46px] cursor-pointer items-center justify-center gap-2 rounded bg-brand py-3 px-4 font-semibold text-white opacity-100 duration-200 hover:bg-brand-dark focus:bg-brand-dark sm:h-12 md:px-5"
          onClick={handlerShowModal}
        >
          Generar Reclamo
        </button>
      </div>
      {!isLoading && !claims.length ? (
        <div className="flex items-center justify-center">
          <ItemNotFound
            title="Lista de reclamos vacía"
            message="No realizaste ningún reclamo aún"
            className="px-4 pt-5 pb-10 md:px-6 md:pt-6 lg:px-7 lg:pb-12 3xl:px-8"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {claims.map((claim: Claim, index: number) => (
            <Card key={index} claim={claim} />
          ))}
        </div>
      )}
      {showModal && <CreateClaim handlerHideModal={handlerHideModal} />}
    </div>
  );
}

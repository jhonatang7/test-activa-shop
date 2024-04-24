import React, { useEffect, useState } from 'react';
import { useModalAction, useModalState } from '../modal-views/context';
import Button from '../ui/button';
import { Form } from '../ui/forms/form';
import CheckBox from '../ui/forms/checkbox';
import { RegisterBgPattern } from '../auth/register-bg-pattern';
import { TRANSLATE_KEYS_TO_LANGUAGE } from '@/lib/constants';

interface CredentialsProps {
  credentials?: JSON;
  handlerHideModal?: () => void;
}
type DataKey = keyof typeof TRANSLATE_KEYS_TO_LANGUAGE;

const formatCredentials = (credentials: Record<string, any> = {}) => {
  return Object.entries(credentials)
    .map(([key, value]) => {
      return `${key}: ${value}`;
    })
    .join('\n');
};

export default function CredentialsModal({ credentials }: CredentialsProps) {
  const { closeModal } = useModalAction();

  const handlerHideModal = () => {
    closeModal();
  };
  const { data } = useModalState();
  console.log(data);
  // console.log(payload)
  return (
    // <>
    //   <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
    //     <div className="relative my-6 mx-auto w-2/3">
    //       {/*content*/}
    //       <div className="relative flex w-full flex-col rounded-lg border border-light border-opacity-25 bg-dark-100 shadow-lg outline-none focus:outline-none">
    //         {/*header*/}
    //         <div className="flex items-start justify-between rounded-t border-b border-solid border-light border-opacity-25 p-5">
    //           <h3 className="text-2xl font-semibold">Ver Credenciales</h3>
    //         </div>
    //         {/*body*/}
    //         <div className="relative flex flex-col items-center justify-center bg-dark-250 p-6">
    //           { data ?
    //           Object.entries(data!).map(([key, value]) => (
    //             <p
    //               key={key}
    //               className="text-center text-xl"
    //             >{`${key}: ${value}`}</p>
    //           )): <> En espera...</>}
    //           {/* {data} */}
    //         </div>
    //         {/*footer*/}
    //         <div className="flex items-center justify-end rounded-b border-t border-solid border-light border-opacity-25 p-6">
    //           <button
    //             className="mr-1 mb-1 rounded bg-emerald-500 px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-emerald-600"
    //             type="button"
    //             onClick={handlerHideModal}
    //           >
    //             Cerrar
    //           </button>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    //   <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
    // </>
    <div className="bg-light px-6 pt-10 pb-8 dark:bg-dark-300 sm:px-8 lg:p-12">
      <RegisterBgPattern className="absolute bottom-0 left-0 text-light dark:text-dark-300 dark:opacity-60" />
      <div className="relative z-10 flex items-center">
        <div className="w-full shrink-0 text-left md:w-[380px]">
          <div className="flex flex-col pb-5 text-center xl:pb-6 xl:pt-2">
            <h2 className="text-lg font-medium tracking-[-0.3px] text-dark dark:text-light lg:text-xl">
              {'Credenciales'}
            </h2>
            <div className="mt-1.5 text-13px leading-6 tracking-[0.2px] dark:text-light-900 lg:mt-2.5 xl:mt-3">
              {data ? (
                Object.entries(data!).map(([key, value]) => (
                  <p key={key} className="text-center text-xl">{`${
                    TRANSLATE_KEYS_TO_LANGUAGE[key as DataKey] || key
                  }: ${value}`}</p>
                ))
              ) : (
                <> Procesando el servicio... </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

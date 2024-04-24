import React, { useEffect, useState, useRef } from 'react';
import CustomDropdown from './dropdown/customDropdown';
import { useViewServices } from '@/data/viewServiceUser';
import { Cause, InputClaim, ViewUserServices } from '@/types';
import { useCauses } from '@/data/causes';
import { useMe } from '@/data/user';
import { useMutation } from 'react-query';
import client from '@/data/client';
import toast from 'react-hot-toast';

interface CreateClaimProps {
  handlerHideModal: () => void;
}

export default function CreateClaim({ handlerHideModal }: CreateClaimProps) {
  const { viewServices } = useViewServices();
  const { causes } = useCauses();
  const { me } = useMe();
  const [viewServiceSelected, setViewServiceSelected] =
    useState<ViewUserServices | null>(null);
  const [causeSelected, setCauseSelected] = useState<Cause | null>(null);
  const [validate, setValidate] = useState(true);

  const getViewServiceString = (service: ViewUserServices) => {
    const formattedDate = new Date(service.dateExpired);
    const day = formattedDate.getDate().toString().padStart(2, '0');
    const month = (formattedDate.getMonth() + 1).toString().padStart(2, '0');
    const year = formattedDate.getFullYear();
    const concatenatedValue = `${day}-${month}-${year} | ${service.productName} | ${service.providerFullName}`;
    return concatenatedValue;
  };

  const createClaimMutation = useMutation(client.claims.create, {
    onSuccess: (res) => {
      window.location.reload();
    },
    onError: (err: any) => {
      toast.error(<b>Something went wrong!</b>);
      console.log(err.response.data.message);
    },
  });

  const inputTitle = useRef<HTMLInputElement | null>(null);
  const inputSocialReason = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputTitle.current) {
      inputTitle.current.value = viewServiceSelected?.productName ?? '';
    }
    if (inputSocialReason.current) {
      inputSocialReason.current.value =
        viewServiceSelected?.providerFullName ?? '';
    }
  }, [viewServiceSelected]);

  const OnSubmit = async () => {
    if (!causeSelected || !viewServiceSelected) {
      setValidate(false);
      return;
    }

    const claim: InputClaim = {
      title: inputTitle.current!.value,
      socialReason: inputSocialReason.current!.value,
      statusResponse: 'En Proceso',
      causeId: causeSelected?.id!,
      customerId: me?.id ? +me.id : 0,
      purchaseId: viewServiceSelected.idPurchase,
    };

    setValidate(true);
    createClaimMutation.mutate(claim);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
        <div className="relative my-6 mx-auto w-2/3">
          {/*content*/}
          <div className="relative flex w-full flex-col rounded-lg border border-light border-opacity-25 bg-light shadow-lg outline-none focus:outline-none dark:bg-dark-100">
            {/*header*/}
            <div className="flex items-start justify-between rounded-t border-b border-solid border-light border-opacity-25 p-5">
              <h3 className="text-3xl font-semibold">Generar Reclamo</h3>
            </div>
            {/*body*/}
            <div className="relative flex items-center justify-center bg-slate-50 p-6 dark:bg-dark-250">
              <form action="POST" className="w-full max-w-lg">
                <CustomDropdown<ViewUserServices>
                  options={viewServices}
                  placeholder="Selecciona una compra"
                  getStringFormated={(service) => getViewServiceString(service)}
                  getValuedSelected={(service) =>
                    setViewServiceSelected(service)
                  }
                />
                <div className="my-5 border border-light border-opacity-25" />
                <div className="mb-3 grid grid-cols-4 items-center gap-6">
                  <label htmlFor="txtTitle">Título:</label>
                  <input
                    id="txtTitle"
                    ref={inputTitle}
                    className="col-span-3 rounded-md border border-light border-opacity-25 bg-light hover:border-opacity-75 dark:bg-dark-100 dark:text-light"
                    type="text"
                    name="txtTitle"
                    //value={viewServiceSelected?.productName}
                  />
                </div>
                <div className="mb-3 grid grid-cols-4 items-center gap-6">
                  <label htmlFor="txtSocialReason">Razón social:</label>
                  <input
                    id="txtSocialReason"
                    ref={inputSocialReason}
                    className="col-span-3 rounded-md border border-light border-opacity-25 hover:border-opacity-75 dark:bg-dark-100 dark:text-light"
                    type="text"
                    name="txtSocialReason"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-6">
                  <label htmlFor="cmbCause">Causa:</label>
                  <div className="col-span-3">
                    <CustomDropdown<Cause>
                      options={causes}
                      placeholder="Seleccione una causa"
                      getStringFormated={(cause) => cause.causeOfClose}
                      getValuedSelected={(cause) => setCauseSelected(cause)}
                    />
                  </div>
                </div>
                <div
                  className={`mt-4 text-sm font-semibold text-red-500 outline-none ${
                    validate ? 'hidden' : 'block'
                  }`}
                >
                  <span>Seleccione una compra y una causa...</span>
                </div>
              </form>
            </div>
            {/*footer*/}
            <div className="flex items-center justify-end rounded-b border-t border-solid border-light border-opacity-25 p-6">
              <button
                className="background-transparent mr-1 mb-1 px-6 py-2 text-sm font-bold uppercase text-red-500 outline-none transition-all duration-150 ease-linear focus:outline-none"
                type="button"
                onClick={handlerHideModal}
              >
                Cancelar
              </button>
              <button
                className="mr-1 mb-1 rounded bg-emerald-500 px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-emerald-600"
                type="button"
                onClick={OnSubmit}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
    </>
  );
}

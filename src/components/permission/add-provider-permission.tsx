import { useMutation } from 'react-query';
import { RegisterBgPattern } from '../auth/register-bg-pattern';
import { useModalAction, useModalState } from '../modal-views/context';
import Button from '../ui/button';
import client from '@/data/client';
import toast from 'react-hot-toast';
import { FiLoader } from 'react-icons/fi';
import { useRouter } from 'next/router';

export default function AddProviderPermission() {
  const { closeModal } = useModalAction();
  const { data } = useModalState();
  const router = useRouter();
  const { mutate, isLoading } = useMutation(
    client.permission.convertToProvider,
    {
      onSuccess: () => {
        toast.success(<b>Espere unos segundos...</b>);
        router.push(`${process.env.NEXT_PUBLIC_ADMIN_URL}/login`);
      },
      onError: () => {
        toast.error(<b>No se pudo completar la operación!</b>);
      },
    }
  );

  const convertUserToProvider = () => {
    mutate({ userId: data.userId });
  };
  return (
    <div className="bg-light px-6 pt-10 pb-8 dark:bg-dark-300 sm:px-8 lg:p-12">
      <RegisterBgPattern className="absolute bottom-0 left-0 text-light dark:text-dark-300 dark:opacity-60" />
      <div className="relative z-10 flex items-center">
        <div className="w-full shrink-0 text-left md:w-[380px]">
          {isLoading ? (
            <div className="flex flex-col items-center">
              <h2 className="mb-3 text-lg font-medium tracking-[-0.3px] text-dark dark:text-light lg:text-xl">
                Procesando Solicitud...
              </h2>
              <FiLoader className="duration-2000 h-12 w-12 animate-spin" />
            </div>
          ) : (
            <>
              <div className="flex flex-col pb-2 text-center xl:pb-3 xl:pt-2">
                <h2 className="text-lg font-medium tracking-[-0.3px] text-dark dark:text-light lg:text-xl">
                  {'Volverse Proveedor'}
                </h2>
                <div className="mt-1.5 flex-col text-left text-13px leading-6 tracking-[0.2px] dark:text-light-900 lg:mt-2.5 xl:mt-3">
                  <h4 className="mb-2 text-sm font-medium text-dark dark:text-light lg:mb-3">
                    Estas a punto de volverte un proveedor, tendras las
                    siguientes funcionalidades:
                  </h4>
                  <ul className="first-letter ml-6 mb-2 list-disc">
                    <li>Podras usar tu cuenta actual, para iniciar sesión</li>
                    <li>Publicar productos</li>
                    <li>Tener acceso a la página de proveedor</li>
                    <li>
                      Podras elegir un flujo de trabajo, con los productos que
                      creas
                    </li>
                    <li>
                      Tendras que responder a los reclamos que te lleguen por
                      parte de los clientes
                    </li>
                  </ul>
                  <h2 className="mb-2 text-sm font-medium text-dark dark:text-light lg:mb-3">
                    ¿Estas seguro de ser Proveedor?
                  </h2>
                </div>
              </div>

              <div className="flex justify-center space-x-2">
                <Button onClick={() => closeModal()} className="w-full">
                  Rechazar
                </Button>
                <Button onClick={convertUserToProvider} className="w-full">
                  Confirmar
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

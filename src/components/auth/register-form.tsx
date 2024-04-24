import * as yup from 'yup';
import type { SubmitHandler } from 'react-hook-form';
import type { RegisterUserInput } from '@/types';
import { useMutation } from 'react-query';
import toast from 'react-hot-toast';
import { Form } from '@/components/ui/forms/form';
import Password from '@/components/ui/forms/password';
import { useModalAction } from '@/components/modal-views/context';
import Input from '@/components/ui/forms/input';
import client from '@/data/client';
import Button from '@/components/ui/button';
import { RegisterBgPattern } from '@/components/auth/register-bg-pattern';
import { useState } from 'react';
import useAuth from './use-auth';
import { useTranslation } from 'next-i18next';

const registerUserValidationSchema = yup.object().shape({
  firstName: yup.string().max(20).required('Se requiere el nombre'),
  lastName: yup.string().max(20).required('Se requiere el apellido'),
  numberPhone: yup.string().max(20).required('Se requiere el teléfono'),
  email: yup.string().email().required('Se requiere el correo électronico'),
  password: yup
    .string()
    .min(6, 'Debe ser mayor a 6')
    .required('Se requiere la contraseña'),
});

export default function RegisterUserForm() {
  const { t } = useTranslation('common');
  const { openModal, closeModal } = useModalAction();
  const { authorize } = useAuth();
  let [serverError, setServerError] = useState<RegisterUserInput | null>(null);
  const { mutate } = useMutation(client.users.register, {
    onSuccess: (res) => {
      // if (!res.token) {
      //   toast.error(<b>{t('text-profile-page-error-toast')}</b>, {
      //     className: '-mt-10 xs:mt-0',
      //   });
      //   return;
      // }
      //authorize(res.token);
      toast.success(<b>{'Registro existoso!'}</b>, {
        className: '-mt-10 xs:mt-0',
      });
      closeModal();
    },
    onError: (err: any) => {
      if (err.response.data.statusCode === 406) {
        toast.error(<b>El correo ya existe</b>, {
          className: '-mt-10 xs:mt-0',
        });
        return;
      }
      toast.error(<b>Algo salio mal :(</b>, {
        className: '-mt-10 xs:mt-0',
      });
    },
  });
  const onSubmit: SubmitHandler<RegisterUserInput> = (data) => {
    mutate(data);
  };

  return (
    <div className="bg-light px-6 pt-10 pb-8 dark:bg-dark-300 sm:px-8 lg:p-12">
      <RegisterBgPattern className="absolute bottom-0 left-0 text-light dark:text-dark-300 dark:opacity-60" />
      <div className="relative z-10 flex items-center">
        <div className="w-full shrink-0 text-left md:w-[380px]">
          <div className="flex flex-col pb-5 text-center lg:pb-9 xl:pb-10 xl:pt-2">
            <h2 className="text-lg font-medium tracking-[-0.3px] text-dark dark:text-light lg:text-xl">
              {'Registrarse como cliente'}
            </h2>
            <div className="mt-1.5 text-13px leading-6 tracking-[0.2px] dark:text-light-900 lg:mt-2.5 xl:mt-3">
              {'Tengo una cuenta para'}{' '}
              <button
                onClick={() => openModal('LOGIN_VIEW')}
                className="inline-flex font-semibold text-brand hover:text-dark-400 hover:dark:text-light-500"
              >
                {'ingresar'}
              </button>
            </div>
          </div>

          <Form<RegisterUserInput>
            onSubmit={onSubmit}
            validationSchema={registerUserValidationSchema}
            serverError={serverError}
            className="space-y-4 lg:space-y-5"
          >
            {({ register, formState: { errors } }) => (
              <>
                <Input
                  label="Nombres"
                  inputClassName="bg-light dark:bg-dark-300"
                  {...register('firstName')}
                  error={errors.firstName?.message}
                />
                <Input
                  label="Apellidos"
                  inputClassName="bg-light dark:bg-dark-300"
                  {...register('lastName')}
                  error={errors.lastName?.message}
                />
                <Input
                  label="Número de celular"
                  inputClassName="bg-light dark:bg-dark-300"
                  {...register('numberPhone')}
                  error={errors.numberPhone?.message}
                />
                <Input
                  label="Email"
                  inputClassName="bg-light dark:bg-dark-300"
                  type="email"
                  {...register('email')}
                  error={errors.email?.message}
                />
                <Password
                  label="Contraseña"
                  inputClassName="bg-light dark:bg-dark-300"
                  {...register('password')}
                  error={errors.password?.message}
                />
                <Button
                  type="submit"
                  className="!mt-5 w-full text-sm tracking-[0.2px] lg:!mt-7"
                >
                  {'Registrar'}
                </Button>
              </>
            )}
          </Form>
        </div>
      </div>
    </div>
  );
}

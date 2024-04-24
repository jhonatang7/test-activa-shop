import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import type {
  ChangePasswordInput,
  NextPageWithLayout,
  SettingsQueryOptions,
} from '@/types';
import type { SubmitHandler } from 'react-hook-form';
import {
  dehydrate,
  QueryClient,
  useMutation,
  useQueryClient,
} from 'react-query';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import DashboardLayout from '@/layouts/_dashboard';
import { Form } from '@/components/ui/forms/form';
import Password from '@/components/ui/forms/password';
import Button from '@/components/ui/button';
import client from '@/data/client';
import { fadeInBottom } from '@/lib/framer-motion/fade-in-bottom';
import * as yup from 'yup';
import { useState } from 'react';
import { API_ENDPOINTS } from '@/data/client/endpoints';
import { useLogout, useMe } from '@/data/user';
import { pick } from 'lodash';

// export const getStaticProps = async () => {
//   const queryClient = new QueryClient();
//   await queryClient.prefetchQuery(
//     [API_ENDPOINTS.SETTINGS],
//     client.settings.all
//   );
//   return {
//     props: {
//       dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
//     },
//   };
// };
const changePasswordSchema = yup.object().shape({
  idUser: yup.string(),
  oldPassword: yup.string().required('Se requiere este campo'),
  newPassword: yup
    .string()
    .min(6, 'Debe ser mayor a 6 caracteres')
    .required('Error'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'La contraseña no coincide')
    .required('Se requiere'),
});

const ChangePasswordPage: NextPageWithLayout = () => {
  //const { t } = useTranslation('common');
  const { me } = useMe();
  let [error, setError] = useState<Partial<ChangePasswordInput> | null>(null);
  const { mutate: logout } = useLogout();

  const passwordMutation = useMutation(
    (data: ChangePasswordInput) => {
      return client.users.changePassword(me?.id as string, data);
    },
    {
      onSuccess: (data) => {
        if (!data.success) {
          setError({ oldPassword: data.message });

          if (!data.message) {
            toast.success(<b>Contraseña cambiada con éxito</b>, {
              className: '-mt-10 xs:mt-0',
            });
            logout();
            return;
          }
          return;
        }
      },
      onError: (e) => {
        toast.error(<b>{'Ocurrio un error :('}</b>, {
          className: '-mt-10 xs:mt-0',
        });
      },
    }
  );

  const onSubmit: SubmitHandler<ChangePasswordInput> = (data) => {
    console.log(data);
    passwordMutation.mutate(data);
  };
  return (
    <motion.div
      variants={fadeInBottom()}
      className="flex min-h-full flex-grow flex-col"
    >
      <h1 className="mb-5 text-15px font-medium text-dark dark:text-light sm:mb-6">
        {'Cambiar contraseña'}
      </h1>
      <Form<ChangePasswordInput & { confirmPassword: string }>
        onSubmit={onSubmit}
        validationSchema={changePasswordSchema}
        serverError={error}
        className="flex flex-grow flex-col"
      >
        {({ register, reset, formState: { errors } }) => (
          <>
            <fieldset className="mb-6 grid gap-5 pb-5 sm:grid-cols-2 md:pb-9 lg:mb-8">
              {/* <input type='hidden' {...register('idUser')}></input> */}
              <Password
                label={'Escribe tu contraseña actual'}
                {...register('oldPassword')}
                error={
                  errors.oldPassword?.message && 'Contraseña actual incorrecta'
                }
              />
              <Password
                label={'Escribe tu nueva contraseña'}
                {...register('newPassword')}
                error={errors.newPassword?.message}
              />
              <Password
                label={'Confirma la nueva contraseña'}
                {...register('confirmPassword')}
                error={errors.confirmPassword?.message}
              />
            </fieldset>
            <div className="mt-auto flex items-center gap-4 pb-3 lg:justify-end">
              <Button
                type="reset"
                variant="outline"
                disabled={passwordMutation.isLoading}
                onClick={() => reset()}
                className="flex-1 lg:flex-none"
              >
                {'Cancelar'}
              </Button>
              <Button
                type="submit"
                isLoading={passwordMutation.isLoading}
                disabled={passwordMutation.isLoading}
                className="flex-1 lg:flex-none"
              >
                {'Guardar cambios'}
              </Button>
            </div>
          </>
        )}
      </Form>
    </motion.div>
  );
};

ChangePasswordPage.authorization = true;
ChangePasswordPage.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(
    [API_ENDPOINTS.SETTINGS, { language: locale }],
    ({ queryKey }) => client.settings.all(queryKey[1] as SettingsQueryOptions)
  );
  return {
    props: {
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
      ...(await serverSideTranslations(locale!, ['common'])),
    },
    revalidate: 60, // In seconds
  };
};

export default ChangePasswordPage;

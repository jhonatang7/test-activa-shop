import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import type { CreateContactUsInput, NextPageWithLayout } from '@/types';
import React, { useState } from 'react';
import { useMutation } from 'react-query';
import type { SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';
import GeneralLayout from '@/layouts/_general-layout';
import { LocationIcon } from '@/components/icons/contact/location-icon';
import { PhoneIcon } from '@/components/icons/contact/phone-icon';
import { MailIcon } from '@/components/icons/contact/mail-icon';
import { Form } from '@/components/ui/forms/form';
import Input from '@/components/ui/forms/input';
import Textarea from '@/components/ui/forms/textarea';
import Seo from '@/layouts/_seo';
import Button from '@/components/ui/button';
import client from '@/data/client';
import PageHeading from '@/components/ui/page-heading';
import routes from '@/config/routes';
import * as yup from 'yup';
import { useSettings } from '@/data/settings';
import Link from 'next/link';

const formatPhone = `+${process.env.NEXT_PUBLIC_COUNTRY_CODE} ${process.env.NEXT_PUBLIC_PHONE_WHATSAPP}`;
const linkWhatsApp = `${process.env.NEXT_PUBLIC_LINK_WHATSAPP}`;

function ContactInfo({
  icon,
  title,
  description,
  isWhatsAppLink,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  isWhatsAppLink: boolean;
}) {
  return (
    <div className="flex max-w-xs flex-row items-center pr-4 sm:pr-2 lg:max-w-sm lg:pr-0">
      <div className="flex w-12 flex-shrink-0 justify-center text-brand">
        {icon}
      </div>
      <div className="mt-0 ltr:pl-5 rtl:pr-5">
        <h3 className="mb-2 text-15px font-medium text-dark dark:text-light">
          {title}
        </h3>
        {isWhatsAppLink ? (
          <Link href={linkWhatsApp}>
            <a className="text-blue-500 hover:underline">{description}</a>
          </Link>
        ) : (
          <p className="leading-[1.8em]">{description}</p>
        )}
      </div>
    </div>
  );
}

const contactUsFormSchema = yup.object().shape({
  name: yup.string().required('Se requiere este campo'),
  email: yup.string().email().required('Se requiere este campo'),
  subject: yup.string().required('Se requiere este campo'),
  description: yup.string().required('Se requiere este campo'),
});

const ContactUsPage: NextPageWithLayout = () => {
  const { t } = useTranslation('common');
  const { settings } = useSettings();
  const { contactDetails } = settings ?? {};
  let [reset, setReset] = useState<CreateContactUsInput | null>(null);
  const { mutate } = useMutation(client.settings.contactUs, {
    onSuccess: () => {
      toast.success('Correo enviado con éxito!');
      setReset({
        name: '',
        email: '',
        subject: '',
        description: '',
      });
    },
    onError: (res) => {
      toast.error('Algo salio mal :(');
    },
  });
  const onSubmit: SubmitHandler<CreateContactUsInput> = (values) => {
    mutate(values);
  };
  return (
    <>
      <Seo
        title="Contact us"
        description="Fastest digital download template built with React, NextJS, TypeScript, React-Query and Tailwind CSS."
        url={routes.contact}
      />
      <div className="mx-auto flex h-full w-full max-w-screen-xl flex-col p-4 sm:p-5">
        <PageHeading
          title="¿Necesita ayuda? Póngase en contacto con nosotros"
          subtitle="Escriba aquí sus datos de contacto"
        />
        <div className="md:light:bg-light flex w-full flex-col overflow-hidden rounded-md px-4 py-5 sm:px-6 sm:py-8 md:p-10 md:shadow-card md:dark:bg-dark-200 md:dark:shadow-none lg:flex-row lg:p-0">
          <div className="shrink-0 border-light-300 dark:border-dark-300 lg:w-[400px] lg:py-10 ltr:lg:border-r ltr:lg:pr-[72px] ltr:lg:pl-10 rtl:lg:border-l rtl:lg:pl-[72px] rtl:lg:pr-10 lg:dark:bg-dark-250 xl:w-[430px] xl:py-12 ltr:xl:pr-24 rtl:xl:pl-24">
            <h2 className="pb-2 text-lg font-medium text-dark dark:text-light md:text-xl">
              {'Información de contacto'}
            </h2>
            <p className="font-medium leading-[1.8em]">
              {
                'Rellene el formulario y nuestro equipo se pondrá en contacto con usted en 24 horas.'
              }
            </p>
            <div className="grid-cols-2 gap-x-5 gap-y-8 space-y-7 pt-9 sm:grid sm:space-y-0 md:gap-y-9 lg:block lg:space-y-9">
              <ContactInfo
                icon={<PhoneIcon className="h-10 w-10" />}
                title={'Número de Contacto'}
                description={formatPhone}
                isWhatsAppLink={true}
              />
              <ContactInfo
                icon={<MailIcon className="h-10 w-10" />}
                title="Visitar el sitio web"
                description={
                  contactDetails?.website ??
                  'Añade la información de tu sitio web desde el panel de administración'
                }
                isWhatsAppLink={false}
              />
            </div>
          </div>
          <div className="w-full flex-grow pt-12 lg:p-10 xl:p-12">
            <Form<CreateContactUsInput>
              onSubmit={onSubmit}
              validationSchema={contactUsFormSchema}
              resetFields={reset}
            >
              {({ register, formState: { errors } }) => (
                <>
                  <fieldset className="mb-6 grid gap-5 sm:grid-cols-2">
                    <Input
                      label="Nombre"
                      {...register('name')}
                      error={errors.name?.message}
                    />
                    <Input
                      label="Correo Electrónico"
                      type="email"
                      {...register('email')}
                      error={errors.email?.message}
                    />
                    <Input
                      label="Asunto"
                      {...register('subject')}
                      error={errors.subject?.message}
                      className="sm:col-span-2"
                    />
                    <Textarea
                      label={'Descripción'}
                      {...register('description')}
                      error={errors.description?.message}
                      className="sm:col-span-2"
                    />
                  </fieldset>
                  <Button
                    type="submit"
                    className="mb-1 w-full flex-1 sm:flex-none md:w-auto"
                  >
                    {'Enviar'}
                  </Button>
                </>
              )}
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

ContactUsPage.getLayout = function getLayout(page) {
  return <GeneralLayout>{page}</GeneralLayout>;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, ['common'])),
    },
    revalidate: 60, // In seconds
  };
};

export default ContactUsPage;

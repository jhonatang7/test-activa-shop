import { ViewUserServices } from '@/types';
import Image from '@/components/ui/image';
import { motion } from 'framer-motion';
import placeholder from '@/assets/images/placeholders/netflix.jpg';
import { FiCalendar, FiUser, FiKey, FiDollarSign } from 'react-icons/fi';
import CredentialsModal from './credentialsModal';
import { useState } from 'react';

interface CardProps {
  viewService: ViewUserServices;
  handlerShowModal: (credentials: JSON) => void;
}

export default function Card({ viewService, handlerShowModal }: CardProps) {
  const openModalAction = () => {
    handlerShowModal(viewService.credentials);
  };
  const stringDate = new Date(viewService.dateExpired);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  const fullDate = stringDate.toLocaleDateString('default', options);

  const isValidImage = (imagePath: string) => {
    return (
      imagePath.includes('http://') ||
      imagePath.includes('https://') ||
      imagePath.startsWith('/')
    );
  };

  return (
    <motion.div
      className="border-ligth my-1 flex justify-around rounded border border-2 border-opacity-25 p-2 shadow"
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ opacity: 0.95, scale: 0.99 }}
      transition={{ ease: 'easeOut', duration: 0.1 }}
    >
      <div className="group relative flex aspect-[3/2] w-1/5 justify-center overflow-hidden">
        <Image
          alt={viewService.productName}
          layout="fill"
          quality={100}
          objectFit="cover"
          src={
            isValidImage(viewService.imagePath)
              ? viewService.imagePath
              : placeholder
          }
          className="rounded bg-light-500 dark:bg-dark-400"
        />
      </div>
      <div className="ml-3 flex flex-col justify-center space-y-1 text-sm text-gray-500 dark:text-gray-300">
        <span className="mb-1 text-lg font-semibold">
          {viewService.productName}
        </span>
        <div className="flex items-center">
          <FiCalendar className="mr-1" />
          <span>Fecha de Expiración: {fullDate}</span>
        </div>
        <div className="flex items-center">
          <FiUser className="mr-1" />
          <span>Proveedor: {viewService.providerFullName}</span>
        </div>
        <div className="flex items-center">
          <FiDollarSign className="mr-1" />
          <span>Total: {viewService.total}</span>
        </div>
      </div>
      <div className="flex flex-col self-center">
        <div className="flex items-center">
          <FiKey className="mr-1" />
          <span className="self-start">Credenciales: </span>
        </div>
        <button
          className="ml-3 rounded border border-green-700 py-2 px-4 font-bold"
          onClick={openModalAction}
        >
          Ver Credenciales
        </button>
      </div>
      {/* {showModal && (
                  <CredentialsModal
                    handlerHideModal={handlerHideModal}
                    credentials={viewService.credentials}
                  />
                )} */}
    </motion.div>
  );
}

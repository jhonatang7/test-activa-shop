import { ViewUserServices } from '@/types';
import Card from './card';
import { useState } from 'react';
import CredentialsModal from './credentialsModal';
import { useModalAction } from '../modal-views/context';

interface GridProps {
  viewServices: ViewUserServices[];
  isLoading?: boolean;
}

export default function Grid({ viewServices, isLoading }: GridProps) {
  const { openModal } = useModalAction();

  const [showModal, setShowModal] = useState(false);

  const handlerShowModal = (credentials: JSON) => {
    // setShowModal(true);
    openModal('VIEW_CREDENTIAL', credentials);
  };

  return (
    <div>
      <h1 className="col-span-6 flex items-center text-15px font-medium text-dark dark:text-light">
        Mi Lista De Compras
        <span className="ml-1 text-light-900">({viewServices.length})</span>
      </h1>
      <div className="flex flex-col">
        {viewServices.length
          ? viewServices.map((value, index) => (
              <>
                {console.log(index)}
                <Card
                  key={index}
                  viewService={value}
                  handlerShowModal={() => handlerShowModal(value.credentials)}
                />
                {/* {showModal && (
                  <CredentialsModal
                    handlerHideModal={handlerHideModal}
                    credentials={value.credentials}
                  />
                )} */}
              </>
            ))
          : null}
      </div>
    </div>
  );
}

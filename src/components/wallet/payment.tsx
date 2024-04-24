import { useModalAction, useModalState } from '../modal-views/context';
import Button from '../ui/button';

export default function Payment() {
  const { closeModal } = useModalAction();
  const { data } = useModalState();
  console.log(data);
  return (
    <div className="bg-light px-6 pt-10 pb-8 dark:bg-dark-300 sm:px-8 lg:p-12">
      <Button onClick={() => closeModal()}>Cerrar</Button>
    </div>
  );
}

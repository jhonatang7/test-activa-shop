import { motion } from 'framer-motion';
import Image from '@/components/ui/image';
import placeholder from '@/assets/images/placeholders/netflix.jpg';
import { Service } from '@/types';
import { useRouter } from 'next/router';

export default function Card({ service }: { service: Service }) {
  const { id, name, image } = service ?? {};
  console.log(service);
  const router = useRouter();
  const handlerRouter = (id: number) => {
    router.push(`/productsByService/?id=${id}`);
  };
  return (
    <motion.div
      title={name}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ opacity: 0.8, scale: 0.95 }}
      transition={{ ease: 'easeOut', duration: 0.1 }}
      onClick={() => handlerRouter(id)}
    >
      <div className="group relative flex aspect-[3/2] w-full justify-center overflow-hidden">
        <Image
          alt={name}
          layout="fill"
          quality={100}
          objectFit="cover"
          src={image ?? placeholder}
          className="bg-light-500 dark:bg-dark-400"
        />
      </div>
      <div className="flex items-start justify-between pt-3.5">
        <div className="-mt-[1px] flex flex-col truncate ltr:mr-auto ltr:pl-2.5 rtl:ml-auto rtl:pr-2.5 rtl:text-right">
          <h3
            title={name}
            className="mb-0.5 truncate font-medium text-dark-100 dark:text-light"
          >
            {name}
          </h3>
        </div>
      </div>
    </motion.div>
  );
}

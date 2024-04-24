import React from 'react';
import type { Claim } from '@/types';
import { motion } from 'framer-motion';
import StatusResponse from './statusResponse';

export default function Card({ claim }: { claim: Claim }) {
  const { title, socialReason, statusResponse, customer, causal, date } =
    claim ?? {};

  const stringDate = new Date(date);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  const fullDate = stringDate.toLocaleDateString('default', options);

  return (
    <motion.div
      className="rounded-lg bg-light-200 shadow-md hover:shadow-lg dark:bg-neutral-700"
      title={title}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ opacity: 0.8, scale: 0.95 }}
      transition={{ ease: 'easeOut', duration: 0.1 }}
    >
      <div className="mb-2 rounded-t-lg bg-neutral-50 p-3 dark:bg-neutral-400">
        <h3 className="text-xl font-semibold text-neutral-700">{title}</h3>
      </div>
      <div className="p-3">
        <p className="mb-1 text-lg font-semibold text-dark-200 dark:text-slate-100">
          <span>{causal.causeOfClose}</span>
        </p>
        <p className="mb-0 font-semibold text-dark-500 dark:text-neutral-300">
          <span>{socialReason}</span>
        </p>
        <a
          className="mb-4 font-semibold text-dark-500 dark:text-neutral-300"
          href="#"
        >
          <span>
            {customer.firstName} {customer.lastName}
          </span>
        </a>
        <div className="grid grid-cols-2 gap-4">
          <StatusResponse statusResponse={statusResponse} />
          <p className="mb-0 flex items-center justify-end font-semibold text-neutral-400">
            <span>{fullDate}</span>
          </p>
        </div>
      </div>
    </motion.div>
  );
}

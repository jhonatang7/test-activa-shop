import cn from 'classnames';
import { useTranslation } from 'next-i18next';

export default function Copyright({ className }: { className?: string }) {
  const currentYear = new Date().getFullYear();
  return (
    <div className={cn('tracking-[0.2px]', className)}>
      &copy; {'copy-right'} {currentYear} {'copy-right-by'}{' '}
      <a
        href="https://redq.io"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-brand-dark"
      >
        Avtica+
      </a>
      .
    </div>
  );
}

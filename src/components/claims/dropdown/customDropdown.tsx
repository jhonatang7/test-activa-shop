import { Purchase } from '@/types';
import React, { useEffect, useRef, useState } from 'react';

interface DropdownProps<T> {
  options: T[];
  placeholder: string;
  getStringFormated: (item: T) => string;
  getValuedSelected: (item: T) => void;
}

const CustomDropdown = <T extends {}>({
  options,
  placeholder,
  getStringFormated,
  getValuedSelected,
}: DropdownProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [valueStringSelected, setValueStringSelected] = useState('');
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionSelected = (value: T) => {
    setValueStringSelected(getStringFormated(value));
    getValuedSelected(value);
    toggleDropdown();
  };

  const handleClickOutside = (event: any) => {
    if (
      dropdownRef.current &&
      !(dropdownRef.current as any).contains(event.target)
    ) {
      if (isOpen) {
        toggleDropdown();
      }
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="flex h-10 w-full cursor-pointer items-center justify-start rounded-md border border-opacity-25 hover:border-opacity-75 dark:border-light dark:bg-dark-100 dark:text-light"
        onClick={toggleDropdown}
      >
        <div className="mx-1 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            className={`flex-auto ${
              isOpen ? 'rotate-90' : 'rotate 0'
            } transform transition-all duration-150 ease-in-out`}
          >
            <path
              fill="currentColor"
              d="M9 6h1.5l6 6l-6 6H9V6m4.67 6L11 9.33v5.34L13.67 12Z"
            />
          </svg>
          <span className="flex-auto">
            {!valueStringSelected ? placeholder : valueStringSelected}
          </span>
        </div>
        {
          <div
            className={`absolute z-40 ${
              options.length < 5
                ? `mt-[${options.length * 2.5 + 2.5}rem]`
                : 'mt-[15rem]'
            } ${
              options.length < 5 ? 'h-auto' : 'h-[12.5rem]'
            } w-full overflow-auto rounded bg-dark-400 ${
              isOpen
                ? 'pointer-events-auto scale-y-100'
                : 'pointer-events-none scale-y-0'
            } origin-top transform transition-all duration-150 ease-in-out`}
          >
            {options.map((value: T, index) => (
              <div
                className="duration-50 hover:bg-light-100-500 flex h-10 items-center border border-transparent bg-light-100 px-4 transition ease-out hover:-translate-y-px hover:scale-95 hover:rounded hover:border-light hover:border-opacity-25 focus:bg-dark-100 dark:bg-dark-600 dark:text-light-800 dark:hover:bg-dark-500 hover:dark:text-light dark:focus:bg-dark-600"
                key={index}
                onClick={() => handleOptionSelected(value)}
              >
                {getStringFormated(value)}
              </div>
            ))}
          </div>
        }
      </div>
    </div>
  );
};

export default CustomDropdown;

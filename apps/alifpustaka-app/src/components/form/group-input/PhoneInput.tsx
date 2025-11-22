'use client';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import React, { useEffect, useRef, useState } from 'react';

interface CountryCode {
  code: string;
  label: string;
}

/* interface FormData {
  fname: string;
  lname: string;
  phone: string;
  image: string;
  bio: string;
} */

interface PhoneInputProps {
  refresh?: boolean;
  phone?: string;
  countries: CountryCode[];
  placeholder?: string;
  onChange?: (phoneNumber: string) => void;
  selectPosition?: 'start' | 'end'; // New prop for dropdown position
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  refresh,
  phone = '(+62)00000000000',
  countries,
  placeholder = '000 0000 0000',
  onChange,
  selectPosition = 'start', // Default position is 'start'
}) => {
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [selected, setSelected] = useState('+62');
  const [dropdown, setDropdown] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { clickOutside: dropdownClick } = useOutsideClick(ref);

  /* const countryCodes: Record<string, string> = countries.reduce(
    (acc, { code, label }) => ({ ...acc, [code]: label }),
    {},
  ); */

  useEffect(() => {
    if (dropdownClick) {
      setDropdown(false);
    }
    console.log('dropdown: ', dropdownClick);
  }, [dropdownClick]);

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const newPhoneNumber = e.target.value;
    setPhoneNumber(newPhoneNumber);
    if (onChange) {
      onChange(`(${selected})${newPhoneNumber}`);
    }
  };

  const handleSelectionCode = (e: string) => {
    setSelected(e);
    if (onChange) {
      onChange(`(${e})${phoneNumber}`);
    }
    setDropdown(false);
  };

  const handleDropdown = (e: React.MouseEvent) => {
    e.preventDefault();
    setDropdown(!dropdown);
  };

  useEffect(() => {
    const match = phone.match(/^\(\+(\d{1,4})\)/);
    if (!match) setPhoneNumber('');

    if (match) {
      const rest = phone.slice(match[0].length);
      setPhoneNumber(rest);
    }

    console.log('refresh: ', refresh);
  }, [refresh]);

  useEffect(() => {
    console.log('phone: ', phoneNumber);
  }, [phoneNumber]);

  return (
    <div className="relative flex">
      {/* Dropdown position: Start */}
      {selectPosition === 'start' && (
        <div className="absolute" ref={ref}>
          <button
            onClick={(e) => handleDropdown(e)}
            className="focus:border-brand-300 focus:ring-brand-500/10 relative flex appearance-none flex-row gap-2 rounded-l-lg border-0 border-r border-gray-200 bg-transparent bg-none px-3.5 py-3 leading-tight text-gray-700 focus:ring-3 focus:outline-hidden dark:border-gray-800 dark:text-gray-400"
          >
            <p>{selected}</p>
            <div
              className={`pointer-events-none inset-y-0 right-3 flex items-center text-gray-700 transition-transform duration-300 ease-in-out dark:text-gray-400 ${dropdown ? 'rotate-180' : 'rotate-0'}`}
            >
              <svg
                className="stroke-current"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.79175 7.396L10.0001 12.6043L15.2084 7.396"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </button>

          <ul
            className={`no-scrollbar absolute z-10 mt-1 h-64 w-64 flex-col overflow-y-auto rounded-xl border border-amber-50/20 dark:bg-gray-900 ${dropdown ? 'flex' : 'hidden'}`}
          >
            {countries.map((country, i) => (
              <li
                key={i}
                className="flex cursor-pointer flex-row justify-between px-3 py-1 text-gray-700 dark:text-gray-400 hover:dark:bg-gray-700"
                onClick={() => handleSelectionCode(country.code)}
              >
                <div>{`${country.code}`}</div>
                <div>{`${country.label}`}</div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Input field */}
      <input
        type="number"
        value={phoneNumber}
        onChange={handlePhoneNumberChange}
        placeholder={placeholder}
        className={`dark:bg-dark-900 h-11 w-full appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${
          selectPosition === 'start' ? 'pl-[84px]' : 'pr-[84px]'
        } shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30`}
      />
    </div>
  );
};

export default PhoneInput;

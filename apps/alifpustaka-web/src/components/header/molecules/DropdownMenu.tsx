// components/molecules/DropdownMenu.jsx

import { useEffect, useState } from 'react';
import { DropdownItem } from '../atom/DropdownItem';

interface DropdownMenuType {
  dropDownSection: string;
  prevDropdown: string;
  setPrevDropdown: (e: string) => void;
  text: string;
  content: itemContentType[];
}

type itemContentType = {
  text: string;
  link: string;
  desc: string;
  icon: string;
};

export const DropdownMenu = ({
  dropDownSection,
  prevDropdown,
  text,
  content,
}: DropdownMenuType) => {
  const [mounted, setMounted] = useState(false);
  const [animate, setAnimate] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (dropDownSection === text) {
      setAnimate('z-10 animate-show-dropdown');
    } else if (dropDownSection !== text && prevDropdown === text) {
      setAnimate('z-0 animate-hide-dropdown');
    } else {
      setAnimate('hidden');
    }
  }, [dropDownSection]);

  if (!mounted) return null;

  return (
    <div
      className={`absolute left-1/2 mt-4 w-full max-w-7xl -translate-x-1/2 rounded-xl backdrop-blur-2xl ${animate}`}
    >
      <div
        className={`relative mx-auto hidden max-h-[80svh] flex-wrap gap-4 overflow-hidden rounded-xl p-4 lg:grid lg:grid-cols-3 xl:grid-cols-4`}
        style={{
          background: `radial-gradient(circle at 10% 50%, var(--color-info) -200%, transparent 50%), radial-gradient(circle at 90% 50%, var(--color-accent) -200%, transparent 55%)`,
        }}
      >
        {content.map((subMenu: itemContentType, i: number) => (
          <DropdownItem key={i} {...subMenu} />
        ))}
      </div>
    </div>
  );
};

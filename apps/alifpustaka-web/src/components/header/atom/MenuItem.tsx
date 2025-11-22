import { ChevronDown } from 'lucide-react';
import Link from 'next/link';

interface MenuItemType {
  text: string;
  link?: string;
  dropDownSection?: string;
  subMenu: boolean;
  onClick?: (e: string) => void;
}
// components/atoms/MenuItem.jsx
export const MenuItem = ({ text, link, dropDownSection, subMenu, onClick }: MenuItemType) => {
  if (subMenu && onClick) {
    return (
      <div
        className="flex cursor-pointer gap-1 font-bold"
        onClick={() => onClick(dropDownSection == text ? '' : text)}
      >
        <p>{text}</p>
        <ChevronDown
          className={`transform transition-transform duration-500 ease-in-out ${dropDownSection === text ? 'rotate-180' : 'rotate-0'}`}
        />
      </div>
    );
  } else {
    return (
      <Link className="flex cursor-pointer gap-1 font-bold" href={link ? link : '#'}>
        {text}
      </Link>
    );
  }
};

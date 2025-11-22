import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface DropDownItemType {
  text: string;
  link: string;
  desc: string;
  icon: string;
}

export const DropdownItem = ({ text, link, desc, icon }: DropDownItemType) => {
  const [hoverAction, setHoverAction] = useState(false);
  return (
    <Link
      className="z-10 flex min-h-24 w-full flex-row items-center gap-4 overflow-hidden rounded-lg px-3 py-2 text-base-content hover:bg-base-300/30"
      href={link}
      onMouseEnter={() => setHoverAction(true)}
      onTouchStart={() => setHoverAction(true)}
      onMouseLeave={() => setHoverAction(false)}
      onTouchEnd={() => setHoverAction(false)}
    >
      {/* <Icons icon="vertical-flower-pattern" className="fill-pattern h-14 w-14 basis-1/4" /> */}
      <Image src={icon} width={40} height={40} alt={text} className="rounded-lg" />
      <div className="flex w-fit flex-col">
        <p
          className={`items-center font-semibold transition-transform duration-500 ease-in-out ${hoverAction ? 'text-lg' : 'text-xl'}`}
        >
          {text}
        </p>
        <p
          className={`text-xs transition-normal duration-500 ease-in-out ${hoverAction ? 'max-h-20 translate-y-0 opacity-100' : 'max-h-0 translate-y-2 opacity-0'}`}
        >
          {desc}
        </p>
      </div>
    </Link>
  );
};

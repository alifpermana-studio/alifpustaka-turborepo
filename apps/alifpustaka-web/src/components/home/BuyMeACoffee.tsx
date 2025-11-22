'use client';

import Image from 'next/image';

interface bmacType {
  inView: boolean;
}

export const BuyMeACoffee = ({ inView }: bmacType) => {
  return (
    <div
      className="flex w-full flex-col items-center justify-center gap-8 rounded-xl p-8 md:flex-row md:justify-between"
      style={{
        background: `radial-gradient(circle at 10% 10%, var(--color-info) -200%, transparent 98%), radial-gradient(circle at 90% 90%, var(--color-accent) -200%, transparent 88%)`,
      }}
    >
      <div className={`flex w-full flex-col`}>
        <h1
          className={`text-center text-3xl font-semibold transition-opacity duration-500 ease-in-out md:text-left ${inView ? 'opacity-100' : 'opacity-0'}`}
        >
          Are you satisfied with our content and product?
        </h1>
      </div>
      <div className="flex w-fit items-center justify-center md:justify-end">
        <div className="scale-100 cursor-pointer transition-all duration-500 ease-in-out hover:scale-105 active:scale-110">
          <Image width={356.2} height={100} src="/assets/home/bmc-button-yallow.svg" alt="image" />
        </div>
      </div>
    </div>
  );
};

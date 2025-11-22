import Icons from '@/assets/Icons';
import { useTheme } from '@/contexts/ThemeContext';
import { ChevronRight, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';

export const Hero = () => {
  const [onHover, setOnHover] = useState('');
  const [onClick, setOnClick] = useState('');
  const { theme } = useTheme();
  return (
    <div
      className="relative mx-auto flex w-full max-w-7xl flex-row flex-wrap justify-between overflow-hidden rounded-2xl p-4 shadow-lg"
      style={{
        background: `radial-gradient(circle at 10% 90%, var(--color-base-300) -200%, transparent 50%), radial-gradient(circle at 70% 120%, var(--color-info) -200%, transparent 65%), radial-gradient(circle at 90% -10%, var(--color-accent) -200%, transparent 55%)`,
      }}
    >
      <div className="z-10 flex basis-full flex-col items-center justify-center gap-7 p-4 text-center lg:basis-1/2 lg:items-start lg:text-left">
        <h1 className="text-4xl font-bold">Code That Connects Worlds</h1>
        <p className="relative text-lg">
          I build full-stack web applications that seamlessly connect people, systems, and smart
          devices with clarity, purpose, and precision.
        </p>
        <div className="flex w-full flex-col items-center justify-center gap-4 lg:flex-row lg:justify-start">
          <button
            className="relative flex h-full cursor-pointer flex-row items-center gap-3 overflow-hidden rounded-lg bg-black px-4 py-2 text-white"
            onMouseEnter={() => setOnHover('github')}
            onMouseLeave={() => setOnHover('')}
            onMouseDown={() => setOnClick('github')}
            onMouseUp={() => setOnClick('')}
          >
            <Icons icon="github-icon" className="h-6 w-6 text-white" />
            <p>alifpermana-studio</p>
            <div
              className={`absolute top-0 left-0 h-full w-full bg-black/80 transition-all duration-300 ease-in-out ${onHover === 'github' || onClick === 'github' ? 'scale-100 opacity-100' : 'scale-125 opacity-0'}`}
            >
              <ExternalLink className="absolute inset-0 m-auto text-white" />
            </div>
          </button>
          <button
            className="flex w-fit cursor-pointer items-center justify-center gap-2 rounded-lg bg-neutral px-4 py-2 text-xl text-neutral-content hover:bg-neutral/90 active:bg-neutral/80"
            onMouseEnter={() => setOnHover('explore')}
            onMouseLeave={() => setOnHover('')}
            onMouseDown={() => setOnClick('explore')}
            onMouseUp={() => setOnClick('')}
          >
            <p className="">Explore now</p>
            <ChevronRight
              className={`h-7 w-auto transition-all duration-500 ease-in-out ${onHover === 'explore' ? (onClick === 'explore' ? 'pl-4' : 'pl-2') : 'pl-0'}`}
            />
          </button>
        </div>

        <div className="flex flex-col items-center justify-center gap-2 lg:flex-row lg:flex-wrap">
          <p>#web-developer</p>
          <p>#iotsolution</p>
          <p>#automationsystem</p>
        </div>
      </div>
      <div className="z-10 flex basis-full flex-col items-center justify-center p-4 lg:basis-1/2">
        <Image
          src={`/icon-3d/${theme === 'dark' ? 'dark-hero-theme' : 'light-hero-theme'}.png`}
          width={500}
          height={500}
          className="h-auto w-full lg:w-full"
          priority
          alt="web-development"
        />
      </div>
    </div>
  );
};

import Image from 'next/image';
import React, { useCallback, useEffect, useRef } from 'react';

import { Cpu, FileText, Globe, PackageCheck, Palette, RadioTower, ServerCog } from 'lucide-react';

import { throttle } from 'lodash';
import { useScrollTracker } from '@/contexts/ScrollRectContext';
import AnimatedCounter from '@/components/other/AnimatedCounter';

interface InViewType {
  inView: boolean;
}

export const Stats = ({ inView }: InViewType) => {
  const myStats = [
    { title: 'Web Page Templates', count: 12, Icon: Palette },
    { title: 'Blog Posts', count: 24, Icon: FileText },
    { title: 'SaaS Projects', count: 2, Icon: ServerCog },
    { title: 'Website Projects', count: 15, Icon: Globe },
    { title: 'Licensed Packages', count: 6, Icon: PackageCheck },
    { title: 'IoT Architectures', count: 1, Icon: RadioTower },
    { title: 'Automation Systems', count: 3, Icon: Cpu },
  ];

  const targetRef = useRef<HTMLDivElement | null>(null);

  const { setElementRect, getPercentage, scrollTop } = useScrollTracker();

  const percentage = getPercentage('stats');

  const updateRects = useCallback(() => {
    const rect = targetRef.current?.getBoundingClientRect();
    if (rect) {
      setElementRect('stats', rect);
    }
  }, [setElementRect]);

  useEffect(() => {
    /* const updateRect = () => {
      if (targetRef.current) {
        const rect = targetRef.current.getBoundingClientRect();
        setElementRect('stats', rect);
      }
    }; */

    const throttled = throttle(updateRects, 100);

    throttled(); // Initial

    // Update whenever container scrolls → containerRect changes
    // containerRect is a new object on each scroll update (if you manage it correctly)
  }, [scrollTop]);

  return (
    <div className="home-stats-container">
      <div className="home-stats-left-section">
        <h1 ref={targetRef} className="text-4xl font-bold">
          <span
            className={`${percentage >= 30 ? 'text-accent-test' : 'text-text-light/20 dark:text-text-dark/20'}`}
          >
            Career{' '}
          </span>
          <span
            className={`${percentage >= 60 ? 'text-accent-test' : 'text-text-light/20 dark:text-text-dark/20'}`}
          >
            Journey{' '}
          </span>
          <span
            className={`${percentage >= 90 ? 'text-accent-test' : 'text-text-light/20 dark:text-text-dark/20'}`}
          >
            in Numbers
          </span>
        </h1>
        <p>
          Over the years, I’ve built a variety of solutions, each requiring time, care, and
          resources. These stats reflect not just what I’ve done — but how much I’ve grown and the
          trust clients have placed in me.
        </p>

        <Image
          src="/icon-3d/achievement-stats.png"
          width={400}
          height={200}
          alt="achievement-stat"
          className="mx-auto hidden h-auto w-full"
        />
      </div>
      <div className="home-stats-right-section">
        <div className="absolute h-full w-full">
          <Image
            src="/icon-3d/arrow-on-point.png"
            alt="stats-front"
            width={180}
            height={188}
            className="absolute z-30 h-auto w-28"
          />
          <Image
            src="/icon-3d/bulp-yellow.png"
            alt="stats-front"
            width={180}
            height={188}
            className="absolute right-0 z-10 h-auto w-28"
          />
          <Image
            src="/icon-3d/check-list.png"
            alt="stats-front"
            width={100}
            height={100}
            className="absolute right-0 bottom-0 z-30 h-auto w-28"
          />
          <Image
            src="/icon-3d/trophy-gold.png"
            alt="stats-front"
            width={100}
            height={100}
            className="absolute bottom-0 h-auto w-28"
          />
          <div className="relative flex h-full items-center justify-center">
            <Image
              src="/icon-3d/twisted-arrow.png"
              alt="stats-front"
              width={550}
              height={275}
              className="h-auto w-full opacity-90"
            />
          </div>
        </div>
        <div className="w-full p-10 lg:p-16">
          <div className="gradient-background-stats relative z-20 grid h-full w-full grid-cols-1 gap-10 overflow-hidden rounded-lg bg-primary-dark/30 p-8 text-center backdrop-blur-md md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {myStats.map((stat, i) => {
              const { title, count, Icon } = stat;
              return (
                <div className="flex flex-col items-center justify-start gap-3" key={i}>
                  <div className="flex flex-row items-center justify-center gap-6">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center">
                      <Icon className="h-full w-full text-white" strokeWidth={1.5} />
                    </div>
                    <AnimatedCounter className="text-5xl" from={0} to={count} inView={inView} />
                  </div>
                  <div className="text-xl">{title}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

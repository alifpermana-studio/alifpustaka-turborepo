import React, { useEffect, useState } from 'react';

import { AtomicElement } from './features/AtomicElement';
import { useScrollTracker } from '@/contexts/ScrollRectContext';
import FadeGroup from './features/FadeGroup';

interface DOMRectLike {
  top: number;
  height: number;
  width: number;
  x: number;
  y: number;
  left: number;
  right: number;
  bottom: number;
}

interface InViewType {
  inView: boolean;
}

export const Introduction = ({ inView }: InViewType) => {
  const { elementRects, getPercentage, scrollTop } = useScrollTracker();
  const [elementTarget, setElementTarget] = useState<DOMRectLike | null>(null);
  const [threshold, setThreshold] = useState<number>(100);
  const percentage2 = getPercentage('introduction');

  useEffect(() => {
    if (!elementTarget) {
      setElementTarget(elementRects['payment-preview']);
    }

    if (elementTarget && percentage2 >= 90) {
      const thisEl = elementRects['payment-preview'];

      const nominator = thisEl.top + 1;
      const denominator = elementTarget.top + 1;

      setThreshold(Math.round((nominator / denominator) * 100));
    }
  }, [scrollTop]);

  useEffect(() => {
    console.log('threshold: ', threshold);
  }, [threshold]);

  return (
    <div className="glow-background relative grid h-full grid-cols-1 items-center justify-center gap-4 rounded-xl p-4 text-base-content md:grid-cols-[1fr_2fr]">
      <AtomicElement />
      <TitleAndDesc threshold={threshold} inView={inView} />
    </div>
  );
};

interface TitleAndDescType {
  threshold: number;
  inView: boolean;
}

const TitleAndDesc = ({ threshold, inView }: TitleAndDescType) => {
  /*  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLSpanElement | null)[]>([]); */

  /* useEffect(() => {
    if (!containerRef.current) return;

    const timeout = setTimeout(() => {
      const totalHeight = itemRefs.current.reduce((sum, el) => {
        if (el && el.classList.contains('fade-in')) {
          console.log('offsetHeight: ', el.offsetHeight);
          return sum + el.offsetHeight;
        }
        return sum;
      }, 0);
    }, 100);

    return () => clearTimeout(timeout);
  }, [threshold]); */

  return (
    <div className={`relative order-1 flex flex-col gap-6 p-4 md:order-2`}>
      <h1
        className={`text-3xl font-bold text-accent transition-opacity delay-500 duration-700 ease-in-out ${inView ? 'opacity-100' : 'opacity-0'}`}
      >
        Robust Infrastructure, Seamless Experience
      </h1>
      <FadeGroup threshold={threshold} />

      <button
        className={`w-fit cursor-pointer rounded-lg bg-neutral px-4 py-1 text-xl font-bold text-neutral-content transition-opacity delay-[1500ms] duration-700 ease-in-out hover:rounded-full ${inView ? 'opacity-100' : 'opacity-0'}`}
      >
        Go to Tech Tree
      </button>
    </div>
  );
};

'use client';

import { KeyframeOptions, animate, useIsomorphicLayoutEffect } from 'framer-motion';
import { useRef } from 'react';

type AnimatedCounterProps = {
  className: string;
  from: number;
  to: number;
  inView: boolean;
  animationOptions?: KeyframeOptions;
};

const AnimatedCounter = ({
  className,
  from,
  to,
  inView,
  animationOptions,
}: AnimatedCounterProps) => {
  const ref = useRef<HTMLSpanElement>(null);

  useIsomorphicLayoutEffect(() => {
    const element = ref.current;

    if (!element) return;
    if (!inView) return;

    // Set initial value
    element.textContent = String(from);

    // If reduced motion is enabled in system's preferences
    if (window.matchMedia('(prefers-reduced-motion)').matches) {
      element.textContent = String(to);
      return;
    }

    const controls = animate(from, to, {
      duration: 4,
      ease: 'easeInOut',
      ...animationOptions,
      onUpdate(value) {
        element.textContent = value.toFixed(0);
      },
    });

    // Cancel on unmount
    return () => {
      controls.stop();
    };
  }, [ref, inView, from, to]);

  return <span ref={ref} className={className} />;
};

export default AnimatedCounter;

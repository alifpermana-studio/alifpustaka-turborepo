import { motion } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';

interface AtomicProps {
  size: { width: number; height: number };
}

export const AtomicElement = () => {
  const atomicRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const container = atomicRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setSize({ width, height });
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={atomicRef}
      className="relative order-2 mx-auto aspect-square w-full max-w-xl md:order-1"
    >
      <Nucleus size={size} />
      <InnerOrbit size={size} />
      <OuterOrbit size={size} />
    </div>
  );
};

const Nucleus = ({ size }: AtomicProps) => {
  const centerSize = size.width * 0.25; // 25% of parent width
  const offset = centerSize / 2;

  return (
    <div className="absolute inset-0">
      <div
        className="absolute rounded-full"
        style={{
          top: `calc(50% - ${offset}px)`,
          left: `calc(50% - ${offset}px)`,
          width: `${centerSize}px`,
          height: `${centerSize}px`,
        }}
      >
        <Image
          src="/assets/home/ferriswheel/alifpustaka.svg"
          alt="ap-icon"
          fill
          className="rounded-full object-contain"
        />
      </div>
    </div>
  );
};

const InnerOrbit = ({ size }: AtomicProps) => {
  const numberOfIcons = 4;
  const radius = size.width * 0.25;
  const icons = [
    '/assets/home/ferriswheel/gcp.svg',
    '/assets/home/ferriswheel/firebase.svg',
    '/assets/home/ferriswheel/mongodb.svg',
    '/assets/home/ferriswheel/nodejs.svg',
  ];

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
      className="absolute inset-0"
      style={{ transformOrigin: 'center center' }}
    >
      <div className="absolute inset-[25%] rounded-full border-2 border-dashed border-blue-400 dark:border-white" />

      {icons.map((src, i) => {
        const angleDeg = (360 / numberOfIcons) * i;

        return (
          <motion.div
            key={i}
            className="absolute top-[44%] left-[44%] flex h-[12%] w-[12%] items-center justify-center"
            style={{
              transform: `rotate(${angleDeg}deg) translateY(-${radius}px)`,
              transformOrigin: 'center center',
            }}
          >
            <motion.div
              className="relative h-full w-full"
              animate={{ rotate: -360 }}
              transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
            >
              <Image
                src={src}
                alt="icon"
                fill
                className="rounded-full object-contain shadow-lg/40"
                style={{
                  transform: `rotate(${-angleDeg}deg)`,
                  transformOrigin: 'center center',
                }}
              />
            </motion.div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

const OuterOrbit = ({ size }: AtomicProps) => {
  const numberOfIcons = 6;
  const radius = size.width * 0.4375;

  const icons = [
    '/assets/home/ferriswheel/nextjs.svg',
    '/assets/home/ferriswheel/framer.svg',
    '/assets/home/ferriswheel/react.svg',
    '/assets/home/ferriswheel/tailwind.svg',
    '/assets/home/ferriswheel/prisma.svg',
    '/assets/home/ferriswheel/socketio.svg',
  ];

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
      className="absolute inset-0"
      style={{ transformOrigin: 'center center' }}
    >
      <div className="absolute inset-[6.25%] rounded-full border-2 border-dashed border-blue-400 dark:border-white" />

      {icons.map((src, i) => {
        const angleDeg = (360 / numberOfIcons) * i;

        return (
          <motion.div
            key={i}
            className="absolute top-[44%] left-[44%] flex h-[12%] w-[12%] items-center justify-center"
            style={{
              transform: `rotate(${angleDeg}deg) translateY(-${radius}px)`,
              transformOrigin: 'center center',
            }}
          >
            <motion.div
              className="relative h-full w-full"
              animate={{ rotate: -360 }}
              transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
            >
              <Image
                src={src}
                alt="icon"
                fill
                className="rounded-full object-contain shadow-lg/40"
                style={{
                  transform: `rotate(${-angleDeg}deg)`,
                  transformOrigin: 'center center',
                }}
              />
            </motion.div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

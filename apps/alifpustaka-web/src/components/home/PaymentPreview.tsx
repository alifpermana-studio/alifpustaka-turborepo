'use client';

import { motion, Variants } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Icons from '@/assets/Icons';

interface InViewType {
  inView: boolean;
}

export const PaymentPreview = ({ inView }: InViewType) => {
  return (
    <div
      className={`relative grid grid-cols-1 gap-4 rounded-xl p-8 text-base-content md:grid-cols-2 ${inView ? 'opacity-100' : 'opacity-0'}`}
      style={{
        background: `radial-gradient(circle at 50% 50%, var(--color-info) -200%, transparent 28%)`,
      }}
    >
      <LeftSide />
      <RightSide />
    </div>
  );
};

const LeftSide = () => {
  return (
    <div className="order-2 flex flex-col justify-start gap-4 md:order-1 lg:justify-center">
      <h1 className="inline-block text-3xl font-bold text-accent">
        Secure & Verified Payments
        <span className="ml-4 inline-block align-middle">
          <Icons icon="verified-badge" className="h-8 w-8 fill-neutral" />
        </span>
      </h1>
      <p className="text-xl">
        We take your security seriously. Our website supports
        <span className="font-bold"> only trusted and verified payment methods </span>, ensuring
        that your transactions are safe and protected at every step.
      </p>
    </div>
  );
};

const RightSide = () => {
  const images1 = [
    '/assets/home/paymenticon/webmoney.svg',
    '/assets/home/paymenticon/amazonpay.svg',
    '/assets/home/paymenticon/bitcoin.svg',
    '/assets/home/paymenticon/gopay.svg',
    '/assets/home/paymenticon/googlepay.svg',
  ];

  const images2 = [
    '/assets/home/paymenticon/etherium.svg',
    '/assets/home/paymenticon/paypal.svg',
    '/assets/home/paymenticon/shopeepay.svg',
    '/assets/home/paymenticon/maestro.svg',
    '/assets/home/paymenticon/qris.svg',
  ];

  const images3 = [
    '/assets/home/paymenticon/alipay.svg',
    '/assets/home/paymenticon/lightcoin.svg',
    '/assets/home/paymenticon/mastercard.svg',
    '/assets/home/paymenticon/etherium.svg',
    '/assets/home/paymenticon/paypal.svg',
  ];

  const images4 = [
    '/assets/home/paymenticon/qris.svg',
    '/assets/home/paymenticon/stripe.svg',
    '/assets/home/paymenticon/visa.svg',
    '/assets/home/paymenticon/webmoney.svg',
    '/assets/home/paymenticon/gopay.svg',
  ];

  const [scrollHeight, setScrollHeight] = useState(0);
  const refImages1 = useRef<HTMLDivElement | null>(null);
  const refContainer = useRef<HTMLDivElement | null>(null);

  const updateHeight = () => {
    if (refImages1.current) {
      setScrollHeight(refImages1.current.scrollHeight);
    }
  };

  useEffect(() => {
    const contentEl = refImages1.current;

    if (!contentEl) return;

    const observer = new ResizeObserver(updateHeight);
    observer.observe(contentEl);

    // Fallback: force recalc after short delay (browser paint)
    /* const timeout = setTimeout(updateHeight, 20000); */

    return () => {
      observer.disconnect();
      /* clearTimeout(timeout); */
    };
  }, []);

  const marqueeVariants = (duration: number) => {
    const variants: Variants = {
      animate: {
        // Animate from 0 to -elementScrollHeight to scroll all content once
        y: ['0px', `-${scrollHeight / 2}px`],
        transition: {
          y: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: duration,
            ease: 'easeInOut',
          },
        },
      },
    };

    return variants;
  };

  return (
    <div className="order-1 flex w-full flex-col justify-center gap-4 overflow-hidden md:order-2">
      <div
        ref={refContainer}
        className="relative flex h-[30vh] w-full flex-row justify-start gap-3 overflow-hidden [mask-image:_linear-gradient(to_top,transparent_0,_black_128px,_black_calc(100%-200px),transparent_100%)] sm:h-[300px] sm:justify-center md:h-[400px] md:justify-end"
      >
        <motion.div
          ref={refImages1}
          className="relative left-0 flex w-1/4 flex-col"
          variants={marqueeVariants(30)}
          animate="animate"
        >
          {[...images1, ...images1].map((image, i) => (
            <Image
              src={image}
              alt={image}
              width={100}
              height={100}
              className="h-[100px] w-full py-2"
              key={i}
              onLoad={updateHeight}
            />
          ))}
        </motion.div>
        <motion.div
          className="relative left-0 flex w-1/4 flex-col"
          variants={marqueeVariants(35)}
          animate="animate"
        >
          {[...images2, ...images2].map((image, i) => (
            <Image
              src={image}
              alt={image}
              width={100}
              height={100}
              className="h-[100px] w-full py-2"
              key={i}
            />
          ))}
        </motion.div>
        <motion.div
          className="relative left-0 flex w-1/4 flex-col"
          variants={marqueeVariants(30)}
          animate="animate"
        >
          {[...images3, ...images3].map((image, i) => (
            <Image
              src={image}
              alt={image}
              width={100}
              height={100}
              className="h-[100px] w-full py-2"
              key={i}
            />
          ))}
        </motion.div>
        <motion.div
          className="relative left-0 flex w-1/4 flex-col"
          variants={marqueeVariants(40)}
          animate="animate"
        >
          {[...images4, ...images4].map((image, i) => (
            <Image
              src={image}
              alt={image}
              width={100}
              height={100}
              className="h-[100px] w-full py-2"
              key={i}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

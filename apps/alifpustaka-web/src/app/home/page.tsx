// pages/HomePage.jsx

'use client';

import React, { lazy, Suspense, useEffect, useRef } from 'react';
import { DefaultLayoutTemplate } from '../../templates/DefaultLayoutTemplate'; // Assuming path
import { navData } from '@/data/navigation';

import { motion, useInView } from 'framer-motion';
import { useScrollTracker } from '@/contexts/ScrollRectContext';
import { Hero } from '@/components/home/Hero';

const StatsFeature = lazy(() =>
  import('@/components/home/Stats').then(({ Stats }) => ({
    default: Stats,
  }))
);

const Introduction = lazy(() =>
  import('@/components/home/Introduction').then(({ Introduction }) => ({
    default: Introduction,
  }))
);

const BuyMeACoffee = lazy(() =>
  import('@/components/home/BuyMeACoffee').then(({ BuyMeACoffee }) => ({
    default: BuyMeACoffee,
  }))
);

const PaymentPreview = lazy(() =>
  import('@/components/home/PaymentPreview').then(({ PaymentPreview }) => ({
    default: PaymentPreview,
  }))
);

const HomePage = () => {
  const refStats = useRef<HTMLDivElement | null>(null);
  const refIntroduction = useRef<HTMLDivElement | null>(null);
  const refPaymentPreview = useRef<HTMLDivElement | null>(null);
  const refBuyMeACoffee = useRef<HTMLDivElement | null>(null);

  const { setElementRect, scrollTop } = useScrollTracker();

  const inViewStats = useInView(refStats, {
    margin: '10px',
    amount: 0.1,
    once: true,
  });

  const inViewIntroduction = useInView(refIntroduction, {
    margin: '10px',
    amount: 0.1,
    once: true,
  });

  const inViewPaymentPreview = useInView(refPaymentPreview, {
    margin: '10px',
    amount: 0.1,
    once: true,
  });

  const inViewBuyMeACoffee = useInView(refBuyMeACoffee, {
    margin: '10px',
    amount: 0.1,
    once: true,
  });

  useEffect(() => {
    if (refStats.current) {
      const rectStats = refStats.current.getBoundingClientRect();
      setElementRect('stats', rectStats);
    }

    if (refBuyMeACoffee.current) {
      const rectBuyMeACoffee = refBuyMeACoffee.current.getBoundingClientRect();
      setElementRect('buymeacoffee', rectBuyMeACoffee);
    }

    if (refPaymentPreview.current) {
      const rectPaymentPreview = refPaymentPreview.current.getBoundingClientRect();
      setElementRect('payment-preview', rectPaymentPreview);
    }

    if (refIntroduction.current) {
      const rectIntro = refIntroduction.current.getBoundingClientRect();
      setElementRect('introduction', rectIntro);
    }
  }, [scrollTop]);

  return (
    <DefaultLayoutTemplate navItems={navData}>
      <Hero />

      <div className="relative min-h-[1000px]">
        <div className="sticky top-16 mx-auto mt-6 max-w-7xl">
          <motion.div
            ref={refStats}
            initial={{ opacity: 0, x: 10 }}
            animate={inViewStats ? { opacity: 1, x: 0 } : { opacity: 0, x: 10 }}
            transition={{ duration: 1 }}
          >
            <Suspense fallback={<div>Loading...</div>}>
              <StatsFeature inView={inViewStats} />
            </Suspense>
          </motion.div>
        </div>
      </div>
      <div className="relative min-h-[3000px]">
        <div className="sticky top-14 mx-auto mt-6 max-w-7xl">
          <motion.div
            ref={refIntroduction}
            initial={{ opacity: 0, x: -10 }}
            animate={inViewIntroduction ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
            transition={{ duration: 1 }}
          >
            <Suspense fallback={<div>Loading...</div>}>
              <Introduction inView={inViewIntroduction} />
            </Suspense>
          </motion.div>
        </div>
      </div>

      <div className="relative min-h-[900px]">
        <div className="sticky top-16 mx-auto mt-6 max-w-7xl">
          <motion.div
            ref={refPaymentPreview}
            initial={{ opacity: 0, x: 10 }}
            animate={inViewPaymentPreview ? { opacity: 1, x: 0 } : { opacity: 0, x: 10 }}
            transition={{ duration: 1 }}
          >
            <Suspense fallback={<div>Loading...</div>}>
              <PaymentPreview inView={inViewPaymentPreview} />
            </Suspense>
          </motion.div>
        </div>
      </div>

      <div className="relative mx-auto mt-6 max-w-7xl">
        <motion.div
          ref={refBuyMeACoffee}
          initial={{ opacity: 0, x: -10 }}
          animate={inViewBuyMeACoffee ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
          transition={{ duration: 1 }}
        >
          <Suspense fallback={<div>Loading...</div>}>
            <BuyMeACoffee inView={inViewBuyMeACoffee} />
          </Suspense>
        </motion.div>
      </div>
    </DefaultLayoutTemplate>
  );
};

export default HomePage;

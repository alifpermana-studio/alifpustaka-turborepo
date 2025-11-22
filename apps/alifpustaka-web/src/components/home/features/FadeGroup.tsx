'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { FadeItem } from './FadeItem';
import clsx from 'clsx';

interface ArrNumType {
  threshold: number;
}

export default function FadeGroup({ threshold }: ArrNumType) {
  const thresholds = [80, 70, 60, 50, 40];

  return (
    <div className="h-auto">
      <AnimatePresence initial={false}>
        {thresholds.map((t, i) =>
          threshold <= t ? (
            <motion.span
              key={i}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.4, duration: 0.4, ease: 'easeInOut' }}
              className={clsx('overflow-hidden')}
            >
              <FadeItem index={i} />
            </motion.span>
          ) : null
        )}
      </AnimatePresence>
    </div>
  );
}

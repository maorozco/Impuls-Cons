'use client';

import { useRef } from 'react';
import { motion, useInView, type HTMLMotionProps } from 'framer-motion';

/**
 * Reveal — scroll-triggered fade+slide-up wrapper.
 *
 * Usage:
 *   <Reveal>
 *     <h2>Heading that fades in when visible</h2>
 *   </Reveal>
 *
 *   <Reveal delay={0.15}>...</Reveal>   // stagger for grids
 *
 * Respects `prefers-reduced-motion` automatically via framer-motion.
 * Animation runs once per element (no re-trigger on scroll-up).
 */

type RevealProps = HTMLMotionProps<'div'> & {
  delay?: number;
  /** y-offset in px before reveal — default 24 */
  offset?: number;
  /** trigger threshold 0..1 — default 0.25 */
  amount?: number;
};

export function Reveal({
  children,
  delay = 0,
  offset = 24,
  amount = 0.25,
  ...rest
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: offset }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

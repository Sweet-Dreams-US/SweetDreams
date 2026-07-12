'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from '@/app/software/software.module.css';
import { PNODES, PIPE_D } from '@/app/software/data';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

/**
 * The self-drawing AI pipeline: a line that draws itself as you scroll while
 * each module node lights up in sequence. Reduced motion renders it fully
 * drawn with every node lit. Self-contained (own root + gsap.context).
 */
export default function AiPipeline() {
  const root = useRef<HTMLDivElement>(null);
  const pipePath = useRef<SVGPathElement>(null);

  useEffect(() => {
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      const nodeEls = gsap.utils.toArray<SVGGElement>('[data-pnode]');
      const path = pipePath.current;
      if (!path || !nodeEls.length) return;

      if (reduce) {
        path.style.strokeDasharray = 'none';
        path.style.strokeDashoffset = '0';
        nodeEls.forEach((el) => el.classList.add(styles.pnodeOn));
        return;
      }

      const total = path.getTotalLength();

      // Fraction of total length at which each node sits.
      const fracs = nodeEls.map((el) => {
        const cx = Number(el.dataset.cx);
        const cy = Number(el.dataset.cy);
        let best = Infinity;
        let bestLen = 0;
        const samples = 500;
        for (let s = 0; s <= samples; s++) {
          const l = (total * s) / samples;
          const pt = path.getPointAtLength(l);
          const d = (pt.x - cx) ** 2 + (pt.y - cy) ** 2;
          if (d < best) {
            best = d;
            bestLen = l;
          }
        }
        return bestLen / total;
      });

      path.style.strokeDasharray = `${total}`;
      path.style.strokeDashoffset = `${total}`;

      gsap.to(path, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: '[data-pipe]',
          start: 'top 74%',
          end: 'bottom 62%',
          scrub: 0.6,
          onUpdate: (self) => {
            const p = self.progress;
            nodeEls.forEach((el, i) => {
              el.classList.toggle(styles.pnodeOn, p >= fracs[i] - 0.02);
            });
          },
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div className={styles.pipeWrap} data-pipe ref={root}>
      <svg
        className={styles.pipe}
        viewBox="0 0 1000 320"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="AI pipeline connecting the modules that run your business"
      >
        <path className={styles.pipeTrack} d={PIPE_D} />
        <path ref={pipePath} className={styles.pipeDraw} d={PIPE_D} />

        {PNODES.map((n) => (
          <g
            key={n.label}
            className={n.hub ? styles.pnodeHub : undefined}
            data-pnode
            data-cx={n.cx}
            data-cy={n.cy}
          >
            <circle className={styles.pnodeRing} cx={n.cx} cy={n.cy} r={n.hub ? 22 : 14} />
            <circle className={styles.pnodeCore} cx={n.cx} cy={n.cy} r={n.hub ? 8 : 5} />
            <text
              className={n.hub ? styles.pnodeLabelHub : styles.pnodeLabel}
              x={n.cx}
              y={n.labelY}
              textAnchor="middle"
            >
              {n.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

import { useEffect, useRef } from 'react';

/**
 * Animated layered-wave background, ported from the original index.html canvas.
 * Renders the fixed #bg-canvas element (styled in global.css) and runs a
 * requestAnimationFrame loop. Honors prefers-reduced-motion by drawing a single
 * static frame instead of animating.
 */

type Wave = {
  y: number; amp: number; freq: number; spd: number; off: number; col: string; a: number;
};

const WAVES: Wave[] = [
  { y: 0.18, amp: 55, freq: 0.0022, spd: 0.00012, off: 0, col: 'rgba(30,110,110,', a: 0.022 },
  { y: 0.32, amp: 70, freq: 0.0018, spd: 0.00009, off: 2.1, col: 'rgba(42,90,106,', a: 0.028 },
  { y: 0.50, amp: 80, freq: 0.0015, spd: 0.00007, off: 4.3, col: 'rgba(26,50,70,', a: 0.025 },
  { y: 0.68, amp: 65, freq: 0.0020, spd: 0.00011, off: 1.2, col: 'rgba(20,80,80,', a: 0.02 },
  { y: 0.82, amp: 50, freq: 0.0025, spd: 0.00014, off: 3.5, col: 'rgba(42,90,106,', a: 0.018 },
  { y: 0.95, amp: 40, freq: 0.0028, spd: 0.00016, off: 5.8, col: 'rgba(30,110,110,', a: 0.015 },
];

export default function WaveCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = (t: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const w of WAVES) {
        ctx.beginPath();
        const base = canvas.height * w.y;
        ctx.moveTo(0, base);
        for (let x = 0; x <= canvas.width; x += 5) {
          const y =
            base +
            Math.sin(x * w.freq + t * w.spd + w.off) * w.amp +
            Math.sin(x * w.freq * 0.7 + t * w.spd * 0.8 + w.off + 1) * w.amp * 0.3;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        ctx.fillStyle = w.col + w.a + ')';
        ctx.fill();
      }
      if (!reduce) raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas id="bg-canvas" ref={ref} aria-hidden="true" />;
}

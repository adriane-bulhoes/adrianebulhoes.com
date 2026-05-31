import { useEffect } from 'react';

/**
 * Custom dot + trailing-ring cursor, ported from the original index.html.
 * Renders #cur-dot / #cur-ring (styled in global.css). Disabled on coarse /
 * no-hover pointers so touch devices keep their native behavior.
 */
export default function Cursor() {
  useEffect(() => {
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;

    const dot = document.getElementById('cur-dot');
    const ring = document.getElementById('cur-ring');
    if (!dot || !ring) return;

    let mx = 0, my = 0, rx = 0, ry = 0, raf = 0;

    const move = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left = `${mx - 4}px`;
      dot.style.top = `${my - 4}px`;
    };
    document.addEventListener('mousemove', move);

    const anim = () => {
      rx += (mx - rx) * 0.1;
      ry += (my - ry) * 0.1;
      ring.style.left = `${rx - 18}px`;
      ring.style.top = `${ry - 18}px`;
      raf = requestAnimationFrame(anim);
    };
    raf = requestAnimationFrame(anim);

    return () => {
      document.removeEventListener('mousemove', move);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div id="cur-dot" aria-hidden="true"></div>
      <div id="cur-ring" aria-hidden="true"></div>
    </>
  );
}

import { useEffect, useRef, useState } from "react";

export function Counter({ to, duration = 1400 }: { to: number; duration?: number }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let frameId: number;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min((now - start) / duration, 1);
            setVal(Math.floor((1 - Math.pow(1 - p, 3)) * to));
            if (p < 1) {
              frameId = requestAnimationFrame(tick);
            }
          };
          frameId = requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 }
    );

    obs.observe(el);
    return () => {
      obs.disconnect();
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [to, duration]);

  return <span ref={ref}>{val}</span>;
}


"use client";
import { useEffect, useRef } from "react";

export default function BubblesBackground({
  count = 40, // number of bubbles
  color = "rgba(125, 211, 252, 0.25)", // sky-300 at 25% opacity
}: {
  count?: number;
  color?: string;
}) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    let raf = 0;

    // respect prefers-reduced-motion
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function size() {
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      canvas.width = innerWidth * dpr;
      canvas.height = innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    size();
    addEventListener("resize", size);

    type Bubble = {
      x: number;
      y: number;
      r: number;
      vy: number;
      alpha: number;
    };
    const bubbles: Bubble[] = Array.from({ length: count }).map(() => ({
      x: Math.random() * innerWidth,
      y: Math.random() * innerHeight,
      r: Math.random() * 18 + 8, // radius 8 to 26
      vy: Math.random() * 0.4 + 0.15, // upward speed
      alpha: Math.random() * 0.5 + 0.2, // base opacity
    }));

    function draw() {
      ctx.clearRect(0, 0, innerWidth, innerHeight);

      // soft vignette so bubbles pop on gray or black
      const g = ctx.createRadialGradient(
        innerWidth * 0.5,
        innerHeight * 0.5,
        0,
        innerWidth * 0.5,
        innerHeight * 0.5,
        Math.max(innerWidth, innerHeight) * 0.8,
      );
      g.addColorStop(0, "rgba(0,0,0,0)");
      g.addColorStop(1, "rgba(0,0,0,0.06)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, innerWidth, innerHeight);

      ctx.fillStyle = color;
      for (const b of bubbles) {
        const flicker = Math.sin(Date.now() * 0.0015 + b.x) * 0.12;
        ctx.globalAlpha = Math.min(1, Math.max(0, b.alpha + flicker));

        // soft blur ring
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();

        // subtle highlight
        ctx.globalAlpha *= 0.6;
        ctx.beginPath();
        ctx.arc(b.x - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.6, 0, Math.PI * 2);
        ctx.fill();

        // move upward
        b.y -= b.vy;
        if (b.y < -b.r) {
          b.y = innerHeight + b.r;
          b.x = Math.random() * innerWidth;
        }
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    }

    if (!reduceMotion) {
      raf = requestAnimationFrame(draw);
    } else {
      // still render one frame if reduced motion is on
      draw();
    }

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("resize", size);
    };
  }, [count, color]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="absolute inset-0 -z-10 pointer-events-none"
    />
  );
}

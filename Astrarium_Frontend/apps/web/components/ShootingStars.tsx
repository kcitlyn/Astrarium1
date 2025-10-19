"use client";

import { useEffect, useState } from "react";

interface Star {
  id: number;
  style: React.CSSProperties;
  duration: number;
}

export function ShootingStars() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    // Generate initial stars
    const generateStar = (id: number): Star => {
      const startY = Math.random() * 50; // Start in top half
      const startX = Math.random() * 100;
      const duration = 1 + Math.random() * 2; // 1-3 seconds
      const delay = Math.random() * 5; // Random delay up to 5s
      const length = 50 + Math.random() * 100; // Trail length

      return {
        id,
        duration,
        style: {
          left: `${startX}%`,
          top: `${startY}%`,
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`,
          width: `${length}px`,
        },
      };
    };

    // Create initial stars
    const initialStars = Array.from({ length: 15 }, (_, i) => generateStar(i));
    setStars(initialStars);

    // Periodically add new stars
    const interval = setInterval(() => {
      setStars((prev) => {
        const newId = prev.length > 0 ? Math.max(...prev.map((s) => s.id)) + 1 : 0;
        const newStar = generateStar(newId);
        // Keep only last 20 stars to prevent memory issues
        return [...prev.slice(-19), newStar];
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="shooting-stars-container">
      {stars.map((star) => (
        <div
          key={star.id}
          className="shooting-star"
          style={star.style}
        />
      ))}
      <style jsx>{`
        .shooting-stars-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
        }

        .shooting-star {
          position: absolute;
          height: 2px;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.8) 50%,
            rgba(147, 197, 253, 1) 100%
          );
          border-radius: 50%;
          transform: rotate(-45deg);
          animation: shoot linear infinite;
          opacity: 0;
          filter: drop-shadow(0 0 6px rgba(147, 197, 253, 0.8));
        }

        @keyframes shoot {
          0% {
            transform: rotate(-45deg) translateX(0);
            opacity: 1;
          }
          70% {
            opacity: 1;
          }
          100% {
            transform: rotate(-45deg) translateX(300px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

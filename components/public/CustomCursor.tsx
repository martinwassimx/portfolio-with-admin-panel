'use client';

import React, { useEffect, useState } from 'react';

export function CustomCursor({ enabled = true }: { enabled?: boolean }) {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [followerPos, setFollowerPos] = useState({ x: -100, y: -100 });
  const [isPointer, setIsPointer] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Check if device has touch capability
    if (typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
      setIsTouchDevice(true);
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });

      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable =
          target.tagName === 'A' ||
          target.tagName === 'BUTTON' ||
          target.closest('a') !== null ||
          target.closest('button') !== null ||
          target.getAttribute('role') === 'button';
        setIsPointer(isClickable);
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  useEffect(() => {
    if (isTouchDevice || !enabled) return;

    let frameId: number;
    const animateFollower = () => {
      setFollowerPos((prev) => ({
        x: prev.x + (pos.x - prev.x) * 0.18,
        y: prev.y + (pos.y - prev.y) * 0.18,
      }));
      frameId = requestAnimationFrame(animateFollower);
    };

    frameId = requestAnimationFrame(animateFollower);
    return () => cancelAnimationFrame(frameId);
  }, [pos, isTouchDevice, enabled]);

  if (!enabled || isTouchDevice) return null;

  return (
    <>
      {/* Inner precise dot */}
      <div
        className="fixed top-0 left-0 w-2.5 h-2.5 rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-transform duration-75"
        style={{
          backgroundColor: 'var(--accent)',
          boxShadow: '0 0 12px var(--accent)',
          transform: `translate3d(${pos.x}px, ${pos.y}px, 0) scale(${isPointer ? 1.5 : 1})`,
        }}
      />
      {/* Outer trailing aura */}
      <div
        className="fixed top-0 left-0 w-9 h-9 rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 ease-out"
        style={{
          borderColor: 'color-mix(in srgb, var(--accent) 50%, transparent)',
          backgroundColor: 'color-mix(in srgb, var(--accent) 10%, transparent)',
          borderWidth: '1px',
          borderStyle: 'solid',
          transform: `translate3d(${followerPos.x}px, ${followerPos.y}px, 0) scale(${isPointer ? 1.3 : 1})`,
        }}
      />
    </>
  );
}

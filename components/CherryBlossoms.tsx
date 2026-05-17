"use client";

import { useEffect, useRef } from "react";

interface Petal {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  swayAmp: number;
  swaySpeed: number;
  swayOffset: number;
}

function spawnPetal(width: number, randomY = false, mobile = false): Petal {
  const sizeBase = mobile ? 3 : 5;
  const sizeRange = mobile ? 4 : 7;
  return {
    x: Math.random() * width,
    y: randomY ? Math.random() * 600 : -20,
    size: sizeBase + Math.random() * sizeRange,
    speedY: 0.6 + Math.random() * 1.0,
    speedX: (Math.random() - 0.5) * 0.4,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.03,
    opacity: 0.35 + Math.random() * 0.45,
    swayAmp: 18 + Math.random() * 28,
    swaySpeed: 0.008 + Math.random() * 0.016,
    swayOffset: Math.random() * Math.PI * 2,
  };
}

function drawPetal(ctx: CanvasRenderingContext2D, p: Petal) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rotation);
  ctx.globalAlpha = p.opacity;

  const s = p.size;

  // Cherry blossom petal: narrow base at bottom, wide rounded top with notch
  ctx.beginPath();
  // Start at base (bottom)
  ctx.moveTo(0, s * 0.9);
  // Right side sweeping up and outward
  ctx.bezierCurveTo(s * 0.55, s * 0.55, s * 0.95, s * 0.05, s * 0.78, -s * 0.42);
  // Right lobe curving up to notch
  ctx.bezierCurveTo(s * 0.62, -s * 0.88, s * 0.18, -s * 0.92, 0, -s * 0.62);
  // Left lobe from notch
  ctx.bezierCurveTo(-s * 0.18, -s * 0.92, -s * 0.62, -s * 0.88, -s * 0.78, -s * 0.42);
  // Left side sweeping back down to base
  ctx.bezierCurveTo(-s * 0.95, s * 0.05, -s * 0.55, s * 0.55, 0, s * 0.9);
  ctx.closePath();

  // Gradient from pale center to deeper pink edge
  const grad = ctx.createRadialGradient(0, -s * 0.1, 0, 0, s * 0.1, s * 1.1);
  grad.addColorStop(0, "rgba(255, 240, 245, 0.98)");
  grad.addColorStop(0.45, "rgba(255, 200, 220, 0.85)");
  grad.addColorStop(1, "rgba(210, 130, 165, 0.25)");
  ctx.fillStyle = grad;
  ctx.fill();

  // Subtle midrib vein
  ctx.beginPath();
  ctx.moveTo(0, s * 0.85);
  ctx.bezierCurveTo(s * 0.05, s * 0.2, 0, -s * 0.3, 0, -s * 0.6);
  ctx.strokeStyle = "rgba(220, 150, 180, 0.22)";
  ctx.lineWidth = 0.6;
  ctx.stroke();

  ctx.restore();
}

export default function CherryBlossoms() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let petals: Petal[] = [];
    let t = 0;

    const isMobile = () => canvas.offsetWidth < 768;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Seed with petals already on screen
    for (let i = 0; i < 30; i++) {
      petals.push(spawnPetal(canvas.width, true, isMobile()));
    }

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t++;

      if (t % 6 === 0 && petals.length < 30) {
        petals.push(spawnPetal(canvas.width, false, isMobile()));
      }

      petals = petals.filter((p) => p.y < canvas.height + 30);

      for (const p of petals) {
        p.x += p.speedX + Math.sin(t * p.swaySpeed + p.swayOffset) * 0.4;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;
        drawPetal(ctx, p);
      }

      animId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}

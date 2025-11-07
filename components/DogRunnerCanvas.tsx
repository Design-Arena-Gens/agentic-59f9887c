'use client';

import { useEffect, useRef } from 'react';

const BASE_WIDTH = 960;
const BASE_HEIGHT = 540;

const drawSky = (ctx: CanvasRenderingContext2D) => {
  const gradient = ctx.createLinearGradient(0, 0, 0, BASE_HEIGHT);
  gradient.addColorStop(0, '#0d1f33');
  gradient.addColorStop(0.4, '#142b46');
  gradient.addColorStop(1, '#1e2d3f');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, BASE_WIDTH, BASE_HEIGHT);
};

const drawBuildings = (ctx: CanvasRenderingContext2D) => {
  ctx.save();
  const silhouettes = [
    { x: 30, width: 120, height: 220 },
    { x: 180, width: 90, height: 260 },
    { x: 280, width: 130, height: 210 },
    { x: 430, width: 110, height: 240 },
    { x: 560, width: 150, height: 200 },
    { x: 740, width: 100, height: 260 },
    { x: 860, width: 80, height: 230 }
  ];

  silhouettes.forEach((building, i) => {
    const gradient = ctx.createLinearGradient(
      building.x,
      BASE_HEIGHT - building.height,
      building.x,
      BASE_HEIGHT
    );
    gradient.addColorStop(0, `rgba(30, 52, 82, ${0.9 - i * 0.08})`);
    gradient.addColorStop(1, `rgba(12, 24, 38, ${0.75 - i * 0.06})`);
    ctx.fillStyle = gradient;
    ctx.fillRect(
      building.x,
      BASE_HEIGHT - building.height - 120,
      building.width,
      building.height
    );
  });
  ctx.restore();
};

const drawStreet = (ctx: CanvasRenderingContext2D, elapsed: number) => {
  const horizon = BASE_HEIGHT * 0.72;
  ctx.fillStyle = '#213347';
  ctx.fillRect(0, horizon, BASE_WIDTH, BASE_HEIGHT - horizon);

  ctx.fillStyle = '#1a2838';
  ctx.fillRect(0, horizon + 18, BASE_WIDTH, BASE_HEIGHT - (horizon + 18));

  // dashed center line animation
  const dashWidth = 120;
  const dashGap = 90;
  const dashOffset = (elapsed * 180) % (dashWidth + dashGap);
  const y = horizon + 48;
  ctx.strokeStyle = '#f9f6e7';
  ctx.lineWidth = 6;
  ctx.setLineDash([dashWidth, dashGap]);
  ctx.lineDashOffset = -dashOffset;
  ctx.beginPath();
  ctx.moveTo(0, y);
  ctx.lineTo(BASE_WIDTH, y);
  ctx.stroke();
  ctx.setLineDash([]);
};

const drawRoundRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) => {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
};

const drawDog = (
  ctx: CanvasRenderingContext2D,
  elapsed: number,
  x: number,
  y: number,
  scale: number
) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  const stride = Math.sin(elapsed * 10);
  const bounce = Math.sin(elapsed * 5) * 4;

  // shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.beginPath();
  ctx.ellipse(0, 36, 48, 12, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.translate(0, bounce * -0.6);

  // body
  ctx.fillStyle = '#d6b48c';
  ctx.strokeStyle = '#3f2f23';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(0, 0, 56, 22, 0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // back leg
  ctx.save();
  ctx.translate(-24, 12);
  ctx.rotate(stride * 0.6 - 0.5);
  ctx.fillStyle = '#c49b73';
  drawRoundRect(ctx, -6, 0, 12, 28, 6);
  ctx.fill();
  ctx.restore();

  // front leg
  ctx.save();
  ctx.translate(28, 12);
  ctx.rotate(-stride * 0.8 + 0.6);
  ctx.fillStyle = '#c49b73';
  drawRoundRect(ctx, -6, 0, 12, 28, 6);
  ctx.fill();
  ctx.restore();

  // tail
  ctx.save();
  ctx.translate(-48, -8);
  ctx.rotate(Math.cos(elapsed * 12) * 0.4 + 0.6);
  ctx.fillStyle = '#d6b48c';
  drawRoundRect(ctx, -4, -2, 26, 8, 4);
  ctx.fill();
  ctx.restore();

  // head
  ctx.save();
  ctx.translate(52, -10);
  ctx.beginPath();
  ctx.ellipse(0, 0, 22, 18, 0.1, 0, Math.PI * 2);
  ctx.fillStyle = '#d6b48c';
  ctx.fill();
  ctx.stroke();

  // ear
  ctx.save();
  ctx.translate(-6, -12);
  ctx.rotate(-0.2 + stride * 0.1);
  ctx.fillStyle = '#b5865c';
  drawRoundRect(ctx, -6, 0, 14, 18, 6);
  ctx.fill();
  ctx.restore();

  // eye
  ctx.fillStyle = '#1b1814';
  ctx.beginPath();
  ctx.arc(8, -4, 2.4, 0, Math.PI * 2);
  ctx.fill();

  // snout
  ctx.save();
  ctx.translate(16, 4);
  drawRoundRect(ctx, -2, -6, 14, 12, 6);
  ctx.fillStyle = '#cfa178';
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // nose
  ctx.fillStyle = '#1b1814';
  ctx.beginPath();
  ctx.arc(26, 4, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();

  ctx.restore();
};

const drawForegroundLights = (ctx: CanvasRenderingContext2D, elapsed: number) => {
  ctx.save();
  const baseY = BASE_HEIGHT * 0.68;
  for (let i = 0; i < 20; i += 1) {
    const offset = ((elapsed * 140) + i * 100) % (BASE_WIDTH + 100) - 100;
    ctx.fillStyle = 'rgba(246, 196, 82, 0.16)';
    ctx.beginPath();
    ctx.ellipse(BASE_WIDTH - offset, baseY + 40, 36, 8, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
};

const DogRunnerCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const deviceRatio = window.devicePixelRatio || 1;

    const resize = () => {
      canvas.width = BASE_WIDTH * deviceRatio;
      canvas.height = BASE_HEIGHT * deviceRatio;
      canvas.style.width = `${BASE_WIDTH}px`;
      canvas.style.height = `${BASE_HEIGHT}px`;
    };

    resize();

    let mounted = true;
    let frame: number;

    const render = (time: number) => {
      if (!mounted) return;
      frame = requestAnimationFrame(render);
      const seconds = time / 1000;

      ctx.setTransform(deviceRatio, 0, 0, deviceRatio, 0, 0);
      ctx.clearRect(0, 0, BASE_WIDTH, BASE_HEIGHT);

      drawSky(ctx);
      drawBuildings(ctx);
      drawStreet(ctx, seconds);

      const speed = 220;
      const offset = (seconds * speed) % (BASE_WIDTH + 240);
      const dogX = BASE_WIDTH - offset;
      const dogY = BASE_HEIGHT * 0.66;

      drawDog(ctx, seconds, dogX, dogY, 0.85);
      drawForegroundLights(ctx, seconds);
    };

    frame = requestAnimationFrame(render);

    const handleResize = () => {
      resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      mounted = false;
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label="Animated illustration of a dog running along a nighttime street"
    />
  );
};

export default DogRunnerCanvas;

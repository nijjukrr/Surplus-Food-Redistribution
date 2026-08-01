import React, { useEffect, useRef } from 'react';

export const SpiderCursorBg = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const canvas = document.createElement('canvas');
    canvas.className = 'w-full h-full block absolute inset-0';
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const { sin, cos, PI, hypot, min, max } = Math;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    function rnd(x = 1, dx = 0) {
      return Math.random() * x + dx;
    }

    function lerp(a, b, t) {
      return a + (b - a) * t;
    }

    function noise(x, y, t = 101) {
      let w0 = sin(0.3 * x + 1.4 * t + 2.0 + 2.5 * sin(0.4 * y + -1.3 * t + 1.0));
      let w1 = sin(0.2 * y + 1.5 * t + 2.8 + 2.3 * sin(0.5 * x + -1.2 * t + 0.5));
      return w0 + w1;
    }

    function many(n, f) {
      return [...Array(n)].map((_, i) => f(i));
    }

    function drawCircle(x, y, r) {
      ctx.beginPath();
      ctx.ellipse(x, y, Math.max(0.1, r), Math.max(0.1, r), 0, 0, PI * 2);
      ctx.fill();
    }

    function drawLine(x0, y0, x1, y1) {
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      many(20, (i) => {
        const step = (i + 1) / 20;
        const x = lerp(x0, x1, step);
        const y = lerp(y0, y1, step);
        const k = noise(x / 5 + x0, y / 5 + y0) * 1.5;
        ctx.lineTo(x + k, y + k);
      });
      ctx.stroke();
    }

    function spawn() {
      const pts = many(120, () => ({
        x: rnd(window.innerWidth),
        y: rnd(window.innerHeight),
        len: 0,
        r: 0
      }));

      const pts2 = many(8, (i) => ({
        x: cos((i / 8) * PI * 2),
        y: sin((i / 8) * PI * 2)
      }));

      let tx = rnd(window.innerWidth);
      let ty = rnd(window.innerHeight);
      let x = rnd(window.innerWidth);
      let y = rnd(window.innerHeight);
      let seed = rnd(100);
      let r = window.innerWidth / rnd(100, 150);

      function paintPt(pt) {
        pts2.forEach((pt2) => {
          if (!pt.len) return;
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 0.8;
          drawLine(
            lerp(x + pt2.x * r, pt.x, pt.len * pt.len),
            lerp(y + pt2.y * r, pt.y, pt.len * pt.len),
            x + pt2.x * r,
            y + pt2.y * r
          );
        });
        ctx.fillStyle = '#ffffff';
        drawCircle(pt.x, pt.y, pt.r);
      }

      return {
        follow(newX, newY) {
          tx = newX;
          ty = newY;
        },

        tick(t) {
          const selfMoveX = cos(t * 0.5 + seed) * 30;
          const selfMoveY = sin(t * 0.5 + seed) * 30;
          let fx = tx + selfMoveX;
          let fy = ty + selfMoveY;

          x += min(window.innerWidth / 100, (fx - x) / 10);
          y += min(window.innerHeight / 100, (fy - y) / 10);

          let i = 0;
          pts.forEach((pt) => {
            const dx = pt.x - x;
            const dy = pt.y - y;
            const len = hypot(dx, dy);
            let radius = min(2, window.innerWidth / len / 5);
            const increasing = len < window.innerWidth / 10 && i++ < 8;
            let dir = increasing ? 0.1 : -0.1;
            if (increasing) radius *= 1.5;
            pt.r = radius;
            pt.len = max(0, min(pt.len + dir, 1));
            paintPt(pt);
          });
        }
      };
    }

    const spiders = many(2, spawn);

    const handlePointerMove = (e) => {
      spiders.forEach((spider) => spider.follow(e.clientX, e.clientY));
    };
    window.addEventListener('pointermove', handlePointerMove);

    let animationFrameId;
    let time = 0;
    const anim = () => {
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, w, h);

      time += 0.016;
      spiders.forEach((spider) => spider.tick(time));
      animationFrameId = requestAnimationFrame(anim);
    };

    anim();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      if (container && canvas.parentNode === container) {
        container.removeChild(canvas);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-slate-950" />
  );
};

export default SpiderCursorBg;

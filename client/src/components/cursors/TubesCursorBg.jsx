import React, { useEffect, useRef } from 'react';

export const TubesCursorBg = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.className = 'w-full h-full block';
    const container = containerRef.current;
    if (!container) return;
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const mouse = { x: width / 2, y: height / 2 };
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener('pointermove', handleMouseMove);

    // Particles/Tubes simulation in pure Black & White
    const history = [];
    const maxPoints = 40;

    const render = () => {
      ctx.fillStyle = 'rgba(2, 6, 23, 0.25)';
      ctx.fillRect(0, 0, width, height);

      history.push({ x: mouse.x, y: mouse.y });
      if (history.length > maxPoints) history.shift();

      if (history.length > 1) {
        ctx.beginPath();
        ctx.moveTo(history[0].x, history[0].y);
        for (let i = 1; i < history.length; i++) {
          const xc = (history[i].x + history[i - 1].x) / 2;
          const yc = (history[i].y + history[i - 1].y) / 2;
          ctx.quadraticCurveTo(history[i - 1].x, history[i - 1].y, xc, yc);
        }

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 6;
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#ffffff';
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();

        ctx.strokeStyle = '#888888';
        ctx.lineWidth = 14;
        ctx.shadowBlur = 0;
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handleMouseMove);
      if (container && canvas.parentNode === container) {
        container.removeChild(canvas);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-slate-950" />
  );
};

export default TubesCursorBg;

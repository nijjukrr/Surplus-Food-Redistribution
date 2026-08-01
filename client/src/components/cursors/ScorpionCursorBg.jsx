import React, { useEffect, useRef } from 'react';

export const ScorpionCursorBg = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const canvas = document.createElement('canvas');
    canvas.className = 'w-full h-full block absolute inset-0';
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
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
    window.addEventListener('mousemove', handleMouseMove);

    class Segment {
      constructor(parent, size, angle, range, stiffness) {
        this.isSegment = true;
        this.parent = parent;
        this.children = [];
        if (parent && typeof parent.children === 'object') {
          parent.children.push(this);
        }
        this.size = size;
        this.relAngle = angle;
        this.defAngle = angle;
        this.absAngle = parent ? parent.absAngle + angle : angle;
        this.range = range;
        this.stiffness = stiffness;
        this.x = parent ? parent.x + Math.cos(this.absAngle) * size : width / 2;
        this.y = parent ? parent.y + Math.sin(this.absAngle) * size : height / 2;
      }

      updateRelative(iter, flex) {
        this.relAngle =
          this.relAngle -
          2 * Math.PI * Math.floor((this.relAngle - this.defAngle) / 2 / Math.PI + 1 / 2);
        if (flex) {
          this.relAngle = Math.min(
            this.defAngle + this.range / 2,
            Math.max(
              this.defAngle - this.range / 2,
              (this.relAngle - this.defAngle) / this.stiffness + this.defAngle
            )
          );
        }
        this.absAngle = this.parent.absAngle + this.relAngle;
        this.x = this.parent.x + Math.cos(this.absAngle) * this.size;
        this.y = this.parent.y + Math.sin(this.absAngle) * this.size;
        if (iter) {
          for (let i = 0; i < this.children.length; i++) {
            this.children[i].updateRelative(iter, flex);
          }
        }
      }

      draw(iter) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.parent.x, this.parent.y);
        ctx.lineTo(this.x, this.y);
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
        ctx.fill();

        if (iter) {
          for (let i = 0; i < this.children.length; i++) {
            this.children[i].draw(true);
          }
        }
      }
    }

    class Creature {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.absAngle = 0;
        this.fSpeed = 0;
        this.children = [];
      }
      follow(x, y) {
        const dist = Math.hypot(x - this.x, y - this.y);
        const angle = Math.atan2(y - this.y, x - this.x);
        this.absAngle = angle;
        if (dist > 10) {
          this.x += Math.cos(angle) * Math.min(dist * 0.1, 8);
          this.y += Math.sin(angle) * Math.min(dist * 0.1, 8);
        }
        for (let i = 0; i < this.children.length; i++) {
          this.children[i].updateRelative(true, true);
        }
        this.draw(true);
      }
      draw(iter) {
        ctx.strokeStyle = '#ffffff';
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
        ctx.fill();
        if (iter) {
          for (let i = 0; i < this.children.length; i++) {
            this.children[i].draw(true);
          }
        }
      }
    }

    const critter = new Creature(width / 2, height / 2);
    let spinal = critter;
    for (let i = 0; i < 18; i++) {
      spinal = new Segment(spinal, 14, 0, Math.PI / 3, 1.2);
      for (let ii = -1; ii <= 1; ii += 2) {
        const legBase = new Segment(spinal, 12, ii * 1.2, 0.5, 2);
        new Segment(legBase, 16, -ii * 0.6, 0.5, 2);
      }
    }

    let intervalId;
    const render = () => {
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, width, height);
      critter.follow(mouse.x, mouse.y);
    };

    intervalId = setInterval(render, 33);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (container && canvas.parentNode === container) {
        container.removeChild(canvas);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-slate-950" />
  );
};

export default ScorpionCursorBg;

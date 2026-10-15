import { useEffect, useRef } from "react";

const EMBER_COLORS = [
  { r: 0, g: 245, b: 255 }, // Cyber Cyan (#00f5ff)
  { r: 5, g: 213, b: 255 }, // Bright Cyan (#05d5ff)
  { r: 0, g: 242, b: 254 }, // Neon Teal (#00f2fe)
  { r: 168, g: 85, b: 247 }, // Electric Violet (#a855f7)
  { r: 129, g: 140, b: 248 }, // Soft Indigo (#818cf8)
  { r: 16, g: 185, b: 129 }, // Emerald Accent (#10b981)
];

export default function CyberMiddleBody({ children }) {
  const wrapperRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const canvasRef = useRef(null);
  // Shared between the scroll tracker and the render loop: the ember canvas only
  // needs to animate while the middle body is actually on screen.
  const visibleRef = useRef(false);
  const startLoopRef = useRef(null);

  // Scroll boundary tracker: smoothly feathers the fixed particle canvas & spotlights
  // using CSS mask-image so they seamlessly dissolve in and out without ANY hard cut lines
  // (starts smoothly after Hero, ends smoothly before Footer)
  useEffect(() => {
    let ticking = false;
    let lastMask = null;

    const setMask = (el, mask) => {
      // Rewriting an identical mask forces a repaint of the whole fixed layer
      if (mask === lastMask) return;
      lastMask = mask;
      el.style.maskImage = mask;
      el.style.webkitMaskImage = mask;
    };

    const updateClip = () => {
      ticking = false;
      if (!wrapperRef.current || !canvasContainerRef.current) return;
      const rect = wrapperRef.current.getBoundingClientRect();
      const vh = window.innerHeight;

      // Check if any portion of the middle body is inside viewport
      if (rect.bottom <= 0 || rect.top >= vh) {
        canvasContainerRef.current.style.opacity = "0";
        setMask(canvasContainerRef.current, "none");
        visibleRef.current = false;
      } else {
        canvasContainerRef.current.style.opacity = "1";
        if (!visibleRef.current) {
          visibleRef.current = true;
          startLoopRef.current?.();
        }

        // Soft feathering zone (140px) eliminates hard cutting of blur spotlights and embers
        const feather = 140;
        const t0 = Math.max(0, Math.min(vh, rect.top));
        const t1 = Math.max(0, Math.min(vh, rect.top + feather));
        const b0 = Math.max(0, Math.min(vh, rect.bottom - feather));
        const b1 = Math.max(0, Math.min(vh, rect.bottom));

        // Fully inside the body: no feathering needed, drop the mask entirely
        const mask =
          rect.top <= 0 && rect.bottom >= vh
            ? "none"
            : `linear-gradient(to bottom, transparent 0px, transparent ${t0}px, black ${t1}px, black ${b0}px, transparent ${b1}px, transparent ${vh}px)`;
        setMask(canvasContainerRef.current, mask);
      }
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateClip);
        ticking = true;
      }
    };

    updateClip();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateClip);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateClip);
    };
  }, []);

  // Ambient Floating Particle Embers Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let particles = [];
    let animationId = null;

    let currentFlowMode = "drift";

    const mouse = {
      x: -9999,
      y: -9999,
      prevX: -9999,
      prevY: -9999,
      vx: 0,
      vy: 0,
      speed: 0,
      isInside: false,
      lastMoveTime: 0,
    };

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    function resize() {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    }

    function createParticle(initialYRandom = true) {
      const colorIndex = Math.floor(Math.random() * EMBER_COLORS.length);
      const color = EMBER_COLORS[colorIndex];
      return {
        colorIndex,
        x: Math.random() * (width || window.innerWidth),
        y: initialYRandom ? Math.random() * (height || 1000) : (height || 1000) + 10 + Math.random() * 20,
        prevY: 0,
        radius: 0.9 + Math.random() * 2.3,
        baseAlpha: 0.18 + Math.random() * 0.45,
        alphaPulseSpeed: 0.015 + Math.random() * 0.03,
        alphaPulseOffset: Math.random() * Math.PI * 2,
        baseVy: 0.28 + Math.random() * 0.55,
        swayAmplitude: 0.6 + Math.random() * 1.4,
        swayFrequency: 0.008 + Math.random() * 0.014,
        swayOffset: Math.random() * Math.PI * 2,
        color,
        hasGlow: Math.random() > 0.35,
        impulseVx: 0,
        impulseVy: 0,
      };
    }

    function initParticles() {
      const isWarp = currentFlowMode === "warp";
      const baseCount = prefersReducedMotion.matches ? 25 : window.innerWidth < 640 ? 45 : 85;
      const count = isWarp ? Math.floor(baseCount * 1.6) : baseCount;
      particles = [];
      for (let i = 0; i < count; i++) {
        const p = createParticle(true);
        p.prevY = p.y;
        particles.push(p);
      }
    }

    window.setEmberFlowMode = function (mode) {
      currentFlowMode = mode;
      const targetCount = prefersReducedMotion.matches
        ? 25
        : window.innerWidth < 640
        ? mode === "warp"
          ? 70
          : 45
        : mode === "warp"
        ? 140
        : 85;
      while (particles.length < targetCount) {
        const p = createParticle(false);
        p.prevY = p.y;
        particles.push(p);
      }
      if (particles.length > targetCount) {
        particles.splice(targetCount);
      }
    };

    window.getEmberFlowMode = function () {
      return currentFlowMode;
    };

    const handleMouseMove = (e) => {
      const currentX = e.clientX;
      const currentY = e.clientY;
      const now = performance.now();
      const dt = Math.max(1, now - (mouse.lastMoveTime || now));

      if (mouse.prevX !== -9999 && mouse.prevY !== -9999) {
        const rawVx = ((currentX - mouse.prevX) / dt) * 16.67;
        const rawVy = ((currentY - mouse.prevY) / dt) * 16.67;
        mouse.vx = mouse.vx * 0.4 + rawVx * 0.6;
        mouse.vy = mouse.vy * 0.4 + rawVy * 0.6;
      }

      mouse.speed = Math.hypot(mouse.vx, mouse.vy);
      mouse.x = currentX;
      mouse.y = currentY;
      mouse.prevX = currentX;
      mouse.prevY = currentY;
      mouse.isInside = true;
      mouse.lastMoveTime = now;
    };

    const handleMouseLeave = () => {
      mouse.isInside = false;
      mouse.x = -9999;
      mouse.y = -9999;
      mouse.vx = 0;
      mouse.vy = 0;
      mouse.speed = 0;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave);

    let tick = 0;
    function render() {
      if (!visibleRef.current || document.hidden) {
        animationId = null;
        return;
      }
      ctx.clearRect(0, 0, width, height);
      tick++;

      const isMotionReduced = prefersReducedMotion.matches;
      const isWarp = currentFlowMode === "warp";

      const speedMult = isWarp ? 3.4 : 1.0;
      const swayMult = isWarp ? 2.0 : 1.0;
      const repulsionMult = isWarp ? 1.8 : 1.0;

      if (mouse.isInside) {
        mouse.vx *= 0.88;
        mouse.vy *= 0.88;
        mouse.speed = Math.hypot(mouse.vx, mouse.vy);
      }

      const interactionRadius = isWarp ? 220 : 160;
      const interactionRadiusSq = interactionRadius * interactionRadius;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.prevY = p.y;

        if (!isMotionReduced) {
          if (mouse.isInside) {
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const distSq = dx * dx + dy * dy;

            if (distSq < interactionRadiusSq && distSq > 0.01) {
              const dist = Math.sqrt(distSq);
              const force = 1 - dist / interactionRadius;
              const nx = dx / dist;
              const ny = dy / dist;

              const repulsionPower = 2.4 * repulsionMult;
              p.impulseVx += nx * force * repulsionPower;
              p.impulseVy += ny * force * repulsionPower;

              if (mouse.speed > 0.1) {
                const swirlFactor = force * Math.min(mouse.speed, 22) * (isWarp ? 0.1 : 0.06);
                p.impulseVx += -ny * swirlFactor;
                p.impulseVy += nx * swirlFactor;
                p.impulseVx += mouse.vx * force * 0.04;
                p.impulseVy += mouse.vy * force * 0.04;
              }
            }
          }

          const damping = isWarp ? 0.94 : 0.92;
          p.impulseVx *= damping;
          p.impulseVy *= damping;

          const maxSpeed = isWarp ? 16 : 9;
          const currentImpulseSpeed = Math.hypot(p.impulseVx, p.impulseVy);
          if (currentImpulseSpeed > maxSpeed) {
            p.impulseVx = (p.impulseVx / currentImpulseSpeed) * maxSpeed;
            p.impulseVy = (p.impulseVy / currentImpulseSpeed) * maxSpeed;
          }

          p.y -= p.baseVy * speedMult - p.impulseVy;
          p.x += Math.sin(tick * p.swayFrequency + p.swayOffset) * (p.swayAmplitude * 0.35 * swayMult) + p.impulseVx;

          if (p.y < -25) {
            particles[i] = createParticle(false);
            particles[i].prevY = particles[i].y;
            continue;
          }
          if (p.x < -30) p.x = width + 20;
          else if (p.x > width + 30) p.x = -20;
        }

        const shimmer = Math.sin(tick * p.alphaPulseSpeed + p.alphaPulseOffset);
        const impulseEnergy = Math.hypot(p.impulseVx, p.impulseVy);
        const glowBoost = Math.min(0.35, impulseEnergy * 0.08) + (isWarp ? 0.15 : 0);
        const currentAlpha = Math.max(0.08, Math.min(0.98, p.baseAlpha + shimmer * 0.16 + glowBoost));

        if (isWarp && !isMotionReduced) {
          ctx.beginPath();
          const trailLength = Math.max(8, p.baseVy * speedMult * 3.5 + Math.abs(p.impulseVy) * 1.5);
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.impulseVx * 1.2, p.y + trailLength);
          ctx.strokeStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${currentAlpha * 0.75})`;
          ctx.lineWidth = Math.max(0.8, p.radius * 0.9);
          ctx.lineCap = "round";
          ctx.stroke();
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * (isWarp ? 1.2 : 1), 0, Math.PI * 2);

        if (p.hasGlow && !isMotionReduced) {
          ctx.shadowColor = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${currentAlpha * 0.9})`;
          ctx.shadowBlur = p.radius * (isWarp ? 8 : 4 + Math.min(4, impulseEnergy * 1.2));
        }

        ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${currentAlpha})`;
        ctx.fill();
        ctx.restore();
      }

      animationId = requestAnimationFrame(render);
    }

    startLoopRef.current = () => {
      if (animationId === null) animationId = requestAnimationFrame(render);
    };
    const onVisibility = () => {
      if (!document.hidden) startLoopRef.current?.();
    };
    document.addEventListener("visibilitychange", onVisibility);

    resize();
    initParticles();
    if (visibleRef.current) startLoopRef.current();

    let resizeDebounce;
    const onResize = () => {
      clearTimeout(resizeDebounce);
      resizeDebounce = setTimeout(() => {
        resize();
        initParticles();
      }, 150);
    };

    window.addEventListener("resize", onResize);
    prefersReducedMotion.addEventListener("change", initParticles);

    return () => {
      cancelAnimationFrame(animationId);
      startLoopRef.current = null;
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", onResize);
      prefersReducedMotion.removeEventListener("change", initParticles);
      delete window.setEmberFlowMode;
      delete window.getEmberFlowMode;
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="relative w-full overflow-hidden bg-transparent"
      data-purpose="cyber-middle-body"
    >
      {/* 0. CYBERPUNK MATRIX BASE & GRID WITH SOFT FEATHERED DISSOLVE AT BOUNDARIES */}
      <div
        className="absolute inset-0 bg-cyber-universe pointer-events-none -z-20"
        style={{
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 180px, black calc(100% - 180px), transparent 100%)",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 180px, black calc(100% - 180px), transparent 100%)",
        }}
      />

      {/* ATMOSPHERIC DISSOLVE BRIDGES */}
      {/* Top Bridge: Seamlessly blends the Hero's #121318 into the Cyberpunk #030712 */}
      <div
        className="absolute top-0 left-0 right-0 h-48 pointer-events-none -z-10"
        style={{
          background:
            "linear-gradient(to bottom, #121318 0%, rgba(18, 19, 24, 0.75) 40%, rgba(3, 7, 18, 0) 100%)",
        }}
      />
      {/* Bottom Bridge: Seamlessly blends the Cyberpunk #030712 into the Footer's #0d0e13 */}
      <div
        className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none -z-10"
        style={{
          background:
            "linear-gradient(to top, #0d0e13 0%, rgba(13, 14, 19, 0.75) 40%, rgba(3, 7, 18, 0) 100%)",
        }}
      />

      {/* 1. FIXED VIEWPORT AMBIENT PARTICLE EMBERS & SPOTLIGHT LAYER (Feather-masked on scroll) */}
      <div
        ref={canvasContainerRef}
        className="fixed inset-0 pointer-events-none z-0"
        aria-hidden="true"
        style={{ opacity: 0, transition: "opacity 0.25s ease-out" }}
      >
        {/* Dynamic Viewport Blur Spotlights */}
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-2/3 right-10 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Ambient Particle Embers Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />
      </div>

      {/* 2. IN-FLOW VOLUMETRIC GLOW ORBS (Masked to dissolve gracefully at section boundaries) */}
      <div
        className="absolute inset-0 pointer-events-none -z-10 overflow-hidden"
        style={{
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 180px, black calc(100% - 180px), transparent 100%)",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 180px, black calc(100% - 180px), transparent 100%)",
        }}
      >
        <div className="absolute top-[6%] left-4 sm:left-12 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-[22%] right-4 sm:right-12 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-[38%] left-4 sm:left-12 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-[54%] right-4 sm:right-12 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-[70%] left-4 sm:left-12 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[6%] right-4 sm:right-12 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 3. MIDDLE BODY CONTENT SECTIONS (About through Contact) */}
      <div className="relative z-10 space-y-20 md:space-y-28 pt-16 md:pt-20 pb-20 md:pb-28">
        {children}
      </div>
    </div>
  );
}

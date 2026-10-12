import { useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import Button from "../components/Button";
import HeroExperience from "../components/models/hero_models/HeroExperience";

const PHRASES = [
  "Digital Experiences",
  "Websites",
  "Web Apps",
  "Interactive Interfaces",
  "Digital Products",
];

const Hero = () => {
  const [index, setIndex] = useState(0);
  const [animClass, setAnimClass] = useState("phrase-idle");

  // Initial hero entrance animation
  useGSAP(() => {
    gsap.fromTo(
      ".hero-text h1",
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.2, duration: 1, ease: "power2.inOut" }
    );
  });

  // Continuous phrase rotation with fade out -> upward movement -> blur transition -> enter from below -> fade in
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    let isMounted = true;
    let holdTimer;
    let exitTimer;
    let enterTimer;

    const startCycle = () => {
      // Hold visible for ~2.3 seconds
      holdTimer = setTimeout(() => {
        if (!isMounted) return;

        // Step 1: Fade out + slight upward movement (-20px) + blur (8px) over 650ms
        setAnimClass("phrase-exit");

        exitTimer = setTimeout(() => {
          if (!isMounted) return;

          // Step 2: Switch to next phrase in exact order
          setIndex((prev) => (prev + 1) % PHRASES.length);

          // Step 3: Enter from slightly below (+20px) with blur clearing over 650ms
          setAnimClass("phrase-enter");

          enterTimer = setTimeout(() => {
            if (!isMounted) return;

            // Step 4: Settle in place and restart cycle
            setAnimClass("phrase-idle");
            startCycle();
          }, 650);
        }, 650);
      }, 2300);
    };

    startCycle();

    return () => {
      isMounted = false;
      clearTimeout(holdTimer);
      clearTimeout(exitTimer);
      clearTimeout(enterTimer);
    };
  }, []);

  return (
    <section id="hero" className="relative overflow-hidden">
      <div className="absolute top-0 left-0 z-10">
        <img src="/images/bg.png" alt="" />
      </div>

      <div className="hero-layout">
        {/* LEFT: Hero Content */}
        <header className="flex flex-col justify-center md:w-full w-screen md:px-20 px-5">
          <div className="flex flex-col gap-7">
            <div className="hero-text">
              <h1>
                <span className="text-white">I Create</span>{" "}
                <span
                  className={`hero-rotating-phrase ${animClass}`}
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {PHRASES[index]}
                </span>
              </h1>
              <h1 className="text-white">Built For The Modern Web</h1>
            </div>

            <p className="text-white-50 text-base md:text-xl max-w-2xl leading-relaxed relative z-10 pointer-events-none">
              Full Stack Developer focused on clean UI, powerful functionality and seamless user experiences.
            </p>

            <Button
              text="See My Work"
              className="md:w-80 md:h-16 w-60 h-12"
              id="work"
            />
          </div>
        </header>

        {/* RIGHT: 3D Model or Visual */}
        <figure>
          <div className="hero-3d-layout">
            <HeroExperience />
          </div>
        </figure>
      </div>
    </section>
  );
};

export default Hero;

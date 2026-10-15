import { useEffect, useRef } from "react";
import * as THREE from "three";

const HologramScene = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let animationFrameId;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene & Fog
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0c16, 0.022);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 9);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.pointerEvents = "none";
    container.appendChild(renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0x0e1528, 2.2);
    scene.add(ambientLight);

    const cyanPoint = new THREE.PointLight(0x00f0ff, 4.2, 35);
    cyanPoint.position.set(4, 5, 5);
    scene.add(cyanPoint);

    const violetPoint = new THREE.PointLight(0xa855f7, 3.8, 30);
    violetPoint.position.set(-5, -4, 4);
    scene.add(violetPoint);

    const centerGlow = new THREE.PointLight(0x38bdf8, 2.5, 18);
    centerGlow.position.set(0, 0, 0);
    scene.add(centerGlow);

    // 5. Core Group
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // Central Holographic Core
    const coreGeo = new THREE.IcosahedronGeometry(1.6, 1);
    const innerGeo = new THREE.IcosahedronGeometry(1.2, 0);

    const innerMat = new THREE.MeshPhongMaterial({
      color: 0x00f0ff,
      emissive: 0x083344,
      shininess: 90,
      transparent: true,
      opacity: 0.85,
      flatShading: true,
    });
    const innerCore = new THREE.Mesh(innerGeo, innerMat);
    coreGroup.add(innerCore);

    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.5,
    });
    const wireCore = new THREE.Mesh(coreGeo, wireframeMat);
    coreGroup.add(wireCore);

    const vertexMat = new THREE.PointsMaterial({
      color: 0x00f0ff,
      size: 0.08,
      transparent: true,
      opacity: 0.9,
    });
    const vertexPoints = new THREE.Points(coreGeo, vertexMat);
    coreGroup.add(vertexPoints);

    // 6. Orbital Rings
    const ringGroup = new THREE.Group();
    scene.add(ringGroup);

    const ringGeometries = [];
    const ringMaterials = [];

    const createOrbitRing = (radius, tube, color, opacity, rx, ry) => {
      const ringGeo = new THREE.TorusGeometry(radius, tube, 16, 100);
      ringGeometries.push(ringGeo);
      const ringMat = new THREE.MeshStandardMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.3,
        roughness: 0.2,
        metalness: 0.8,
        transparent: true,
        opacity: opacity,
      });
      ringMaterials.push(ringMat);
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.set(rx, ry, 0);
      return ringMesh;
    };

    const ring1 = createOrbitRing(2.6, 0.02, 0x00f0ff, 0.65, Math.PI / 3, 0);
    const ring2 = createOrbitRing(3.2, 0.015, 0xa855f7, 0.55, -Math.PI / 4, Math.PI / 6);
    const ring3 = createOrbitRing(3.9, 0.01, 0x38bdf8, 0.45, Math.PI / 6, -Math.PI / 3);
    ringGroup.add(ring1);
    ringGroup.add(ring2);
    ringGroup.add(ring3);

    // 7. Floating Interactive Satellite Data Nodes
    const satellites = [];
    const satGeo = new THREE.BoxGeometry(0.14, 0.14, 0.14);
    const satMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00f0ff,
      emissiveIntensity: 0.8,
      metalness: 0.9,
      roughness: 0.1,
    });

    for (let i = 0; i < 8; i++) {
      const sat = new THREE.Mesh(satGeo, satMat);
      sat.userData = {
        orbitRadius: 2.8 + (i % 3) * 0.6,
        speed: 0.4 + i * 0.08,
        angleOffset: (i * Math.PI * 2) / 8,
        tilt: (i % 2 === 0 ? 1 : -1) * (0.3 + i * 0.1),
      };
      satellites.push(sat);
      scene.add(sat);
    }

    // 8. Floating Neural Constellation Particle Field
    const particleCount = 450;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds = [];

    for (let i = 0; i < particleCount; i++) {
      const pIdx = i * 3;
      particlePositions[pIdx] = (Math.random() - 0.5) * 16;
      particlePositions[pIdx + 1] = (Math.random() - 0.5) * 12;
      particlePositions[pIdx + 2] = (Math.random() - 0.5) * 10;
      particleSpeeds.push({
        vx: (Math.random() - 0.5) * 0.003,
        vy: 0.004 + Math.random() * 0.006,
        vz: (Math.random() - 0.5) * 0.003,
      });
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.05,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Mouse & Scroll Interactivity
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    let targetScrollProgress = 0;
    let scrollProgress = 0;

    const handleMouseMove = (e) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      targetX = nx * 0.5;
      targetY = ny * 0.35;
    };

    const handleScroll = () => {
      const heroH = window.innerHeight * 1.5;
      const scrollY = window.scrollY || window.pageYOffset || 0;
      targetScrollProgress = Math.min(Math.max(scrollY / heroH, 0), 1);
    };

    let resizeTimer;
    const applyResize = () => {
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(applyResize, 120);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    // 9. Render Loop — only runs while the hero is on screen and the tab is visible
    const clock = new THREE.Clock();
    let inView = true;

    const animate = () => {
      if (!inView || document.hidden) {
        animationFrameId = null;
        return;
      }
      animationFrameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Smooth mouse and scroll interpolation
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;
      scrollProgress += (targetScrollProgress - scrollProgress) * 0.06;

      // Scroll-linked 3D camera rotation and dynamic perspective shift
      camera.position.x = Math.sin(scrollProgress * Math.PI * 0.6) * 3.2 + mouseX * 0.8;
      camera.position.y = -scrollProgress * 2.8 + mouseY * 0.6;
      camera.position.z = 9 - scrollProgress * 2.2;
      camera.lookAt(0, -scrollProgress * 0.8, 0);

      // Rotate Core with scroll acceleration and mouse tracking
      coreGroup.rotation.y = t * 0.25 + mouseX * 0.8 + scrollProgress * Math.PI * 0.8;
      coreGroup.rotation.x = Math.sin(t * 0.3) * 0.2 + mouseY * 0.5 + scrollProgress * 0.4;
      coreGroup.rotation.z = Math.cos(t * 0.2) * 0.15 + scrollProgress * 0.25;

      // Pulse Inner Core scale & color
      const pulse = 1 + Math.sin(t * 2.0) * 0.06;
      innerCore.scale.set(pulse, pulse, pulse);
      wireCore.scale.set(
        1 + Math.sin(t * 1.5) * 0.03,
        1 + Math.sin(t * 1.5) * 0.03,
        1 + Math.sin(t * 1.5) * 0.03
      );

      // Rotate Orbital Rings
      ring1.rotation.z = t * 0.35 + scrollProgress * 1.2;
      ring1.rotation.x = Math.PI / 3 + mouseY * 0.4 + scrollProgress * 0.5;

      ring2.rotation.z = -t * 0.28 - scrollProgress * 0.9;
      ring2.rotation.y = Math.PI / 6 + mouseX * 0.4 + scrollProgress * 0.6;

      ring3.rotation.z = t * 0.2 + scrollProgress * 0.7;
      ring3.rotation.x = -Math.PI / 4 + mouseY * 0.3;

      ringGroup.rotation.y = mouseX * 0.4 + scrollProgress * 0.5;
      ringGroup.rotation.x = -mouseY * 0.3 - scrollProgress * 0.3;

      // Animate Satellites
      satellites.forEach((sat) => {
        const angle = t * sat.userData.speed + sat.userData.angleOffset + scrollProgress * 1.5;
        const r = sat.userData.orbitRadius;
        sat.position.x = Math.cos(angle) * r;
        sat.position.y =
          Math.sin(angle) * r * Math.sin(sat.userData.tilt) +
          Math.sin(t + sat.userData.angleOffset) * 0.2;
        sat.position.z = Math.sin(angle) * r * Math.cos(sat.userData.tilt);
        sat.rotation.x += 0.02;
        sat.rotation.y += 0.03;
      });

      // Animate Particles
      const pos = particles.geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3;
        pos[idx + 1] += particleSpeeds[i].vy;
        if (pos[idx + 1] > 6) {
          pos[idx + 1] = -6;
          pos[idx] = (Math.random() - 0.5) * 16;
        }
      }
      particles.geometry.attributes.position.needsUpdate = true;
      particles.rotation.y = t * 0.03 + mouseX * 0.2 + scrollProgress * 0.3;

      // Dynamic light pulsation
      centerGlow.intensity = 2.0 + Math.sin(t * 3.0) * 0.8 + scrollProgress * 1.2;

      renderer.render(scene, camera);
    };

    const resume = () => {
      if (animationFrameId == null && inView && !document.hidden) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      resume();
    });
    observer.observe(container);
    document.addEventListener("visibilitychange", resume);

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(resizeTimer);
      observer.disconnect();
      document.removeEventListener("visibilitychange", resume);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      coreGeo.dispose();
      innerGeo.dispose();
      satGeo.dispose();
      particleGeo.dispose();
      ringGeometries.forEach((g) => g.dispose());
      innerMat.dispose();
      wireframeMat.dispose();
      vertexMat.dispose();
      satMat.dispose();
      particleMat.dispose();
      ringMaterials.forEach((m) => m.dispose());
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full" />;
};

export default HologramScene;

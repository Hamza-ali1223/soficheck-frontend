import { useEffect, useRef, useCallback } from "react";

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    opacity: number;
    pulseSpeed: number;
    pulseOffset: number;
}

export default function ParticlesBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const animRef = useRef<number>(0);
    const timeRef = useRef<number>(0);

    const isDark = useCallback(() => {
        return document.documentElement.classList.contains("dark");
    }, []);

    const createParticles = useCallback((width: number, height: number) => {
        const count = Math.min(Math.floor((width * height) / 18000), 60);
        const particles: Particle[] = [];

        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3 - 0.1, // slight upward drift
                radius: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2,
                pulseSpeed: Math.random() * 0.02 + 0.005,
                pulseOffset: Math.random() * Math.PI * 2,
            });
        }

        particlesRef.current = particles;
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d", { alpha: true });
        if (!ctx) return;

        function resize() {
            if (!canvas) return;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            createParticles(canvas.width, canvas.height);
        }

        resize();
        window.addEventListener("resize", resize);

        function draw() {
            if (!canvas || !ctx) return;
            const { width, height } = canvas;
            timeRef.current += 1;

            ctx.clearRect(0, 0, width, height);

            const dark = isDark();

            for (const p of particlesRef.current) {
                // Move
                p.x += p.vx;
                p.y += p.vy;

                // Wrap around edges
                if (p.x < -10) p.x = width + 10;
                if (p.x > width + 10) p.x = -10;
                if (p.y < -10) p.y = height + 10;
                if (p.y > height + 10) p.y = -10;

                // Pulse opacity
                const pulse = Math.sin(timeRef.current * p.pulseSpeed + p.pulseOffset);
                const alpha = p.opacity + pulse * 0.15;

                if (dark) {
                    // Dark mode: glowing indigo particles with hue shift
                    const hue = 235 + pulse * 15; // subtle shift between blue-indigo
                    const glow = p.radius * 4;

                    // Outer glow
                    const gradient = ctx.createRadialGradient(
                        p.x, p.y, 0,
                        p.x, p.y, glow
                    );
                    gradient.addColorStop(0, `hsla(${hue}, 80%, 72%, ${alpha * 0.6})`);
                    gradient.addColorStop(0.4, `hsla(${hue}, 80%, 72%, ${alpha * 0.15})`);
                    gradient.addColorStop(1, `hsla(${hue}, 80%, 72%, 0)`);

                    ctx.beginPath();
                    ctx.arc(p.x, p.y, glow, 0, Math.PI * 2);
                    ctx.fillStyle = gradient;
                    ctx.fill();

                    // Core dot
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                    ctx.fillStyle = `hsla(${hue}, 80%, 76%, ${alpha * 0.9})`;
                    ctx.fill();
                } else {
                    // Light mode: vivid indigo dots with soft glow
                    const glow = p.radius * 3;

                    // Soft glow halo
                    const gradient = ctx.createRadialGradient(
                        p.x, p.y, 0,
                        p.x, p.y, glow
                    );
                    gradient.addColorStop(0, `rgba(79, 70, 229, ${alpha * 0.3})`);
                    gradient.addColorStop(0.5, `rgba(79, 70, 229, ${alpha * 0.08})`);
                    gradient.addColorStop(1, `rgba(79, 70, 229, 0)`);

                    ctx.beginPath();
                    ctx.arc(p.x, p.y, glow, 0, Math.PI * 2);
                    ctx.fillStyle = gradient;
                    ctx.fill();

                    // Core dot
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(79, 70, 229, ${alpha * 0.55})`;
                    ctx.fill();
                }
            }

            animRef.current = requestAnimationFrame(draw);
        }

        animRef.current = requestAnimationFrame(draw);

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animRef.current);
        };
    }, [createParticles, isDark]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0"
            aria-hidden="true"
        />
    );
}

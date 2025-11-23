import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  type: 'bean' | 'steam' | 'star';
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Create particles
    const createParticles = () => {
      const particles: Particle[] = [];
      const particleCount = Math.floor((window.innerWidth * window.innerHeight) / 15000);
      
      for (let i = 0; i < particleCount; i++) {
        const types: Array<'bean' | 'steam' | 'star'> = ['bean', 'bean', 'steam', 'star'];
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 4 + 2,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5 - 0.3,
          opacity: Math.random() * 0.3 + 0.1,
          type: types[Math.floor(Math.random() * types.length)]
        });
      }
      return particles;
    };

    particlesRef.current = createParticles();

    // Draw coffee bean
    const drawBean = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, opacity: number) => {
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.fillStyle = "#6F4E37";
      ctx.beginPath();
      ctx.ellipse(x, y, size, size * 1.3, Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();
      
      // Bean line
      ctx.strokeStyle = "#5A3A29";
      ctx.lineWidth = size * 0.3;
      ctx.beginPath();
      ctx.moveTo(x - size * 0.3, y - size * 0.5);
      ctx.lineTo(x + size * 0.3, y + size * 0.5);
      ctx.stroke();
      ctx.restore();
    };

    // Draw steam
    const drawSteam = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, opacity: number) => {
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.fillStyle = "#E5A36F";
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    // Draw star
    const drawStar = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, opacity: number) => {
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.fillStyle = "#E5A36F";
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
        const x1 = x + Math.cos(angle) * size;
        const y1 = y + Math.sin(angle) * size;
        if (i === 0) ctx.moveTo(x1, y1);
        else ctx.lineTo(x1, y1);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle) => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Wrap around screen
        if (particle.x < -20) particle.x = canvas.width + 20;
        if (particle.x > canvas.width + 20) particle.x = -20;
        if (particle.y < -20) particle.y = canvas.height + 20;
        if (particle.y > canvas.height + 20) particle.y = -20;

        // Draw particle
        if (particle.type === 'bean') {
          drawBean(ctx, particle.x, particle.y, particle.size, particle.opacity);
        } else if (particle.type === 'steam') {
          drawSteam(ctx, particle.x, particle.y, particle.size, particle.opacity);
        } else {
          drawStar(ctx, particle.x, particle.y, particle.size, particle.opacity);
        }
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: 0.4 }}
    />
  );
}

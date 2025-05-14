import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import { SplitText } from 'gsap/SplitText';
import ServicesSection from '../components/ServicesSection';
import GallerySlider from '../components/GallerySlider';

gsap.registerPlugin(ScrollTrigger, TextPlugin, SplitText);

// Interface for our particle type
interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  opacity: number;
  linkedParticles: number[];
}

const Home: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Particles effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas to full screen
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    
    // Particle settings
    const particleCount = 80; // Number of particles
    const maxDistance = 150; // Maximum distance for connecting particles
    const mouseMoveRadius = 120; // Radius of mouse influence
    const particles: Particle[] = [];
    const colors = ['#6366f1', '#ec4899', '#06b6d4', '#ffffff']; // Primary, accent, and white colors
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: Math.random() * 0.5 - 0.25,
        speedY: Math.random() * 0.5 - 0.25,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.5 + 0.2,
        linkedParticles: [],
      });
    }
    
    // Mouse move event handler
    const handleMouseMove = (e: MouseEvent) => {
      // Get actual mouse position relative to canvas
      const rect = canvas.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    };
    
    canvas.addEventListener('mousemove', handleMouseMove);
    
    // Animation function
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particles.forEach((particle, index) => {
        // Move particles
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Bounce off edges
        if (particle.x > canvas.width || particle.x < 0) {
          particle.speedX = -particle.speedX;
        }
        if (particle.y > canvas.height || particle.y < 0) {
          particle.speedY = -particle.speedY;
        }
        
        // Mouse interaction - attract particles
        const dx = mousePosition.x - particle.x;
        const dy = mousePosition.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouseMoveRadius) {
          const angle = Math.atan2(dy, dx);
          const force = (mouseMoveRadius - distance) / mouseMoveRadius;
          particle.speedX += Math.cos(angle) * force * 0.02;
          particle.speedY += Math.sin(angle) * force * 0.02;
          
          // Add slight pulse effect
          particle.size = Math.min(4, particle.size + 0.1);
        } else {
          // Return to normal size gradually
          particle.size = Math.max(0.5, particle.size * 0.99);
        }
        
        // Speed limit
        particle.speedX = Math.min(1, Math.max(-1, particle.speedX));
        particle.speedY = Math.min(1, Math.max(-1, particle.speedY));
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
        
        // Find particles to connect
        particle.linkedParticles = [];
        particles.forEach((otherParticle, otherIndex) => {
          if (index !== otherIndex) {
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < maxDistance) {
              particle.linkedParticles.push(otherIndex);
              
              // Draw connection lines
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(otherParticle.x, otherParticle.y);
              ctx.strokeStyle = particle.color;
              ctx.globalAlpha = 0.2 * (1 - distance / maxDistance);
              ctx.lineWidth = 0.5;
              ctx.stroke();
              ctx.globalAlpha = 1;
            }
          }
        });
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  // Original animations
  useEffect(() => {
    // Initial loading animation
    const tl = gsap.timeline();
    
    // Variable to store splitTitle reference for cleanup
    let splitTitle: SplitText | null = null;
    
    // Professional sleek animation for "Quantic Studio"
    if (titleRef.current) {
      // Split the title into words and characters for more control
      splitTitle = new SplitText(titleRef.current, { 
        type: "chars,words", 
        charsClass: "char individual-char",
        wordsClass: "word"
      });
      
      const chars = splitTitle.chars;
      const words = splitTitle.words;
      
      // Set initial state - everything invisible with no transforms
      gsap.set(titleRef.current, { autoAlpha: 1 });
      gsap.set(chars, { 
        autoAlpha: 0,
        y: 40,
        rotationX: -90,
        filter: 'blur(10px)'
      });
      
      // Word container animation - subtle scale
      gsap.fromTo(words, 
        { scale: 0.9 },
        { 
          scale: 1, 
          duration: 1.8,
          ease: "power3.out",
        }
      );
      
      // Characters animation with staggered reveal
      tl.to(chars, {
        duration: 0.05,
        autoAlpha: 1,
        y: 0,
        rotationX: 0,
        filter: 'blur(0px)',
        stagger: {
          each: 0.06,
          from: "start",
          ease: "power4.out"
        },
        ease: "power4.out",
      })
      // Add a slight bounce at the end
      .to(chars, {
        duration: 0.2,
        y: -10,
        ease: "power2.in",
        stagger: {
          each: 0.03,
          from: "start",
        }
      })
      .to(chars, {
        duration: 0.3,
        y: 0,
        ease: "elastic.out(1, 0.3)",
        stagger: {
          each: 0.03,
          from: "start",
        },
        // Add hover effect for each character after initial animation
        onComplete: () => {
          // Add a minimal, elegant light shimmer effect as a continuous loop
          const createMinimalLightEffect = () => {
            // Create a subtle shimmer effect that moves across the text
            const timeline = gsap.timeline({
              repeat: -1, // Loop indefinitely
              repeatDelay: 4 // Longer delay for minimalism
            });
            
            // Subtle shimmer effect - very gentle color and shadow changes
            timeline.to(chars, {
              duration: 0.8,
              stagger: {
                each: 0.05,
                from: "start",
                grid: "auto"
              },
              color: "rgba(255, 255, 255, 0.95)", // Very subtle brightening
              textShadow: "0 0 8px rgba(255, 255, 255, 0.3)", // Minimal glow
              ease: "sine.inOut",
              overwrite: "auto"
            }).to(chars, {
              duration: 0.8,
              stagger: {
                each: 0.05,
                from: "start",
                grid: "auto"
              },
              color: "", // Return to original color
              textShadow: "",
              ease: "sine.inOut",
            });
            
            // Instead of the diagonal sweep element, use a simpler highlight effect
            const highlightTimeline = gsap.timeline({
              repeat: -1,
              repeatDelay: 5 // Longer delay between highlights for minimalism
            });
            
            // Create a minimal highlight that sweeps across the title
            highlightTimeline.fromTo(titleRef.current, {
              backgroundImage: "linear-gradient(90deg, transparent 0%, transparent 100%)",
              backgroundSize: "200% 100%",
              backgroundRepeat: "no-repeat",
              backgroundClip: "text",
              WebkitBackgroundClip: "text"
            }, {
              backgroundImage: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 10%, rgba(255,255,255,0.3) 20%, transparent 30%)",
              backgroundPosition: "200% 0",
              duration: 3,
              ease: "power1.inOut"
            });
            
            return () => {
              timeline.kill();
              highlightTimeline.kill();
            };
          };
          
          // Start the minimal light effect
          createMinimalLightEffect();
          
          // Setup hover effect for individual characters
          chars.forEach(char => {
            char.addEventListener('mouseenter', () => {
              gsap.to(char, { 
                filter: 'blur(2px)', // More subtle blur
                duration: 0.3, 
                ease: 'sine.out' 
              });
            });
            char.addEventListener('mouseleave', () => {
              gsap.to(char, { 
                filter: 'blur(0px)', 
                duration: 0.3, 
                ease: 'sine.inOut' 
              });
            });
          });
        }
      });
    }
    
    // Animated typing effect for subtitle
    if (subtitleRef.current) {
      tl.fromTo(subtitleRef.current,
        { autoAlpha: 0, y: 20 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
        },
        "-=1"
      ).to(subtitleRef.current, {
        duration: 2,
        text: {
          value: "Crafting digital experiences with modern technologies and minimalist design aesthetics",
          delimiter: " "
        },
        ease: "none",
      }, "-=0.5");
    }
    
    // Floating animation for background elements
    gsap.to('.floating-element', {
      y: -20,
      duration: 2,
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1,
    });
    
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      splitTitle?.revert();
    };
  }, []);
  
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Interactive particle background */}
        <canvas 
          ref={canvasRef}
          className="absolute inset-0 z-0 w-full h-full"
        />
        
        {/* Blurred highlight lights */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {/* Top left highlight */}
          <div className="absolute top-0 left-0 w-[45vw] h-[45vh] opacity-10">
            <div className="absolute w-full h-full bg-white rounded-full blur-[100px] transform -translate-x-1/4 -translate-y-1/4 animate-pulse-slow"></div>
          </div>
          
          {/* Bottom right highlight */}
          <div className="absolute bottom-0 right-0 w-[50vw] h-[50vh] opacity-15">
            <div className="absolute w-full h-full bg-white rounded-full blur-[120px] transform translate-x-1/4 translate-y-1/4 animate-pulse-slow-reverse"></div>
          </div>
        </div>
        
        {/* Minimal noise texture overlay */}
        <div 
          className="absolute inset-0 z-5 mix-blend-overlay opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '150px'
          }}
        ></div>
        
        {/* Content */}
        <div 
          ref={textRef}
          className="container mx-auto px-4 md:px-8 relative z-10 flex flex-col items-center justify-center"
        >
          <div className="text-center backdrop-blur-sm bg-background/10 p-8 rounded-xl">
            <h1 
              ref={titleRef}
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight opacity-0"
            >
              Quantic Studio
            </h1>
            
            <p 
              ref={subtitleRef}
              className="text-sm md:text-base text-white mb-12 max-w-3xl mx-auto opacity-0"
            ></p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-6 mt-8">
              <Link 
                to="/projects" 
                className="group bg-primary hover:bg-primary/90 px-8 py-4 rounded-full font-medium inline-flex items-center justify-center transition-all duration-300 transform hover:scale-105"
                style={{ color: '#000000' }}
              >
                View Projects
                <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link 
                to="/contact" 
                className="group bg-transparent border-2 border-foreground/20 hover:border-foreground/40 text-foreground px-8 py-4 rounded-full font-medium inline-flex items-center justify-center transition-all duration-300 transform hover:scale-105"
              >
                Let's Talk
                <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-40 left-1/2 transform -translate-x-1/2">
          <div className="w-6 h-10 border-2 border-foreground/20 rounded-full p-1">
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce mx-auto"></div>
          </div>
        </div>
      </section>
      
      {/* Services Section - Replaced with component */}
      <ServicesSection id="services" style={{ visibility: 'visible', display: 'block', zIndex: 50, position: 'relative' }} />
      
      {/* Gallery Slider */}
      <section className="py-24 relative bg-gradient-to-b from-background/50 to-background">
        <div className="container mx-auto px-4 md:px-8 mb-12">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-center">
            My <span className="text-primary">Portfolio</span>
              </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-center mb-16">
            Explore some of my latest creative projects with interactive visuals
          </p>
        </div>
        <GallerySlider className="mb-20" />
      </section>
    </motion.main>
  );
};

export default Home;
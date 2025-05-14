import React, { useEffect, useRef } from 'react';
import { Home, User, FolderOpen, Mail } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger with GSAP
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface BottomNavProps {
  onSectionClick: (id: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ onSectionClick }) => {
  const navRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!navRef.current || !containerRef.current) return;
    
    // Initial animation effect for the nav
    gsap.set(containerRef.current, {
      rotateX: 0,
      transformPerspective: 600,
      transformStyle: "preserve-3d"
    });
    
    // Create scroll-triggered animation
    ScrollTrigger.create({
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        // Calculate rotation based on scroll position
        // Subtle rotation effect - max 5 degrees
        const scrollDirection = self.direction > 0 ? 1 : -1; // 1 for down, -1 for up
        const scrollSpeed = Math.abs(self.getVelocity() / 1000);
        const maxTilt = 5; // Maximum tilt in degrees
        
        // Apply tilt effect based on scroll speed and direction
        const tiltAmount = Math.min(scrollSpeed * scrollDirection, maxTilt);
        
        // Apply the rotation to the nav container
        gsap.to(containerRef.current, {
          rotateX: tiltAmount,
          duration: 0.5,
          ease: "power2.out",
        });
        
        // Add subtle scale effect based on scroll position
        const scale = 1 - (Math.abs(tiltAmount) / 100); // Subtle scale change
        gsap.to(containerRef.current, {
          scale: scale,
          duration: 0.5,
          ease: "power2.out",
        });
        
        // Add subtle y-position change based on scroll direction
        const yOffset = scrollDirection * 2; // Small Y movement
        gsap.to(navRef.current, {
          y: yOffset,
          duration: 0.5,
          ease: "power2.out",
        });
      }
    });
    
    // Create a hover effect for added interactivity
    containerRef.current.addEventListener('mouseenter', () => {
      gsap.to(containerRef.current, {
        scale: 1.05,
        duration: 0.3,
        ease: "power1.out"
      });
    });
    
    containerRef.current.addEventListener('mouseleave', () => {
      gsap.to(containerRef.current, {
        scale: 1,
        duration: 0.3,
        ease: "power1.out"
      });
    });
    
    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);
  
  return (
    <nav ref={navRef} className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <div 
        ref={containerRef}
        className="bg-background/60 backdrop-blur-xl border border-foreground/10 px-6 py-4 rounded-full shadow-lg"
        style={{ transformOrigin: "center center" }}
      >
        <ul className="flex items-center gap-8">
          {[
            { id: 'home', icon: <Home size={20} />, label: 'Home' },
            { id: 'about', icon: <User size={20} />, label: 'About' },
            { id: 'projects', icon: <FolderOpen size={20} />, label: 'Projects' },
            { id: 'contact', icon: <Mail size={20} />, label: 'Contact' },
          ].map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onSectionClick(item.id)}
                data-section={item.id}
                className="relative flex flex-col items-center gap-1 text-sm font-medium
                  transition-colors duration-300 text-foreground/60 hover:text-foreground"
              >
                {item.icon}
                <span className="text-xs">{item.label}</span>
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary transition-opacity duration-300 opacity-0 group-hover:opacity-100" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default BottomNav;
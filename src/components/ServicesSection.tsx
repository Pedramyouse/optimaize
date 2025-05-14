import React, { useRef, CSSProperties, useEffect } from 'react';
// Available icons: Code, Palette, Layers, Sparkles, Lightbulb, Smartphone, Monitor, Users, Share2, ThumbsUp, MessageSquare, Award
import { Lightbulb, Palette, Users } from 'lucide-react'; // Updated icons
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  createScrollTimeline, 
  cleanupScrollTriggers, 
  performanceDefaults 
} from '../utils/gsapUtils';

// ServiceCard component defined directly here
interface ServiceProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
  componentId: string;
}

const ServiceCard: React.FC<ServiceProps> = ({ icon, title, description, index, componentId }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  
  useEffect(() => {
    const card = cardRef.current;
    const iconEl = iconRef.current;
    const titleEl = titleRef.current;
    const descEl = descRef.current;
    
    if (!card || !iconEl || !titleEl || !descEl) return;
    
    // Create staggered animation timeline for card elements
    // Use specific ID for each card to properly track and clean them up
    const cardId = `${componentId}-card-${index}`;
    
    const tl = createScrollTimeline(cardId, {
      trigger: card,
      start: 'top 85%',
      toggleActions: 'play none none none'
    });
    
    // Timeline animations - using performanceDefaults
    tl.fromTo(card, 
      { 
        y: 60,
        opacity: 0,
        scale: 0.9
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: performanceDefaults.duration,
        ease: performanceDefaults.ease,
        delay: index * 0.1, // Reduced from 0.15 to improve performance
        force3D: true
      }
    )
    .fromTo(iconEl, 
      {
        scale: 0,
        opacity: 0
      },
      {
        scale: 1,
        opacity: 1,
        ease: "back.out(1.7)",
        duration: 0.4, // Reduced duration
        force3D: true
      }, 
      "-=0.3" // Adjusted timing
    )
    .fromTo(titleEl, 
      {
        y: 20,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.4, // Reduced duration
        ease: performanceDefaults.ease,
        force3D: true
      }, 
      "-=0.2" // Adjusted timing
    )
    .fromTo(descEl, 
      {
        y: 20,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.4, // Reduced duration
        ease: performanceDefaults.ease,
        force3D: true
      }, 
      "-=0.2" // Adjusted timing
    );
    
    // Clean up
    return () => {
      cleanupScrollTriggers(cardId);
    };
  }, [index, componentId]);
  
  return (
    <div
      ref={cardRef}
      className="service-item group p-10 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
      style={{ 
        backgroundColor: '#121212', 
        border: '1px solid rgba(255, 255, 255, 0.1)',
        color: 'white',
        position: 'relative',
        zIndex: 'var(--z-content-raised)',
        display: 'block',
        width: '100%',
        height: 'auto',
        minHeight: '250px',
        visibility: 'visible'
      }}
    >
      <div 
        ref={iconRef}
        className="mb-6 transform group-hover:scale-110 transition-transform duration-300"
        style={{ display: 'block', visibility: 'visible' }}
      >
        {icon}
      </div>
      <h3 
        ref={titleRef}
        className="text-2xl font-bold mb-4" 
        style={{ color: 'white', display: 'block', visibility: 'visible' }}
      >
        {title}
      </h3>
      <p 
        ref={descRef}
        style={{ color: 'rgba(255, 255, 255, 0.8)', display: 'block', visibility: 'visible' }}
      >
        {description}
      </p>
    </div>
  );
};

interface ServicesSectionProps {
  id?: string;
  style?: CSSProperties;
}

const SERVICES_COMPONENT_ID = 'services-section';

const ServicesSection: React.FC<ServicesSectionProps> = ({ id, style }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const subheadingRef = useRef<HTMLParagraphElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const decorationRef1 = useRef<HTMLDivElement>(null);
  const decorationRef2 = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const subheading = subheadingRef.current;
    const cardsContainer = cardsContainerRef.current;
    const decoration1 = decorationRef1.current;
    const decoration2 = decorationRef2.current;
    
    if (!section || !heading || !subheading || !cardsContainer || !decoration1 || !decoration2) return;
    
    // Main timeline for section entrance
    const mainTl = createScrollTimeline(SERVICES_COMPONENT_ID, {
      trigger: section,
      start: "top 80%",
      toggleActions: "play none none none"
    });
    
    // Animate decorative elements
    mainTl.fromTo(
      [decoration1, decoration2], 
      { 
        scale: 0.5, 
        opacity: 0, 
        x: (index) => index === 0 ? -50 : 50 // First decoration from left, second from right
      }, 
      {
        scale: 1, 
        opacity: 1, 
        x: 0, 
        duration: 1.2, 
        ease: performanceDefaults.ease,
        stagger: 0.1,
        force3D: true
      }
    );
    
    // Animate title and subtitle without manipulating DOM directly
    mainTl.fromTo(
      heading.querySelector(".word-my"),
      {
        y: 30,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: performanceDefaults.ease,
        force3D: true
      },
      "-=0.9" // Start slightly before decorations finish
    );
    
    mainTl.fromTo(
      heading.querySelector(".word-services"),
      {
        y: 30,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: performanceDefaults.ease,
        force3D: true
      },
      "-=0.3" // Overlap with previous animation
    );
    
    // Animate subheading
    mainTl.fromTo(
      subheading,
      { 
        y: 20, 
        opacity: 0 
      },
      {
        y: 0, 
        opacity: 1, 
        duration: 0.6, 
        ease: performanceDefaults.ease,
        force3D: true
      },
      "-=0.3" // Overlap with previous animation
    );
    
    // Animate cards container - just make visible and let cards handle their own animations
    mainTl.fromTo(
      cardsContainer,
      {
        opacity: 0
      },
      {
        opacity: 1,
        duration: 0.3
      },
      "-=0.3" // Overlap with previous animation
    );
    
    // Clean up properly to prevent memory leaks
    return () => {
      cleanupScrollTriggers(SERVICES_COMPONENT_ID);
    };
  }, []);
  
  const services = [
    {
      icon: <Lightbulb size={40} style={{ color: 'white' }} />,
      title: 'Branding',
      description: 'Creating visual identity and brand strategy for your business',
    },
    {
      icon: <Palette size={40} style={{ color: 'white' }} />,
      title: 'Web & App Design',
      description: 'Modern and engaging UI/UX design for various platforms',
    },
    {
      icon: <Users size={40} style={{ color: 'white' }} />,
      title: 'Social Media',
      description: 'Creative content management and production for your social networks',
    },
  ];

  return (
    <section 
      ref={sectionRef} 
      id={id}
      className="py-32 bg-muted/50 relative overflow-visible"
      style={{ 
        position: 'relative', 
        zIndex: 'var(--z-section)',
        visibility: 'visible',
        display: 'block',
        ...style
      }}
    >
      <div className="container mx-auto px-4 md:px-8" style={{ visibility: 'visible', position: 'relative', zIndex: 'var(--z-section-content)' }}>
        <div className="text-center mb-20" style={{ visibility: 'visible' }}>
          <div 
            ref={headingRef}
            className="text-4xl md:text-5xl font-bold mb-6" 
            style={{ visibility: 'visible' }}
          >
            <span className="word-my">My</span> <span className="text-primary word-services">Services</span>
          </div>
          <p 
            ref={subheadingRef}
            className="text-xl text-muted-foreground max-w-2xl mx-auto" 
            style={{ visibility: 'visible' }}
          >
            Our expertise is providing creative and technical solutions for your digital project success
          </p>
        </div>
        
        <div 
          ref={cardsContainerRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10" 
          style={{ visibility: 'visible', position: 'relative', zIndex: 'var(--z-section-content)' }}
        >
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
              index={index}
              componentId={`${SERVICES_COMPONENT_ID}`}
            />
          ))}
        </div>
      </div>
      
      {/* Background decoration */}
      <div 
        ref={decorationRef1}
        className="absolute -top-20 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" 
        style={{ zIndex: 'var(--z-background-decorations)' }}
      ></div>
      <div 
        ref={decorationRef2}
        className="absolute -bottom-20 -left-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl" 
        style={{ zIndex: 'var(--z-background-decorations)' }}
      ></div>
    </section>
  );
};

export default ServicesSection; 
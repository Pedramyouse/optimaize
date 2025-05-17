import React, { useEffect, useState, useRef } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import Cursor from './components/Cursor';
import LoadingScreen from './components/LoadingScreen';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
// import Gallery from './pages/Gallery';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { useGSAP } from '@gsap/react';
import { 
  createScrollTrigger, 
  performanceDefaults, 
  cleanupScrollTriggers 
} from './utils/gsapUtils';

// We don't need to register plugins here since they are registered in gsapUtils
// gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const APP_COMPONENT_ID = 'app-main';

function App() {
  const [loading, setLoading] = useState(true);
  const mainRef = useRef<HTMLElement>(null);
  const sectionsRef = useRef<HTMLDivElement[]>([]);

  useGSAP(() => {
    // Set up section transitions
    sectionsRef.current.forEach((section, i) => {
      if (!section) return;
      
      const sectionId = section.id;
      const componentId = `${APP_COMPONENT_ID}-section-${sectionId}`;
      const sectionChildren = Array.from(section.children) as HTMLElement[];
      
      gsap.set(sectionChildren, {
        y: 50,
        opacity: 0,
        force3D: true 
      });

      createScrollTrigger(componentId, {
        trigger: section,
        start: 'top center',
        end: 'bottom center',
        fastScrollEnd: true, 
        onEnter: () => {
          sectionChildren.forEach(child => child.classList.add('will-change-transform-opacity'));
          gsap.to(sectionChildren, {
            y: 0,
            opacity: 1,
            ...performanceDefaults,
            duration: 0.6,
            stagger: 0.15,
            onComplete: () => {
              sectionChildren.forEach(child => child.classList.remove('will-change-transform-opacity'));
            }
          });
          document.querySelector(`[data-section="${sectionId}"]`)?.classList.add('text-primary');
        },
        onLeaveBack: () => {
          sectionChildren.forEach(child => child.classList.add('will-change-transform-opacity'));
          gsap.to(sectionChildren, {
            y: 50,
            opacity: 0,
            ...performanceDefaults,
            duration: 0.3,
            onComplete: () => {
              sectionChildren.forEach(child => child.classList.remove('will-change-transform-opacity'));
            }
          });
          document.querySelector(`[data-section="${sectionId}"]`)?.classList.remove('text-primary');
        },
        onEnterBack: () => {
          sectionChildren.forEach(child => child.classList.add('will-change-transform-opacity'));
          gsap.to(sectionChildren, {
            y: 0,
            opacity: 1,
            ...performanceDefaults,
            duration: 0.6,
            stagger: 0.15,
            onComplete: () => {
              sectionChildren.forEach(child => child.classList.remove('will-change-transform-opacity'));
            }
          });
          document.querySelector(`[data-section="${sectionId}"]`)?.classList.add('text-primary');
        },
        onLeave: () => {
          document.querySelector(`[data-section="${sectionId}"]`)?.classList.remove('text-primary');
        }
      });
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => {
      clearTimeout(timer);
      cleanupScrollTriggers(APP_COMPONENT_ID);
    };
  }, []);

  const scrollToSection = (id: string) => {
    gsap.to(window, {
      duration: 1,  // Reduced from 1.5
      scrollTo: `#${id}`,
      ease: 'power3.inOut', // Changed from power4 to power3 for better performance
      overwrite: 'auto'
    });
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <BrowserRouter>
      <ThemeProvider>
        <div className="relative">
          <Cursor />
          <Header />
          <main ref={mainRef} className="relative z-10">
            <section 
              id="home" 
              ref={el => sectionsRef.current[0] = el as HTMLDivElement}
              className="min-h-screen relative z-10"
            >
              <Home />
            </section>
            <section 
              id="about"
              ref={el => sectionsRef.current[1] = el as HTMLDivElement}
              className="min-h-screen relative z-10"
            >
              <About />
            </section>
            <section 
              id="projects"
              ref={el => sectionsRef.current[2] = el as HTMLDivElement}
              className="min-h-screen relative z-10"
            >
              <Projects />
            </section>
            <section 
              id="contact"
              ref={el => sectionsRef.current[3] = el as HTMLDivElement}
              className="min-h-screen relative z-10"
            >
              <Contact />
            </section>
            {/* 
            <section 
              id="gallery"
              ref={el => sectionsRef.current[4] = el as HTMLDivElement}
              className="min-h-screen relative z-10"
            >
              <Gallery />
            </section>
            */}
          </main>
          <BottomNav onSectionClick={scrollToSection} />
        </div>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
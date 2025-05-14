import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import { Code, Palette, ExternalLink, ArrowRight, Github, Eye, Layers } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger, TextPlugin);

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  tags: string[];
  link: string;
  github?: string;
  featured?: boolean;
}

const Projects: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const projectsRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  
  const projects: Project[] = [
    {
      id: 1,
      title: 'E-Commerce Platform',
      description: 'A full-featured online store built with React and Node.js, featuring real-time inventory management and seamless payment integration.',
      image: 'https://images.pexels.com/photos/5076516/pexels-photo-5076516.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      category: 'Web Development',
      tags: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      link: '#',
      github: '#',
      featured: true,
    },
    {
      id: 2,
      title: 'Financial Dashboard',
      description: 'Interactive financial analytics dashboard with real-time data visualization and predictive modeling capabilities.',
      image: 'https://images.pexels.com/photos/6476264/pexels-photo-6476264.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      category: 'UI/UX Design',
      tags: ['Dashboard', 'Data Visualization', 'Figma', 'React'],
      link: '#',
      featured: true,
    },
    {
      id: 3,
      title: 'Travel Companion App',
      description: 'A comprehensive travel planning application with AI-powered recommendations and interactive itinerary building.',
      image: 'https://images.pexels.com/photos/3769138/pexels-photo-3769138.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      category: 'Mobile Development',
      tags: ['React Native', 'Firebase', 'Maps API', 'AI'],
      link: '#',
      github: '#',
    },
    {
      id: 4,
      title: 'Corporate Website',
      description: 'Modern corporate website with advanced animations and interactive elements, built for optimal performance.',
      image: 'https://images.pexels.com/photos/3182773/pexels-photo-3182773.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      category: 'Web Development',
      tags: ['Next.js', 'GSAP', 'Tailwind', 'SEO'],
      link: '#',
    },
    {
      id: 5,
      title: 'Design System',
      description: 'Comprehensive design system and component library built for scalability and consistency across platforms.',
      image: 'https://images.pexels.com/photos/5473298/pexels-photo-5473298.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      category: 'UI/UX Design',
      tags: ['Design System', 'Components', 'Documentation'],
      link: '#',
      github: '#',
    },
    {
      id: 6,
      title: 'AI Content Platform',
      description: 'Content management platform with AI-powered content generation and optimization tools.',
      image: 'https://images.pexels.com/photos/7103/writing-notes-idea-conference.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      category: 'Mobile Development',
      tags: ['AI/ML', 'React', 'Node.js', 'MongoDB'],
      link: '#',
    },
  ];
  
  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(project => project.category === activeFilter));
    }
  }, [activeFilter]);
  
  useEffect(() => {
    // Hero section animation
    const heroTl = gsap.timeline();
    
    heroTl.from(heroRef.current?.querySelector('h1'), {
      y: 100,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
    }).from(heroRef.current?.querySelector('p'), {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
    }, '-=0.5');
    
    // Filter buttons animation
    gsap.from(filterRef.current?.children, {
      opacity: 0,
      y: 30,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: filterRef.current,
        start: 'top 80%',
      },
    });
    
    // Project cards animation
    const projectCards = projectsRef.current?.querySelectorAll('.project-card');
    
    if (projectCards) {
      gsap.from(projectCards, {
        opacity: 0,
        y: 100,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: projectsRef.current,
          start: 'top 70%',
        },
      });
    }
    
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [filteredProjects]);
  
  const categories = ['all', ...new Set(projects.map(project => project.category))];
  
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="pt-24 md:pt-28"
    >
      {/* Hero Section */}
      <section ref={heroRef} className="py-20 bg-muted/50 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Featured <span className="text-primary">Projects</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore my portfolio of selected projects showcasing innovation in web development and design
            </p>
          </div>
        </div>
      </section>
      
      {/* Projects Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-8">
          {/* Filter Buttons */}
          <div 
            ref={filterRef}
            className="flex flex-wrap justify-center gap-4 mb-16"
          >
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => setActiveFilter(category)}
                className={`px-8 py-3 rounded-full text-lg transition-all duration-300 transform hover:scale-105 ${
                  activeFilter === category
                    ? 'bg-primary text-white shadow-lg shadow-primary/25'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {category === 'all' ? 'All Projects' : category}
              </button>
            ))}
          </div>
          
          {/* Projects Grid */}
          <div 
            ref={projectsRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredProjects.map((project) => (
              <div 
                key={project.id} 
                className="project-card group relative bg-background rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2"
              >
                {/* Project Image */}
                <div className="relative h-64 overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${project.image})` }}
                  ></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-90"></div>
                  
                  {/* Featured Badge */}
                  {project.featured && (
                    <div className="absolute top-4 right-4 bg-primary/90 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Featured
                    </div>
                  )}
                </div>
                
                {/* Project Info */}
                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold">{project.title}</h3>
                    <span className="inline-block text-xs font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">
                      {project.category}
                    </span>
                  </div>
                  
                  <p className="text-muted-foreground mb-6">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-8">
                    {project.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="text-sm bg-muted px-3 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-primary text-white hover:bg-primary/90 px-4 py-2 rounded-lg font-medium inline-flex items-center justify-center transition-colors group"
                    >
                      <Eye size={18} className="mr-2" />
                      Live Preview
                      <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </a>
                    
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-muted hover:bg-muted/80 px-4 py-2 rounded-lg font-medium inline-flex items-center justify-center transition-colors"
                      >
                        <Github size={18} className="mr-2" />
                        Code
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-accent text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 md:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">Have a Project in Mind?</h2>
          <p className="text-xl text-accent-foreground/90 max-w-2xl mx-auto mb-12">
            I'm always excited to collaborate on new projects and bring innovative ideas to life.
          </p>
          <a 
            href="/contact" 
            className="group bg-white text-accent hover:bg-accent-foreground/90 px-10 py-4 rounded-full font-medium inline-flex items-center justify-center transition-all duration-300 transform hover:scale-105"
          >
            Start a Conversation
            <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </section>
    </motion.main>
  );
};

export default Projects;
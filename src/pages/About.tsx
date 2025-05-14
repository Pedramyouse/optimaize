import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Code, Palette, Monitor, ArrowRight, Award, BookOpen, PanelRight, Briefcase } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const About: React.FC = () => {
  const skillsRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Skills animation
    const skillBars = skillsRef.current?.querySelectorAll('.skill-progress');
    
    if (skillBars) {
      gsap.from(skillBars, {
        width: 0,
        duration: 1.5,
        ease: 'power2.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: skillsRef.current,
          start: 'top 70%',
        },
      });
    }
    
    // Timeline animation
    const timelineItems = timelineRef.current?.querySelectorAll('.timeline-item');
    
    if (timelineItems) {
      gsap.from(timelineItems, {
        opacity: 0,
        y: 50,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: timelineRef.current,
          start: 'top 70%',
        },
      });
    }
    
    // Stats animation
    const statItems = statsRef.current?.querySelectorAll('.stat-item');
    
    if (statItems) {
      gsap.from(statItems, {
        opacity: 0,
        scale: 0.9,
        duration: 0.6,
        stagger: 0.1,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: statsRef.current,
          start: 'top 80%',
        },
      });
      
      // Counter animation for numbers
      statItems.forEach(item => {
        const countElement = item.querySelector('.count');
        const targetNumber = parseInt(countElement?.textContent || '0', 10);
        
        gsap.from(countElement, {
          innerText: 0,
          duration: 2,
          snap: { innerText: 1 },
          scrollTrigger: {
            trigger: statsRef.current,
            start: 'top 80%',
          },
          onUpdate: () => {
            if (countElement) {
              countElement.textContent = Math.ceil(parseFloat(countElement.textContent || '0')).toString();
            }
          },
        });
      });
    }
    
    return () => {
      // Clean up ScrollTrigger instances
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);
  
  const skills = [
    { name: 'HTML/CSS', level: 95, icon: <Code size={20} className="text-primary" /> },
    { name: 'JavaScript/TypeScript', level: 90, icon: <Code size={20} className="text-primary" /> },
    { name: 'React/Next.js', level: 92, icon: <Monitor size={20} className="text-primary" /> },
    { name: 'UI/UX Design', level: 85, icon: <Palette size={20} className="text-primary" /> },
    { name: 'Node.js/Express', level: 80, icon: <PanelRight size={20} className="text-primary" /> },
    { name: 'GSAP/Animation', level: 88, icon: <Palette size={20} className="text-primary" /> },
  ];
  
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="pt-24 md:pt-28"
    >
      {/* About Intro Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold mb-6">
                About <span className="text-primary">Me</span>
              </h1>
              
              <p className="text-lg text-muted-foreground mb-6">
                I'm a passionate web developer and designer with a focus on creating exceptional digital experiences 
                that combine aesthetic appeal with functional excellence.
              </p>
              
              <p className="text-muted-foreground mb-8">
                With over 5 years of experience in the industry, I've worked with various clients from startups to 
                established companies, helping them achieve their goals through thoughtful design and clean, efficient code.
                I'm particularly interested in interactive web experiences, performance optimization, and creating intuitive 
                user interfaces.
              </p>
              
              <Link 
                to="/contact" 
                className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium inline-flex items-center justify-center transition-colors"
              >
                Let's Connect
                <ArrowRight size={18} className="ml-2" />
              </Link>
            </div>
            
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden">
                <img 
                  src="https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Professional portrait" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 md:w-40 md:h-40 bg-primary rounded-2xl -z-10"></div>
              <div className="absolute -top-6 -right-6 w-32 h-32 md:w-40 md:h-40 bg-accent rounded-2xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Skills Section */}
      <section ref={skillsRef} className="py-16 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              My <span className="text-primary">Skills</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The tools and technologies I use to bring digital products to life
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 max-w-4xl mx-auto">
            {skills.map((skill, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    {skill.icon}
                    <span className="font-medium">{skill.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{skill.level}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="skill-progress h-full bg-primary rounded-full"
                    style={{ width: `${skill.level}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section ref={statsRef} className="py-16 md:py-24 bg-primary text-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { count: 50, label: 'Projects Completed', icon: <Briefcase /> },
              { count: 15, label: 'Happy Clients', icon: <Award /> },
              { count: 5, label: 'Years Experience', icon: <BookOpen /> },
              { count: 500, label: 'Coffee Cups', icon: <Award /> },
            ].map((stat, index) => (
              <div key={index} className="stat-item text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4">
                  {stat.icon}
                </div>
                <div className="count text-4xl font-bold mb-2">{stat.count}</div>
                <div className="text-primary-foreground/90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Experience Timeline */}
      <section ref={timelineRef} className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              My <span className="text-primary">Journey</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The path that has shaped my skills and expertise in the digital realm
            </p>
          </div>
          
          <div className="relative max-w-3xl mx-auto pt-8">
            {/* Timeline line */}
            <div className="absolute top-0 left-1/2 w-0.5 h-full bg-muted transform -translate-x-1/2"></div>
            
            {/* Timeline items */}
            {[
              {
                year: '2023 - Present',
                position: 'Senior Frontend Developer',
                company: 'Tech Innovations Inc.',
                description: 'Leading the frontend development team, architecting scalable solutions, and implementing modern web technologies.',
              },
              {
                year: '2020 - 2023',
                position: 'UI/UX Developer',
                company: 'Creative Agency',
                description: 'Designed and developed user interfaces for various clients, focusing on creating engaging and accessible experiences.',
              },
              {
                year: '2018 - 2020',
                position: 'Web Developer',
                company: 'Digital Solutions',
                description: 'Built responsive websites and applications using React, Node.js, and other modern technologies.',
              },
            ].map((item, index) => (
              <div key={index} className="timeline-item relative mb-12">
                <div className={`flex items-center ${index % 2 === 0 ? 'flex-row-reverse' : ''}`}>
                  {/* Content */}
                  <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'pl-8'}`}>
                    <div className="bg-background p-6 rounded-lg shadow-sm border border-foreground/5">
                      <span className="inline-block text-xs font-semibold text-primary mb-2">
                        {item.year}
                      </span>
                      <h3 className="text-lg font-bold mb-1">{item.position}</h3>
                      <h4 className="text-base text-muted-foreground mb-3">{item.company}</h4>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                  
                  {/* Spacer */}
                  <div className="w-2/12 flex justify-center">
                    <div className="w-4 h-4 bg-primary rounded-full relative z-10"></div>
                  </div>
                  
                  {/* Empty space for alternating layout */}
                  <div className="w-5/12"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-accent text-white">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Let's Create Something Amazing</h2>
          <p className="text-accent-foreground/90 max-w-2xl mx-auto mb-8">
            Interested in working together? Let's discuss your project and see how I can help bring your ideas to life.
          </p>
          <Link 
            to="/contact" 
            className="bg-white text-accent hover:bg-accent-foreground/90 px-8 py-3 rounded-lg font-medium inline-flex items-center justify-center transition-colors"
          >
            Start a Project
            <ArrowRight size={18} className="ml-2" />
          </Link>
        </div>
      </section>
    </motion.main>
  );
};

export default About;
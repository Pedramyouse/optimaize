import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { Mail, Phone, MapPin, Send, Loader } from 'lucide-react';

const Contact: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormState({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 3000);
    }, 1500);
  };
  
  useEffect(() => {
    const tl = gsap.timeline();
    
    // Animate form elements
    if (formRef.current) {
      tl.from(formRef.current.querySelectorAll('.form-element'), {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
      }, 0.2);
    }
    
    // Animate info elements
    if (infoRef.current) {
      tl.from(infoRef.current.querySelectorAll('.info-element'), {
        x: -30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
      }, 0.2);
    }
    
    return () => {
      tl.kill();
    };
  }, []);
  
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="pt-24 md:pt-28"
    >
      {/* Hero Section */}
      <section className="py-12 md:py-20 bg-muted/50">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-6">
            Let's <span className="text-primary">Connect</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have a project in mind or just want to say hello? I'd love to hear from you.
          </p>
        </div>
      </section>
      
      {/* Contact Form Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Contact Info */}
            <div ref={infoRef} className="order-2 lg:order-1">
              <h2 className="text-2xl md:text-3xl font-bold mb-8">
                Get in <span className="text-primary">Touch</span>
              </h2>
              
              <div className="space-y-8">
                <div className="info-element flex items-start space-x-6">
                  <div className="flex items-center justify-center w-12 h-12 bg-primary/10 text-primary rounded-full">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Email</h3>
                    <p className="text-muted-foreground">contact@example.com</p>
                  </div>
                </div>
                
                <div className="info-element flex items-start space-x-6">
                  <div className="flex items-center justify-center w-12 h-12 bg-primary/10 text-primary rounded-full">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Phone</h3>
                    <p className="text-muted-foreground">+1 (123) 456-7890</p>
                  </div>
                </div>
                
                <div className="info-element flex items-start space-x-6">
                  <div className="flex items-center justify-center w-12 h-12 bg-primary/10 text-primary rounded-full">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Location</h3>
                    <p className="text-muted-foreground">New York, NY, United States</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-12">
                <h3 className="text-lg font-medium mb-4">Follow Me</h3>
                <div className="flex space-x-4">
                  {['github', 'twitter', 'linkedin', 'dribbble'].map((social) => (
                    <a
                      key={social}
                      href={`https://${social}.com`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-muted flex items-center justify-center rounded-full hover:bg-primary hover:text-white transition-colors"
                      aria-label={`Follow on ${social}`}
                    >
                      <span className="capitalize">{social.charAt(0)}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="order-1 lg:order-2">
              <form 
                ref={formRef} 
                onSubmit={handleSubmit}
                className="bg-background p-8 rounded-lg shadow-sm border border-foreground/5"
              >
                <h2 className="text-2xl md:text-3xl font-bold mb-8">
                  Send Me a <span className="text-primary">Message</span>
                </h2>
                
                <div className="space-y-6">
                  <div className="form-element">
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Your Name <span className="text-error">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-foreground/10 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div className="form-element">
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Your Email <span className="text-error">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formState.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-foreground/10 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>
                  
                  <div className="form-element">
                    <label htmlFor="subject" className="block text-sm font-medium mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formState.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-foreground/10 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
                      placeholder="Project Inquiry"
                    />
                  </div>
                  
                  <div className="form-element">
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      Your Message <span className="text-error">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formState.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 rounded-lg border border-foreground/10 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors resize-none"
                      placeholder="Hello, I'd like to discuss a project..."
                    />
                  </div>
                  
                  <div className="form-element">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium inline-flex items-center justify-center transition-colors disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader size={18} className="animate-spin mr-2" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send size={18} className="ml-2" />
                        </>
                      )}
                    </button>
                    
                    {submitStatus === 'success' && (
                      <p className="mt-4 text-success text-center">
                        Your message has been sent successfully!
                      </p>
                    )}
                    
                    {submitStatus === 'error' && (
                      <p className="mt-4 text-error text-center">
                        There was an error sending your message. Please try again.
                      </p>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
      
      {/* Map Section */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Find Me <span className="text-primary">Here</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Located in the heart of New York City
            </p>
          </div>
          
          <div className="rounded-lg overflow-hidden h-96 shadow-md">
            <img 
              src="https://images.pexels.com/photos/7412095/pexels-photo-7412095.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
              alt="Map location"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>
    </motion.main>
  );
};

export default Contact;
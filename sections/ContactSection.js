"use client";

import { motion } from 'framer-motion';
import { useState } from 'react';
import { HiMail, HiPhone, HiLocationMarker, HiExternalLink, HiPaperAirplane, HiUser, HiChatAlt, HiDownload } from 'react-icons/hi';
import { cn } from '../utils/cn';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      console.log('Form submitted:', formData);
      alert('Thank you for your message! I\'ll get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitting(false);
    }, 1000);
  };

  const contactInfo = [
    {
      icon: HiMail,
      label: 'Email',
      value: 'urmi24112001@gmail.com',
      href: 'mailto:urmi24112001@gmail.com'
    },
    {
      icon: HiLocationMarker,
      label: 'Location',
      value: 'Kolkata, India',
      href: null
    }
  ];

  const socialLinks = [
    {
      name: 'LinkedIn',
      href: 'https://www.linkedin.com/in/urmi-chakraborty-809678183/',
      description: 'Professional network & updates'
    },
    {
      name: 'Muckrack',
      href: 'https://muckrack.com/urmi-chakraborty-1',
      description: 'My Muck Rack profile'
    }
  ];

  const downloadPortfolioPDF = () => {
    const link = document.createElement('a');
    link.href = '/Urmi_Chakraborty_Portfolio_Content_Writing_Samples.pdf';
    link.download = 'Urmi_Chakraborty_Portfolio_Content_Writing_Samples.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadPortfolioDOCX = () => {
    const link = document.createElement('a');
    link.href = '/Urmi_Chakraborty_Portfolio_Content_Writing_Samples.docx';
    link.download = 'Urmi_Chakraborty_Portfolio_Content_Writing_Samples.docx';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadCV = () => {
    const link = document.createElement('a');
    link.href = '/Urmi_Chakraborty_CV.pdf';
    link.download = 'Urmi_Chakraborty_CV.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const quickActions = [
    {
      title: 'Download CV',
      description: 'Get my complete resume and professional background',
      action: 'Download PDF',
      icon: HiUser,
      onClick: downloadCV
    },
    {
      title: 'Download Portfolio (PDF)',
      description: 'View my content writing samples and case studies',
      action: 'Download PDF',
      icon: HiExternalLink,
      onClick: downloadPortfolioPDF
    },
    {
      title: 'Download Portfolio (DOCX)',
      description: 'Editable version of my writing samples',
      action: 'Download DOCX',
      icon: HiExternalLink,
      onClick: downloadPortfolioDOCX
    }
  ];

  return (
    <section id="contact" className="relative py-20 bg-gradient-to-br from-gray-50 via-purple-50/20 to-blue-50/30 dark:from-gray-900 dark:via-purple-900/10 dark:to-gray-800/50 font-sans transition-colors duration-500 overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-gradient-to-r from-purple-300/15 to-pink-300/15 dark:from-purple-500/8 dark:to-pink-500/8 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-gradient-to-r from-blue-300/15 to-cyan-300/15 dark:from-blue-500/8 dark:to-cyan-500/8 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl animate-pulse-slower" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-pink-300/8 to-purple-300/8 dark:from-pink-500/4 dark:to-purple-500/4 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-2xl" />
        
        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 0.4, 0],
              scale: [0, 1, 0],
              x: [0, Math.random() * 120 - 60],
              y: [0, Math.random() * 120 - 60],
            }}
            transition={{
              duration: 14 + i * 2,
              repeat: Infinity,
              delay: i * 4,
              ease: "easeInOut",
            }}
            className="absolute w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 dark:from-purple-500 dark:to-pink-500 rounded-full opacity-15"
            style={{
              left: `${10 + (i * 15)}%`,
              top: `${20 + (i * 10)}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header - Enhanced */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, type: "spring", bounce: 0.3 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium mb-6 border border-purple-200/50 dark:border-purple-700/50"
          >
            Get In Touch
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-8 font-sans"
          >
            Let's {' '}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 dark:from-purple-400 dark:via-pink-400 dark:to-purple-400 bg-clip-text text-transparent">
                connect
              </span>
              <motion.div
                className="absolute -bottom-1 sm:-bottom-2 left-0 right-0 h-0.5 sm:h-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                viewport={{ once: true }}
              />
            </span>
            {' '}&{' '}
            <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 dark:from-pink-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              create impactful
            </span>
            <br />
            <span className="text-gray-700 dark:text-gray-300">content</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-xl text-gray-600 dark:text-gray-300 max-w-5xl mx-auto leading-relaxed font-sans"
          >
            From breaking news to in-depth features, I bring clarity, creativity and credibility to every story. <br/>
            <span className="font-semibold text-purple-600 dark:text-purple-400"> Let's collaborate and bring your vision to life.</span>
          </motion.p>

        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-white/50 dark:border-gray-700/50">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 font-sans">Send me a message</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-sans">
                      Your Name
                    </label>
                    <div className="relative">
                      <HiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-gray-100 font-sans transition-colors"
                        placeholder="Enter your name"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-sans">
                      Email Address
                    </label>
                    <div className="relative">
                      <HiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-gray-100 font-sans transition-colors"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-sans">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-gray-100 font-sans transition-colors"
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-sans">
                    Message
                  </label>
                  <div className="relative">
                    <HiChatAlt className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-gray-100 font-sans transition-colors resize-none"
                      placeholder="Tell me about your project, goals, and how I can help..."
                    />
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "w-full inline-flex items-center justify-center gap-3 px-6 py-4 rounded-lg text-lg font-semibold",
                    "bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 text-white",
                    "shadow-lg hover:shadow-xl transition-all duration-300 font-sans",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <HiPaperAirplane className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Contact Info & Links */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="h-full"
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-white/50 dark:border-gray-700/50 h-full flex flex-col">
              {/* Top Section */}
              <div className="flex-1">
                {/* Professional Links - Enhanced */}
                <div className="mb-8">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 font-sans">Connect With Me</h3>
                    <div className="w-16 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto rounded-full"></div>
                  </div>
                  <div className="space-y-4">
                    {socialLinks.map((link, index) => (
                      <motion.a
                        key={link.name}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: index * 0.2 }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.05, y: -3 }}
                        className="relative flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-800/30 dark:hover:to-pink-800/30 transition-all duration-150 group border border-purple-200/50 dark:border-purple-700/50 overflow-hidden"
                      >
                        {/* Animated background glow */}
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-pink-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-150"></div>
                        
                        <div className="relative w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-150">
                          <HiExternalLink className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-150" />
                        </div>
                        <div className="relative flex-1">
                          <h4 className="font-bold text-gray-900 dark:text-gray-100 font-sans group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors text-lg">
                            {link.name}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 font-sans group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                            {link.description}
                          </p>
                        </div>
                  
                      </motion.a>
                    ))}
                  </div>
                </div>

                {/* Divider with decoration */}
                <div className="relative my-8">
                  <div className="border-t border-gray-200 dark:border-gray-600"></div>
                  <div className="absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                      <HiMail className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  {contactInfo.map((info, index) => {
                    const IconComponent = info.icon;
                    return (
                      <motion.div
                        key={info.label}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.02, x: 5 }}
                        className="flex justify-center items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-all duration-150"
                      >
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1 font-sans">{info.label}</h4>
                          {info.href ? (
                            <a
                              href={info.href}
                              className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium font-sans transition-colors"
                            >
                              {info.value}
                            </a>
                          ) : (
                            <p className="text-gray-600 dark:text-gray-300 font-medium font-sans">{info.value}</p>
                          )}
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-sans">{info.description}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>


            </div>
          </motion.div>
        </div>

        {/* Documents Section - Horizontal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-12"
        >
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/50 dark:border-gray-700/50">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center font-sans">Documents & Downloads</h3>
                         <div className="flex flex-col sm:flex-row gap-6 justify-center">
               {quickActions.map((action, index) => {
                 const IconComponent = action.icon;
                 return (
                   <motion.div
                     key={action.title}
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.5, delay: index * 0.1 }}
                     viewport={{ once: true }}
                     whileHover={{ scale: 1.05, y: -2 }}
                     onClick={action.onClick}
                     className="cursor-pointer bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-150 border border-gray-200 dark:border-gray-600 group max-w-xs"
                   >
                     <div className="flex flex-col items-center text-center space-y-4">
                       <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
                         <IconComponent className="w-6 h-6 text-white" />
                       </div>
                       <div>
                         <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 font-sans group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                           {action.title}
                         </h4>
                         <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 font-sans">
                           {action.description}
                         </p>
                         <div className="flex items-center justify-center gap-2 text-sm font-medium text-purple-600 dark:text-purple-400 font-sans">
                           <span>{action.action}</span>
                           <HiDownload className="w-4 h-4 group-hover:animate-bounce" />
                         </div>
                       </div>
                     </div>
                   </motion.div>
                 );
               })}
             </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection; 
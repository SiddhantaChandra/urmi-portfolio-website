"use client";

import { motion } from 'framer-motion';
import { useState } from 'react';
import { HiMail, HiPhone, HiLocationMarker, HiExternalLink, HiPaperAirplane, HiUser, HiChatAlt } from 'react-icons/hi';
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
      href: 'mailto:urmi24112001@gmail.com',
      description: 'Let\'s discuss your content needs'
    },
    {
      icon: HiLocationMarker,
      label: 'Location',
      value: 'Kolkata, India',
      href: null,
      description: 'Available for remote work globally'
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
      description: 'Journalism portfolio & credentials'
    }
  ];

  const quickActions = [
    {
      title: 'Download Portfolio',
      description: 'Get my complete work samples and case studies',
      action: 'Download PDF',
      onClick: () => console.log('Download portfolio')
    },
    {
      title: 'Schedule a Call',
      description: 'Book a 30-minute consultation call',
      action: 'Book Call',
      onClick: () => console.log('Schedule call')
    }
  ];

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-gray-900 dark:to-gray-800/50 font-sans transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-lg text-sm font-medium mb-4">
            Get In Touch
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6 font-sans">
            Let's {' '}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">connect </span>
            &
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent"> create impactful </span>
            content
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed font-sans">
            From breaking news to in-depth features, I bring clarity, creativity and credibility to every story. Here's how you can reach out to me.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
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

          {/* Contact Info & Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Contact Information */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-white/50 dark:border-gray-700/50">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 font-sans">Contact Information</h3>
              <div className="space-y-6">
                {contactInfo.map((info, index) => {
                  const IconComponent = info.icon;
                  return (
                    <motion.div
                      key={info.label}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-start gap-4"
                    >
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
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

            {/* Social Links */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-white/50 dark:border-gray-700/50">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 font-sans">Professional Links</h3>
              <div className="space-y-4">
                {socialLinks.map((link, index) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600/50 transition-all duration-300 group"
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 rounded-lg flex items-center justify-center">
                      <HiExternalLink className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 font-sans group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {link.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-sans">{link.description}</p>
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-white/50 dark:border-gray-700/50">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 font-sans">Quick Actions</h3>
              <div className="space-y-4">
                {quickActions.map((action, index) => (
                  <motion.button
                    key={action.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    onClick={action.onClick}
                    className="w-full text-left p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600/50 transition-all duration-300 group"
                  >
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 font-sans group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {action.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 font-sans">{action.description}</p>
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-purple-600 dark:text-purple-400 font-sans">
                      {action.action}
                      <HiExternalLink className="w-4 h-4" />
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 rounded-2xl p-1 shadow-2xl">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 lg:p-12">
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4 font-sans">
                Ready to transform your content strategy?
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto font-sans">
                Let's combine journalistic precision with marketing impact to create content that truly converts.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 font-sans"
                >
                  <HiMail className="w-5 h-5" />
                  Start a Project
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 font-sans"
                >
                  Download Portfolio
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 right-0 w-64 h-64 bg-gradient-to-r from-purple-300/20 to-pink-300/20 dark:from-purple-500/10 dark:to-pink-500/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-gradient-to-r from-blue-300/20 to-cyan-300/20 dark:from-blue-500/10 dark:to-cyan-500/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl" />
      </div>
    </section>
  );
};

export default ContactSection; 
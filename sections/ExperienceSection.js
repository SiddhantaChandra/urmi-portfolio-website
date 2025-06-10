"use client";

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { HiCalendar, HiOfficeBuilding, HiTrendingUp, HiLightBulb, HiStar, HiBadgeCheck, HiNewspaper, HiPencilAlt } from 'react-icons/hi';
import { cn } from '../utils/cn';

const ExperienceSection = () => {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.5", "end 0.5"]
  });

  const springScrollY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const beamHeight = useTransform(springScrollY, [0, 1], ["0%", "100%"]);

  const experiences = [
    {
      period: "Nov 2024 - Present",
      role: "Sub Editor",
      company: "ABP Digital",
      location: "Kolkata",
      type: "Current Role",
      icon: HiNewspaper,
      description: "Working on daily coverage of the entertainment industry. Producing SEO-optimised articles and breaking news while maintaining journalistic accuracy under tight deadlines.",
      achievements: [
        "Report on entertainment news across Hollywood, Bollywood, anime and OTT content",
        "Write and optimize SEO-driven articles to enhance reach and engagement", 
        "Produce spot copies for breaking news, ensuring accuracy and meeting strict deadlines",
        "Cover exclusive celebrity news, film releases and conduct interviews with industry figures",
        "Provide comprehensive event coverage including Kolkata Comic Con",
        "Build and maintain a strong network of industry contacts and sources",
        "Edit and proof copies ensuring clarity, error-free and accurate content",
        "Handle The Telegraph Online's social media presence, ensuring timely coverage of trending and viral topics",
        "Boost page views and user engagement by strategically leveraging push notifications for impactful stories"
      ],
      skills: ["Entertainment Journalism", "SEO Writing", "Breaking News", "Celebrity Interviews", "Event Coverage"],
      color: "from-green-500 to-emerald-500",
      darkColor: "dark:from-green-400 dark:to-emerald-400"
    },
    {
      period: "Aug 2023 - Nov 2024",
      role: "Entertainment reporter for The Telegraph Online",
      company: "ALLCAP Communications",
      location: "ALLCAP Communications - Remote",
      type: "Full-time",
      icon: HiStar,
      description: "Covered daily entertainment developments across Hollywood and Bollywood, while pioneering anime coverage and Korean entertainment reporting. Specialized in celebrity fashion and red carpet trend analysis.",
      achievements: [
        "Covered daily Hollywood and Bollywood developments including film releases and celebrity updates",
        "Introduced in-depth anime coverage through monthly listicles, highlights and reviews",
        "Provided timely Korean entertainment coverage including music, dramas, and celebrity trends",
        "Wrote extensively on celebrity fashion and red carpet trends, highlighting notable looks and analysing style choices"
      ],
      skills: ["Hollywood Coverage", "Bollywood Reporting", "Anime Journalism", "K-Pop Coverage", "Fashion Analysis"],
      color: "from-purple-500 to-pink-500",
      darkColor: "dark:from-purple-400 dark:to-pink-400"
    },
    {
      period: "Nov 2022 - Aug 2023", 
      role: "Freelance reporter for The Telegraph Online and MyKolkata",
      company: "ALLCAP Communications",
      location: "ALLCAP Communications - Kolkata",
      type: "Freelance",
      icon: HiLightBulb,
      description: "Covered popular culture, entertainment and lifestyle with unique perspectives. Provided in-depth coverage of cultural festivals and events while reporting on emerging OTT platforms and entertainment trends.",
      achievements: [
        "Covered popular culture, entertainment and lifestyle with fresh, unique perspectives",
        "Provided in-depth coverage of film and theatre festivals including Nandikar Theatre Festival 2022",
        "Researched and reported on various cultural events delivering timely, engaging stories",
        "Attended press conferences and reported on the latest updates, including new releases on OTT platforms such as Hoichoi"
      ],
      skills: ["Cultural Reporting", "Festival Coverage", "Press Conferences", "OTT Platform Coverage", "Event Journalism"],
      color: "from-blue-500 to-cyan-500",
      darkColor: "dark:from-blue-400 dark:to-cyan-400"
    },
    {
      period: "Aug 2022 - Dec 2023",
      role: "Freelance Academic Writer", 
      company: "MYCHATLESSON",
      location: "Freelance",
      type: "Part-time",
      icon: HiBadgeCheck,
      description: "Developed scripts for a chat-based educational app aimed at students with low attention spans. Created engaging, concise and digestible content.",
      achievements: [
        "Wrote and edited scripts across English Literature, History, Political Science and Geography",
        "Created content for CBSE, ICSE and KSEEB curriculum standards",
        "Analyzed student needs and structured content with clarity, conciseness and simplicity",
        "Specialized in content for students with low attention spans",
        "Consistently delivered quality content within strict deadlines"
      ],
      skills: ["Academic Writing", "Curriculum Development", "Educational Content", "Multi-board Expertise", "Student-focused Writing"],
      color: "from-indigo-500 to-blue-500", 
      darkColor: "dark:from-indigo-400 dark:to-blue-400"
    },
    {
      period: "Aug 2020 - Nov 2022",
      role: "Content Editor",
      company: "Freelance",
      location: "Kolkata",
      type: "Freelance",
      icon: HiPencilAlt,
      description: "Provided comprehensive editing services for academic and non-fiction manuscripts. Focused on improving content quality, argument structure, and ensuring consistency in tone and language across diverse topics.",
      achievements: [
        "Edited and proofed academic and non-fiction manuscripts across diverse topics",
        "Provided constructive feedback and suggestions based on client requirements", 
        "Identified and resolved inconsistencies in tone, language and structure",
        "Maintained high standards for content, argument, structure and format",
        "Developed keen eye for detail ensuring document quality excellence"
      ],
      skills: ["Content Editing", "Proofreading", "Academic Editing", "Structural Analysis", "Quality Assurance"],
      color: "from-teal-500 to-green-500",
      darkColor: "dark:from-teal-400 dark:to-green-400"
    },
    {
      period: "Feb 2020 - Aug 2022",
      role: "Content Writer",
      company: "Freelance",
      location: "Kolkata", 
      type: "Freelance",
      icon: HiTrendingUp,
      description: "Delivered high-quality content across multiple industries and niches. Specialized in creating engaging, informative content for websites and blogs while adapting writing style to client needs.",
      achievements: [
        "Delivered high-quality content that was insightful, informative and entertaining",
        "Created website content, blog posts and articles for travel, lifestyle, animal and health niches",
        "Assessed client requirements and tailored content and style to specific needs",
        "Created high-quality product descriptions to meet market standards",
        "Maintained excellent client relationships with prompt responses and deadline consistency"
      ],
      skills: ["Content Writing", "Blog Writing", "Website Content", "Product Descriptions", "Multi-niche Writing"],
      color: "from-orange-500 to-red-500",
      darkColor: "dark:from-orange-400 dark:to-red-400"
    }
  ];

  useEffect(() => {
    const updateActiveIndex = (latest) => {
      const progress = latest;
      const newIndex = Math.floor(progress * experiences.length);
      setActiveIndex(Math.min(newIndex, experiences.length - 1));
    };

    const unsubscribe = scrollYProgress.on("change", updateActiveIndex);
    return () => unsubscribe();
  }, [scrollYProgress, experiences.length]);

  return (
    <section id="experience" className="py-20 bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900/50 font-sans overflow-hidden transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-lg text-sm font-medium mb-4">
            Professional Journey
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6 font-sans">
            My Career
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent"> Timeline</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed font-sans">
          From creating content for various industries to reporting on daily news and exclusive stories, here's how I've evolved from a content writer to a dedicated journalist.
          </p>
        </motion.div>

        {/* Experience Timeline */}
        <div ref={containerRef} className="relative">
          {/* Tracing Beam */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700 hidden lg:block">
            <motion.div
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-indigo-500 to-purple-500 dark:from-indigo-400 dark:to-purple-400 origin-top"
              style={{ height: beamHeight }}
            />
          </div>

          {/* Experience Items */}
          <div className="space-y-16 sm:space-y-20 lg:space-y-16">
            {experiences.map((exp, index) => {
              const IconComponent = exp.icon;
              const isActive = index <= activeIndex;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative flex flex-col lg:flex-row gap-8 items-start"
                >
                  {/* Timeline Node */}
                  <div className="hidden lg:flex absolute left-0 top-8 -translate-x-1/2">
                    <motion.div
                      className={cn(
                        "w-16 h-16 rounded-full border-4 border-white dark:border-gray-800 shadow-lg flex items-center justify-center",
                        `bg-gradient-to-r ${exp.color} ${exp.darkColor}`,
                        isActive ? "scale-110" : "scale-100"
                      )}
                      animate={{ scale: isActive ? 1.1 : 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <IconComponent className="w-8 h-8 text-white" />
                    </motion.div>
                  </div>

                  {/* Content Card */}
                  <div className="lg:ml-24 w-full">
                    <motion.div
                      className={cn(
                        "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-6 sm:p-8 shadow-lg border transition-all duration-300",
                        isActive 
                          ? "border-indigo-200 dark:border-indigo-500/30 shadow-xl transform scale-105" 
                          : "border-white/50 dark:border-gray-700/50 hover:border-indigo-100 dark:hover:border-indigo-500/20"
                      )}
                      whileHover={{ y: -5 }}
                    >
                      {/* Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                        <div className="flex items-start gap-4 mb-4 sm:mb-0">
                          <div className={cn(
                            "w-14 h-14 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center lg:hidden flex-shrink-0 shadow-md",
                            `bg-gradient-to-r ${exp.color} ${exp.darkColor}`
                          )}>
                            <IconComponent className="w-7 h-7 sm:w-6 sm:h-6 text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 font-sans leading-tight">{exp.role}</h3>
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mt-1">
                              <HiOfficeBuilding className="w-4 h-4 flex-shrink-0" />
                              <span className="font-sans text-sm sm:text-base">{exp.company}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-start sm:items-end gap-2">
                          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                            <HiCalendar className="w-4 h-4" />
                            <span className="text-sm font-medium font-sans">{exp.period}</span>
                          </div>
                          <span className={cn(
                            "px-3 py-1 rounded-full text-xs font-medium",
                            `bg-gradient-to-r ${exp.color} ${exp.darkColor} text-white`
                          )}>
                            {exp.type}
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6 font-sans">
                        {exp.description}
                      </p>

                      {/* Achievements */}
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 font-sans">Key Achievements</h4>
                        <ul className="space-y-2">
                          {exp.achievements.map((achievement, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                              <div className={cn(
                                "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                                `bg-gradient-to-r ${exp.color} ${exp.darkColor}`
                              )}>
                                <span className="text-white text-xs font-bold">✓</span>
                              </div>
                              <span className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed font-sans">
                                {achievement}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Skills */}
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 font-sans">Skills Developed</h4>
                        <div className="flex flex-wrap gap-2">
                          {exp.skills.map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full font-medium font-sans"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection; 
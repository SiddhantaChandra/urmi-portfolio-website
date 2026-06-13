"use client";

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { HiCalendar, HiOfficeBuilding } from 'react-icons/hi';
import * as PhosphorIcons from '@phosphor-icons/react';
import { cn } from '../utils/cn';

const ExperienceSection = ({ experiences = [] }) => {
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
    <section id="experience" className="py-16 md:py-20 bg-neutral-bg dark:bg-neutral-bg-dark font-sans overflow-hidden transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <span className="inline-block px-3 py-1.5 md:px-4 md:py-2 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-lg text-xs md:text-sm font-medium mb-3 md:mb-4">
            Professional Journey
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4 md:mb-6 font-sans leading-tight">
            My Career
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent"> Timeline</span>
          </h2>
          <p className="text-base md:text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed font-sans">
          From creating content for various industries to reporting on daily news and exclusive stories, here's how I've evolved from a content writer to a dedicated journalist.
          </p>
        </motion.div>

        {/* Experience Timeline */}
        <div ref={containerRef} className="relative">
          {/* Tracing Beam */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-card-border dark:bg-card-border hidden lg:block">
            <motion.div
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-indigo-500 to-purple-500 dark:from-indigo-400 dark:to-purple-400 origin-top"
              style={{ height: beamHeight }}
            />
          </div>

          {/* Experience Items */}
          <div className="space-y-12 md:space-y-16 lg:space-y-16">
            {experiences.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 text-sm">No experiences added yet.</p>
              </div>
            )}
            {experiences.map((exp, index) => {
              const IconComponent = PhosphorIcons[exp.icon] || PhosphorIcons.Question;
              const isActive = index <= activeIndex;
              
              return (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative flex flex-col lg:flex-row gap-6 md:gap-8 items-start"
                >
                  {/* Timeline Node */}
                  <div className="hidden lg:flex absolute left-0 top-6 md:top-8 -translate-x-1/2">
                    <motion.div
                      className={cn(
                        "w-12 h-12 md:w-16 md:h-16 rounded-full border border-white dark:border dark:border-white/60 shadow-lg flex items-center justify-center overflow-hidden",
                        exp.logo ? "bg-white dark:bg-gray-800" : `bg-gradient-to-r ${exp.color} ${exp.darkColor}`,
                        isActive ? "scale-110" : "scale-100"
                      )}
                      animate={{ scale: isActive ? 1.1 : 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {exp.logo ? (
                        <img src={exp.logo} alt="" className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-white dark:border-white/60 shadow-lg" />
                      ) : (
                        <IconComponent className="w-6 h-6 md:w-8 md:h-8 text-white" />
                      )}
                    </motion.div>
                  </div>

                  {/* Content Card */}
                  <div className="lg:ml-24 w-full">
                    <motion.div
                      className={cn(
                        "bg-card-bg dark:bg-card-bg-dark backdrop-blur-sm rounded-lg p-4 md:p-6 lg:p-8 shadow-lg border transition-all duration-300",
                        isActive
                          ? "border-purple-300 dark:border-purple-500/30 shadow-xl transform scale-105"
                          : "border-card-border dark:border-white/20 hover:border-purple-300 dark:hover:border-purple-500/20"
                      )}
                      whileHover={{ y: -5 }}
                    >
                      {/* Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6">
                        <div className="flex items-start gap-3 md:gap-4 mb-3 md:mb-4 sm:mb-0">
                          <div className={cn(
                            "w-12 h-12 md:w-14 md:h-14 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center lg:hidden flex-shrink-0 shadow-md overflow-hidden",
                            exp.logo ? "" : `bg-gradient-to-r ${exp.color} ${exp.darkColor}`
                          )}>
                            {exp.logo ? (
                              <img src={exp.logo} alt="" className="w-full h-full object-cover rounded-xl" />
                            ) : (
                              <IconComponent className="w-6 h-6 md:w-7 md:h-7 lg:w-6 lg:h-6 text-white" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100 font-sans leading-tight">{exp.role}</h3>
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mt-1">
                              <HiOfficeBuilding className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                              <span className="font-sans text-xs md:text-sm lg:text-base">{exp.company}{exp.location ? ` · ${exp.location}` : ''}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-start sm:items-end gap-1.5 md:gap-2">
                          <div className="flex items-center gap-1.5 md:gap-2 text-gray-500 dark:text-gray-400">
                            <HiCalendar className="w-3 h-3 md:w-4 md:h-4" />
                            <span className="text-xs md:text-sm font-medium font-sans">{exp.period}</span>
                          </div>
                          <span className={cn(
                            "px-2.5 py-0.5 md:px-3 md:py-1 rounded-full text-xs font-medium",
                            `bg-gradient-to-r ${exp.color} ${exp.darkColor} text-white`
                          )}>
                            {exp.type}
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed mb-4 md:mb-6 font-sans">
                        {exp.description}
                      </p>

                      {/* Achievements */}
                      <div className="mb-4 md:mb-6">
                        <h4 className="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 md:mb-3 font-sans">Key Achievements</h4>
                        <ul className="space-y-1.5 md:space-y-2">
                          {exp.achievements?.map((achievement, idx) => (
                            <li key={achievement.id} className="flex items-start gap-2 md:gap-3">
                              <div className={cn(
                                "w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                                `bg-gradient-to-r ${exp.color} ${exp.darkColor}`
                              )}>
                                <span className="text-white text-xs font-bold">✓</span>
                              </div>
                              <span className="text-gray-600 dark:text-gray-300 text-xs md:text-sm leading-relaxed font-sans">
                                {achievement.text}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Skills */}
                      <div>
                        <h4 className="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 md:mb-3 font-sans">Skills Developed</h4>
                        <div className="flex flex-wrap gap-1.5 md:gap-2">
                          {exp.skills?.map((skill, idx) => (
                            <span
                              key={skill.id}
                              className="px-2.5 py-0.5 md:px-3 md:py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs md:text-sm rounded-full font-medium font-sans"
                            >
                              {skill.name}
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

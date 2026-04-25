'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useState } from 'react';
import {
  SparklesIcon,
  ClockIcon,
  ShieldCheckIcon,
  UsersIcon,
  ChartBarIcon,
  DocumentTextIcon,
  CogIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';
import { FloatingElement, StaggeredContainer, StaggeredItem } from '../ui/sophisticated-animations';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  sparkles: SparklesIcon,
  clock: ClockIcon,
  shield: ShieldCheckIcon,
  users: UsersIcon,
  chart: ChartBarIcon,
  document: DocumentTextIcon,
  cog: CogIcon,
  badge: CheckBadgeIcon,
};

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface FeatureGridProps {
  features: Feature[];
  columns?: 2 | 3 | 4;
}

export function FeatureGrid({ features, columns = 3 }: FeatureGridProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <section ref={ref} className="relative py-20 md:py-28 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 overflow-hidden">
      {/* Advanced decorative background elements with floating animations */}
      <div className="absolute inset-0">
        {/* Animated grid pattern */}
        <motion.div 
          className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:2rem_2rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.2 } : { opacity: 0 }}
          transition={{ duration: 2 }}
        />
        
        {/* Advanced floating glass orbs */}
        <FloatingElement className="absolute top-1/4 right-0 w-96 h-96 bg-gradient-to-bl from-blue-500/20 to-slate-900/20 rounded-full blur-3xl translate-x-1/2" intensity={25} duration={15}>
          <div />
        </FloatingElement>
        <FloatingElement className="absolute bottom-1/4 left-0 w-64 h-64 bg-gradient-to-tr from-blue-600/20 to-slate-800/20 rounded-full blur-3xl -translate-x-1/2" intensity={18} duration={12}>
          <div />
        </FloatingElement>
        <FloatingElement className="absolute top-1/2 left-1/3 w-32 h-32 bg-blue-500/15 rounded-full blur-2xl" intensity={12} duration={9}>
          <div />
        </FloatingElement>
        
        {/* Particle constellation */}
        <FloatingElement className="absolute top-1/6 left-1/4 w-3 h-3 bg-blue-400/70 rounded-full blur-sm" intensity={6} duration={7}>
          <div />
        </FloatingElement>
        <FloatingElement className="absolute bottom-1/3 right-1/5 w-2 h-2 bg-slate-600/80/60 rounded-full blur-sm" intensity={8} duration={5}>
          <div />
        </FloatingElement>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Advanced animated headline */}
        <StaggeredContainer className="text-center mb-16">
          <StaggeredItem>
            <motion.h2 
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent"
              initial={{ scale: 0.9 }}
              animate={inView ? { scale: 1 } : { scale: 0.9 }}
              transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
            >
              RFP Software Features to Win More Bids
            </motion.h2>
          </StaggeredItem>
          <StaggeredItem>
            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              AI-powered RFP software features designed for UK procurement teams to streamline bid processes and maximize success rates
            </p>
          </StaggeredItem>
        </StaggeredContainer>

        {/* Advanced animated feature cards */}
        <StaggeredContainer className={`grid grid-cols-1 ${gridCols[columns]} gap-8 lg:gap-10`}>
          {features.map((feature, index) => {
            const Icon = iconMap[feature.icon] || SparklesIcon;
            const isHovered = hoveredIndex === index;
            
            return (
              <StaggeredItem key={index}>
                <motion.div
                  className="group relative h-full"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  whileHover={{ 
                    y: -12,
                    scale: 1.03,
                    rotateX: 8,
                    rotateY: 4
                  }}
                  whileTap={{ scale: 0.98 }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Enhanced glass morphism card with 3D effects */}
                  <motion.div 
                    className="relative h-full bg-slate-900/60 backdrop-blur-xl rounded-3xl p-8 lg:p-10 border-slate-700/50 shadow-2xl shadow-blue-900/20"
                    whileHover={{ 
                      backgroundColor: 'rgba(30, 41, 59, 0.7)',
                      boxShadow: '0 32px 64px -12px rgba(59, 130, 246, 0.4), 0 0 0 1px rgba(59, 130, 246, 0.4)',
                      borderColor: 'rgba(59, 130, 246, 0.5)'
                    }}
                    transition={{ duration: 0.3 }}
                  >
                  {/* Enhanced gradient overlay on hover */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-br from-blue-500/15 via-transparent to-slate-500/15 rounded-3xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
                  />
                  
                  {/* Animated top accent line */}
                  <motion.div 
                    className="absolute top-0 left-1/2 -translate-x-1/2 h-1 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full"
                    initial={{ width: 0, opacity: 0.6 }}
                    animate={{ 
                      width: isHovered ? 80 : 20,
                      opacity: isHovered ? 1 : 0.6
                    }}
                    transition={{ duration: 0.4 }}
                  />
                  
                  {/* Enhanced Content with sophisticated animations */}
                  <div className="relative z-10">
                    {/* Advanced animated icon container */}
                    <motion.div 
                      className="mb-8"
                      initial={{ y: 0, rotateY: 0 }}
                      animate={{ 
                        y: isHovered ? -4 : 0,
                        rotateY: isHovered ? 15 : 0
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div 
                        className="relative inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500/20 to-blue-600/30 backdrop-blur-sm border-blue-500/30 overflow-hidden"
                        whileHover={{ 
                          scale: 1.15,
                          rotate: 5,
                          boxShadow: '0 0 30px rgba(59, 130, 246, 0.8)'
                        }}
                        style={{ transformStyle: 'preserve-3d' }}
                      >
                        {/* Shimmer effect */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                          initial={{ x: '-100%', skewX: -20 }}
                          animate={{
                            x: isHovered ? '200%' : '-100%'
                          }}
                          transition={{ 
                            duration: 0.8, 
                            ease: "easeInOut",
                            delay: isHovered ? 0 : 0
                          }}
                        />
                        
                        {/* Inner glow effect */}
                        <motion.div 
                          className="absolute inset-2 bg-gradient-to-br from-blue-400/30 to-blue-500/30 rounded-2xl blur-sm"
                          animate={{ opacity: isHovered ? 1 : 0 }}
                          transition={{ duration: 0.3 }}
                        />
                        
                        <motion.div
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.8 }}
                        >
                          <Icon className="w-10 h-10 text-blue-400 relative z-10 group-hover:text-white transition-colors duration-300" />
                        </motion.div>
                      </motion.div>
                    </motion.div>
                    
                    {/* Animated title */}
                    <motion.h3 
                      className="text-2xl lg:text-3xl font-bold text-white mb-4 tracking-tight"
                      initial={{ backgroundImage: 'none' }}
                      animate={{
                        backgroundImage: isHovered 
                          ? 'linear-gradient(to right, #ffffff, #dbeafe, #ffffff)'
                          : 'none'
                      }}
                      style={{
                        backgroundClip: isHovered ? 'text' : 'unset',
                        color: isHovered ? 'transparent' : 'white'
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {feature.title}
                    </motion.h3>
                    
                    {/* Animated description */}
                    <motion.p 
                      className="text-slate-300 leading-relaxed text-lg"
                      animate={{
                        color: isHovered ? '#cbd5e1' : '#cbd5e1'
                      }}
                      initial={{ y: 0 }}
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.2 }}
                    >
                      {feature.description}
                    </motion.p>
                  </div>

                  {/* Enhanced bottom gradient highlight */}
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500/60 via-blue-400/80 to-blue-500/60 rounded-b-3xl"
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ 
                      opacity: isHovered ? 1 : 0,
                      scaleX: isHovered ? 1 : 0
                    }}
                    transition={{ duration: 0.5 }}
                  />
                  
                  {/* Enhanced side glow effect */}
                  <motion.div 
                    className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-transparent via-blue-500/50 to-transparent rounded-l-3xl"
                    initial={{ opacity: 0, scaleY: 0 }}
                    animate={{ 
                      opacity: isHovered ? 1 : 0,
                      scaleY: isHovered ? 1 : 0
                    }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  />
                  </motion.div>

                  {/* Advanced floating particles system */}
                  {isHovered && (
                    <>
                      <motion.div
                        className="absolute w-2 h-2 bg-blue-400 rounded-full"
                        style={{ top: '10%', right: '10%' }}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ 
                          scale: [0, 1, 0],
                          opacity: [0, 1, 0],
                          x: [0, 20, 0],
                          y: [0, -10, 0]
                        }}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity,
                          delay: Math.random() * 2
                        }}
                      />
                      <motion.div
                        className="absolute w-1.5 h-1.5 bg-slate-400 rounded-full"
                        style={{ bottom: '15%', left: '15%' }}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ 
                          scale: [0, 1, 0],
                          opacity: [0, 1, 0],
                          x: [0, -15, 0],
                          y: [0, 15, 0]
                        }}
                        transition={{ 
                          duration: 2.5, 
                          repeat: Infinity,
                          delay: Math.random() * 2
                        }}
                      />
                      <motion.div
                        className="absolute w-1 h-1 bg-blue-300 rounded-full"
                        style={{ top: '70%', right: '20%' }}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ 
                          scale: [0, 1, 0],
                          opacity: [0, 1, 0],
                          x: [0, 10, 0],
                          y: [0, -20, 0]
                        }}
                        transition={{ 
                          duration: 1.8, 
                          repeat: Infinity,
                          delay: Math.random() * 2
                        }}
                      />
                    </>
                  )}
                </motion.div>
              </StaggeredItem>
            );
          })}
        </StaggeredContainer>

        {/* Enhanced bottom decorative element */}
        <motion.div 
          className="mt-20 text-center"
          initial={{ y: 30, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <motion.div 
            className="inline-flex items-center px-8 py-4 bg-slate-900/50 backdrop-blur-sm rounded-full border-slate-700/50 text-slate-300"
            whileHover={{ 
              scale: 1.05, 
              backgroundColor: 'rgba(30, 41, 59, 0.6)',
              borderColor: 'rgba(59, 130, 246, 0.3)'
            }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <SparklesIcon className="w-5 h-5 text-blue-400 mr-3" />
            </motion.div>
            <span className="text-base font-medium">AI-powered features coming Q2 2026</span>
            <motion.div 
              className="w-2 h-2 bg-green-400 rounded-full ml-4"
              animate={{ 
                scale: [1, 1.3, 1], 
                opacity: [1, 0.5, 1] 
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity 
              }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

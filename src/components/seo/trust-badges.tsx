'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FloatingElement, StaggeredContainer, StaggeredItem } from '../ui/sophisticated-animations';

interface TrustBadge {
  name: string;
  logo?: string;
  url?: string;
  description?: string;
}

interface TrustBadgesProps {
  badges: TrustBadge[];
  title?: string;
  subtitle?: string;
  variant?: 'light' | 'dark' | 'gradient';
}

export function TrustBadges({ 
  badges, 
  title = "Trusted by UK Government & Enterprise",
  subtitle = "Official certifications and partnerships that demonstrate our commitment to security and compliance",
  variant = 'gradient' 
}: TrustBadgesProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <section ref={ref} className="relative py-20 md:py-28 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 overflow-hidden">
      {/* Advanced decorative background elements with floating animations */}
      <div className="absolute inset-0">
        {/* Animated grid pattern */}
        <motion.div 
          className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:2.5rem_2.5rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.25 } : { opacity: 0 }}
          transition={{ duration: 1.5 }}
        />
        
        {/* Advanced floating glass orbs with sophisticated animations */}
        <FloatingElement className="absolute top-1/4 left-0 w-80 h-80 bg-gradient-to-br from-blue-500/15 to-blue-600/10 rounded-full blur-3xl -translate-x-1/2" intensity={22} duration={14}>
          <div />
        </FloatingElement>
        <FloatingElement className="absolute bottom-0 right-1/4 w-64 h-64 bg-gradient-to-tl from-slate-400/15 to-blue-400/10 rounded-full blur-3xl translate-y-1/2" intensity={18} duration={11}>
          <div />
        </FloatingElement>
        <FloatingElement className="absolute top-2/3 right-0 w-48 h-48 bg-blue-500/12 rounded-full blur-2xl translate-x-1/3" intensity={12} duration={9}>
          <div />
        </FloatingElement>
        
        {/* Additional floating particles */}
        <FloatingElement className="absolute top-1/5 left-2/3 w-6 h-6 bg-blue-400/50 rounded-full blur-sm" intensity={10} duration={7}>
          <div />
        </FloatingElement>
        <FloatingElement className="absolute bottom-1/3 left-1/4 w-4 h-4 bg-slate-300/40 rounded-full blur-sm" intensity={8} duration={6}>
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
              transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] as any }}
            >
              {title}
            </motion.h2>
          </StaggeredItem>
          <StaggeredItem>
            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          </StaggeredItem>
        </StaggeredContainer>

        {/* Advanced animated badge grid */}
        <StaggeredContainer className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6 lg:gap-8">
          {badges.map((badge, index) => {
            const isHovered = hoveredIndex === index;
            
            const badgeContent = (
              <StaggeredItem key={index}>
                <motion.div
                  className="group relative h-full"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  whileHover={{ 
                    y: -8,
                    scale: 1.02,
                    rotateX: 5,
                    rotateY: 2
                  }}
                  whileTap={{ scale: 0.98 }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Enhanced glass morphism card */}
                  <motion.div 
                    className="relative h-full min-h-[120px] bg-slate-900/60 backdrop-blur-xl rounded-3xl p-6 lg:p-8 flex items-center justify-center border border-slate-700/50 shadow-2xl shadow-blue-900/20 transition-all duration-500"
                    whileHover={{ 
                      backgroundColor: 'rgba(30, 41, 59, 0.7)',
                      boxShadow: '0 25px 50px -12px rgba(59, 130, 246, 0.4), 0 0 0 1px rgba(59, 130, 246, 0.4)',
                      borderColor: 'rgba(59, 130, 246, 0.5)'
                    }}
                  >
                  {/* Enhanced gradient overlay on hover */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-br from-blue-500/15 via-transparent to-slate-500/15 rounded-3xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
                  />
                  
                  {/* Top accent line */}
                  <motion.div 
                    className="absolute top-0 left-1/2 -translate-x-1/2 h-1 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full"
                    initial={{ width: 0, opacity: 0.6 }}
                    animate={{ 
                      width: isHovered ? 80 : 16,
                      opacity: isHovered ? 1 : 0.6
                    }}
                    transition={{ duration: 0.4 }}
                  />
                  
                  {/* Enhanced Content with animations */}
                  <div className="relative z-10 flex flex-col items-center justify-center text-center">
                    {badge.logo ? (
                      <motion.div
                        className="relative h-12 md:h-16 flex items-center justify-center"
                        initial={{ filter: 'grayscale(100%) opacity(60%)' }}
                        animate={{ 
                          filter: isHovered ? 'grayscale(0%) opacity(100%)' : 'grayscale(70%) opacity(80%)',
                          scale: isHovered ? 1.1 : 1
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        {/* Glow effect on hover */}
                        <motion.div 
                          className="absolute inset-0 bg-blue-500/20 rounded-2xl blur-lg"
                          animate={{ opacity: isHovered ? 1 : 0 }}
                          transition={{ duration: 0.3 }}
                        />
                        <Image
                          src={badge.logo}
                          alt={badge.name}
                          width={120}
                          height={48}
                          className="max-h-full w-auto object-contain relative z-10"
                        />
                      </motion.div>
                    ) : (
                      <motion.div 
                        className="px-4 py-2 text-slate-200 font-medium text-sm md:text-base"
                        animate={{
                          color: isHovered ? '#dbeafe' : '#cbd5e1'
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        {badge.name}
                      </motion.div>
                    )}
                    
                    {badge.description && (
                      <motion.div
                        className="mt-2 text-xs text-slate-400 font-medium opacity-0 max-h-0 overflow-hidden"
                        animate={{
                          opacity: isHovered ? 1 : 0,
                          maxHeight: isHovered ? 50 : 0,
                          marginTop: isHovered ? 8 : 0
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        {badge.description}
                      </motion.div>
                    )}
                  </div>

                  {/* Bottom gradient highlight */}
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
                          x: [0, 15, 0],
                          y: [0, -8, 0]
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
                          x: [0, -10, 0],
                          y: [0, 10, 0]
                        }}
                        transition={{ 
                          duration: 2.2, 
                          repeat: Infinity,
                          delay: Math.random() * 2
                        }}
                      />
                    </>
                  )}
                </motion.div>
              </StaggeredItem>
            );

            return badge.url ? (
              <Link
                key={index}
                href={badge.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                {badgeContent}
              </Link>
            ) : (
              <div key={index}>{badgeContent}</div>
            );
          })}
        </StaggeredContainer>

        {/* Enhanced bottom decorative element */}
        <motion.div 
          className="mt-20 text-center"
          initial={{ y: 30, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <motion.div 
            className="inline-flex items-center px-6 py-3 bg-slate-900/50 backdrop-blur-sm rounded-full border border-slate-700/50 text-slate-300 text-sm"
            whileHover={{ 
              scale: 1.05, 
              backgroundColor: 'rgba(30, 41, 59, 0.6)',
              borderColor: 'rgba(59, 130, 246, 0.3)'
            }}
            transition={{ duration: 0.2 }}
          >
            <motion.div 
              className="w-2 h-2 bg-green-400 rounded-full mr-3"
              animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            Compliance certifications updated regularly
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

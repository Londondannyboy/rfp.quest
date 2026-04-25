'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FloatingElement, StaggeredContainer, StaggeredItem } from '../ui/sophisticated-animations';

interface Stat {
  value: string;
  label: string;
  suffix?: string;
}

interface StatsBarProps {
  stats: Stat[];
  variant?: 'light' | 'dark' | 'gradient';
}

export function StatsBar({ stats, variant = 'gradient' }: StatsBarProps) {
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
          className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.3 } : { opacity: 0 }}
          transition={{ duration: 1.5 }}
        />
        
        {/* Advanced floating glass orbs with sophisticated animations */}
        <FloatingElement className="absolute top-0 left-1/4 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-full blur-3xl" intensity={20} duration={12}>
          <div />
        </FloatingElement>
        <FloatingElement className="absolute bottom-0 right-1/3 w-48 h-48 bg-gradient-to-tl from-slate-400/20 to-blue-400/10 rounded-full blur-3xl" intensity={15} duration={10}>
          <div />
        </FloatingElement>
        <FloatingElement className="absolute top-1/2 right-1/4 w-32 h-32 bg-blue-500/15 rounded-full blur-2xl" intensity={10} duration={8}>
          <div />
        </FloatingElement>
        
        {/* Additional floating particles */}
        <FloatingElement className="absolute top-1/3 left-1/6 w-4 h-4 bg-blue-400/60 rounded-full blur-sm" intensity={8} duration={6}>
          <div />
        </FloatingElement>
        <FloatingElement className="absolute bottom-1/4 left-2/3 w-6 h-6 bg-slate-600/80/40 rounded-full blur-sm" intensity={12} duration={9}>
          <div />
        </FloatingElement>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Advanced animated headline */}
        <StaggeredContainer className="text-center mb-16">
          <StaggeredItem>
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent"
              initial={{ scale: 0.9 }}
              animate={inView ? { scale: 1 } : { scale: 0.9 }}
              transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            >
              Trusted by UK Procurement Teams
            </motion.h2>
          </StaggeredItem>
          <StaggeredItem>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Platform metrics that demonstrate our commitment to UK government procurement excellence
            </p>
          </StaggeredItem>
        </StaggeredContainer>

        {/* Advanced animated card grid */}
        <StaggeredContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <StaggeredItem key={index}>
              <motion.div 
                className="group relative h-full"
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
                  className="relative h-full bg-slate-900/60 backdrop-blur-xl rounded-3xl p-8 text-center border-slate-700/50 shadow-2xl shadow-blue-900/20 transition-all duration-500"
                  whileHover={{ 
                    backgroundColor: 'rgba(30, 41, 59, 0.6)',
                    boxShadow: '0 25px 50px -12px rgba(59, 130, 246, 0.3), 0 0 0 1px rgba(59, 130, 246, 0.3)'
                  }}
                >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-slate-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
                
                {/* Top accent line */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Enhanced Content with animations */}
                <div className="relative z-10">
                  {/* Animated icon circle with shimmer effect */}
                  <motion.div 
                    className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-500/20 to-blue-600/30 rounded-2xl flex items-center justify-center backdrop-blur-sm border-blue-500/30 overflow-hidden"
                    whileHover={{ 
                      scale: 1.1,
                      rotateY: 15,
                      boxShadow: '0 0 20px rgba(59, 130, 246, 0.6)'
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Shimmer effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      initial={{ x: '-100%', skewX: -20 }}
                      whileHover={{ x: '200%' }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                    />
                    <motion.div 
                      className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg flex items-center justify-center"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.8 }}
                    >
                      <div className="w-4 h-4 bg-slate-900/60 backdrop-blur-xl border-slate-700/50/90 rounded-sm"></div>
                    </motion.div>
                  </motion.div>
                  
                  {/* Animated stat value */}
                  <motion.div 
                    className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <span className="tabular-nums bg-gradient-to-br from-white via-blue-100 to-white bg-clip-text text-transparent">
                      {stat.value}
                    </span>
                    {stat.suffix && (
                      <span className="text-2xl md:text-3xl ml-1 opacity-70">{stat.suffix}</span>
                    )}
                  </motion.div>
                  
                  {/* Animated label */}
                  <motion.div 
                    className="text-base font-medium text-slate-300 tracking-wide leading-relaxed"
                    initial={{ y: 20, opacity: 0 }}
                    animate={inView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
                  >
                    {stat.label}
                  </motion.div>
                </div>

                {/* Bottom gradient highlight */}
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500/60 via-blue-400/80 to-blue-500/60 rounded-b-3xl"
                  initial={{ opacity: 0, scaleX: 0 }}
                  whileHover={{ opacity: 1, scaleX: 1 }}
                  transition={{ duration: 0.5 }}
                />
                </motion.div>
              </motion.div>
            </StaggeredItem>
          ))}
        </StaggeredContainer>

        {/* Enhanced bottom decorative element */}
        <motion.div 
          className="mt-20 text-center"
          initial={{ y: 30, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <motion.div 
            className="inline-flex items-center px-6 py-3 bg-slate-900/50 backdrop-blur-sm rounded-full border-slate-700/50 text-slate-300 text-sm"
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(30, 41, 59, 0.6)' }}
            transition={{ duration: 0.2 }}
          >
            <motion.div 
              className="w-2 h-2 bg-green-400 rounded-full mr-3"
              animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            Live platform metrics • Updated daily
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

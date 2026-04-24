'use client';

import { motion } from 'framer-motion';
import { ReactNode, useState, useRef } from 'react';
import Link from 'next/link';

interface InteractiveCardProps {
  children: ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  glowColor?: string;
  tiltIntensity?: number;
}

export function InteractiveCard({
  children,
  className = '',
  href,
  onClick,
  glowColor = 'rgba(59, 130, 246, 0.5)',
  tiltIntensity = 10
}: InteractiveCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const rotateX = ((e.clientY - centerY) / rect.height) * -tiltIntensity;
    const rotateY = ((e.clientX - centerX) / rect.width) * tiltIntensity;

    cardRef.current.style.transform = `
      perspective(1000px) 
      rotateX(${rotateX}deg) 
      rotateY(${rotateY}deg) 
      scale3d(1.05, 1.05, 1.05)
    `;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    
    cardRef.current.style.transform = `
      perspective(1000px) 
      rotateX(0deg) 
      rotateY(0deg) 
      scale3d(1, 1, 1)
    `;
  };

  const cardContent = (
    <motion.div
      ref={cardRef}
      className={`
        relative overflow-hidden rounded-3xl bg-slate-900/60 backdrop-blur-xl 
        border border-slate-700/50 shadow-2xl shadow-blue-900/20
        transition-all duration-300 ease-out cursor-pointer
        ${className}
      `}
      style={{
        transformStyle: 'preserve-3d',
        boxShadow: isHovered 
          ? `0 25px 50px -12px ${glowColor}, 0 0 0 1px rgba(59, 130, 246, 0.3)`
          : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setIsHovered(true)}
      onClick={onClick}
      whileHover={{ 
        scale: 1.02,
      }}
      whileTap={{ 
        scale: 0.98,
      }}
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-slate-500/10"
        animate={{
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
        initial={{ x: '-100%', skewX: -20 }}
        animate={{
          x: isHovered ? '200%' : '-100%',
        }}
        transition={{ 
          duration: 0.8, 
          ease: "easeInOut",
          delay: isHovered ? 0 : 0
        }}
        style={{
          transform: 'skewX(-20deg)',
        }}
      />

      {/* Border glow */}
      <motion.div
        className="absolute inset-0 rounded-3xl"
        animate={{
          boxShadow: isHovered
            ? `inset 0 0 0 1px rgba(59, 130, 246, 0.4)`
            : `inset 0 0 0 1px rgba(148, 163, 184, 0.1)`
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Floating particles */}
      {isHovered && (
        <>
          <motion.div
            className="absolute w-1 h-1 bg-blue-400 rounded-full"
            initial={{ x: '20%', y: '80%', opacity: 0 }}
            animate={{ 
              x: '80%', 
              y: '20%', 
              opacity: [0, 1, 0],
            }}
            transition={{ duration: 2, repeat: Infinity, delay: 0 }}
          />
          <motion.div
            className="absolute w-0.5 h-0.5 bg-slate-400 rounded-full"
            initial={{ x: '70%', y: '20%', opacity: 0 }}
            animate={{ 
              x: '30%', 
              y: '70%', 
              opacity: [0, 1, 0],
            }}
            transition={{ duration: 3, repeat: Infinity, delay: 1 }}
          />
          <motion.div
            className="absolute w-1.5 h-1.5 bg-purple-400 rounded-full"
            initial={{ x: '10%', y: '30%', opacity: 0 }}
            animate={{ 
              x: '90%', 
              y: '80%', 
              opacity: [0, 1, 0],
            }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
          />
        </>
      )}
    </motion.div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}

// Navigation card with icon and description
interface NavigationCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
}

export function NavigationCard({
  title,
  description,
  icon,
  href,
  onClick,
  className = ''
}: NavigationCardProps) {
  return (
    <InteractiveCard
      href={href}
      onClick={onClick}
      className={`p-8 ${className}`}
      glowColor="rgba(59, 130, 246, 0.4)"
    >
      {/* Icon */}
      <motion.div
        className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/30 backdrop-blur-sm border border-blue-500/30"
        whileHover={{ 
          scale: 1.1, 
          rotate: 5,
          boxShadow: '0 0 20px rgba(59, 130, 246, 0.6)'
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-blue-400 relative z-10">
          {icon}
        </div>
      </motion.div>

      {/* Content */}
      <div>
        <motion.h3 
          className="text-xl font-bold text-white mb-3 tracking-tight"
          whileHover={{
            backgroundImage: 'linear-gradient(to right, #3b82f6, #ffffff, #3b82f6)',
            backgroundClip: 'text',
            color: 'transparent',
          }}
          transition={{ duration: 0.3 }}
        >
          {title}
        </motion.h3>
        <p className="text-slate-300 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Arrow indicator */}
      <motion.div
        className="absolute bottom-6 right-6 w-6 h-6 text-blue-400"
        initial={{ x: 0, opacity: 0.6 }}
        whileHover={{ x: 4, opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </motion.div>
    </InteractiveCard>
  );
}

// Feature highlight card
interface FeatureCardProps {
  title: string;
  description: string;
  highlight: string;
  icon: ReactNode;
  className?: string;
}

export function FeatureCard({
  title,
  description,
  highlight,
  icon,
  className = ''
}: FeatureCardProps) {
  return (
    <InteractiveCard 
      className={`p-8 ${className}`}
      glowColor="rgba(16, 185, 129, 0.4)"
    >
      {/* Highlight badge */}
      <motion.div
        className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 text-emerald-300 text-xs font-semibold rounded-full border border-emerald-500/30"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        {highlight}
      </motion.div>

      {/* Icon */}
      <motion.div
        className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/30 backdrop-blur-sm border border-emerald-500/30"
        whileHover={{ 
          scale: 1.1, 
          rotate: -5,
          boxShadow: '0 0 20px rgba(16, 185, 129, 0.6)'
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-emerald-400 relative z-10">
          {icon}
        </div>
      </motion.div>

      {/* Content */}
      <div>
        <motion.h3 
          className="text-xl font-bold text-white mb-3 tracking-tight"
          whileHover={{
            backgroundImage: 'linear-gradient(to right, #10b981, #ffffff, #10b981)',
            backgroundClip: 'text',
            color: 'transparent',
          }}
          transition={{ duration: 0.3 }}
        >
          {title}
        </motion.h3>
        <p className="text-slate-300 leading-relaxed">
          {description}
        </p>
      </div>
    </InteractiveCard>
  );
}
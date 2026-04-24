'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ReactNode } from 'react';

// Staggered fade-in animation for containers
interface StaggeredContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  viewThreshold?: number;
}

export function StaggeredContainer({ 
  children, 
  className = '',
  staggerDelay = 0.1,
  viewThreshold = 0.1
}: StaggeredContainerProps) {
  const { ref, inView } = useInView({
    threshold: viewThreshold,
    triggerOnce: true,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Individual animated item for staggered effects
interface StaggeredItemProps {
  children: ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
}

export function StaggeredItem({ 
  children, 
  className = '',
  direction = 'up',
  distance = 50
}: StaggeredItemProps) {
  const getDirection = () => {
    switch (direction) {
      case 'up': return { y: distance };
      case 'down': return { y: -distance };
      case 'left': return { x: distance };
      case 'right': return { x: -distance };
      default: return { y: distance };
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0,
      ...getDirection(),
      filter: 'blur(4px)',
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      filter: 'blur(0px)',
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.23, 1, 0.32, 1] as any, // Custom bezier
        filter: { duration: 0.6 },
        scale: { duration: 0.6 }
      },
    },
  };

  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
}

// Advanced slide-in animation with reveal effect
interface SlideRevealProps {
  children: ReactNode;
  className?: string;
  direction?: 'left' | 'right' | 'up' | 'down';
  distance?: number;
  delay?: number;
}

export function SlideReveal({
  children,
  className = '',
  direction = 'left',
  distance = 100,
  delay = 0
}: SlideRevealProps) {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const getInitialPosition = () => {
    switch (direction) {
      case 'left': return { x: -distance };
      case 'right': return { x: distance };
      case 'up': return { y: distance };
      case 'down': return { y: -distance };
      default: return { x: -distance };
    }
  };

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div
        initial={{
          ...getInitialPosition(),
          opacity: 0,
          filter: 'blur(6px)',
        }}
        animate={inView ? {
          x: 0,
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
        } : {}}
        transition={{
          duration: 1.2,
          delay,
          ease: [0.23, 1, 0.32, 1] as any,
          filter: { duration: 0.8 }
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

// Floating animation for elements
interface FloatingElementProps {
  children: ReactNode;
  className?: string;
  intensity?: number;
  duration?: number;
}

export function FloatingElement({
  children,
  className = '',
  intensity = 10,
  duration = 6
}: FloatingElementProps) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [-intensity, intensity, -intensity],
        x: [-intensity/2, intensity/2, -intensity/2],
        rotate: [-1, 1, -1],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}

// Magnetic hover effect
interface MagneticElementProps {
  children: ReactNode;
  className?: string;
  strength?: number;
}

export function MagneticElement({
  children,
  className = '',
  strength = 20
}: MagneticElementProps) {
  return (
    <motion.div
      className={`relative cursor-pointer ${className}`}
      whileHover={{
        scale: 1.05,
      }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;
        
        e.currentTarget.style.transform = `
          scale(1.05) 
          translate(${deltaX * 0.1}px, ${deltaY * 0.1}px)
        `;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1) translate(0px, 0px)';
      }}
      transition={{
        duration: 0.3,
        ease: "easeOut"
      }}
    >
      {children}
    </motion.div>
  );
}

// Text reveal animation
interface TextRevealProps {
  children: string;
  className?: string;
  delay?: number;
}

export function TextReveal({
  children,
  className = '',
  delay = 0
}: TextRevealProps) {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const words = children.split(' ');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: delay,
      },
    },
  };

  const wordVariants = {
    hidden: {
      y: 100,
      opacity: 0,
      rotateX: -90,
    },
    visible: {
      y: 0,
      opacity: 1,
      rotateX: 0,
      transition: {
        duration: 0.8,
        ease: [0.23, 1, 0.32, 1] as any,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={`flex flex-wrap ${className}`}
    >
      {words.map((word, index) => (
        <div key={index} className="overflow-hidden">
          <motion.span
            variants={wordVariants}
            className="inline-block mr-2"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {word}
          </motion.span>
        </div>
      ))}
    </motion.div>
  );
}

// Parallax scroll effect
interface ParallaxElementProps {
  children: ReactNode;
  className?: string;
  offset?: number;
}

export function ParallaxElement({
  children,
  className = '',
  offset = 50
}: ParallaxElementProps) {
  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: false,
  });

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        y: inView ? 0 : offset,
      }}
      transition={{
        duration: 0.8,
        ease: "easeOut"
      }}
    >
      {children}
    </motion.div>
  );
}
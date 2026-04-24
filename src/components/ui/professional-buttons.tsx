'use client';

import { motion } from 'framer-motion';
import { ReactNode, useState } from 'react';
import Link from 'next/link';

interface ProfessionalButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'gradient';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  href?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
}

const buttonVariants = {
  primary: {
    base: 'bg-blue-600 text-white border-blue-600',
    hover: 'hover:bg-blue-500',
    glow: 'rgba(59, 130, 246, 0.5)',
    gradient: 'from-blue-600 to-blue-500'
  },
  secondary: {
    base: 'bg-slate-800 text-slate-100 border-slate-600',
    hover: 'hover:bg-slate-700',
    glow: 'rgba(148, 163, 184, 0.3)',
    gradient: 'from-slate-800 to-slate-700'
  },
  ghost: {
    base: 'bg-transparent text-slate-300 border-slate-600',
    hover: 'hover:bg-slate-800/50',
    glow: 'rgba(148, 163, 184, 0.2)',
    gradient: 'from-transparent to-slate-800/30'
  },
  gradient: {
    base: 'bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 text-white border-transparent',
    hover: 'hover:from-blue-500 hover:via-purple-500 hover:to-blue-500',
    glow: 'rgba(139, 92, 246, 0.5)',
    gradient: 'from-blue-600 via-purple-600 to-blue-600'
  }
};

const buttonSizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
  xl: 'px-10 py-5 text-xl'
};

export function ProfessionalButton({
  children,
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  className = '',
  disabled = false,
  icon,
  iconPosition = 'right'
}: ProfessionalButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const variantStyles = buttonVariants[variant];

  const buttonContent = (
    <motion.button
      className={`
        relative overflow-hidden font-semibold rounded-2xl border-2
        ${variantStyles.base} ${buttonSizes[size]} ${variantStyles.hover}
        transition-all duration-300 ease-out
        disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-none focus:ring-4 focus:ring-blue-500/20
        ${className}
      `}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      style={{
        boxShadow: isHovered && !disabled
          ? `0 10px 25px -5px ${variantStyles.glow}, 0 0 0 1px rgba(59, 130, 246, 0.3)`
          : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      }}
      whileHover={!disabled ? { 
        scale: 1.02,
        y: -2,
      } : {}}
      whileTap={!disabled ? { 
        scale: 0.98,
        y: 0,
      } : {}}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20
      }}
    >
      {/* Animated background overlay */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-r ${variantStyles.gradient} opacity-0`}
        animate={{
          opacity: isHovered ? 0.2 : 0,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: '-100%', skewX: -20 }}
        animate={{
          x: isHovered ? '200%' : '-100%',
        }}
        transition={{ 
          duration: 0.8, 
          ease: "easeInOut",
        }}
        style={{
          transform: 'skewX(-20deg)',
        }}
      />

      {/* Ripple effect */}
      {isPressed && (
        <motion.div
          className="absolute inset-0 bg-white/20 rounded-2xl"
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.6 }}
        />
      )}

      {/* Content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {icon && iconPosition === 'left' && (
          <motion.span
            animate={{
              x: isHovered ? -2 : 0,
            }}
            transition={{ duration: 0.2 }}
          >
            {icon}
          </motion.span>
        )}
        
        <span>{children}</span>
        
        {icon && iconPosition === 'right' && (
          <motion.span
            animate={{
              x: isHovered ? 2 : 0,
            }}
            transition={{ duration: 0.2 }}
          >
            {icon}
          </motion.span>
        )}
      </span>

      {/* Glow particles */}
      {isHovered && !disabled && (
        <>
          <motion.div
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              top: '20%',
              left: '20%',
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
          <motion.div
            className="absolute w-0.5 h-0.5 bg-white rounded-full"
            style={{
              top: '70%',
              right: '30%',
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        </>
      )}
    </motion.button>
  );

  if (href && !disabled) {
    return (
      <Link href={href} className="inline-block">
        {buttonContent}
      </Link>
    );
  }

  return buttonContent;
}

// Floating Action Button
interface FloatingActionButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

export function FloatingActionButton({
  children,
  onClick,
  className = '',
  size = 'md',
  position = 'bottom-right'
}: FloatingActionButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const sizes = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16', 
    lg: 'w-20 h-20'
  };

  const positions = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6'
  };

  return (
    <motion.button
      className={`
        fixed ${positions[position]} ${sizes[size]}
        bg-gradient-to-r from-blue-600 to-purple-600 
        text-white rounded-full shadow-2xl
        flex items-center justify-center
        z-50 ${className}
      `}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ 
        scale: 1.1,
        rotate: 5,
      }}
      whileTap={{ 
        scale: 0.9,
        rotate: 0,
      }}
      animate={{
        y: isHovered ? -4 : 0,
        boxShadow: isHovered 
          ? '0 20px 25px -5px rgba(139, 92, 246, 0.5), 0 10px 10px -5px rgba(139, 92, 246, 0.3)'
          : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20
      }}
    >
      {/* Pulse animation */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"
        animate={{
          scale: isHovered ? [1, 1.2, 1] : 1,
          opacity: isHovered ? [0.5, 0, 0.5] : 0.5,
        }}
        transition={{
          duration: 2,
          repeat: isHovered ? Infinity : 0,
        }}
      />
      
      <span className="relative z-10">
        {children}
      </span>
    </motion.button>
  );
}

// Icon Button
interface IconButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function IconButton({
  children,
  onClick,
  className = '',
  variant = 'ghost',
  size = 'md'
}: IconButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-500',
    secondary: 'bg-slate-800 text-slate-100 hover:bg-slate-700',
    ghost: 'bg-transparent text-slate-400 hover:text-white hover:bg-slate-800/50'
  };

  const sizes = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg'
  };

  return (
    <motion.button
      className={`
        ${sizes[size]} ${variants[variant]}
        rounded-xl flex items-center justify-center
        transition-all duration-200 ease-out
        relative overflow-hidden
        ${className}
      `}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Ripple effect */}
      <motion.div
        className="absolute inset-0 bg-white/10 rounded-xl"
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: isHovered ? 1 : 0,
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ duration: 0.2 }}
      />
      
      <span className="relative z-10">
        {children}
      </span>
    </motion.button>
  );
}
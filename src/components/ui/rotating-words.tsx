'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RotatingWordsProps {
  words: string[];
  interval?: number;
  className?: string;
}

export function RotatingWords({ 
  words, 
  interval = 3000,
  className = ''
}: RotatingWordsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, interval);

    return () => clearInterval(timer);
  }, [words.length, interval]);

  return (
    <div className={`relative inline-block ${className}`}>
      <AnimatePresence mode="wait">
        <motion.span
          key={currentIndex}
          initial={{ 
            y: 20, 
            opacity: 0,
            rotateX: -90,
            filter: 'blur(4px)'
          }}
          animate={{ 
            y: 0, 
            opacity: 1,
            rotateX: 0,
            filter: 'blur(0px)'
          }}
          exit={{ 
            y: -20, 
            opacity: 0,
            rotateX: 90,
            filter: 'blur(4px)'
          }}
          transition={{
            duration: 0.6,
            ease: [0.23, 1, 0.32, 1], // Custom bezier for smooth feel
            rotateX: {
              duration: 0.8,
              ease: "easeInOut"
            }
          }}
          className="block bg-gradient-to-r from-blue-400 via-white to-blue-400 bg-clip-text text-transparent font-bold"
          style={{
            transformStyle: 'preserve-3d',
            textShadow: '0 0 20px rgba(59, 130, 246, 0.5)',
          }}
        >
          {words[currentIndex]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

// Advanced rotating words with stagger animation for each character
interface StaggeredRotatingWordsProps {
  words: string[];
  interval?: number;
  className?: string;
}

export function StaggeredRotatingWords({
  words,
  interval = 4000,
  className = ''
}: StaggeredRotatingWordsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, interval);

    return () => clearInterval(timer);
  }, [words.length, interval]);

  const currentWord = words[currentIndex];

  return (
    <div className={`relative inline-block ${className}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          className="flex"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {currentWord.split('').map((char, index) => (
            <motion.span
              key={`${currentIndex}-${index}`}
              initial={{ 
                y: 50, 
                opacity: 0,
                rotateX: -90,
                filter: 'blur(4px)',
                scale: 0.8
              }}
              animate={{ 
                y: 0, 
                opacity: 1,
                rotateX: 0,
                filter: 'blur(0px)',
                scale: 1
              }}
              exit={{ 
                y: -50, 
                opacity: 0,
                rotateX: 90,
                filter: 'blur(4px)',
                scale: 0.8
              }}
              transition={{
                duration: 0.8,
                delay: index * 0.05,
                ease: [0.23, 1, 0.32, 1],
                rotateX: {
                  duration: 1,
                  ease: "easeInOut"
                }
              }}
              className="inline-block bg-gradient-to-r from-blue-400 via-white to-blue-400 bg-clip-text text-transparent font-bold"
              style={{
                transformStyle: 'preserve-3d',
                textShadow: '0 0 30px rgba(59, 130, 246, 0.6)',
                filter: 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.3))',
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
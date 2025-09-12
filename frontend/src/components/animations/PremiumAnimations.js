import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';

// Premium Scroll Reveal with Parallax
export const PremiumScrollReveal = ({ 
  children, 
  delay = 0, 
  duration = 1, 
  direction = 'up',
  distance = 50,
  parallax = false 
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const controls = useAnimation();
  const y = useMotionValue(0);
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 });

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  useEffect(() => {
    if (parallax && ref.current) {
      const handleScroll = () => {
        const rect = ref.current.getBoundingClientRect();
        const scrollY = window.scrollY;
        const elementTop = rect.top + scrollY;
        const elementHeight = rect.height;
        const windowHeight = window.innerHeight;
        
        const scrolled = scrollY + windowHeight;
        const rate = (scrolled - elementTop) / (windowHeight + elementHeight);
        y.set(rate * distance);
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [parallax, y, distance]);

  const variants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? distance : direction === 'down' ? -distance : 0,
      x: direction === 'left' ? distance : direction === 'right' ? -distance : 0,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      transition: {
        duration,
        delay,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants}
      style={parallax ? { y: smoothY } : {}}
    >
      {children}
    </motion.div>
  );
};

// Premium Mouse Tracking Component
export const MouseTracker = ({ children, intensity = 0.1 }) => {
  const ref = useRef(null);
    // const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 }); // Removido para evitar warning
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateX = useTransform(y, [-300, 300], [intensity * 10, -intensity * 10]);
  const rotateY = useTransform(x, [-300, 300], [-intensity * 10, intensity * 10]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;
        
        // setMousePosition({ x: mouseX, y: mouseY }); // Removido para evitar warning
        x.set(mouseX);
        y.set(mouseY);
      }
    };

    const element = ref.current;
    if (element) {
      element.addEventListener('mousemove', handleMouseMove);
      return () => element.removeEventListener('mousemove', handleMouseMove);
    }
  }, [x, y]);

  return (
    <motion.div
      ref={ref}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {children}
    </motion.div>
  );
};

// Premium 3D Hover Button
export const Premium3DButton = ({ 
  children, 
  onClick, 
  className = '', 
  variant = 'primary',
  size = 'md' 
}) => {
  const buttonVariants = {
    rest: { 
      scale: 1,
      boxShadow: '0 10px 20px rgba(0, 0, 0, 0.6)',
    },
    hover: { 
      scale: 1.05,
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.8)',
      transition: { duration: 0.3 }
    },
    tap: { 
      scale: 0.98,
      transition: { duration: 0.1 }
    }
  };

  const getButtonClasses = () => {
    const baseClasses = 'btn-premium';
    const sizeClasses = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg'
    };
    const variantClasses = {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      ghost: 'btn-ghost'
    };
    return `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;
  };

  return (
    <motion.button
      className={getButtonClasses()}
      variants={buttonVariants}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
};

// Premium Floating Card
export const PremiumFloatingCard = ({ 
  children, 
  className = '', 
  delay = 0,
  intensity = 1 
}) => {
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.95,
      rotateX: -10,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        duration: 0.8,
        delay,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    hover: {
      y: -12,
      scale: 1.03,
      rotateX: 5,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  return (
    <motion.div
      className={`card-premium ${className}`}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once: true, margin: '-50px' }}
      animate={{
        y: [0, -5 * intensity, 0],
      }}
      transition={{
        y: {
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      }}
    >
      {children}
    </motion.div>
  );
};

// Premium Staggered Container
export const PremiumStaggeredContainer = ({ 
  children, 
  staggerDelay = 0.15,
  className = '' 
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div key={index} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

// Premium Typewriter Effect
export const PremiumTypewriter = ({ 
  text, 
  speed = 50, 
  delay = 0,
  className = '' 
}) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed + delay);

      return () => clearTimeout(timeout);
    } else {
      setIsComplete(true);
    }
  }, [currentIndex, text, speed, delay]);

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {displayText}
      {!isComplete && (
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="text-white"
        >
          |
        </motion.span>
      )}
    </motion.span>
  );
};

// Premium Loading Spinner
export const PremiumSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} ${className}`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    >
      <div className="w-full h-full border-2 border-gray-600 border-t-white rounded-full" />
    </motion.div>
  );
};

// Premium Gradient Text
export const PremiumGradientText = ({ 
  children, 
  className = '',
  gradient = 'metallic' 
}) => {
  const gradientClasses = {
    metallic: 'bg-gradient-to-r from-gray-400 via-white to-gray-400 bg-clip-text text-transparent',
    cosmic: 'bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent',
    space: 'bg-gradient-to-r from-gray-500 via-white to-gray-500 bg-clip-text text-transparent',
  };

  return (
    <motion.span
      className={`${gradientClasses[gradient]} ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      {children}
    </motion.span>
  );
};

// Premium Pulse Animation
export const PremiumPulse = ({ 
  children, 
  intensity = 1,
  duration = 2 
}) => {
  return (
    <motion.div
      animate={{
        scale: [1, 1 + 0.05 * intensity, 1],
        opacity: [0.8, 1, 0.8],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  );
};

// Premium Magnetic Effect
export const MagneticEffect = ({ children, intensity = 0.3 }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = (e) => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;
      
      x.set(distanceX * intensity);
      y.set(distanceY * intensity);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {children}
    </motion.div>
  );
};

// Premium Reveal Text
export const PremiumRevealText = ({ 
  text, 
  className = '',
  delay = 0 
}) => {
  const words = text.split(' ');
  
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      transition={{ delay }}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { 
              opacity: 1, 
              y: 0,
              transition: { delay: index * 0.1 }
            }
          }}
          className="inline-block mr-2"
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

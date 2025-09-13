import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const PremiumCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [cursorText, setCursorText] = useState('');

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    // Add event listeners
    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // Add hover listeners for interactive elements
    const interactiveElements = document.querySelectorAll(
      'button, a, input, textarea, [role="button"], .premium-btn, .premium-card, .interactive, .premium-nav-link, .premium-feature-link'
    );

    const handleMouseEnter = (e) => {
      setIsHovering(true);
      
      // Get custom text from data attribute
      const customText = e.target.getAttribute('data-cursor-text');
      if (customText) {
        setCursorText(customText);
      } else {
        setCursorText('');
      }
    };
    
    const handleMouseLeave = () => {
      setIsHovering(false);
      setCursorText('');
    };

    interactiveElements.forEach((element) => {
      element.addEventListener('mouseenter', handleMouseEnter);
      element.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      
      interactiveElements.forEach((element) => {
        element.removeEventListener('mouseenter', handleMouseEnter);
        element.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  const cursorVariants = {
    default: {
      x: mousePosition.x - 10,
      y: mousePosition.y - 10,
      scale: 1,
      backgroundColor: '#EDECE9',
      borderColor: '#56B8B9',
    },
    hover: {
      x: mousePosition.x - 15,
      y: mousePosition.y - 15,
      scale: 1.5,
      backgroundColor: '#56B8B9',
      borderColor: '#F8AC00',
    },
    click: {
      x: mousePosition.x - 8,
      y: mousePosition.y - 8,
      scale: 0.8,
      backgroundColor: '#00799B',
      borderColor: '#56B8B9',
    },
  };

  const textVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <>
      <motion.div
        className="premium-cursor"
        variants={cursorVariants}
        animate={
          isClicking
            ? 'click'
            : isHovering
            ? 'hover'
            : 'default'
        }
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 28,
        }}
        style={{
          position: 'fixed',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          border: '2px solid',
          pointerEvents: 'none',
          zIndex: 9999,
          mixBlendMode: 'difference',
        }}
      />
      
      {/* Cursor Text */}
      {cursorText && (
        <motion.div
          className="premium-cursor-text"
          variants={textVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          style={{
            position: 'fixed',
            left: mousePosition.x + 20,
            top: mousePosition.y - 10,
            pointerEvents: 'none',
            zIndex: 9999,
            fontSize: '14px',
            fontWeight: '600',
            color: '#56B8B9',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            padding: '4px 8px',
            borderRadius: '6px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            whiteSpace: 'nowrap',
          }}
        >
          {cursorText}
        </motion.div>
      )}
    </>
  );
};

export default PremiumCursor;

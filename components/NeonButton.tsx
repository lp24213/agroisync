"use client";
import { motion } from "framer-motion";
import { ReactNode, ButtonHTMLAttributes } from "react";

interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: ReactNode;
}

export function NeonButton({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  className = "",
  disabled,
  ...props
}: NeonButtonProps) {
  const baseClasses = "relative inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-neon-blue/50 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-neon-blue text-matte-black hover:bg-neon-blue-dark shadow-neon hover:shadow-neon-strong",
    secondary: "bg-neon-purple text-white hover:bg-neon-purple/80 shadow-lg",
    outline: "border-2 border-neon-blue text-neon-blue hover:bg-neon-blue hover:text-matte-black",
    ghost: "text-neon-blue hover:bg-neon-blue/10"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
        ${baseClasses}
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="loading-spinner mr-2" />
      )}
      {icon && !loading && (
        <span className="mr-2">{icon}</span>
      )}
      {children}
    </motion.button>
  );
}

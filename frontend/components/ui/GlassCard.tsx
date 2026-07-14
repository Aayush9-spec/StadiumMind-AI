import React from "react";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function GlassCard({ children, className = "", onClick }: GlassCardProps) {
  return (
    <div 
      onClick={onClick}
      className={`glass-card p-6 ${className}`}
    >
      {children}
    </div>
  );
}

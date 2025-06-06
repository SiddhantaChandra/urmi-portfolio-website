"use client";

import { cn } from '../utils/cn';

const GridBackground = ({ children, className, gridSize = 40, gridColor = "rgba(148, 163, 184, 0.3)" }) => {
  return (
    <div className={cn("relative", className)}>
      {/* Grid Background */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(${gridColor} 1px, transparent 1px), linear-gradient(90deg, ${gridColor} 1px, transparent 1px)`,
          backgroundSize: `${gridSize}px ${gridSize}px`,
          maskImage: 'radial-gradient(ellipse at center, white, transparent)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, white, transparent)',
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default GridBackground; 
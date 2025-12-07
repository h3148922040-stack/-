import React, { useMemo } from 'react';
import { GearProps } from '../types';

interface ExtendedGearProps extends GearProps {
  className?: string;
  opacity?: number;
}

export const Gear: React.FC<ExtendedGearProps> = ({ 
  teeth, 
  radius, 
  color, 
  rotation, 
  x, 
  y, 
  label,
  speedLabel,
  className = "",
  opacity = 1
}) => {
  // Generate the gear path
  const gearPath = useMemo(() => {
    const holeRadius = radius * 0.15; // Slightly smaller hole for stacking
    const teethHeight = radius * 0.15;
    const outerRadius = radius;
    const innerRadius = radius - teethHeight;
    
    let path = "";
    const angleStep = (Math.PI * 2) / teeth;

    for (let i = 0; i < teeth; i++) {
      const angle = i * angleStep;
      const nextAngle = (i + 1) * angleStep;
      
      // Tooth calculations (simplified trapezoid shape)
      const toothWidth = angleStep * 0.5; // Half of the segment is tooth, half is gap
      const t1 = angle;
      const t2 = angle + toothWidth * 0.25; 
      const t3 = angle + toothWidth * 0.75;
      const t4 = angle + toothWidth;

      // Coordinates
      const p1 = [Math.cos(t1) * innerRadius, Math.sin(t1) * innerRadius];
      const p2 = [Math.cos(t2) * outerRadius, Math.sin(t2) * outerRadius];
      const p3 = [Math.cos(t3) * outerRadius, Math.sin(t3) * outerRadius];
      const p4 = [Math.cos(t4) * innerRadius, Math.sin(t4) * innerRadius];

      if (i === 0) {
        path += `M ${p1[0]} ${p1[1]}`;
      } else {
        path += ` L ${p1[0]} ${p1[1]}`;
      }
      path += ` L ${p2[0]} ${p2[1]} L ${p3[0]} ${p3[1]} L ${p4[0]} ${p4[1]}`;
    }
    path += " Z";
    
    return path;
  }, [teeth, radius]);

  return (
    <g transform={`translate(${x}, ${y})`} className={className} style={{ opacity }}>
      {/* Label above gear */}
      {label && (
        <text 
          x="0" 
          y={-radius - 20} 
          textAnchor="middle" 
          className="fill-slate-600 font-bold text-sm tracking-widest uppercase"
        >
          {label}
        </text>
      )}
      
      {/* Rotating Group */}
      <g transform={`rotate(${rotation})`}>
        {/* Main Gear Body */}
        <path 
          d={gearPath} 
          fill={color} 
          stroke="rgba(0,0,0,0.1)" 
          strokeWidth="1"
        />
        {/* Decorative Inner Circle/Spokes */}
        <circle r={radius * 0.6} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="4" strokeDasharray={`${radius * 0.5} ${radius * 0.3}`} />
        <circle r={radius * 0.2} fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
      </g>

      {/* Static Axle */}
      <circle r={radius * 0.12} fill="#cbd5e1" stroke="#94a3b8" strokeWidth="2" />

      {/* Speed Label */}
      {speedLabel && (
        <text 
          x="0" 
          y={radius + 30} 
          textAnchor="middle" 
          className="fill-slate-500 text-xs font-mono bg-white"
        >
          {speedLabel}
        </text>
      )}
    </g>
  );
};
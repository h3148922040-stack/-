import React from 'react';
import { Gear } from './Gear';

interface InternalMechanismProps {
  totalSeconds: number;
}

export const InternalMechanism: React.FC<InternalMechanismProps> = ({ totalSeconds }) => {
  // Visual Scaling for the animation
  // Real gear ratios (60:1) are too big for a screen. 
  // We will visualize a "concept" transmission with smaller ratios but accurate labeling.
  // Let's assume a visual ratio where:
  // Seconds Gear (Green) -> Fast
  // Connecting Pinion -> Medium
  // Minutes Gear (Blue) -> Medium Slow
  // Connecting Pinion -> Slow
  // Hour Gear (Red) -> Very Slow
  
  // Animation Rotation Logic:
  // We use totalSeconds to drive the rotation.
  const baseSpeed = totalSeconds * 30; // Base rotation speed factor

  // 1. Seconds Gear (Green) - Connected to "Power"
  const secGearTeeth = 12;
  const secRotation = baseSpeed; // Spins once per second conceptually? No, let's make it look fast.

  // 2. Transmission Gear 1 (Grey) - Connects Sec to Min
  // Let's say it has 24 teeth. Ratio 1:2.
  const trans1Teeth = 36;
  const trans1Rotation = -secRotation * (secGearTeeth / trans1Teeth); 

  // 3. Minutes Gear (Blue)
  // To make it visually educational, let's just make it spin at "Minute" speed relative to "Second" speed in real time?
  // Real time: Minute hand is 1/60th of Second hand.
  // Visual time: If we show 1/60th, it looks broken/stopped.
  // COMPROMISE: We will drive the rotations mathematically based on time, but lay them out physically.
  
  // Let's stick to strict time-based rotation for accuracy, but allow the user to speed up time in App.tsx.
  
  const secRot = (totalSeconds % 60) / 60 * 360; // 0-360 per minute? No, 360 per minute.
  // Wait, a second hand rotates 360 degrees in 60 seconds.
  // Rotation = totalSeconds * 6 degrees.
  const rSeconds = totalSeconds * 6;
  
  // Minute Hand: 360 degrees in 3600 seconds.
  // Rotation = totalSeconds * (360 / 3600) = totalSeconds * 0.1
  const rMinutes = totalSeconds * 0.1;
  
  // Hour Hand: 360 degrees in 43200 seconds (12 hours).
  // Rotation = totalSeconds * (360 / 43200) = totalSeconds * (1/120)
  const rHours = totalSeconds * (1/120);

  // Layout Constants
  const startX = 100;
  const startY = 150;
  const gap = 110;

  // We need "Idler" gears to reverse direction and make it look connected, 
  // or we just place them adjacently and reverse rotation math.
  
  return (
    <div className="w-full h-full min-h-[300px] flex items-center justify-center bg-slate-100 rounded-xl border-4 border-slate-200 overflow-hidden relative">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
      
      <svg width="100%" height="100%" viewBox="0 0 600 300" preserveAspectRatio="xMidYMid meet">
        
        {/* Connection Lines (Shafts) */}
        <path d="M100 150 L250 150 L400 150" stroke="#cbd5e1" strokeWidth="12" strokeLinecap="round" />

        {/* 1. The Seconds Gear System */}
        <Gear 
          x={100} 
          y={150} 
          radius={50} 
          teeth={12} 
          color="#86efac" // Green-300
          rotation={rSeconds}
          label="秒针"
          speedLabel="最快"
        />

        {/* Transmission Gear (Small) linking Sec to Min visual gap */}
        {/* We place a small gear 'behind' or between to show reduction */}
        <Gear 
          x={175} 
          y={150} 
          radius={25} 
          teeth={8} 
          color="#94a3b8" 
          rotation={-rSeconds} // Spins opposite to Seconds
        />

        {/* 2. The Minutes Gear System */}
        <Gear 
          x={250} 
          y={150} 
          radius={60} 
          teeth={24} 
          color="#93c5fd" // Blue-300
          rotation={rMinutes}
          label="分针"
          speedLabel="中速"
        />

        {/* Transmission Gear linking Min to Hour */}
        <Gear 
          x={335} 
          y={150} 
          radius={25} 
          teeth={8} 
          color="#94a3b8" 
          rotation={-rMinutes} // Spins opposite to Minutes
        />

        {/* 3. The Hour Gear System */}
        <Gear 
          x={430} 
          y={150} 
          radius={80} 
          teeth={36} 
          color="#fca5a5" // Red-300
          rotation={rHours}
          label="时针"
          speedLabel="最慢"
        />
        
        {/* Explanatory Arrows / Flow */}
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
          </marker>
        </defs>
        
        {/* Flow indicator */}
        <path d="M 120 220 L 230 220" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" markerEnd="url(#arrowhead)" />
        <text x="175" y="240" textAnchor="middle" className="fill-slate-500 text-xs">减速</text>

        <path d="M 270 220 L 400 220" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" markerEnd="url(#arrowhead)" />
        <text x="335" y="240" textAnchor="middle" className="fill-slate-500 text-xs">再次减速</text>

      </svg>
      
      <div className="absolute top-4 right-4 bg-white/80 p-2 rounded shadow text-xs max-w-[150px]">
        <p className="font-bold mb-1">运行原理:</p>
        <p>小齿轮带动大齿轮会让转速变慢（也就是减速运动）。这就是为什么时针转得这么慢！</p>
      </div>
    </div>
  );
};
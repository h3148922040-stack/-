import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Gear } from './Gear';

interface ClockFaceProps {
  totalSeconds: number;
}

export const ClockFace: React.FC<ClockFaceProps> = ({ totalSeconds }) => {
  const [isSkeleton, setIsSkeleton] = useState(false);

  // Calculate angles
  // Seconds: 6 degrees per second (360 / 60)
  const secondsDegrees = (totalSeconds % 60) * 6;
  
  // Minutes: 6 degrees per minute (360 / 60) + contribution from seconds
  const minutesDegrees = ((totalSeconds / 60) % 60) * 6;
  
  // Hours: 30 degrees per hour (360 / 12) + contribution from minutes
  const hoursDegrees = ((totalSeconds / 3600) % 12) * 30;

  // Intermediate Gear Rotation (for visual effect)
  // Let's create an idler gear that spins between minute and hour speeds
  const idlerRotation = -minutesDegrees * 2; 

  return (
    <div className="relative flex flex-col items-center gap-4">
      {/* Toggle Switch */}
      <button
        onClick={() => setIsSkeleton(!isSkeleton)}
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all shadow-sm border ${
          isSkeleton 
            ? 'bg-slate-800 text-white border-slate-700' 
            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
        }`}
      >
        {isSkeleton ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        {isSkeleton ? '关闭透视' : '透视内部'}
      </button>

      <div className={`relative w-64 h-64 md:w-80 md:h-80 rounded-full shadow-2xl border-8 transition-all duration-500 flex items-center justify-center mx-auto overflow-hidden
        ${isSkeleton ? 'bg-slate-900 border-slate-600' : 'bg-white border-slate-700'}
      `}>
        
        {/* SKELETON LAYER (Internal Gears) - Only visible when toggled */}
        <div className={`absolute inset-0 transition-opacity duration-500 ${isSkeleton ? 'opacity-100' : 'opacity-0'}`}>
          <svg width="100%" height="100%" viewBox="0 0 320 320">
            {/* Background metallic texture */}
            <defs>
              <radialGradient id="metalGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" stopColor="#475569" />
                <stop offset="100%" stopColor="#1e293b" />
              </radialGradient>
            </defs>
            <rect width="320" height="320" fill="url(#metalGradient)" opacity="0.5" />

            {/* 1. Hour Gear (Large, Red, Slowest) - Bottom Layer */}
            <Gear 
              x={160} y={160} 
              radius={110} 
              teeth={48} 
              color="#ef4444" // Red-500
              rotation={hoursDegrees}
              opacity={0.3} // Faded
              className="drop-shadow-lg"
            />

            {/* 2. Idler/Connecting Gear (Decorative, connects Minute to Hour visually) */}
            <Gear 
              x={230} y={90} 
              radius={40} 
              teeth={16} 
              color="#94a3b8" // Slate-400
              rotation={idlerRotation}
              opacity={0.6}
            />

            {/* 3. Minute Gear (Medium, Blue) - Middle Layer */}
            <Gear 
              x={160} y={160} 
              radius={70} 
              teeth={32} 
              color="#3b82f6" // Blue-500
              rotation={minutesDegrees}
              opacity={0.5}
            />

            {/* 4. Seconds Gear (Small, Green, Fast) - Top Gear Layer */}
            <Gear 
              x={160} y={160} 
              radius={30} 
              teeth={12} 
              color="#22c55e" // Green-500
              rotation={secondsDegrees}
              opacity={0.8}
            />
          </svg>
        </div>

        {/* CLOCK FACE LAYER */}
        
        {/* Clock Markers */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-full h-full text-center pt-2 font-bold text-xl transition-colors duration-300 ${isSkeleton ? 'text-white/60' : 'text-slate-400'}`}
            style={{ transform: `rotate(${i * 30}deg)` }}
          >
            <span className="inline-block" style={{ transform: `rotate(-${i * 30}deg)` }}>
              {i === 0 ? 12 : i}
            </span>
          </div>
        ))}

        {/* Ticks */}
        {[...Array(60)].map((_, i) => (
          <div
            key={`tick-${i}`}
            className={`absolute top-0 w-0.5 h-full transition-colors duration-300 ${
              i % 5 === 0 
                ? (isSkeleton ? 'bg-white/50 w-1' : 'bg-slate-400 w-1') 
                : (isSkeleton ? 'bg-white/20' : 'bg-slate-200')
            }`}
            style={{ 
              transform: `rotate(${i * 6}deg)`,
              clipPath: 'inset(10px 0 92% 0)' /* Only show the top tip */
            }}
          />
        ))}

        {/* Hour Hand */}
        <div
          className="absolute w-2.5 rounded-full origin-bottom z-10 shadow-lg"
          style={{
            backgroundColor: '#ef4444', // Red
            height: '25%',
            bottom: '50%',
            transform: `rotate(${hoursDegrees}deg)`,
            transition: 'transform 0.1s linear',
            opacity: isSkeleton ? 0.9 : 1
          }}
        />

        {/* Minute Hand */}
        <div
          className="absolute w-2 rounded-full origin-bottom z-20 shadow-lg"
          style={{
            backgroundColor: '#3b82f6', // Blue
            height: '38%',
            bottom: '50%',
            transform: `rotate(${minutesDegrees}deg)`,
            transition: 'transform 0.1s linear',
            opacity: isSkeleton ? 0.9 : 1
          }}
        />

        {/* Second Hand */}
        <div
          className="absolute w-1 rounded-full origin-bottom z-30 shadow-sm"
          style={{
            backgroundColor: '#22c55e', // Green
            height: '45%',
            bottom: '50%',
            transform: `rotate(${secondsDegrees}deg)`,
            transition: 'transform 0.1s linear',
            boxShadow: isSkeleton ? '0 0 5px #22c55e' : 'none'
          }}
        />
        
        {/* Center Cap */}
        <div className={`absolute w-5 h-5 rounded-full z-40 border-2 shadow-md transition-colors ${isSkeleton ? 'bg-slate-800 border-slate-400' : 'bg-slate-700 border-white'}`}></div>
      </div>
      
      {/* Instruction hint */}
      {isSkeleton && (
        <div className="text-xs text-slate-500 font-medium animate-pulse">
          现在你可以看到指针是如何连接到齿轮上的！
        </div>
      )}
    </div>
  );
};
import React, { useState, useEffect, useRef } from 'react';
import { ClockFace } from './components/ClockFace';
import { InternalMechanism } from './components/InternalMechanism';
import { Play, Pause, FastForward, RotateCcw, Info } from 'lucide-react';

const App: React.FC = () => {
  // State
  const [totalSeconds, setTotalSeconds] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [showInfo, setShowInfo] = useState<boolean>(false);

  // Refs for animation loop
  const lastTimeRef = useRef<number>(0);
  const requestRef = useRef<number>(0);

  // Initialize with current time on mount (seconds since midnight to keep it clean)
  useEffect(() => {
    const now = new Date();
    const secondsSinceMidnight = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    setTotalSeconds(secondsSinceMidnight);
  }, []);

  const animate = (time: number) => {
    if (lastTimeRef.current !== 0) {
      const deltaTime = (time - lastTimeRef.current) / 1000; // in seconds
      
      if (isPlaying) {
        setTotalSeconds(prev => prev + (deltaTime * speedMultiplier));
      }
    }
    lastTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [isPlaying, speedMultiplier]);

  const handleReset = () => {
    const now = new Date();
    const secondsSinceMidnight = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    setTotalSeconds(secondsSinceMidnight);
    setSpeedMultiplier(1);
    setIsPlaying(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-sky-50 to-blue-100 p-4 md:p-8">
      
      {/* Header */}
      <header className="w-full max-w-5xl flex justify-between items-center mb-8">
        <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight flex items-center gap-2">
          <span className="text-4xl">🕰️</span> 时钟
          <span className="text-blue-500">探秘</span>
        </h1>
        <button 
          onClick={() => setShowInfo(!showInfo)}
          className="p-2 bg-white rounded-full shadow hover:bg-slate-50 transition-colors"
        >
          <Info className="w-6 h-6 text-slate-600" />
        </button>
      </header>

      {/* Info Modal */}
      {showInfo && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowInfo(false)}>
          <div className="bg-white p-6 rounded-2xl max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-2 text-slate-800">你知道吗？</h3>
            <p className="text-slate-600 mb-4">
              在时钟内部，一系列齿轮（称为“齿轮系”）将走得快的秒针和走得慢的时针连接起来。
              秒针齿轮必须转动 <strong>60圈</strong>，分针齿轮才会转动 <strong>1圈</strong>！
            </p>
            <button 
              onClick={() => setShowInfo(false)}
              className="w-full py-2 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600"
            >
              明白了！
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-8">
        
        {/* Left: Clock Face */}
        <div className="flex flex-col items-center gap-4">
          <div className="bg-white/50 p-6 rounded-3xl shadow-sm border border-white/60 backdrop-blur-sm w-full flex justify-center">
            <ClockFace totalSeconds={totalSeconds} />
          </div>
          <div className="bg-white px-6 py-3 rounded-full shadow-sm font-mono text-xl text-slate-700 font-bold border border-slate-100">
            {formatTime(totalSeconds)}
          </div>
        </div>

        {/* Right: Internal Mechanics */}
        <div className="flex flex-col gap-4 h-full">
           <div className="bg-white p-2 rounded-3xl shadow-lg border-4 border-slate-700 h-full flex flex-col relative overflow-hidden">
             <div className="absolute top-0 left-0 bg-slate-700 text-white text-xs font-bold px-4 py-1 rounded-br-xl z-10">
               内部结构
             </div>
             <InternalMechanism totalSeconds={totalSeconds} />
           </div>
        </div>

      </main>

      {/* Controls */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white/90 backdrop-blur shadow-2xl p-2 rounded-2xl border border-slate-200 z-40">
        
        <button 
          onClick={handleReset}
          className="p-3 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors"
          title="重置为实时"
        >
          <RotateCcw className="w-6 h-6" />
        </button>

        <div className="h-8 w-px bg-slate-200 mx-1"></div>

        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className={`p-4 rounded-xl transition-all shadow-lg ${
            isPlaying 
              ? 'bg-amber-100 text-amber-600 hover:bg-amber-200' 
              : 'bg-green-500 text-white hover:bg-green-600'
          }`}
        >
          {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current" />}
        </button>

        <div className="h-8 w-px bg-slate-200 mx-1"></div>

        {/* Speed Controls */}
        <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
          {[1, 60, 3600].map((speed) => (
            <button
              key={speed}
              onClick={() => {
                setSpeedMultiplier(speed);
                setIsPlaying(true);
              }}
              className={`px-3 py-2 rounded-lg text-sm font-bold transition-all ${
                speedMultiplier === speed 
                  ? 'bg-white shadow text-blue-600' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {speed === 1 ? '1x' : speed === 60 ? '60x' : '极速'}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};

// Helper to format total seconds into HH:MM:SS (Chinese format)
function formatTime(totalSeconds: number): string {
  // Normalize to 24h cycle
  let s = totalSeconds % (24 * 3600);
  if (s < 0) s += 24 * 3600;
  
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = Math.floor(s % 60);

  const pad = (n: number) => n.toString().padStart(2, '0');
  
  // Convert to 12h format for kids
  const period = h >= 12 ? '下午' : '上午';
  const h12 = h % 12 || 12;

  // e.g., 上午 10:05:30
  return `${period} ${pad(h12)}:${pad(m)}:${pad(sec)}`;
}

export default App;
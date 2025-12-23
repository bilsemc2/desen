
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { PatternType, PatternDefinition, GameState } from './types';

// --- Sabitler ---
const COLORS = [
  '#FF6B6B', '#4ECDC4', '#FFE66D', '#1A535C', 
  '#FF9F1C', '#2EC4B6', '#E71D36', '#9B5DE5',
  '#F15BB5', '#00BBF9', '#00F5D4', '#FEE440',
  '#003153', '#E30A17', '#40E0D0' // Türk mavisi ve kırmızısı eklendi
];

const PATTERN_TYPES: PatternType[] = [
  'GRID', 'STRIPES', 'CIRCLES', 'DIAMONDS', 'STARS', 
  'MANDALA_FLOWER', 'MANDALA_WEB', 'MANDALA_GEOMETRIC',
  'TURKISH_TULIP', 'TURKISH_EYE', 'TURKISH_KILIM'
];

const getRandomElement = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// --- Parça/Bütün SVG Bileşeni ---

interface PatternSVGProps {
  pattern: PatternDefinition;
  size: number;
  viewMode: 'whole' | 'hole' | 'piece';
  forceOptionIndex?: number;
}

const PatternSVG: React.FC<PatternSVGProps> = ({ pattern, size, viewMode, forceOptionIndex }) => {
  const { type, colors, correctOptionIndex } = pattern;
  
  const isDistraction = forceOptionIndex !== undefined && forceOptionIndex !== correctOptionIndex;
  
  const displayColors = useMemo(() => {
    if (!isDistraction) return colors;
    const newColors = [...colors];
    const colorShift = (forceOptionIndex || 0) + 1;
    return newColors.map((_, i) => COLORS[(COLORS.indexOf(colors[i]) + colorShift + (i * 4)) % COLORS.length]);
  }, [colors, isDistraction, forceOptionIndex]);

  const renderShapes = () => {
    const c1 = displayColors[0];
    const c2 = displayColors[1] || displayColors[0];
    const c3 = displayColors[2] || displayColors[1] || displayColors[0];

    switch (type) {
      case 'GRID':
        return (
          <>
            <rect x="0" y="0" width="50" height="50" fill={c1} />
            <rect x="50" y="0" width="50" height="50" fill={c2} />
            <rect x="0" y="50" width="50" height="50" fill={c2} />
            <rect x="50" y="50" width="50" height="50" fill={c1} />
          </>
        );
      case 'STRIPES':
        return (
          <>
            <rect x="0" y="0" width="100" height="25" fill={c1} />
            <rect x="0" y="25" width="100" height="25" fill={c2} />
            <rect x="0" y="50" width="100" height="25" fill={c3} />
            <rect x="0" y="75" width="100" height="25" fill={c1} />
          </>
        );
      case 'CIRCLES':
        return (
          <>
            <rect x="0" y="0" width="100" height="100" fill={c1} />
            <circle cx="50" cy="50" r="45" fill={c2} />
            <circle cx="50" cy="50" r="30" fill={c3} />
            <circle cx="50" cy="50" r="15" fill={c1} />
          </>
        );
      case 'DIAMONDS':
        return (
          <>
            <rect x="0" y="0" width="100" height="100" fill={c1} />
            <path d="M50 0 L100 50 L50 100 L0 50 Z" fill={c2} />
            <path d="M50 20 L80 50 L50 80 L20 50 Z" fill={c3} />
          </>
        );
      case 'STARS':
        return (
          <>
            <rect x="0" y="0" width="100" height="100" fill={c1} />
            <path d="M50 5 L64 35 L95 35 L70 55 L80 85 L50 65 L20 85 L30 55 L5 35 L36 35 Z" fill={c2} />
            <circle cx="50" cy="50" r="10" fill={c3} />
          </>
        );
      case 'MANDALA_FLOWER':
        return (
          <>
            <rect x="0" y="0" width="100" height="100" fill={c1} />
            {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => (
              <ellipse 
                key={deg} 
                cx="50" cy="50" rx="40" ry="12" 
                fill={c2} 
                transform={`rotate(${deg} 50 50)`} 
                opacity="0.8"
              />
            ))}
            <circle cx="50" cy="50" r="15" fill={c3} stroke={c1} strokeWidth="2" />
          </>
        );
      case 'MANDALA_WEB':
        return (
          <>
            <rect x="0" y="0" width="100" height="100" fill={c2} />
            {[0, 30, 60, 90, 120, 150].map(deg => (
               <rect key={deg} x="0" y="48" width="100" height="4" fill={c1} transform={`rotate(${deg} 50 50)`} />
            ))}
            <circle cx="50" cy="50" r="40" fill="none" stroke={c3} strokeWidth="5" />
            <circle cx="50" cy="50" r="25" fill="none" stroke={c3} strokeWidth="5" />
            <circle cx="50" cy="50" r="10" fill={c3} />
          </>
        );
      case 'MANDALA_GEOMETRIC':
        return (
          <>
            <rect x="0" y="0" width="100" height="100" fill={c3} />
            <rect x="15" y="15" width="70" height="70" fill={c1} transform="rotate(45 50 50)" />
            <rect x="15" y="15" width="70" height="70" fill={c2} opacity="0.7" />
            <rect x="30" y="30" width="40" height="40" fill={c3} transform="rotate(45 50 50)" />
            <circle cx="50" cy="50" r="10" fill={c1} />
          </>
        );
      case 'TURKISH_TULIP':
        return (
          <>
            <rect x="0" y="0" width="100" height="100" fill={c1} />
            <path d="M50 90 C30 90 20 60 50 10 C80 60 70 90 50 90" fill={c2} />
            <path d="M50 80 C40 80 35 60 50 30 C65 60 60 80 50 80" fill={c3} />
            <circle cx="50" cy="90" r="5" fill={c3} />
            <rect x="0" y="0" width="20" height="20" fill={c3} opacity="0.5" />
            <rect x="80" y="0" width="20" height="20" fill={c3} opacity="0.5" />
            <rect x="0" y="80" width="20" height="20" fill={c3} opacity="0.5" />
            <rect x="80" y="80" width="20" height="20" fill={c3} opacity="0.5" />
          </>
        );
      case 'TURKISH_EYE':
        return (
          <>
            <rect x="0" y="0" width="100" height="100" fill={c1} />
            <circle cx="50" cy="50" r="45" fill={c2} />
            <circle cx="50" cy="50" r="30" fill="white" />
            <circle cx="50" cy="50" r="20" fill="#00BBF9" />
            <circle cx="50" cy="50" r="10" fill="black" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => (
              <path key={deg} d="M50 5 L50 15" stroke={c3} strokeWidth="2" transform={`rotate(${deg} 50 50)`} />
            ))}
          </>
        );
      case 'TURKISH_KILIM':
        return (
          <>
            <rect x="0" y="0" width="100" height="100" fill={c1} />
            <path d="M50 10 L90 50 L50 90 L10 50 Z" fill={c2} />
            <path d="M50 25 L75 50 L50 75 L25 50 Z" fill={c3} />
            <path d="M90 50 L100 40 M90 50 L100 60" stroke={c2} strokeWidth="4" />
            <path d="M10 50 L0 40 M10 50 L0 60" stroke={c2} strokeWidth="4" />
            <path d="M50 10 L40 0 M50 10 L60 0" stroke={c2} strokeWidth="4" />
            <path d="M50 90 L40 100 M50 90 L60 100" stroke={c2} strokeWidth="4" />
          </>
        );
      default:
        return null;
    }
  };

  const viewBox = viewMode === 'piece' ? "55 55 40 40" : "0 0 100 100";

  return (
    <div 
      className={`relative overflow-hidden rounded-xl shadow-md transition-all duration-300 hover:scale-105 cursor-pointer bg-white border-2 border-gray-100`}
      style={{ width: size, height: size }}
    >
      <svg viewBox={viewBox} className="w-full h-full">
        {renderShapes()}
        {viewMode === 'hole' && (
          <>
            <rect 
              x="55" y="55" 
              width="40" height="40" 
              fill="#f8fafc" 
              stroke="#e2e8f0"
              strokeWidth="1"
              className="animate-pulse"
            />
            <text 
              x="75" y="80" 
              textAnchor="middle" 
              fontSize="20" 
              fill="#94a3b8" 
              className="font-bold pointer-events-none"
            >
              ?
            </text>
          </>
        )}
      </svg>
    </div>
  );
};

// --- Ana Uygulama ---

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    currentLevel: 1,
    score: 0,
    totalQuestions: 15,
    isGameOver: false,
    lives: 3
  });

  const [currentPattern, setCurrentPattern] = useState<PatternDefinition | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const generatePattern = useCallback(() => {
    const type = getRandomElement(PATTERN_TYPES);
    const selectedColors: string[] = [];
    const neededColors = (type.startsWith('MANDALA') || type.startsWith('TURKISH')) ? 3 : 2;
    
    while (selectedColors.length < neededColors) {
      const color = getRandomElement(COLORS);
      if (!selectedColors.includes(color)) selectedColors.push(color);
    }

    const correctIndex = Math.floor(Math.random() * 6);

    setCurrentPattern({
      id: Date.now(),
      type,
      colors: selectedColors,
      correctOptionIndex: correctIndex,
      difficulty: gameState.currentLevel
    });
    setFeedback(null);
  }, [gameState.currentLevel]);

  const resetGame = () => {
    setGameState({
      currentLevel: 1,
      score: 0,
      totalQuestions: 15,
      isGameOver: false,
      lives: 3
    });
    setFeedback(null);
    // generatePattern useEffect üzerinden tetiklenecek çünkü currentLevel 1 olacak
  };

  useEffect(() => {
    generatePattern();
  }, [generatePattern]);

  const handleOptionClick = (index: number) => {
    if (feedback || !currentPattern) return;

    if (index === currentPattern.correctOptionIndex) {
      setFeedback('correct');
      setGameState(prev => ({ ...prev, score: prev.score + 10 }));
      setTimeout(() => {
        if (gameState.currentLevel >= gameState.totalQuestions) {
          setGameState(prev => ({ ...prev, isGameOver: true }));
        } else {
          setGameState(prev => ({ ...prev, currentLevel: prev.currentLevel + 1 }));
        }
      }, 1000);
    } else {
      setFeedback('wrong');
      setGameState(prev => ({ ...prev, lives: Math.max(0, prev.lives - 1) }));
      setTimeout(() => {
        if (gameState.lives <= 1) {
          setGameState(prev => ({ ...prev, isGameOver: true }));
        } else {
          setFeedback(null);
        }
      }, 800);
    }
  };

  if (gameState.isGameOver) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-teal-50">
        <div className="bg-white p-10 rounded-3xl shadow-2xl text-center max-w-md w-full border-b-8 border-teal-200">
          <div className="text-6xl mb-4">🏆</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Harika İş!</h1>
          <p className="text-2xl text-gray-600 mb-8">Puanın: <span className="font-bold text-teal-600">{gameState.score}</span></p>
          <button 
            onClick={resetGame}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 rounded-2xl shadow-lg transform active:scale-95 transition-all text-xl"
          >
            Tekrar Oyna
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 flex flex-col items-center bg-indigo-50 font-sans">
      <div className="w-full max-w-3xl flex justify-between items-center mb-6 bg-white p-5 rounded-2xl shadow-sm border-b-4 border-indigo-100">
        <div className="text-indigo-600 font-bold text-lg">Seviye {gameState.currentLevel}/{gameState.totalQuestions}</div>
        <div className="flex gap-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <span key={i} className={`text-2xl transition-all duration-300 ${i < gameState.lives ? 'scale-110' : 'grayscale opacity-30 scale-90'}`}>❤️</span>
          ))}
        </div>
        <div className="text-pink-600 font-bold text-lg">{gameState.score} Puan</div>
      </div>

      <div className="w-full max-w-3xl bg-white rounded-3xl p-6 md:p-10 shadow-xl border-b-8 border-indigo-100 flex flex-col items-center mb-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-16 h-16 opacity-10 rotate-12 pointer-events-none"></div>
        
        <h2 className="text-xl md:text-2xl font-bold text-gray-700 mb-6 text-center">
          Desenin <span className="text-indigo-500 underline">gizli parçasını</span> bulabilir misin?
        </h2>
        
        {currentPattern && (
          <div className="relative p-2 bg-white rounded-2xl shadow-inner border-4 border-indigo-50 transition-transform duration-500">
            <PatternSVG pattern={currentPattern} size={280} viewMode="hole" />
            
            {feedback === 'correct' && (
              <div className="absolute inset-0 flex items-center justify-center bg-green-500/20 rounded-xl animate-bounce">
                <div className="bg-white rounded-full p-4 shadow-xl text-5xl">🌟</div>
              </div>
            )}
            {feedback === 'wrong' && (
              <div className="absolute inset-0 flex items-center justify-center bg-red-500/20 rounded-xl animate-shake">
                <div className="bg-white rounded-full p-4 shadow-xl text-5xl">🧐</div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="w-full max-w-2xl bg-white/60 p-4 rounded-3xl border-2 border-dashed border-indigo-200">
        <h3 className="text-center text-indigo-400 font-bold mb-4 uppercase tracking-widest text-xs">Aşağıdaki parçalardan hangisi eksik?</h3>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3 justify-items-center">
          {currentPattern && Array.from({ length: 6 }).map((_, index) => (
            <div 
              key={index}
              onClick={() => handleOptionClick(index)}
              className={`flex justify-center transition-all ${feedback ? 'pointer-events-none' : 'hover:scale-110 hover:z-10'}`}
            >
              <PatternSVG 
                pattern={currentPattern} 
                size={80} 
                viewMode="piece" 
                forceOptionIndex={index} 
              />
            </div>
          ))}
        </div>
      </div>

      <p className="mt-8 text-indigo-400 text-sm italic text-center px-4 max-w-lg">
        Türk motifleri, mandalalar ve geometrik şekiller... Hepsi simetrik ve düzenli. Boşluğa neyin geleceğini renklere bakarak tahmin et!
      </p>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        .animate-shake { animation: shake 0.15s ease-in-out 2; }
      `}</style>
    </div>
  );
};

export default App;

import React, { useState, useEffect, useRef } from 'react';
import { PetState } from '../types/pet';
import { soundManager } from '../utils/audio';
import { X, Trophy, Coins, RotateCcw, Play, Gamepad2, Sparkles, ArrowLeft, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MiniGamesModalProps {
  pet: PetState;
  isOpen: boolean;
  onClose: () => void;
  onReward: (coins: number, xp: number) => void;
}

type GameType = 'menu' | 'star_catch' | 'cloud_jumper' | 'rune_memory';

export const MiniGamesModal: React.FC<MiniGamesModalProps> = ({
  pet,
  isOpen,
  onClose,
  onReward,
}) => {
  const [activeGame, setActiveGame] = useState<GameType>('menu');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-white">Zona de Minijuegos</h3>
              <p className="text-xs text-slate-400">¡Diviértete con {pet.name} y gana monedas y XP!</p>
            </div>
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {activeGame === 'menu' && (
            <div className="space-y-3.5">
              {/* Game 1: Atrapa Estrellas */}
              <div
                onClick={() => {
                  soundManager.playClick();
                  setActiveGame('star_catch');
                }}
                className="group relative bg-gradient-to-r from-amber-950/40 via-purple-950/40 to-slate-900 border border-amber-500/30 hover:border-amber-400 p-4 rounded-2xl flex items-center justify-between cursor-pointer transition-all hover:scale-[1.01] hover:shadow-xl hover:shadow-amber-500/10"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                    ⭐
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white text-base">Atrapa-Estrellas Mágico</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Popular
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Mueve a {pet.name} para atrapar gemas y estrellas cayendo, evitando asteroides oscuros.
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs font-semibold text-amber-400">
                      <span className="flex items-center gap-1">
                        <Coins className="w-3.5 h-3.5" /> Hasta 80 monedas
                      </span>
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" /> +50 XP
                      </span>
                    </div>
                  </div>
                </div>
                <Play className="w-6 h-6 text-amber-400 group-hover:translate-x-1 transition-transform mr-1" />
              </div>

              {/* Game 2: Salto entre Nubes */}
              <div
                onClick={() => {
                  soundManager.playClick();
                  setActiveGame('cloud_jumper');
                }}
                className="group relative bg-gradient-to-r from-sky-950/40 via-blue-950/40 to-slate-900 border border-sky-500/30 hover:border-sky-400 p-4 rounded-2xl flex items-center justify-between cursor-pointer transition-all hover:scale-[1.01] hover:shadow-xl hover:shadow-sky-500/10"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                    ☁️
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">Salto Celestial</h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Salta sobre nubes flotantes y alcanza las alturas más celestiales del multiverso.
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs font-semibold text-sky-400">
                      <span className="flex items-center gap-1">
                        <Coins className="w-3.5 h-3.5" /> Hasta 100 monedas
                      </span>
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" /> +60 XP
                      </span>
                    </div>
                  </div>
                </div>
                <Play className="w-6 h-6 text-sky-400 group-hover:translate-x-1 transition-transform mr-1" />
              </div>

              {/* Game 3: Memoria Rúnica */}
              <div
                onClick={() => {
                  soundManager.playClick();
                  setActiveGame('rune_memory');
                }}
                className="group relative bg-gradient-to-r from-emerald-950/40 via-purple-950/40 to-slate-900 border border-emerald-500/30 hover:border-emerald-400 p-4 rounded-2xl flex items-center justify-between cursor-pointer transition-all hover:scale-[1.01] hover:shadow-xl hover:shadow-emerald-500/10"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                    🔮
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">Memoria Rúnica de Sabiduría</h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Memoriza el orden de los glifos elementales mágicos con sonidos armónicos.
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs font-semibold text-emerald-400">
                      <span className="flex items-center gap-1">
                        <Coins className="w-3.5 h-3.5" /> Hasta 70 monedas
                      </span>
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" /> +45 XP
                      </span>
                    </div>
                  </div>
                </div>
                <Play className="w-6 h-6 text-emerald-400 group-hover:translate-x-1 transition-transform mr-1" />
              </div>
            </div>
          )}

          {activeGame === 'star_catch' && (
            <StarCatchGame
              pet={pet}
              onBack={() => setActiveGame('menu')}
              onFinish={(coins, xp) => onReward(coins, xp)}
            />
          )}

          {activeGame === 'cloud_jumper' && (
            <CloudJumperGame
              pet={pet}
              onBack={() => setActiveGame('menu')}
              onFinish={(coins, xp) => onReward(coins, xp)}
            />
          )}

          {activeGame === 'rune_memory' && (
            <RuneMemoryGame
              pet={pet}
              onBack={() => setActiveGame('menu')}
              onFinish={(coins, xp) => onReward(coins, xp)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   GAME 1: ATRAPA-ESTRELLAS MÁGICO (Star Catch)
========================================================= */
const StarCatchGame: React.FC<{
  pet: PetState;
  onBack: () => void;
  onFinish: (coins: number, xp: number) => void;
}> = ({ pet, onBack, onFinish }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [petX, setPetX] = useState(50); // percentage 0 to 100
  const [fallingItems, setFallingItems] = useState<
    { id: number; x: number; y: number; type: 'star' | 'gem' | 'skull'; speed: number }[]
  >([]);
  const [gameOver, setGameOver] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Start game
  const startGame = () => {
    soundManager.playClick();
    setScore(0);
    setLives(3);
    setPetX(50);
    setFallingItems([]);
    setGameOver(false);
    setIsPlaying(true);
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isPlaying || gameOver) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        setPetX((prev) => Math.max(10, prev - 9));
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        setPetX((prev) => Math.min(90, prev + 9));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, gameOver]);

  // Touch / Mouse movement
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPlaying || gameOver || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relativeX = ((e.clientX - rect.left) / rect.width) * 100;
    setPetX(Math.max(10, Math.min(90, relativeX)));
  };

  // Game Loop
  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const interval = setInterval(() => {
      // Spawn items
      if (Math.random() < 0.28) {
        const typeRoll = Math.random();
        const type: 'star' | 'gem' | 'skull' =
          typeRoll < 0.65 ? 'star' : typeRoll < 0.85 ? 'gem' : 'skull';
        setFallingItems((prev) => [
          ...prev,
          {
            id: Date.now() + Math.random(),
            x: Math.floor(Math.random() * 80) + 10,
            y: 0,
            type,
            speed: type === 'skull' ? 3.5 : 2.8 + Math.random() * 1.5,
          },
        ]);
      }

      // Move items and check collisions
      setFallingItems((prev) => {
        const next: typeof prev = [];
        for (const item of prev) {
          const nextY = item.y + item.speed;

          // Check if item hit bottom level (around y = 80-90%)
          if (nextY >= 78 && nextY <= 92) {
            const distance = Math.abs(item.x - petX);
            if (distance < 14) {
              // Collided with pet!
              if (item.type === 'star') {
                soundManager.playCoin();
                setScore((s) => s + 10);
              } else if (item.type === 'gem') {
                soundManager.playMagicSpell();
                setScore((s) => s + 25);
              } else if (item.type === 'skull') {
                soundManager.playLose();
                setLives((l) => {
                  const updated = l - 1;
                  if (updated <= 0) {
                    setGameOver(true);
                  }
                  return updated;
                });
              }
              continue; // item absorbed
            }
          }

          if (nextY < 100) {
            next.push({ ...item, y: nextY });
          }
        }
        return next;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isPlaying, gameOver, petX]);

  // Handle Game Over Rewards
  useEffect(() => {
    if (gameOver && score > 0) {
      const coinsEarned = Math.min(100, Math.floor(score * 0.7));
      const xpEarned = Math.min(60, Math.floor(score * 0.45));
      onFinish(coinsEarned, xpEarned);
      confetti({ particleCount: 50, spread: 60 });
    }
  }, [gameOver]);

  return (
    <div className="flex flex-col items-center">
      <div className="w-full flex items-center justify-between mb-3">
        <button
          onClick={onBack}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Volver al menú
        </button>
        <div className="flex items-center gap-4 text-sm font-bold">
          <span className="text-amber-400">Puntos: {score}</span>
          <span className="text-rose-400 flex items-center gap-1">
            {'❤️'.repeat(Math.max(0, lives))}
          </span>
        </div>
      </div>

      {/* Game Canvas Box */}
      <div
        ref={containerRef}
        onPointerMove={handlePointerMove}
        className="relative w-full h-80 bg-gradient-to-b from-slate-950 via-purple-950/80 to-slate-950 rounded-2xl border border-slate-700 overflow-hidden cursor-crosshair select-none touch-none shadow-inner"
      >
        {/* Starry background dots */}
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <div className="absolute top-8 left-12 text-xs">✨</div>
          <div className="absolute top-20 right-14 text-xs">⭐</div>
          <div className="absolute top-36 left-48 text-xs">✨</div>
        </div>

        {/* Falling Items */}
        {fallingItems.map((item) => (
          <div
            key={item.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 text-2xl transition-all"
            style={{ left: `${item.x}%`, top: `${item.y}%` }}
          >
            {item.type === 'star' ? '⭐' : item.type === 'gem' ? '💎' : '☄️'}
          </div>
        ))}

        {/* Pet Basket Player */}
        <div
          className="absolute bottom-4 transform -translate-x-1/2 flex flex-col items-center pointer-events-none transition-all duration-75"
          style={{ left: `${petX}%` }}
        >
          <div className="w-12 h-12 rounded-full bg-purple-500/30 border border-purple-400 flex items-center justify-center text-2xl shadow-lg">
            {pet.speciesId === 'dragon' ? '🐲' : pet.speciesId === 'unicorn' ? '🦄' : pet.speciesId === 'kitsune' ? '🦊' : '🦎'}
          </div>
          <div className="w-16 h-2 bg-purple-500/60 rounded-full blur-[1px] mt-1" />
        </div>

        {/* Start / Game Over Overlays */}
        {!isPlaying && !gameOver && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <span className="text-4xl mb-2 animate-bounce">⭐</span>
            <h4 className="font-heading font-bold text-xl text-white">Atrapa-Estrellas</h4>
            <p className="text-xs text-slate-300 max-w-xs mt-1 mb-4">
              Desliza tu dedo o usa las flechas [← / →] para atrapar estrellas y gemas, evitando los cometas oscuros.
            </p>
            <button
              onClick={startGame}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl shadow-lg flex items-center gap-2 hover:scale-105 active:scale-95 transition-transform"
            >
              <Play className="w-4 h-4" /> Comenzar Partida
            </button>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
            <Trophy className="w-12 h-12 text-amber-400 mb-2 animate-bounce" />
            <h4 className="font-heading font-bold text-2xl text-white">¡Partida Terminada!</h4>
            <p className="text-sm text-slate-300 mt-1">Puntuación alcanzada: <strong className="text-amber-400">{score}</strong></p>
            <div className="flex items-center gap-4 my-3 px-4 py-2 bg-slate-900/80 rounded-xl border border-slate-700">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                <Coins className="w-4 h-4" /> +{Math.min(100, Math.floor(score * 0.7))} Monedas
              </span>
              <span className="text-xs font-bold text-purple-300 flex items-center gap-1">
                <Sparkles className="w-4 h-4" /> +{Math.min(60, Math.floor(score * 0.45))} XP
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={startGame}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl flex items-center gap-2 hover:scale-105 transition-transform"
              >
                <RotateCcw className="w-4 h-4" /> Jugar otra vez
              </button>
              <button
                onClick={onBack}
                className="px-4 py-2.5 bg-slate-800 text-slate-200 font-semibold rounded-xl hover:bg-slate-700 transition-colors"
              >
                Menú
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Controls for touch screens */}
      {isPlaying && !gameOver && (
        <div className="flex justify-between w-full mt-3 px-2">
          <button
            onPointerDown={() => setPetX((prev) => Math.max(10, prev - 12))}
            className="px-6 py-3 bg-slate-800/90 active:bg-purple-600 rounded-xl font-bold flex items-center gap-1 text-slate-200"
          >
            <ArrowLeft className="w-5 h-5" /> Izquierda
          </button>
          <button
            onPointerDown={() => setPetX((prev) => Math.min(90, prev + 12))}
            className="px-6 py-3 bg-slate-800/90 active:bg-purple-600 rounded-xl font-bold flex items-center gap-1 text-slate-200"
          >
            Derecha <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

/* =========================================================
   GAME 2: SALTO CELESTIAL (Cloud Jumper)
========================================================= */
const CloudJumperGame: React.FC<{
  pet: PetState;
  onBack: () => void;
  onFinish: (coins: number, xp: number) => void;
}> = ({ pet, onBack, onFinish }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [heightScore, setHeightScore] = useState(0);
  const [petX, setPetX] = useState(50);
  const [petY, setPetY] = useState(50);
  const [velocity, setVelocity] = useState(0);
  const [clouds, setClouds] = useState<{ id: number; x: number; y: number; width: number }[]>([]);
  const [gameOver, setGameOver] = useState(false);

  const startGame = () => {
    soundManager.playClick();
    setHeightScore(0);
    setPetX(50);
    setPetY(60);
    setVelocity(-6); // initial bounce
    setGameOver(false);
    setIsPlaying(true);

    // Initial platforms
    setClouds([
      { id: 1, x: 50, y: 80, width: 35 },
      { id: 2, x: 25, y: 55, width: 28 },
      { id: 3, x: 75, y: 30, width: 30 },
      { id: 4, x: 40, y: 5, width: 26 },
    ]);
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isPlaying || gameOver) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        setPetX((x) => Math.max(10, x - 8));
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        setPetX((x) => Math.min(90, x + 8));
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isPlaying, gameOver]);

  // Physics Loop
  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const interval = setInterval(() => {
      setVelocity((v) => v + 0.35); // gravity

      setPetY((y) => {
        const nextY = y + velocity;

        // Check platform bounce when falling down
        if (velocity > 0) {
          for (const c of clouds) {
            if (Math.abs(nextY - c.y) < 4 && Math.abs(petX - c.x) < c.width / 2 + 6) {
              soundManager.playJump();
              setVelocity(-7.5); // bounce!
              setHeightScore((h) => h + 15);
              break;
            }
          }
        }

        // Camera scrolls when pet reaches top third
        if (nextY < 35) {
          const shift = 35 - nextY;
          setClouds((prev) => {
            const shifted = prev.map((c) => ({ ...c, y: c.y + shift }));
            // Remove offscreen clouds and spawn new ones at top
            const filtered = shifted.filter((c) => c.y < 105);
            if (filtered.length < 5) {
              filtered.push({
                id: Date.now() + Math.random(),
                x: Math.floor(Math.random() * 65) + 20,
                y: Math.floor(Math.random() * 15) - 5,
                width: Math.floor(Math.random() * 15) + 22,
              });
            }
            return filtered;
          });
          return 35;
        }

        // Fell off bottom
        if (nextY > 98) {
          soundManager.playLose();
          setGameOver(true);
        }

        return nextY;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [isPlaying, gameOver, velocity, clouds, petX]);

  useEffect(() => {
    if (gameOver && heightScore > 0) {
      const coins = Math.min(90, Math.floor(heightScore * 0.5));
      const xp = Math.min(50, Math.floor(heightScore * 0.35));
      onFinish(coins, xp);
      confetti({ particleCount: 40, spread: 55 });
    }
  }, [gameOver]);

  return (
    <div className="flex flex-col items-center">
      <div className="w-full flex items-center justify-between mb-3">
        <button
          onClick={onBack}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Volver al menú
        </button>
        <span className="text-sm font-bold text-sky-400">Altura: {heightScore} m</span>
      </div>

      <div className="relative w-full h-80 bg-gradient-to-b from-indigo-950 via-sky-950 to-slate-950 rounded-2xl border border-slate-700 overflow-hidden shadow-inner">
        {/* Clouds */}
        {clouds.map((c) => (
          <div
            key={c.id}
            className="absolute h-5 bg-gradient-to-r from-sky-200 to-indigo-100 rounded-full shadow-md flex items-center justify-center transform -translate-x-1/2 transition-transform"
            style={{ left: `${c.x}%`, top: `${c.y}%`, width: `${c.width}%` }}
          >
            <div className="w-full h-full rounded-full opacity-60 bg-white" />
          </div>
        ))}

        {/* Pet Jumper */}
        <div
          className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{ left: `${petX}%`, top: `${petY}%` }}
        >
          <div className="w-10 h-10 rounded-full bg-sky-500/40 border border-sky-300 flex items-center justify-center text-xl shadow-lg">
            {pet.speciesId === 'dragon' ? '🐲' : pet.speciesId === 'unicorn' ? '🦄' : pet.speciesId === 'kitsune' ? '🦊' : '🦎'}
          </div>
        </div>

        {!isPlaying && !gameOver && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <span className="text-4xl mb-2 animate-bounce">☁️</span>
            <h4 className="font-heading font-bold text-xl text-white">Salto Celestial</h4>
            <p className="text-xs text-slate-300 max-w-xs mt-1 mb-4">
              Rebota en las nubes y llega lo más alto posible usando las flechas de izquierda y derecha.
            </p>
            <button
              onClick={startGame}
              className="px-6 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold rounded-xl shadow-lg flex items-center gap-2 hover:scale-105 active:scale-95 transition-transform"
            >
              <Play className="w-4 h-4" /> Comenzar a Saltar
            </button>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
            <Trophy className="w-12 h-12 text-sky-400 mb-2 animate-bounce" />
            <h4 className="font-heading font-bold text-2xl text-white">¡Caída Celestial!</h4>
            <p className="text-sm text-slate-300 mt-1">Altura máxima: <strong className="text-sky-400">{heightScore} metros</strong></p>
            <div className="flex items-center gap-4 my-3 px-4 py-2 bg-slate-900/80 rounded-xl border border-slate-700">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                <Coins className="w-4 h-4" /> +{Math.min(90, Math.floor(heightScore * 0.5))} Monedas
              </span>
              <span className="text-xs font-bold text-purple-300 flex items-center gap-1">
                <Sparkles className="w-4 h-4" /> +{Math.min(50, Math.floor(heightScore * 0.35))} XP
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={startGame}
                className="px-5 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold rounded-xl flex items-center gap-2 hover:scale-105 transition-transform"
              >
                <RotateCcw className="w-4 h-4" /> Reintentar
              </button>
              <button
                onClick={onBack}
                className="px-4 py-2.5 bg-slate-800 text-slate-200 font-semibold rounded-xl hover:bg-slate-700 transition-colors"
              >
                Menú
              </button>
            </div>
          </div>
        )}
      </div>

      {isPlaying && !gameOver && (
        <div className="flex justify-between w-full mt-3 px-2">
          <button
            onPointerDown={() => setPetX((prev) => Math.max(10, prev - 12))}
            className="px-6 py-3 bg-slate-800/90 active:bg-sky-600 rounded-xl font-bold flex items-center gap-1 text-slate-200"
          >
            <ArrowLeft className="w-5 h-5" /> Izquierda
          </button>
          <button
            onPointerDown={() => setPetX((prev) => Math.min(90, prev + 12))}
            className="px-6 py-3 bg-slate-800/90 active:bg-sky-600 rounded-xl font-bold flex items-center gap-1 text-slate-200"
          >
            Derecha <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

/* =========================================================
   GAME 3: MEMORIA RÚNICA (Rune Memory)
========================================================= */
const RUNES = [
  { id: 'fuego', label: 'Fuego', color: 'bg-red-500 border-red-400 text-red-200', activeColor: 'bg-red-400 shadow-lg shadow-red-500/50 scale-105', icon: '🔥' },
  { id: 'agua', label: 'Agua', color: 'bg-blue-500 border-blue-400 text-blue-200', activeColor: 'bg-blue-400 shadow-lg shadow-blue-500/50 scale-105', icon: '💧' },
  { id: 'luz', label: 'Estrella', color: 'bg-amber-400 border-amber-300 text-amber-900', activeColor: 'bg-yellow-300 shadow-lg shadow-yellow-400/50 scale-105', icon: '⭐' },
  { id: 'planta', label: 'Naturaleza', color: 'bg-emerald-500 border-emerald-400 text-emerald-200', activeColor: 'bg-emerald-400 shadow-lg shadow-emerald-500/50 scale-105', icon: '🌿' },
];

const RuneMemoryGame: React.FC<{
  pet: PetState;
  onBack: () => void;
  onFinish: (coins: number, xp: number) => void;
}> = ({ pet, onBack, onFinish }) => {
  const [sequence, setSequence] = useState<string[]>([]);
  const [playerStep, setPlayerStep] = useState(0);
  const [activeRune, setActiveRune] = useState<string | null>(null);
  const [isPlayingSeq, setIsPlayingSeq] = useState(false);
  const [round, setRound] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const startNextRound = (currentSeq: string[]) => {
    const nextRune = RUNES[Math.floor(Math.random() * RUNES.length)].id;
    const newSeq = [...currentSeq, nextRune];
    setSequence(newSeq);
    setPlayerStep(0);
    setRound(newSeq.length);
    playSequence(newSeq);
  };

  const startGame = () => {
    soundManager.playClick();
    setGameOver(false);
    setHasStarted(true);
    startNextRound([]);
  };

  const playSequence = async (seq: string[]) => {
    setIsPlayingSeq(true);
    for (let i = 0; i < seq.length; i++) {
      await new Promise((r) => setTimeout(r, 400));
      setActiveRune(seq[i]);
      soundManager.playClick();
      await new Promise((r) => setTimeout(r, 450));
      setActiveRune(null);
    }
    setIsPlayingSeq(false);
  };

  const handleRuneClick = (runeId: string) => {
    if (isPlayingSeq || gameOver || !hasStarted) return;

    soundManager.playClick();
    setActiveRune(runeId);
    setTimeout(() => setActiveRune(null), 200);

    if (sequence[playerStep] === runeId) {
      const nextStep = playerStep + 1;
      if (nextStep === sequence.length) {
        // Round won!
        soundManager.playCoin();
        setTimeout(() => startNextRound(sequence), 700);
      } else {
        setPlayerStep(nextStep);
      }
    } else {
      // Mistake!
      soundManager.playLose();
      setGameOver(true);
      const earnedCoins = round * 10;
      const earnedXp = round * 7;
      if (earnedCoins > 0) {
        onFinish(earnedCoins, earnedXp);
        confetti({ particleCount: 35, spread: 50 });
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-full flex items-center justify-between mb-3">
        <button
          onClick={onBack}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Volver al menú
        </button>
        <span className="text-sm font-bold text-emerald-400">Ronda: {round}</span>
      </div>

      <div className="w-full max-w-sm bg-slate-950/70 p-6 rounded-2xl border border-slate-800 flex flex-col items-center shadow-inner">
        <p className="text-xs text-slate-300 mb-4 text-center">
          {isPlayingSeq
            ? 'Observa y escucha la melodía mágica...'
            : hasStarted && !gameOver
            ? '¡Tu turno! Repite la secuencia en orden.'
            : 'Memoriza los patrones mágicos para entrenar la mente de tu criatura.'}
        </p>

        {/* 4 Rune Buttons */}
        <div className="grid grid-cols-2 gap-3 w-full max-w-xs mb-4">
          {RUNES.map((rune) => {
            const isActive = activeRune === rune.id;
            return (
              <button
                key={rune.id}
                onClick={() => handleRuneClick(rune.id)}
                disabled={isPlayingSeq || gameOver || !hasStarted}
                className={`h-24 rounded-2xl border-2 flex flex-col items-center justify-center transition-all ${
                  isActive ? rune.activeColor : rune.color
                } opacity-90 hover:opacity-100 active:scale-95 disabled:cursor-not-allowed`}
              >
                <span className="text-3xl mb-1">{rune.icon}</span>
                <span className="text-xs font-bold">{rune.label}</span>
              </button>
            );
          })}
        </div>

        {!hasStarted && (
          <button
            onClick={startGame}
            className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl shadow-lg flex items-center gap-2 hover:scale-105 active:scale-95 transition-transform"
          >
            <Play className="w-4 h-4" /> Iniciar Desafío
          </button>
        )}

        {gameOver && (
          <div className="flex flex-col items-center text-center animate-fadeIn">
            <h4 className="font-heading font-bold text-lg text-white mb-1">¡Memoria Deslumbrada!</h4>
            <p className="text-xs text-slate-300">Alcanzaste la ronda {round}. Ganaste +{round * 10} monedas.</p>
            <button
              onClick={startGame}
              className="mt-3 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reintentar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

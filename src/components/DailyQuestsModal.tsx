import React, { useState } from 'react';
import { DailyQuest, PlayerInventory } from '../types/pet';
import { soundManager } from '../utils/audio';
import { X, CheckCircle2, Gift, Coins, Sparkles, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DailyQuestsModalProps {
  quests: DailyQuest[];
  inventory: PlayerInventory;
  isOpen: boolean;
  onClose: () => void;
  onClaimQuest: (questId: string) => void;
  onUpdateInventory: (updater: (prev: PlayerInventory) => PlayerInventory) => void;
}

export const DailyQuestsModal: React.FC<DailyQuestsModalProps> = ({
  quests,
  inventory,
  isOpen,
  onClose,
  onClaimQuest,
  onUpdateInventory,
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<string | null>(null);

  if (!isOpen) return null;

  const todayStr = new Date().toDateString();
  const canSpin = inventory.lastDailySpinDate !== todayStr;

  // Spin Wheel prizes
  const prizes = [
    { label: '+30 Monedas', coins: 30, gems: 0 },
    { label: '+50 Monedas', coins: 50, gems: 0 },
    { label: '+100 Monedas', coins: 100, gems: 0 },
    { label: '+5 Gemas', coins: 0, gems: 5 },
    { label: '+75 Monedas', coins: 75, gems: 0 },
    { label: '¡Premio Mayor: 150 Monedas + 3 Gemas!', coins: 150, gems: 3 },
  ];

  const handleSpinWheel = () => {
    if (!canSpin || isSpinning) return;

    soundManager.playClick();
    setIsSpinning(true);
    setSpinResult(null);

    // Simulate roulette spin
    setTimeout(() => {
      const prize = prizes[Math.floor(Math.random() * prizes.length)];
      soundManager.playLevelUp();
      confetti({ particleCount: 60, spread: 70 });

      onUpdateInventory((inv) => ({
        ...inv,
        coins: inv.coins + prize.coins,
        gems: inv.gems + prize.gems,
        lastDailySpinDate: todayStr,
      }));

      setSpinResult(prize.label);
      setIsSpinning(false);
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-white">Desafíos Diarios & Recompensas</h3>
              <p className="text-xs text-slate-400">Desarrolla responsabilidad y gana tesoros mágicos</p>
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
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
          {/* Daily Spin Section */}
          <div className="bg-gradient-to-r from-amber-950/50 via-purple-950/50 to-slate-950 p-4 rounded-2xl border border-amber-500/30">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-2xl ${
                    isSpinning ? 'animate-spin' : ''
                  }`}
                >
                  🎡
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Ruleta Cósmica Diaria</h4>
                  <p className="text-xs text-slate-300">Gira gratis cada día para ganar monedas y gemas mágicas</p>
                  {spinResult && (
                    <p className="text-xs font-bold text-amber-400 mt-1 animate-bounce">
                      🎉 ¡Ganaste: {spinResult}!
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={handleSpinWheel}
                disabled={!canSpin || isSpinning}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
                  canSpin && !isSpinning
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 shadow-lg shadow-amber-500/20 active:scale-95'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <Gift className="w-4 h-4" />
                <span>{isSpinning ? 'Girando...' : canSpin ? 'Girar Ruleta Gratis' : 'Vuelve mañana'}</span>
              </button>
            </div>
          </div>

          {/* Quests List */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" /> Misiones de Hoy
            </h4>

            <div className="space-y-2.5">
              {quests.map((q) => {
                const progressPercent = Math.min(100, (q.currentCount / q.targetCount) * 100);
                const canClaim = q.currentCount >= q.targetCount && !q.claimed;

                return (
                  <div
                    key={q.id}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                      q.claimed
                        ? 'bg-slate-950/40 border-slate-900 opacity-60'
                        : canClaim
                        ? 'bg-purple-950/40 border-purple-500 shadow-md shadow-purple-500/10'
                        : 'bg-slate-950/60 border-slate-800'
                    }`}
                  >
                    <div className="flex-1 mr-3">
                      <div className="flex items-center gap-2">
                        <h5 className="font-bold text-white text-xs sm:text-sm">{q.title}</h5>
                        <span className="text-[10px] text-slate-400">
                          ({q.currentCount}/{q.targetCount})
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{q.description}</p>

                      {/* Progress bar */}
                      <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Reward & Button */}
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <div className="flex items-center gap-2 text-[11px] font-bold">
                        <span className="text-amber-400 flex items-center gap-0.5">
                          <Coins className="w-3 h-3" /> +{q.rewardCoins}
                        </span>
                        <span className="text-purple-400 flex items-center gap-0.5">
                          <Sparkles className="w-3 h-3" /> +{q.rewardXp}
                        </span>
                      </div>

                      {q.claimed ? (
                        <span className="text-[11px] font-semibold text-slate-500 px-3 py-1 bg-slate-800 rounded-lg">
                          Completada
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            if (canClaim) {
                              soundManager.playCoin();
                              confetti({ particleCount: 30, spread: 45 });
                              onClaimQuest(q.id);
                            }
                          }}
                          disabled={!canClaim}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            canClaim
                              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md active:scale-95 animate-pulse'
                              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          }`}
                        >
                          {canClaim ? 'Reclamar Premio' : 'En progreso'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

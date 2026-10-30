import React, { useState } from 'react';
import { PetState, MagicPower } from '../types/pet';
import { SPECIES_DATA } from '../data/speciesData';
import { soundManager } from '../utils/audio';
import { X, Sparkles, Zap, Lock, Flame, Shield, Sun, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PowersModalProps {
  pet: PetState;
  isOpen: boolean;
  onClose: () => void;
  onUpdatePet: (updater: (prev: PetState) => PetState) => void;
  onReward: (coins: number, xp: number) => void;
  onPowerCast?: () => void;
}

export const PowersModal: React.FC<PowersModalProps> = ({
  pet,
  isOpen,
  onClose,
  onUpdatePet,
  onReward,
  onPowerCast,
}) => {
  const [cooldowns, setCooldowns] = useState<Record<string, number>>({});
  const [castMessage, setCastMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const species = SPECIES_DATA[pet.speciesId];
  const currentStage = pet.level >= 8 ? 3 : pet.level >= 4 ? 2 : 1;

  // Cast a magic power!
  const handleCastPower = (power: MagicPower) => {
    if (pet.level < power.minLevel) return;
    if (cooldowns[power.id] && cooldowns[power.id] > Date.now()) {
      soundManager.playLose();
      return;
    }

    // Play spell audio & particles
    soundManager.playMagicSpell();
    confetti({
      particleCount: 80,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#a855f7', '#ec4899', '#f59e0b', '#38bdf8'],
    });

    // Set cooldown
    setCooldowns((prev) => ({
      ...prev,
      [power.id]: Date.now() + power.cooldownSeconds * 1000,
    }));

    // Trigger effect
    let message = '';
    if (power.effectType === 'coin_boost') {
      const coins = 45;
      onReward(coins, 25);
      message = `¡${power.name} invocó +${coins} Monedas Cósmicas y +25 XP!`;
    } else if (power.effectType === 'stat_restore') {
      onUpdatePet((p) => ({
        ...p,
        stats: {
          ...p.stats,
          hunger: 100,
          energy: 100,
          cleanliness: 100,
          happiness: 100,
        },
      }));
      message = `¡${power.name} restauró al 100% todas las estadísticas de ${pet.name}!`;
    } else if (power.effectType === 'meteor_shower') {
      const coins = 85;
      const xp = 60;
      onReward(coins, xp);
      message = `¡Lluvia estelar legendaria! Ganaste +${coins} Monedas y +${xp} XP.`;
    } else {
      const coins = 30;
      onReward(coins, 40);
      message = `¡${power.name} activado con éxito! +${coins} Monedas y +40 XP.`;
    }

    setCastMessage(message);
    setTimeout(() => setCastMessage(null), 4000);

    if (onPowerCast) onPowerCast();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-white">Evolución & Hechizos Mágicos</h3>
              <p className="text-xs text-slate-400">Nivel actual: {pet.level} • {species.elementLabel}</p>
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
          {/* Casting Success Toast */}
          {castMessage && (
            <div className="p-3 bg-gradient-to-r from-purple-900/90 to-pink-900/90 border border-purple-400 rounded-2xl text-center text-xs font-bold text-white shadow-lg animate-bounce">
              ✨ {castMessage}
            </div>
          )}

          {/* Section 1: Evolution Road Stages */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-purple-400 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Fases de Crecimiento & Metamorfosis
            </h4>

            <div className="grid grid-cols-3 gap-2">
              {species.stages.map((stg) => {
                const isCurrent = currentStage === stg.stage;
                const isUnlocked = pet.level >= stg.minLevel;

                return (
                  <div
                    key={stg.stage}
                    className={`relative p-3 rounded-2xl border flex flex-col justify-between transition-all ${
                      isCurrent
                        ? 'bg-purple-950/60 border-purple-500 shadow-md shadow-purple-500/20 ring-1 ring-purple-400'
                        : isUnlocked
                        ? 'bg-slate-800/80 border-slate-700 opacity-90'
                        : 'bg-slate-950/40 border-slate-800/80 opacity-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-purple-300">Fase {stg.stage}</span>
                        {isUnlocked ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Lock className="w-3.5 h-3.5 text-slate-500" />
                        )}
                      </div>
                      <h5 className="font-bold text-white text-xs line-clamp-1">{stg.title}</h5>
                      <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">
                        {stg.description}
                      </p>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-700/50 flex items-center justify-between text-[10px]">
                      <span className="text-slate-400">Nivel min:</span>
                      <span className="font-bold text-amber-400">{stg.minLevel}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Magical Powers */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-purple-400 mb-3 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" /> Hechizos y Habilidades Desbloqueadas
            </h4>

            <div className="space-y-2.5">
              {species.powers.map((power) => {
                const isUnlocked = pet.level >= power.minLevel;
                const cdUntil = cooldowns[power.id] || 0;
                const isCoolingDown = cdUntil > Date.now();

                return (
                  <div
                    key={power.id}
                    className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                      isUnlocked
                        ? 'bg-slate-950/60 border-slate-800 hover:border-purple-500/50'
                        : 'bg-slate-950/30 border-slate-900 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-lg"
                        style={{
                          backgroundColor: `${power.color}25`,
                          border: `1px solid ${power.color}50`,
                          color: power.color,
                        }}
                      >
                        {power.effectType === 'coin_boost' ? '💰' : power.effectType === 'stat_restore' ? '💖' : power.effectType === 'meteor_shower' ? '🌠' : '⚡'}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-bold text-white text-sm">{power.name}</h5>
                          {!isUnlocked && (
                            <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Lock className="w-2.5 h-2.5" /> Nivel {power.minLevel}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5 max-w-sm">
                          {power.description}
                        </p>
                      </div>
                    </div>

                    <div>
                      {isUnlocked ? (
                        <button
                          onClick={() => handleCastPower(power)}
                          disabled={isCoolingDown}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            isCoolingDown
                              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                              : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-500/20 active:scale-95'
                          }`}
                        >
                          {isCoolingDown ? 'En recarga...' : 'Lanzar Hechizo ✨'}
                        </button>
                      ) : (
                        <span className="text-xs font-semibold text-slate-500 px-3 py-1 bg-slate-900 rounded-xl">
                          Bloqueado
                        </span>
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

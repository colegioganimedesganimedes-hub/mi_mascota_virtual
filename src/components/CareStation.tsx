import React, { useState } from 'react';
import { PetState, PlayerInventory } from '../types/pet';
import { FOOD_ITEMS } from '../data/shopItems';
import { soundManager } from '../utils/audio';
import { Sparkles, Utensils, ShowerHead, Moon, Sun, Heart, Plus } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CareStationProps {
  pet: PetState;
  inventory: PlayerInventory;
  onUpdatePet: (updater: (prev: PetState) => PetState) => void;
  onUpdateInventory: (updater: (prev: PlayerInventory) => PlayerInventory) => void;
  onOpenShop: () => void;
  onActionComplete?: (actionType: 'feed' | 'bath' | 'pet' | 'sleep') => void;
}

export const CareStation: React.FC<CareStationProps> = ({
  pet,
  inventory,
  onUpdatePet,
  onUpdateInventory,
  onOpenShop,
  onActionComplete,
}) => {
  const [activeTab, setActiveTab] = useState<'feed' | 'bath' | 'sleep' | 'pet'>('feed');
  const [selectedFoodId, setSelectedFoodId] = useState<string>('fruta_estelar');
  const [bathBubbles, setBathBubbles] = useState<{ id: number; x: number; y: number; size: number }[]>([]);

  // Feed Pet
  const handleFeed = (foodId: string) => {
    const count = inventory.foods[foodId] || 0;
    if (count <= 0) {
      soundManager.playClick();
      onOpenShop();
      return;
    }

    const food = FOOD_ITEMS.find((f) => f.id === foodId);
    if (!food) return;

    soundManager.playEat();

    // Consume 1 food from inventory
    onUpdateInventory((inv) => ({
      ...inv,
      foods: {
        ...inv.foods,
        [foodId]: (inv.foods[foodId] || 1) - 1,
      },
    }));

    // Update Pet stats
    onUpdatePet((p) => {
      const newHunger = Math.min(100, p.stats.hunger + food.nutrition);
      const newMagic = Math.min(100, p.stats.magicPower + food.magicBoost);
      const newHappiness = Math.min(100, p.stats.happiness + 8);
      const gainedXp = 15;
      let newXp = p.xp + gainedXp;
      let newLevel = p.level;
      let newXpTarget = p.xpToNextLevel;

      if (newXp >= newXpTarget) {
        newLevel += 1;
        newXp -= newXpTarget;
        newXpTarget = Math.floor(newXpTarget * 1.35);
        soundManager.playLevelUp();
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      }

      return {
        ...p,
        stats: {
          ...p.stats,
          hunger: newHunger,
          magicPower: newMagic,
          happiness: newHappiness,
        },
        xp: newXp,
        level: newLevel,
        xpToNextLevel: newXpTarget,
        lastFed: Date.now(),
      };
    });

    if (onActionComplete) onActionComplete('feed');
  };

  // Add bubble during bath
  const handleSpongeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    soundManager.playBubble();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newBubble = {
      id: Date.now() + Math.random(),
      x,
      y,
      size: Math.floor(Math.random() * 20) + 25,
    };

    setBathBubbles((prev) => [...prev.slice(-12), newBubble]);

    onUpdatePet((p) => ({
      ...p,
      stats: {
        ...p.stats,
        cleanliness: Math.min(100, p.stats.cleanliness + 8),
        happiness: Math.min(100, p.stats.happiness + 2),
      },
      lastCleaned: Date.now(),
    }));
  };

  // Rinse with warm shower
  const handleRinseShower = () => {
    soundManager.playMagicSpell();
    setBathBubbles([]);

    onUpdatePet((p) => {
      const gainedXp = 20;
      let newXp = p.xp + gainedXp;
      let newLevel = p.level;
      let newXpTarget = p.xpToNextLevel;

      if (newXp >= newXpTarget) {
        newLevel += 1;
        newXp -= newXpTarget;
        newXpTarget = Math.floor(newXpTarget * 1.35);
        soundManager.playLevelUp();
        confetti({ particleCount: 60, spread: 50 });
      }

      return {
        ...p,
        stats: {
          ...p.stats,
          cleanliness: 100,
          happiness: Math.min(100, p.stats.happiness + 15),
        },
        level: newLevel,
        xp: newXp,
        xpToNextLevel: newXpTarget,
        lastCleaned: Date.now(),
      };
    });

    if (onActionComplete) onActionComplete('bath');
  };

  // Toggle Sleeping
  const handleToggleSleep = () => {
    soundManager.playClick();
    onUpdatePet((p) => {
      const willSleep = !p.isSleeping;
      return {
        ...p,
        isSleeping: willSleep,
        stats: {
          ...p.stats,
          energy: willSleep ? p.stats.energy : Math.min(100, p.stats.energy + 35),
        },
        lastSlept: Date.now(),
      };
    });

    if (onActionComplete) onActionComplete('sleep');
  };

  // Petting button
  const handlePetAction = () => {
    soundManager.playPet();
    onUpdatePet((p) => ({
      ...p,
      stats: {
        ...p.stats,
        happiness: Math.min(100, p.stats.happiness + 10),
      },
      xp: p.xp + 5,
    }));

    if (onActionComplete) onActionComplete('pet');
  };

  return (
    <div className="w-full bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-2xl">
      {/* Category Tabs */}
      <div className="grid grid-cols-4 gap-2 mb-4 bg-slate-950/60 p-1.5 rounded-2xl border border-slate-800/80">
        <button
          onClick={() => {
            soundManager.playClick();
            setActiveTab('feed');
          }}
          className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'feed'
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-orange-500/25'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Utensils className="w-4 h-4" />
          <span>Comer</span>
        </button>

        <button
          onClick={() => {
            soundManager.playClick();
            setActiveTab('bath');
          }}
          className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'bath'
              ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg shadow-cyan-500/25'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <ShowerHead className="w-4 h-4" />
          <span>Bañar</span>
        </button>

        <button
          onClick={() => {
            soundManager.playClick();
            setActiveTab('sleep');
          }}
          className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'sleep'
              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-purple-500/25'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          {pet.isSleeping ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4" />}
          <span>{pet.isSleeping ? 'Despertar' : 'Dormir'}</span>
        </button>

        <button
          onClick={() => {
            soundManager.playClick();
            setActiveTab('pet');
          }}
          className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'pet'
              ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-rose-500/25'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Afecto</span>
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'feed' && (
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-medium text-slate-400">
              Elige un platillo de tu despensa mágica:
            </span>
            <button
              onClick={() => {
                soundManager.playClick();
                onOpenShop();
              }}
              className="text-xs flex items-center gap-1 text-purple-400 hover:text-purple-300 font-semibold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Comprar comida
            </button>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {FOOD_ITEMS.map((item) => {
              const count = inventory.foods[item.id] || 0;
              const isSelected = selectedFoodId === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedFoodId(item.id);
                    handleFeed(item.id);
                  }}
                  className={`relative p-2.5 rounded-2xl flex flex-col items-center justify-center transition-all border ${
                    isSelected
                      ? 'bg-slate-800 border-purple-500 shadow-md shadow-purple-500/20 scale-102'
                      : 'bg-slate-950/40 border-slate-800/90 hover:bg-slate-800/60 hover:border-slate-700'
                  }`}
                >
                  <span className="text-2xl mb-1 filter drop-shadow">{item.icon}</span>
                  <span className="text-[11px] font-bold text-slate-200 line-clamp-1">{item.name}</span>
                  <span className="text-[10px] text-emerald-400 font-semibold">+{item.nutrition}%</span>

                  {/* Count Badge */}
                  <span
                    className={`absolute -top-1.5 -right-1.5 text-[10px] px-1.5 py-0.5 rounded-full font-bold shadow ${
                      count > 0 ? 'bg-purple-600 text-white' : 'bg-red-500/80 text-white'
                    }`}
                  >
                    x{count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'bath' && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
          <div
            onClick={handleSpongeClick}
            className="flex-1 w-full bg-gradient-to-r from-sky-950/60 to-cyan-950/60 border border-cyan-500/30 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:border-cyan-400 transition-all select-none group"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                🧽
              </div>
              <div>
                <h4 className="font-bold text-cyan-200 text-sm">Esponja Mágica Espumosa</h4>
                <p className="text-xs text-slate-400">Toca aquí repetidas veces para frotar espuma celestial</p>
              </div>
            </div>
            <span className="text-xs font-bold text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded-lg border border-cyan-500/30">
              +8% Limpieza
            </span>
          </div>

          <button
            onClick={handleRinseShower}
            className="w-full sm:w-auto px-5 py-3.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold rounded-2xl shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <ShowerHead className="w-5 h-5" />
            <span>Enjuagar con Estrellas</span>
          </button>
        </div>
      )}

      {activeTab === 'sleep' && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-2xl">
              {pet.isSleeping ? '💤' : '🕯️'}
            </div>
            <div>
              <h4 className="font-bold text-purple-200 text-sm">
                {pet.isSleeping ? 'Mascota durmiendo plácidamente' : 'Hora de recargar energía mágica'}
              </h4>
              <p className="text-xs text-slate-400">
                {pet.isSleeping
                  ? 'Recuperando energía rápidamente bajo las estrellas. ¡No hagas mucho ruido!'
                  : 'Apaga las luces del cuarto celestial para que descanse y sueñe con nuevas magias.'}
              </p>
            </div>
          </div>

          <button
            onClick={handleToggleSleep}
            className={`w-full sm:w-auto px-6 py-3.5 font-bold rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${
              pet.isSleeping
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 shadow-amber-500/20'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-purple-500/20'
            }`}
          >
            {pet.isSleeping ? (
              <>
                <Sun className="w-5 h-5" />
                <span>Despertar mascota</span>
              </>
            ) : (
              <>
                <Moon className="w-5 h-5" />
                <span>Apagar luces y dormir</span>
              </>
            )}
          </button>
        </div>
      )}

      {activeTab === 'pet' && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-2xl">
              💖
            </div>
            <div>
              <h4 className="font-bold text-rose-200 text-sm">Afecto y Mimos Mágicos</h4>
              <p className="text-xs text-slate-400">
                Acaricia a tu criatura para fortalecer su vínculo, aumentar su felicidad y ganar XP.
              </p>
            </div>
          </div>

          <button
            onClick={handlePetAction}
            className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white font-bold rounded-2xl shadow-lg shadow-rose-500/25 flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Sparkles className="w-5 h-5" />
            <span>Acariciar con ternura (+10%)</span>
          </button>
        </div>
      )}
    </div>
  );
};

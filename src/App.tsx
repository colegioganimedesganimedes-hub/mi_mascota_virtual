import React, { useState, useEffect, useCallback } from 'react';
import { PetState, PlayerInventory, DailyQuest } from './types/pet';
import { SPECIES_DATA } from './data/speciesData';
import { HABITAT_THEMES } from './data/shopItems';
import {
  loadAllPets,
  saveAllPets,
  loadActivePetId,
  saveActivePetId,
  loadInventory,
  saveInventory,
  loadDailyQuests,
  saveDailyQuests,
  createNewPet,
} from './utils/storage';
import { soundManager } from './utils/audio';
import { PetAvatar } from './components/PetAvatar';
import { CareStation } from './components/CareStation';
import { MiniGamesModal } from './components/MiniGamesModal';
import { WardrobeModal } from './components/WardrobeModal';
import { PowersModal } from './components/PowersModal';
import { DailyQuestsModal } from './components/DailyQuestsModal';
import { AdoptionModal } from './components/AdoptionModal';
import { SanctuaryModal } from './components/SanctuaryModal';
import { PetOracleModal } from './components/PetOracleModal';

import {
  Sparkles,
  Coins,
  Gem,
  Award,
  Gamepad2,
  ShoppingBag,
  Zap,
  Volume2,
  VolumeX,
  Castle,
  MessageCircle,
  Heart,
  Battery,
  Utensils,
  Droplets,
  Flame,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  const [pets, setPets] = useState<PetState[]>([]);
  const [activePetId, setActivePetId] = useState<string>('');
  const [inventory, setInventory] = useState<PlayerInventory>(loadInventory);
  const [quests, setQuests] = useState<DailyQuest[]>(loadDailyQuests);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Modals state
  const [showAdoption, setShowAdoption] = useState(false);
  const [showSanctuary, setShowSanctuary] = useState(false);
  const [showMiniGames, setShowMiniGames] = useState(false);
  const [showWardrobe, setShowWardrobe] = useState(false);
  const [showPowers, setShowPowers] = useState(false);
  const [showQuests, setShowQuests] = useState(false);
  const [showOracle, setShowOracle] = useState(false);

  // Temporary interaction mood
  const [moodOverride, setMoodOverride] = useState<'eating' | 'bathing' | 'happy' | 'sleeping' | null>(null);

  // Initialize pets from storage or trigger first adoption
  useEffect(() => {
    const loaded = loadAllPets();
    if (loaded.length === 0) {
      // First time user: show adoption modal
      setShowAdoption(true);
    } else {
      setPets(loaded);
      const savedActive = loadActivePetId();
      if (savedActive && loaded.some((p) => p.id === savedActive)) {
        setActivePetId(savedActive);
      } else {
        setActivePetId(loaded[0].id);
      }
    }
  }, []);

  // Sync pets to localStorage
  useEffect(() => {
    if (pets.length > 0) {
      saveAllPets(pets);
    }
  }, [pets]);

  // Sync activePetId
  useEffect(() => {
    if (activePetId) {
      saveActivePetId(activePetId);
    }
  }, [activePetId]);

  // Sync inventory
  useEffect(() => {
    saveInventory(inventory);
  }, [inventory]);

  // Sync quests
  useEffect(() => {
    saveDailyQuests(quests);
  }, [quests]);

  // Active pet object
  const activePet = pets.find((p) => p.id === activePetId) || pets[0];
  const species = activePet ? SPECIES_DATA[activePet.speciesId] : null;

  // Active habitat theme
  const currentHabitat =
    HABITAT_THEMES.find((h) => h.id === activePet?.habitat) || HABITAT_THEMES[0];

  // Toggle Sound
  const toggleSound = () => {
    soundManager.enabled = !soundEnabled;
    setSoundEnabled(!soundEnabled);
  };

  // Helper to update active pet state
  const updateActivePet = useCallback(
    (updater: (prev: PetState) => PetState) => {
      setPets((prevPets) =>
        prevPets.map((p) => {
          if (p.id === activePetId) {
            return updater(p);
          }
          return p;
        })
      );
    },
    [activePetId]
  );

  // Helper to progress daily quests
  const progressQuest = (type: 'feed' | 'bath' | 'minigame' | 'pet' | 'power') => {
    setQuests((prevQuests) =>
      prevQuests.map((q) => {
        if (
          (type === 'feed' && q.id === 'quest_feed_3') ||
          (type === 'bath' && q.id === 'quest_bath_1') ||
          (type === 'minigame' && q.id === 'quest_minigame_1') ||
          (type === 'pet' && q.id === 'quest_pet_5') ||
          (type === 'power' && q.id === 'quest_power_1')
        ) {
          const nextCount = q.currentCount + 1;
          const completed = nextCount >= q.targetCount;
          return {
            ...q,
            currentCount: nextCount,
            completed,
          };
        }
        return q;
      })
    );
  };

  // Claim quest reward
  const handleClaimQuest = (questId: string) => {
    const q = quests.find((item) => item.id === questId);
    if (!q || q.claimed || q.currentCount < q.targetCount) return;

    setQuests((prev) =>
      prev.map((item) => (item.id === questId ? { ...item, claimed: true } : item))
    );

    // Reward player
    setInventory((inv) => ({
      ...inv,
      coins: inv.coins + q.rewardCoins,
    }));

    if (activePet) {
      updateActivePet((p) => {
        let newXp = p.xp + q.rewardXp;
        let newLevel = p.level;
        let newTarget = p.xpToNextLevel;
        if (newXp >= newTarget) {
          newLevel += 1;
          newXp -= newTarget;
          newTarget = Math.floor(newTarget * 1.35);
          soundManager.playLevelUp();
          confetti({ particleCount: 75, spread: 70 });
        }
        return {
          ...p,
          xp: newXp,
          level: newLevel,
          xpToNextLevel: newTarget,
        };
      });
    }
  };

  // Mini-game reward handler
  const handleMiniGameReward = (coinsEarned: number, xpEarned: number) => {
    setInventory((inv) => ({
      ...inv,
      coins: inv.coins + coinsEarned,
    }));

    progressQuest('minigame');

    if (activePet) {
      updateActivePet((p) => {
        let newXp = p.xp + xpEarned;
        let newLevel = p.level;
        let newTarget = p.xpToNextLevel;
        if (newXp >= newTarget) {
          newLevel += 1;
          newXp -= newTarget;
          newTarget = Math.floor(newTarget * 1.35);
          soundManager.playLevelUp();
          confetti({ particleCount: 75, spread: 70 });
        }
        return {
          ...p,
          stats: {
            ...p.stats,
            happiness: Math.min(100, p.stats.happiness + 20),
            energy: Math.max(10, p.stats.energy - 10),
            magicPower: Math.min(100, p.stats.magicPower + 15),
          },
          level: newLevel,
          xp: newXp,
          xpToNextLevel: newTarget,
        };
      });
    }
  };

  // Direct pet click (petting)
  const handlePetAvatarClick = () => {
    soundManager.playPet();
    setMoodOverride('happy');
    setTimeout(() => setMoodOverride(null), 1500);

    updateActivePet((p) => ({
      ...p,
      stats: {
        ...p.stats,
        happiness: Math.min(100, p.stats.happiness + 8),
      },
      xp: p.xp + 4,
    }));

    progressQuest('pet');
  };

  // Handle Care Station complete
  const handleCareActionComplete = (actionType: 'feed' | 'bath' | 'pet' | 'sleep') => {
    if (actionType === 'feed') {
      setMoodOverride('eating');
      setTimeout(() => setMoodOverride(null), 1400);
      progressQuest('feed');
    } else if (actionType === 'bath') {
      setMoodOverride('bathing');
      setTimeout(() => setMoodOverride(null), 1400);
      progressQuest('bath');
    } else if (actionType === 'pet') {
      setMoodOverride('happy');
      setTimeout(() => setMoodOverride(null), 1200);
      progressQuest('pet');
    }
  };

  // Adopt pet callback
  const handleAdoptNewPet = (newPet: PetState) => {
    setPets((prev) => [...prev, newPet]);
    setActivePetId(newPet.id);
    setShowAdoption(false);
  };

  // Check if any quest is ready to claim
  const hasUnclaimedQuests = quests.some((q) => q.currentCount >= q.targetCount && !q.claimed);
  const todayStr = new Date().toDateString();
  const canDailySpin = inventory.lastDailySpinDate !== todayStr;

  // Speech bubble phrase
  const getSpeechBubblePhrase = () => {
    if (!species || !activePet) return '¡Hola amigo!';
    if (activePet.isSleeping) return 'Zzz... soñando con estrellas...';
    if (activePet.stats.hunger < 35) return species.catchphrases.hungry[0];
    if (activePet.stats.cleanliness < 40) return species.catchphrases.dirty[0];
    if (activePet.stats.happiness >= 80) return species.catchphrases.happy[0];
    return species.catchphrases.greeting[0];
  };

  // Calculate evolution stage
  const currentStageNum = activePet ? (activePet.level >= 8 ? 3 : activePet.level >= 4 ? 2 : 1) : 1;
  const currentStageInfo = species?.stages.find((s) => s.stage === currentStageNum);

  return (
    <div
      className={`min-h-screen w-full bg-gradient-to-b ${currentHabitat.bgGradient} text-white flex flex-col justify-between relative overflow-x-hidden selection:bg-purple-500 selection:text-white transition-colors duration-1000`}
    >
      {/* Background Animated Atmosphere Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-50">
        <div className="absolute top-16 left-10 text-sm animate-pulse">✨</div>
        <div className="absolute top-1/4 right-12 text-base animate-sparkle">⭐</div>
        <div className="absolute top-1/2 left-8 text-xs animate-float">🌟</div>
        <div className="absolute bottom-1/3 right-16 text-lg animate-pulse">✨</div>
        <div className="absolute top-2/3 left-1/4 text-sm animate-sparkle">⭐</div>
      </div>

      {/* Dim overlay when pet is sleeping */}
      {activePet?.isSleeping && (
        <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px] pointer-events-none z-10 transition-opacity duration-700" />
      )}

      {/* ================= HEADER TOP BAR ================= */}
      <header className="relative z-20 px-3 sm:px-6 py-3 bg-slate-950/70 backdrop-blur-md border-b border-slate-800/80 flex items-center justify-between gap-2 shadow-lg">
        {/* Brand & Mascot Info */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-500 to-amber-400 p-0.5 shadow-md shadow-purple-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-xl">
              🐾
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-heading font-extrabold text-sm sm:text-base text-white tracking-wide">
                Mi Mascota Virtual
              </h1>
              <span className="text-[10px] bg-purple-500/20 text-purple-300 font-bold px-2 py-0.5 rounded-full border border-purple-500/30">
                Fantasía
              </span>
            </div>
            {activePet && (
              <div className="flex items-center gap-2 text-[11px] text-slate-300">
                <span className="font-semibold text-amber-300">
                  {activePet.name}
                </span>
                <span>•</span>
                <span className="text-purple-300 font-medium">Nivel {activePet.level}</span>
                {/* XP mini bar */}
                <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden inline-block">
                  <div
                    className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
                    style={{
                      width: `${Math.min(100, (activePet.xp / activePet.xpToNextLevel) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Currency & Quick Tools */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Coins Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/90 border border-amber-500/40 rounded-2xl shadow-inner text-amber-300 font-bold text-xs sm:text-sm">
            <Coins className="w-4 h-4 text-amber-400" />
            <span>{inventory.coins}</span>
          </div>

          {/* Gems Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/90 border border-emerald-500/40 rounded-2xl shadow-inner text-emerald-300 font-bold text-xs sm:text-sm">
            <Gem className="w-4 h-4 text-emerald-400" />
            <span>{inventory.gems}</span>
          </div>

          {/* Sanctuary Pets Manager */}
          <button
            onClick={() => {
              soundManager.playClick();
              setShowSanctuary(true);
            }}
            title="Santuario de Mascotas"
            className="p-2 sm:px-3 sm:py-1.5 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-2xl text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors"
          >
            <Castle className="w-4 h-4 text-indigo-400" />
            <span className="hidden sm:inline">Santuario</span>
          </button>

          {/* Daily Quests Button */}
          <button
            onClick={() => {
              soundManager.playClick();
              setShowQuests(true);
            }}
            title="Misiones Diarias y Ruleta"
            className="relative p-2 sm:px-3 sm:py-1.5 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-2xl text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors"
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Misiones</span>
            {(hasUnclaimedQuests || canDailySpin) && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
            )}
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            title={soundEnabled ? 'Silenciar audio' : 'Activar audio'}
            className="p-2 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-2xl text-slate-300 transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-purple-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>
        </div>
      </header>

      {/* ================= MAIN INTERACTION AREA ================= */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-between px-3 sm:px-6 py-4 max-w-4xl mx-auto w-full">
        {/* Top Control Bar: MiniGames, Wardrobe, Powers, Telepathy */}
        <div className="w-full grid grid-cols-4 gap-2 mb-3">
          <button
            onClick={() => {
              soundManager.playClick();
              setShowMiniGames(true);
            }}
            className="p-2 sm:p-2.5 bg-slate-900/80 hover:bg-slate-800/90 backdrop-blur-md border border-slate-700/80 rounded-2xl flex flex-col sm:flex-row items-center justify-center gap-1.5 text-xs font-bold text-amber-300 hover:scale-[1.02] active:scale-95 transition-all shadow-md group"
          >
            <Gamepad2 className="w-4 h-4 group-hover:rotate-12 transition-transform text-amber-400" />
            <span>Minijuegos</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setShowWardrobe(true);
            }}
            className="p-2 sm:p-2.5 bg-slate-900/80 hover:bg-slate-800/90 backdrop-blur-md border border-slate-700/80 rounded-2xl flex flex-col sm:flex-row items-center justify-center gap-1.5 text-xs font-bold text-pink-300 hover:scale-[1.02] active:scale-95 transition-all shadow-md group"
          >
            <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform text-pink-400" />
            <span>Personalizar</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setShowPowers(true);
            }}
            className="p-2 sm:p-2.5 bg-slate-900/80 hover:bg-slate-800/90 backdrop-blur-md border border-slate-700/80 rounded-2xl flex flex-col sm:flex-row items-center justify-center gap-1.5 text-xs font-bold text-purple-300 hover:scale-[1.02] active:scale-95 transition-all shadow-md group"
          >
            <Zap className="w-4 h-4 group-hover:scale-110 transition-transform text-purple-400" />
            <span>Evolución</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setShowOracle(true);
            }}
            className="p-2 sm:p-2.5 bg-slate-900/80 hover:bg-slate-800/90 backdrop-blur-md border border-slate-700/80 rounded-2xl flex flex-col sm:flex-row items-center justify-center gap-1.5 text-xs font-bold text-sky-300 hover:scale-[1.02] active:scale-95 transition-all shadow-md group"
          >
            <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform text-sky-400" />
            <span>Telepatía</span>
          </button>
        </div>

        {/* Mascot Center Stage */}
        <div className="flex-1 flex flex-col items-center justify-center my-1 relative w-full">
          {/* Interactive Speech Bubble */}
          <div
            onClick={() => {
              soundManager.playClick();
              setShowOracle(true);
            }}
            className="relative mb-2 px-4 py-2 bg-slate-900/90 hover:bg-slate-800/90 backdrop-blur-md border border-purple-500/40 rounded-2xl text-xs sm:text-sm font-semibold text-purple-200 shadow-xl cursor-pointer hover:scale-105 active:scale-95 transition-all max-w-sm text-center flex items-center gap-2 group"
          >
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 group-hover:rotate-45 transition-transform" />
            <span className="line-clamp-2">{getSpeechBubblePhrase()}</span>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-900 border-r border-b border-purple-500/40 transform rotate-45" />
          </div>

          {/* Central Mascot Rendering */}
          {activePet && (
            <PetAvatar
              pet={activePet}
              moodOverride={moodOverride}
              size="lg"
              onPet={handlePetAvatarClick}
              interactive={true}
            />
          )}

          {/* Stage & Name Pill */}
          <div className="mt-2 flex items-center gap-2">
            <span className="px-3 py-1 bg-slate-950/70 backdrop-blur-md border border-slate-800 rounded-full text-xs font-bold text-white shadow-md">
              {activePet?.name}
            </span>
            <span className="px-3 py-1 bg-gradient-to-r from-purple-900/80 to-pink-900/80 border border-purple-500/40 rounded-full text-[11px] font-semibold text-purple-200">
              {currentStageInfo?.title} (Fase {currentStageNum})
            </span>
          </div>

          {/* Stats Progress Bars */}
          {activePet && (
            <div className="w-full max-w-md grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 bg-slate-950/60 backdrop-blur-md p-3 rounded-2xl border border-slate-800/80">
              {/* Hunger */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300">
                  <span className="flex items-center gap-1">
                    <Utensils className="w-3 h-3 text-orange-400" /> Hambre
                  </span>
                  <span className={activePet.stats.hunger < 35 ? 'text-red-400 font-bold' : ''}>
                    {activePet.stats.hunger}%
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-300"
                    style={{ width: `${activePet.stats.hunger}%` }}
                  />
                </div>
              </div>

              {/* Energy */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300">
                  <span className="flex items-center gap-1">
                    <Battery className="w-3 h-3 text-cyan-400" /> Energía
                  </span>
                  <span className={activePet.stats.energy < 30 ? 'text-red-400 font-bold' : ''}>
                    {activePet.stats.energy}%
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-300"
                    style={{ width: `${activePet.stats.energy}%` }}
                  />
                </div>
              </div>

              {/* Cleanliness */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300">
                  <span className="flex items-center gap-1">
                    <Droplets className="w-3 h-3 text-sky-400" /> Limpieza
                  </span>
                  <span className={activePet.stats.cleanliness < 40 ? 'text-red-400 font-bold' : ''}>
                    {activePet.stats.cleanliness}%
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-sky-400 to-teal-400 rounded-full transition-all duration-300"
                    style={{ width: `${activePet.stats.cleanliness}%` }}
                  />
                </div>
              </div>

              {/* Happiness */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3 text-rose-400" /> Afecto
                  </span>
                  <span>{activePet.stats.happiness}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full transition-all duration-300"
                    style={{ width: `${activePet.stats.happiness}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ================= BOTTOM CARE STATION ================= */}
        {activePet && (
          <div className="w-full mt-2">
            <CareStation
              pet={activePet}
              inventory={inventory}
              onUpdatePet={updateActivePet}
              onUpdateInventory={setInventory}
              onOpenShop={() => setShowWardrobe(true)}
              onActionComplete={handleCareActionComplete}
            />
          </div>
        )}
      </main>

      {/* ================= MODALS ================= */}
      {/* Mini-Games Modal */}
      {activePet && (
        <MiniGamesModal
          pet={activePet}
          isOpen={showMiniGames}
          onClose={() => setShowMiniGames(false)}
          onReward={handleMiniGameReward}
        />
      )}

      {/* Wardrobe & Customization Modal */}
      {activePet && (
        <WardrobeModal
          pet={activePet}
          inventory={inventory}
          isOpen={showWardrobe}
          onClose={() => setShowWardrobe(false)}
          onUpdatePet={updateActivePet}
          onUpdateInventory={setInventory}
        />
      )}

      {/* Powers & Evolution Modal */}
      {activePet && (
        <PowersModal
          pet={activePet}
          isOpen={showPowers}
          onClose={() => setShowPowers(false)}
          onUpdatePet={updateActivePet}
          onReward={(coins, xp) => {
            setInventory((inv) => ({ ...inv, coins: inv.coins + coins }));
            updateActivePet((p) => {
              let newXp = p.xp + xp;
              let newLevel = p.level;
              let newTarget = p.xpToNextLevel;
              if (newXp >= newTarget) {
                newLevel += 1;
                newXp -= newTarget;
                newTarget = Math.floor(newTarget * 1.35);
                soundManager.playLevelUp();
                confetti({ particleCount: 70, spread: 70 });
              }
              return { ...p, xp: newXp, level: newLevel, xpToNextLevel: newTarget };
            });
          }}
          onPowerCast={() => progressQuest('power')}
        />
      )}

      {/* Daily Quests Modal */}
      <DailyQuestsModal
        quests={quests}
        inventory={inventory}
        isOpen={showQuests}
        onClose={() => setShowQuests(false)}
        onClaimQuest={handleClaimQuest}
        onUpdateInventory={setInventory}
      />

      {/* Sanctuary Modal */}
      <SanctuaryModal
        pets={pets}
        activePetId={activePetId}
        isOpen={showSanctuary}
        onClose={() => setShowSanctuary(false)}
        onSelectPet={(id) => {
          setActivePetId(id);
          setShowSanctuary(false);
        }}
        onOpenAdoption={() => {
          setShowSanctuary(false);
          setShowAdoption(true);
        }}
      />

      {/* Adoption Modal */}
      <AdoptionModal
        isOpen={showAdoption}
        onClose={() => setShowAdoption(false)}
        onAdoptPet={handleAdoptNewPet}
        isInitialAdoption={pets.length === 0}
      />

      {/* Pet Telepathy / Oracle Modal */}
      {activePet && (
        <PetOracleModal
          pet={activePet}
          isOpen={showOracle}
          onClose={() => setShowOracle(false)}
        />
      )}
    </div>
  );
}

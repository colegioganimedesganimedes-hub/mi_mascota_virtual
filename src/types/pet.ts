export type SpeciesId = 'dragon' | 'unicorn' | 'kitsune' | 'axolotl';

export type EvolutionStage = 1 | 2 | 3; // 1: Bebé, 2: Joven Celestial, 3: Guardián Legendario

export type PetMood = 'happy' | 'ecstatic' | 'hungry' | 'sleepy' | 'dirty' | 'playful';

export interface PetStats {
  hunger: number; // 0 (starving) to 100 (full)
  energy: number; // 0 (exhausted) to 100 (full energy)
  cleanliness: number; // 0 (dirty) to 100 (sparkling clean)
  happiness: number; // 0 to 100
  magicPower: number; // 0 to 100 (charges when cared for and playing)
}

export interface MagicPower {
  id: string;
  name: string;
  description: string;
  minLevel: number;
  cooldownSeconds: number;
  icon: string;
  color: string;
  effectType: 'coin_boost' | 'xp_boost' | 'stat_restore' | 'meteor_shower' | 'aura_shield';
}

export interface AccessoryItem {
  id: string;
  name: string;
  category: 'hat' | 'glasses' | 'outfit' | 'wings' | 'aura';
  price: number;
  icon: string;
  colorScheme: string;
  description: string;
  unlockedLevel?: number;
}

export interface FoodItem {
  id: string;
  name: string;
  nutrition: number;
  magicBoost: number;
  price: number;
  icon: string;
  color: string;
  description: string;
}

export interface HabitatTheme {
  id: string;
  name: string;
  price: number;
  bgGradient: string;
  ambientParticles: 'stars' | 'sparkles' | 'fireflies' | 'bubbles';
  previewColor: string;
  description: string;
}

export interface PetState {
  id: string;
  speciesId: SpeciesId;
  name: string;
  birthday: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  stats: PetStats;
  isSleeping: boolean;
  equipped: {
    hat?: string;
    glasses?: string;
    outfit?: string;
    wings?: string;
    aura?: string;
  };
  colorTheme: string;
  habitat: string;
  lastFed: number;
  lastCleaned: number;
  lastSlept: number;
  lastInteracted: number;
}

export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  rewardCoins: number;
  rewardXp: number;
  targetCount: number;
  currentCount: number;
  completed: boolean;
  claimed: boolean;
}

export interface PlayerInventory {
  coins: number;
  gems: number;
  ownedAccessories: string[];
  ownedHabitats: string[];
  foods: Record<string, number>; // foodId -> count
  lastDailySpinDate?: string;
}

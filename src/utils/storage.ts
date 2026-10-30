import { PetState, PlayerInventory, DailyQuest, SpeciesId } from '../types/pet';
import { DEFAULT_DAILY_QUESTS } from '../data/shopItems';

const STORAGE_KEY_PETS = 'mi_mascota_virtual_pets_v1';
const STORAGE_KEY_ACTIVE_ID = 'mi_mascota_virtual_active_id_v1';
const STORAGE_KEY_INVENTORY = 'mi_mascota_virtual_inventory_v1';
const STORAGE_KEY_QUESTS = 'mi_mascota_virtual_quests_v1';
const STORAGE_KEY_QUESTS_DATE = 'mi_mascota_virtual_quests_date_v1';

export function createNewPet(speciesId: SpeciesId, name: string): PetState {
  return {
    id: 'pet_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    speciesId,
    name: name.trim() || (speciesId === 'dragon' ? 'Ignis' : speciesId === 'unicorn' ? 'Astra' : speciesId === 'kitsune' ? 'Kitsun' : 'Lumina'),
    birthday: new Date().toISOString(),
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    stats: {
      hunger: 80,
      energy: 90,
      cleanliness: 85,
      happiness: 85,
      magicPower: 50,
    },
    isSleeping: false,
    equipped: {},
    colorTheme: 'default',
    habitat: 'dormitorio_cosmico',
    lastFed: Date.now(),
    lastCleaned: Date.now(),
    lastSlept: Date.now(),
    lastInteracted: Date.now(),
  };
}

export const DEFAULT_INVENTORY: PlayerInventory = {
  coins: 150, // Starting budget for teens to buy food & custom items
  gems: 10,
  ownedAccessories: ['hat_cap'],
  ownedHabitats: ['dormitorio_cosmico'],
  foods: {
    fruta_estelar: 3,
    galleta_nube: 2,
    pocion_mana: 1,
  },
};

export function loadAllPets(): PetState[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PETS);
    if (!raw) return [];
    const pets: PetState[] = JSON.parse(raw);
    
    // Calculate stat decay based on elapsed time (mild decay: max 30% drop per 6 hours)
    const now = Date.now();
    return pets.map((pet) => {
      const elapsedMinutes = Math.min((now - pet.lastInteracted) / 60000, 360); // capped at 6h
      if (elapsedMinutes > 5) {
        const decayHunger = Math.floor(elapsedMinutes * 0.08);
        const decayCleanliness = Math.floor(elapsedMinutes * 0.06);
        const decayEnergy = pet.isSleeping ? 0 : Math.floor(elapsedMinutes * 0.07);
        const energyRecovery = pet.isSleeping ? Math.min(100, pet.stats.energy + Math.floor(elapsedMinutes * 0.3)) : pet.stats.energy;

        return {
          ...pet,
          stats: {
            hunger: Math.max(10, pet.stats.hunger - decayHunger),
            cleanliness: Math.max(10, pet.stats.cleanliness - decayCleanliness),
            energy: pet.isSleeping ? energyRecovery : Math.max(10, pet.stats.energy - decayEnergy),
            happiness: Math.max(15, pet.stats.happiness - Math.floor(decayHunger * 0.5)),
            magicPower: pet.stats.magicPower,
          },
          lastInteracted: now,
        };
      }
      return pet;
    });
  } catch {
    return [];
  }
}

export function saveAllPets(pets: PetState[]) {
  try {
    localStorage.setItem(STORAGE_KEY_PETS, JSON.stringify(pets));
  } catch (err) {
    console.error('Failed to save pets', err);
  }
}

export function loadActivePetId(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY_ACTIVE_ID);
  } catch {
    return null;
  }
}

export function saveActivePetId(id: string) {
  try {
    localStorage.setItem(STORAGE_KEY_ACTIVE_ID, id);
  } catch {}
}

export function loadInventory(): PlayerInventory {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_INVENTORY);
    if (!raw) return DEFAULT_INVENTORY;
    return { ...DEFAULT_INVENTORY, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_INVENTORY;
  }
}

export function saveInventory(inv: PlayerInventory) {
  try {
    localStorage.setItem(STORAGE_KEY_INVENTORY, JSON.stringify(inv));
  } catch {}
}

export function loadDailyQuests(): DailyQuest[] {
  try {
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem(STORAGE_KEY_QUESTS_DATE);
    const rawQuests = localStorage.getItem(STORAGE_KEY_QUESTS);

    if (savedDate !== today || !rawQuests) {
      // New day, reset quests
      localStorage.setItem(STORAGE_KEY_QUESTS_DATE, today);
      localStorage.setItem(STORAGE_KEY_QUESTS, JSON.stringify(DEFAULT_DAILY_QUESTS));
      return DEFAULT_DAILY_QUESTS;
    }
    return JSON.parse(rawQuests);
  } catch {
    return DEFAULT_DAILY_QUESTS;
  }
}

export function saveDailyQuests(quests: DailyQuest[]) {
  try {
    localStorage.setItem(STORAGE_KEY_QUESTS, JSON.stringify(quests));
  } catch {}
}

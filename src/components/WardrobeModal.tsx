import React, { useState } from 'react';
import { PetState, PlayerInventory, AccessoryItem, HabitatTheme, FoodItem } from '../types/pet';
import { ACCESSORY_ITEMS, HABITAT_THEMES, FOOD_ITEMS } from '../data/shopItems';
import { soundManager } from '../utils/audio';
import { X, Sparkles, Shirt, Home, Utensils, Coins, Check, ShoppingBag } from 'lucide-react';
import confetti from 'canvas-confetti';

interface WardrobeModalProps {
  pet: PetState;
  inventory: PlayerInventory;
  isOpen: boolean;
  onClose: () => void;
  onUpdatePet: (updater: (prev: PetState) => PetState) => void;
  onUpdateInventory: (updater: (prev: PlayerInventory) => PlayerInventory) => void;
  initialTab?: 'accessories' | 'habitats' | 'food';
}

export const WardrobeModal: React.FC<WardrobeModalProps> = ({
  pet,
  inventory,
  isOpen,
  onClose,
  onUpdatePet,
  onUpdateInventory,
  initialTab = 'accessories',
}) => {
  const [activeTab, setActiveTab] = useState<'accessories' | 'habitats' | 'food'>(initialTab);
  const [filterCategory, setFilterCategory] = useState<'all' | 'hat' | 'glasses' | 'outfit' | 'aura'>('all');

  if (!isOpen) return null;

  // Buy or Equip Accessory
  const handleAccessoryClick = (item: AccessoryItem) => {
    const isOwned = inventory.ownedAccessories.includes(item.id);

    if (isOwned) {
      soundManager.playClick();
      // Equip or Unequip
      onUpdatePet((p) => {
        const currentEquipped = p.equipped[item.category];
        const newEquipped = { ...p.equipped };
        if (currentEquipped === item.id) {
          delete newEquipped[item.category];
        } else {
          newEquipped[item.category] = item.id;
        }
        return { ...p, equipped: newEquipped };
      });
    } else {
      // Buy
      if (inventory.coins < item.price) {
        soundManager.playLose();
        return;
      }
      soundManager.playCoin();
      confetti({ particleCount: 30, spread: 40 });

      onUpdateInventory((inv) => ({
        ...inv,
        coins: inv.coins - item.price,
        ownedAccessories: [...inv.ownedAccessories, item.id],
      }));

      // Equip right away
      onUpdatePet((p) => ({
        ...p,
        equipped: {
          ...p.equipped,
          [item.category]: item.id,
        },
      }));
    }
  };

  // Buy or Equip Habitat
  const handleHabitatClick = (hab: HabitatTheme) => {
    const isOwned = inventory.ownedHabitats.includes(hab.id);

    if (isOwned) {
      soundManager.playClick();
      onUpdatePet((p) => ({
        ...p,
        habitat: hab.id,
      }));
    } else {
      if (inventory.coins < hab.price) {
        soundManager.playLose();
        return;
      }
      soundManager.playCoin();
      confetti({ particleCount: 40, spread: 50 });

      onUpdateInventory((inv) => ({
        ...inv,
        coins: inv.coins - hab.price,
        ownedHabitats: [...inv.ownedHabitats, hab.id],
      }));

      onUpdatePet((p) => ({
        ...p,
        habitat: hab.id,
      }));
    }
  };

  // Buy Food
  const handleBuyFood = (food: FoodItem) => {
    if (inventory.coins < food.price) {
      soundManager.playLose();
      return;
    }
    soundManager.playCoin();

    onUpdateInventory((inv) => ({
      ...inv,
      coins: inv.coins - food.price,
      foods: {
        ...inv.foods,
        [food.id]: (inv.foods[food.id] || 0) + 1,
      },
    }));
  };

  const filteredAccessories =
    filterCategory === 'all'
      ? ACCESSORY_ITEMS
      : ACCESSORY_ITEMS.filter((i) => i.category === filterCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-white">Boutique & Hábitats Mágicos</h3>
              <p className="text-xs text-slate-400">Personaliza el look de {pet.name} y decora su espacio</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-300 font-bold text-xs">
              <Coins className="w-3.5 h-3.5" /> {inventory.coins}
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
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-3 gap-2 px-5 pt-3 pb-1 border-b border-slate-800/60 bg-slate-950/30">
          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('accessories');
            }}
            className={`py-2 text-xs sm:text-sm font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'accessories'
                ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Shirt className="w-4 h-4" /> Accesorios & Ropa
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('habitats');
            }}
            className={`py-2 text-xs sm:text-sm font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'habitats'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Home className="w-4 h-4" /> Hábitats
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('food');
            }}
            className={`py-2 text-xs sm:text-sm font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'food'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Utensils className="w-4 h-4" /> Tienda de Comida
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {/* TAB 1: ACCESSORIES */}
          {activeTab === 'accessories' && (
            <div>
              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-2 no-scrollbar">
                {(['all', 'hat', 'glasses', 'outfit', 'aura'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                      filterCategory === cat
                        ? 'bg-slate-700 text-white border border-slate-600'
                        : 'bg-slate-800/50 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {cat === 'all'
                      ? 'Todos'
                      : cat === 'hat'
                      ? 'Gorros & Coronas'
                      : cat === 'glasses'
                      ? 'Gafas & Visores'
                      : cat === 'outfit'
                      ? 'Ropa'
                      : 'Auras Mágicas'}
                  </button>
                ))}
              </div>

              {/* Items Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {filteredAccessories.map((item) => {
                  const isOwned = inventory.ownedAccessories.includes(item.id);
                  const isEquipped = pet.equipped[item.category] === item.id;
                  const canAfford = inventory.coins >= item.price;

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleAccessoryClick(item)}
                      className={`relative p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isEquipped
                          ? 'bg-gradient-to-b from-purple-950/60 to-slate-900 border-purple-500 shadow-md shadow-purple-500/20 ring-1 ring-purple-400'
                          : isOwned
                          ? 'bg-slate-800/80 border-slate-700 hover:border-slate-500'
                          : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="text-3xl filter drop-shadow">{item.icon}</span>
                        {isEquipped ? (
                          <span className="text-[10px] bg-purple-600 text-white font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                            <Check className="w-3 h-3" /> Puesto
                          </span>
                        ) : isOwned ? (
                          <span className="text-[10px] bg-slate-700 text-slate-300 font-semibold px-2 py-0.5 rounded-full">
                            Obtenido
                          </span>
                        ) : (
                          <span
                            className={`text-xs font-bold flex items-center gap-1 ${
                              canAfford ? 'text-amber-400' : 'text-slate-500'
                            }`}
                          >
                            <Coins className="w-3.5 h-3.5" /> {item.price}
                          </span>
                        )}
                      </div>

                      <div className="mt-2">
                        <h4 className="font-bold text-white text-xs line-clamp-1">{item.name}</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">
                          {item.description}
                        </p>
                      </div>

                      <button
                        className={`mt-2.5 w-full py-1.5 rounded-xl text-xs font-bold transition-all ${
                          isEquipped
                            ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                            : isOwned
                            ? 'bg-purple-600 hover:bg-purple-500 text-white'
                            : canAfford
                            ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        {isEquipped ? 'Quitar' : isOwned ? 'Equipar' : 'Comprar'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: HABITATS */}
          {activeTab === 'habitats' && (
            <div className="space-y-3">
              {HABITAT_THEMES.map((hab) => {
                const isOwned = inventory.ownedHabitats.includes(hab.id);
                const isActive = pet.habitat === hab.id;
                const canAfford = inventory.coins >= hab.price;

                return (
                  <div
                    key={hab.id}
                    onClick={() => handleHabitatClick(hab)}
                    className={`relative p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-950/70 to-slate-900 border-indigo-500 shadow-md shadow-indigo-500/20 ring-1 ring-indigo-400'
                        : isOwned
                        ? 'bg-slate-800/80 border-slate-700 hover:border-slate-500'
                        : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-inner border border-white/10"
                        style={{ background: hab.previewColor }}
                      >
                        🌌
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white text-sm">{hab.name}</h4>
                          {isActive && (
                            <span className="text-[10px] bg-indigo-500 text-white font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                              <Check className="w-3 h-3" /> Activo
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{hab.description}</p>
                      </div>
                    </div>

                    <div>
                      {isOwned ? (
                        <button
                          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            isActive
                              ? 'bg-slate-800 text-slate-400'
                              : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                          }`}
                        >
                          {isActive ? 'En uso' : 'Usar'}
                        </button>
                      ) : (
                        <button
                          className={`px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                            canAfford
                              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          }`}
                        >
                          <Coins className="w-3.5 h-3.5" /> {hab.price}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 3: FOOD STORE */}
          {activeTab === 'food' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {FOOD_ITEMS.map((food) => {
                const count = inventory.foods[food.id] || 0;
                const canAfford = inventory.coins >= food.price;

                return (
                  <div
                    key={food.id}
                    className="p-3.5 rounded-2xl bg-slate-950/50 border border-slate-800 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl">
                        {food.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-white text-xs">{food.name}</h4>
                          <span className="text-[10px] text-purple-400 font-semibold">x{count}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{food.description}</p>
                        <div className="flex items-center gap-2 mt-1 text-[10px] font-semibold">
                          <span className="text-emerald-400">+{food.nutrition}% Nutrición</span>
                          <span className="text-purple-400">+{food.magicBoost}% Magia</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleBuyFood(food)}
                      disabled={!canAfford}
                      className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                        canAfford
                          ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <Coins className="w-3.5 h-3.5" /> {food.price}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { SpeciesId, PetState } from '../types/pet';
import { SPECIES_DATA, SpeciesInfo } from '../data/speciesData';
import { PetAvatar } from './PetAvatar';
import { createNewPet } from '../utils/storage';
import { soundManager } from '../utils/audio';
import { Sparkles, Heart, Wand2, X, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AdoptionModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onAdoptPet: (newPet: PetState) => void;
  isInitialAdoption?: boolean;
}

export const AdoptionModal: React.FC<AdoptionModalProps> = ({
  isOpen,
  onClose,
  onAdoptPet,
  isInitialAdoption = false,
}) => {
  const [selectedSpecies, setSelectedSpecies] = useState<SpeciesId>('dragon');
  const [customName, setCustomName] = useState<string>('Ignis');

  if (!isOpen) return null;

  const speciesList: SpeciesInfo[] = Object.values(SPECIES_DATA);
  const currentInfo = SPECIES_DATA[selectedSpecies];

  // Temporary mock pet state for preview
  const previewPet: PetState = {
    id: 'preview',
    speciesId: selectedSpecies,
    name: customName || currentInfo.name,
    birthday: new Date().toISOString(),
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    stats: {
      hunger: 90,
      energy: 90,
      cleanliness: 90,
      happiness: 95,
      magicPower: 60,
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

  const handleSelectSpecies = (id: SpeciesId) => {
    soundManager.playClick();
    setSelectedSpecies(id);
    setCustomName(SPECIES_DATA[id].name);
  };

  const handleConfirmAdoption = () => {
    const finalName = customName.trim() || currentInfo.name;
    const newPet = createNewPet(selectedSpecies, finalName);

    soundManager.playLevelUp();
    confetti({
      particleCount: 100,
      spread: 90,
      origin: { y: 0.6 },
    });

    onAdoptPet(newPet);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-xl text-white">
                {isInitialAdoption ? '¡Bienvenido al Santuario Mágico!' : 'Adoptar Nueva Criatura Fantástica'}
              </h3>
              <p className="text-xs text-slate-400">
                Elige a tu compañero mágico y dale un nombre especial
              </p>
            </div>
          </div>

          {!isInitialAdoption && onClose && (
            <button
              onClick={() => {
                soundManager.playClick();
                onClose();
              }}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Species Selector Cards */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
              1. Selecciona la especie mística:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {speciesList.map((sp) => {
                const isSelected = selectedSpecies === sp.id;
                return (
                  <button
                    key={sp.id}
                    onClick={() => handleSelectSpecies(sp.id)}
                    className={`relative p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-purple-950/60 border-purple-400 ring-2 ring-purple-500/40 shadow-lg shadow-purple-500/20 scale-[1.02]'
                        : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="text-3xl mb-1.5">
                      {sp.id === 'dragon' ? '🐲' : sp.id === 'unicorn' ? '🦄' : sp.id === 'kitsune' ? '🦊' : '🦎'}
                    </div>
                    <div className="font-bold text-white text-sm">{sp.name}</div>
                    <div className="text-[11px] text-purple-300 font-medium">{sp.elementLabel}</div>

                    {isSelected && (
                      <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center text-white">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Creature Preview & Lore */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-6">
            <div className="shrink-0 flex flex-col items-center">
              <PetAvatar pet={previewPet} size="md" interactive={false} />
              <span className="text-xs font-semibold text-purple-300 bg-purple-950/60 px-3 py-1 rounded-full border border-purple-500/30 mt-1">
                Fase 1: Bebé Mágico
              </span>
            </div>

            <div className="space-y-2.5 text-center sm:text-left flex-1">
              <div>
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                  {currentInfo.tagline}
                </span>
                <h4 className="font-heading font-bold text-xl text-white">{currentInfo.name}</h4>
                <p className="text-xs italic text-slate-400">{currentInfo.scientificName}</p>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{currentInfo.description}</p>

              <div className="flex flex-wrap gap-2 pt-1 justify-center sm:justify-start text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700">
                  ✨ Personalidad: <strong className="text-white">{currentInfo.personality}</strong>
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700">
                  🔥 Elemento: <strong className="text-purple-300">{currentInfo.elementLabel}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Name Customization Input */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
              2. Bautiza a tu mascota con un nombre único:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                maxLength={18}
                placeholder="Escribe su nombre aquí..."
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white font-semibold text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
              <button
                type="button"
                onClick={() => {
                  const names = ['Nebulita', 'Zafiro', 'Drago', 'Nova', 'Solaria', 'Kira', 'Puff', 'Chispa', 'Pixel'];
                  const random = names[Math.floor(Math.random() * names.length)];
                  setCustomName(random);
                }}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-purple-300 text-xs font-bold rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" /> Aleatorio
              </button>
            </div>
          </div>
        </div>

        {/* Footer Confirm */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-end gap-3">
          {!isInitialAdoption && onClose && (
            <button
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancelar
            </button>
          )}
          <button
            onClick={handleConfirmAdoption}
            className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Heart className="w-4 h-4 fill-white" />
            <span>¡Adoptar a {customName || currentInfo.name}!</span>
          </button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { PetState } from '../types/pet';
import { SPECIES_DATA } from '../data/speciesData';
import { soundManager } from '../utils/audio';
import { X, Plus, Sparkles, Check, Heart } from 'lucide-react';

interface SanctuaryModalProps {
  pets: PetState[];
  activePetId: string;
  isOpen: boolean;
  onClose: () => void;
  onSelectPet: (id: string) => void;
  onOpenAdoption: () => void;
}

export const SanctuaryModal: React.FC<SanctuaryModalProps> = ({
  pets,
  activePetId,
  isOpen,
  onClose,
  onSelectPet,
  onOpenAdoption,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-white">Santuario de Criaturas</h3>
              <p className="text-xs text-slate-400">Tus mascotas fantásticas adoptadas ({pets.length})</p>
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
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {pets.map((pet) => {
              const species = SPECIES_DATA[pet.speciesId];
              const isActive = pet.id === activePetId;

              return (
                <div
                  key={pet.id}
                  onClick={() => {
                    soundManager.playClick();
                    onSelectPet(pet.id);
                  }}
                  className={`relative p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-950/60 to-indigo-950/60 border-purple-500 ring-1 ring-purple-400 shadow-md'
                      : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl">
                      {pet.speciesId === 'dragon' ? '🐲' : pet.speciesId === 'unicorn' ? '🦄' : pet.speciesId === 'kitsune' ? '🦊' : '🦎'}
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-white text-sm">{pet.name}</h4>
                        {isActive && (
                          <span className="text-[10px] bg-purple-600 text-white font-bold px-1.5 py-0.2 rounded-full">
                            Activo
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-purple-300 font-medium">{species.name} • {species.elementLabel}</p>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                        <span>Nivel {pet.level}</span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5 text-rose-400">
                          <Heart className="w-3 h-3 fill-rose-400" /> {pet.stats.happiness}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {isActive ? (
                    <div className="w-7 h-7 rounded-full bg-purple-500 flex items-center justify-center text-white">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  ) : (
                    <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl">
                      Elegir
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Adopt More Button */}
          <div className="pt-2">
            <button
              onClick={() => {
                soundManager.playClick();
                onOpenAdoption();
              }}
              className="w-full py-3.5 bg-slate-950/70 hover:bg-slate-800/80 border border-dashed border-purple-500/40 hover:border-purple-400 rounded-2xl flex items-center justify-center gap-2 text-purple-300 font-bold text-xs sm:text-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Adoptar otra criatura mágica para tu santuario</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { PetState, EvolutionStage } from '../types/pet';
import { SPECIES_DATA } from '../data/speciesData';

interface PetAvatarProps {
  pet: PetState;
  moodOverride?: 'eating' | 'bathing' | 'happy' | 'sleeping' | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onPet?: () => void;
  interactive?: boolean;
}

export const PetAvatar: React.FC<PetAvatarProps> = ({
  pet,
  moodOverride,
  size = 'lg',
  onPet,
  interactive = true,
}) => {
  const species = SPECIES_DATA[pet.speciesId];
  
  // Determine evolution stage (Stage 1: Lv 1-3, Stage 2: Lv 4-7, Stage 3: Lv 8+)
  const stage: EvolutionStage = pet.level >= 8 ? 3 : pet.level >= 4 ? 2 : 1;

  // Determine emotional status
  const isHungry = pet.stats.hunger < 35;
  const isDirty = pet.stats.cleanliness < 40;
  const isSleepy = pet.stats.energy < 30 || pet.isSleeping;
  const isOverjoyed = pet.stats.happiness >= 80;

  const currentMood = moodOverride || (pet.isSleeping ? 'sleeping' : isDirty ? 'dirty' : isHungry ? 'hungry' : isSleepy ? 'sleepy' : isOverjoyed ? 'happy' : 'normal');

  // Dimension scaling
  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-40 h-40',
    lg: 'w-64 h-64 sm:w-72 sm:h-72',
    xl: 'w-80 h-80 sm:w-96 sm:h-96',
  }[size];

  // Colors
  const baseColor = species.baseColor;
  const secColor = species.secondaryColor;
  const accentColor = species.accentColor;

  return (
    <div
      onClick={interactive && onPet ? onPet : undefined}
      className={`relative flex items-center justify-center select-none ${sizeClasses} ${
        interactive ? 'cursor-pointer hover:scale-105 active:scale-95 transition-transform duration-200' : ''
      }`}
    >
      {/* Dynamic Background Magical Aura Glow */}
      <div
        className="absolute inset-4 rounded-full blur-2xl opacity-40 transition-all duration-700 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${baseColor} 0%, ${secColor} 60%, transparent 80%)`,
          transform: stage === 3 ? 'scale(1.3)' : stage === 2 ? 'scale(1.15)' : 'scale(1)',
        }}
      />

      {/* Equipped Aura Overlay */}
      {pet.equipped.aura === 'aura_sparkles' && (
        <div className="absolute inset-0 pointer-events-none animate-spin" style={{ animationDuration: '14s' }}>
          <span className="absolute top-2 left-6 text-xl">✨</span>
          <span className="absolute bottom-4 right-8 text-lg">⭐</span>
          <span className="absolute top-1/2 left-0 text-xl">🌟</span>
          <span className="absolute top-4 right-6 text-sm">✨</span>
        </div>
      )}
      {pet.equipped.aura === 'aura_fire' && (
        <div className="absolute inset-0 pointer-events-none animate-pulse-magic">
          <div className="w-full h-full rounded-full border-2 border-orange-400/40 blur-[2px]" />
        </div>
      )}
      {pet.equipped.aura === 'aura_bubble' && (
        <div className="absolute inset-0 pointer-events-none">
          <span className="absolute top-10 left-4 text-lg animate-bounce">🫧</span>
          <span className="absolute bottom-10 right-6 text-xl animate-bounce" style={{ animationDelay: '0.4s' }}>🫧</span>
        </div>
      )}

      {/* SVG Pet Rendering */}
      <svg
        viewBox="0 0 240 240"
        className={`w-full h-full relative z-10 drop-shadow-2xl ${
          pet.isSleeping ? 'opacity-85' : 'animate-float'
        }`}
      >
        <defs>
          <linearGradient id={`grad-${pet.speciesId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={baseColor} />
            <stop offset="100%" stopColor={secColor} />
          </linearGradient>
          <radialGradient id={`glow-${pet.speciesId}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={accentColor} stopOpacity="0.8" />
            <stop offset="100%" stopColor={baseColor} stopOpacity="0" />
          </radialGradient>
          <filter id="soft-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* ================= STAGE 3 LEGENDARY AURA WINGS / HALO ================= */}
        {stage >= 2 && (
          <g className="opacity-80">
            <circle cx="120" cy="120" r="105" fill="none" stroke={accentColor} strokeWidth={stage === 3 ? "2" : "1"} strokeDasharray="6 6" className="animate-spin" style={{ animationDuration: '30s', transformOrigin: '120px 120px' }} />
          </g>
        )}

        {/* ================= SPECIES SPECIFIC BODY & PARTS ================= */}
        {pet.speciesId === 'dragon' && (
          <g id="dragon-body">
            {/* Dragon Wings */}
            <g id="wings" className={pet.isSleeping ? '' : 'transition-transform duration-500'}>
              <path
                d={stage === 1 
                  ? "M 75 110 Q 30 70 50 125 Q 70 120 75 110 Z"
                  : stage === 2 
                  ? "M 70 105 Q 15 50 35 125 Q 58 115 70 105 Z"
                  : "M 65 100 Q -5 30 25 130 Q 55 120 65 100 Z"
                }
                fill={secColor}
                stroke={accentColor}
                strokeWidth="2"
              />
              <path
                d={stage === 1 
                  ? "M 165 110 Q 210 70 190 125 Q 170 120 165 110 Z"
                  : stage === 2 
                  ? "M 170 105 Q 225 50 205 125 Q 182 115 170 105 Z"
                  : "M 175 100 Q 245 30 215 130 Q 185 120 175 100 Z"
                }
                fill={secColor}
                stroke={accentColor}
                strokeWidth="2"
              />
            </g>

            {/* Dragon Tail with flame */}
            <path
              d="M 155 165 Q 200 170 205 140 Q 185 155 150 170 Z"
              fill={baseColor}
            />
            {/* Tail Flame */}
            <circle cx="205" cy="138" r={stage === 3 ? "12" : "8"} fill={accentColor} className="animate-pulse" />
            <circle cx="203" cy="136" r={stage === 3 ? "6" : "4"} fill="#fff" />

            {/* Body */}
            <ellipse cx="120" cy="145" rx="55" ry="50" fill={`url(#grad-${pet.speciesId})`} />
            {/* Belly scales */}
            <ellipse cx="120" cy="155" rx="36" ry="34" fill="#fef08a" opacity="0.9" />
            <path d="M 100 145 Q 120 150 140 145" stroke="#eab308" strokeWidth="2" fill="none" />
            <path d="M 96 160 Q 120 165 144 160" stroke="#eab308" strokeWidth="2" fill="none" />

            {/* Feet */}
            <ellipse cx="90" cy="190" rx="16" ry="10" fill={secColor} />
            <ellipse cx="150" cy="190" rx="16" ry="10" fill={secColor} />

            {/* Head */}
            <circle cx="120" cy="95" r={stage === 1 ? "46" : "44"} fill={`url(#grad-${pet.speciesId})`} />

            {/* Dragon Horns */}
            <path d="M 95 65 Q 75 35 60 45 Q 80 62 90 70 Z" fill={accentColor} stroke="#ca8a04" strokeWidth="1.5" />
            <path d="M 145 65 Q 165 35 180 45 Q 160 62 150 70 Z" fill={accentColor} stroke="#ca8a04" strokeWidth="1.5" />
            {stage === 3 && (
              <>
                <path d="M 105 55 Q 95 20 85 28 Q 98 48 103 58 Z" fill="#f59e0b" />
                <path d="M 135 55 Q 145 20 155 28 Q 142 48 137 58 Z" fill="#f59e0b" />
              </>
            )}
          </g>
        )}

        {pet.speciesId === 'unicorn' && (
          <g id="unicorn-body">
            {/* Mane Background */}
            <path
              d="M 85 60 C 60 70 50 130 75 160 C 85 140 85 90 95 70 Z"
              fill={secColor}
              opacity="0.9"
            />
            <path
              d="M 155 60 C 180 70 190 130 165 160 C 155 140 155 90 145 70 Z"
              fill={secColor}
              opacity="0.9"
            />

            {/* Body */}
            <ellipse cx="120" cy="148" rx="52" ry="46" fill="#fdf4ff" stroke="#e9d5ff" strokeWidth="2" />

            {/* Hooves */}
            <ellipse cx="92" cy="190" rx="14" ry="10" fill={accentColor} />
            <ellipse cx="148" cy="190" rx="14" ry="10" fill={accentColor} />

            {/* Pegasus Wings if Stage 2+ */}
            {stage >= 2 && (
              <g className="animate-pulse">
                <path d="M 75 125 C 20 100 35 60 65 110 Z" fill="#e0e7ff" stroke="#818cf8" strokeWidth="2" />
                <path d="M 165 125 C 220 100 205 60 175 110 Z" fill="#e0e7ff" stroke="#818cf8" strokeWidth="2" />
              </g>
            )}

            {/* Head */}
            <ellipse cx="120" cy="98" rx="42" ry="40" fill="#fdf4ff" stroke="#e9d5ff" strokeWidth="2" />

            {/* Ears */}
            <path d="M 88 72 L 78 45 L 100 62 Z" fill="#fdf4ff" stroke="#d8b4fe" strokeWidth="1.5" />
            <path d="M 152 72 L 162 45 L 140 62 Z" fill="#fdf4ff" stroke="#d8b4fe" strokeWidth="1.5" />
            <path d="M 88 66 L 82 50 L 96 60 Z" fill="#f472b6" />
            <path d="M 152 66 L 158 50 L 144 60 Z" fill="#f472b6" />

            {/* Forelock Mane */}
            <path d="M 105 65 Q 120 48 135 65 Q 120 75 105 65 Z" fill={secColor} />

            {/* Horn with sparkles */}
            <polygon
              points={stage === 3 ? "120,15 112,65 128,65" : "120,28 113,65 127,65"}
              fill="url(#gold-horn)"
              stroke="#f59e0b"
              strokeWidth="1.5"
            />
            <defs>
              <linearGradient id="gold-horn" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#fbbf24" />
              </linearGradient>
            </defs>
            <circle cx="120" cy={stage === 3 ? "18" : "30"} r="3" fill="#fff" className="animate-ping" />
          </g>
        )}

        {pet.speciesId === 'kitsune' && (
          <g id="kitsune-body">
            {/* Tails (1 in stg 1, 3 in stg 2, 5 in stg 3) */}
            <g id="tails" className="opacity-95">
              <path d="M 140 160 Q 210 185 200 120 Q 180 115 155 150 Z" fill={baseColor} />
              <circle cx="196" cy="122" r="7" fill={accentColor} className="animate-pulse" />
              {stage >= 2 && (
                <>
                  <path d="M 130 165 Q 195 210 215 160 Q 185 150 145 160 Z" fill={secColor} />
                  <path d="M 100 165 Q 45 210 25 160 Q 55 150 95 160 Z" fill={secColor} />
                  <circle cx="212" cy="162" r="6" fill={accentColor} />
                  <circle cx="28" cy="162" r="6" fill={accentColor} />
                </>
              )}
              {stage === 3 && (
                <>
                  <path d="M 100 160 Q 30 185 40 120 Q 60 115 85 150 Z" fill={baseColor} />
                  <circle cx="44" cy="122" r="7" fill={accentColor} />
                </>
              )}
            </g>

            {/* Body */}
            <ellipse cx="120" cy="146" rx="50" ry="44" fill={baseColor} />
            {/* Fluffy white chest */}
            <path d="M 100 135 Q 120 180 140 135 Q 120 125 100 135 Z" fill="#ecfeff" />

            {/* Paws */}
            <ellipse cx="94" cy="188" rx="14" ry="10" fill={secColor} />
            <ellipse cx="146" cy="188" rx="14" ry="10" fill={secColor} />

            {/* Head */}
            <circle cx="120" cy="96" r="42" fill={baseColor} />
            {/* White face cheeks */}
            <path d="M 85 105 Q 120 130 155 105 Q 145 125 120 128 Q 95 125 85 105 Z" fill="#ecfeff" />

            {/* Fox Ears */}
            <polygon points="80,75 60,30 102,55" fill={baseColor} stroke={secColor} strokeWidth="2" />
            <polygon points="82,70 68,40 98,58" fill="#1e293b" />
            <polygon points="160,75 180,30 138,55" fill={baseColor} stroke={secColor} strokeWidth="2" />
            <polygon points="158,70 172,40 142,58" fill="#1e293b" />

            {/* Forehead mystical glyph */}
            <circle cx="120" cy="74" r="4" fill={accentColor} />
            <path d="M 115 74 L 125 74 M 120 68 L 120 80" stroke="#fff" strokeWidth="1.5" />
          </g>
        )}

        {pet.speciesId === 'axolotl' && (
          <g id="axolotl-body">
            {/* Bioluminescent Coral Gills */}
            <g id="gills" className="animate-pulse">
              {/* Left gills */}
              <path d="M 80 85 C 45 75 35 60 50 68 C 65 75 75 80 80 85" stroke="#f472b6" strokeWidth="6" strokeLinecap="round" fill="none" />
              <path d="M 75 95 C 40 95 30 90 45 95 C 60 98 70 96 75 95" stroke="#ec4899" strokeWidth="6" strokeLinecap="round" fill="none" />
              <path d="M 80 108 C 45 120 35 125 50 118 C 65 110 75 106 80 108" stroke="#db2777" strokeWidth="6" strokeLinecap="round" fill="none" />
              {/* Right gills */}
              <path d="M 160 85 C 195 75 205 60 190 68 C 175 75 165 80 160 85" stroke="#f472b6" strokeWidth="6" strokeLinecap="round" fill="none" />
              <path d="M 165 95 C 200 95 210 90 195 95 C 180 98 170 96 165 95" stroke="#ec4899" strokeWidth="6" strokeLinecap="round" fill="none" />
              <path d="M 160 108 C 195 120 205 125 190 118 C 175 110 165 106 160 108" stroke="#db2777" strokeWidth="6" strokeLinecap="round" fill="none" />
            </g>

            {/* Tail */}
            <path d="M 145 160 Q 185 175 190 145 Q 165 140 140 152 Z" fill="#f472b6" />
            <path d="M 148 162 Q 190 180 195 142" stroke={accentColor} strokeWidth="3" fill="none" />

            {/* Body */}
            <ellipse cx="120" cy="148" rx="54" ry="46" fill={`url(#grad-${pet.speciesId})`} />
            <ellipse cx="120" cy="155" rx="36" ry="32" fill="#fdf2f8" opacity="0.8" />

            {/* Small Axolotl Paws */}
            <circle cx="86" cy="186" r="10" fill={secColor} />
            <circle cx="154" cy="186" r="10" fill={secColor} />

            {/* Head */}
            <ellipse cx="120" cy="98" rx="48" ry="42" fill={`url(#grad-${pet.speciesId})`} />
          </g>
        )}

        {/* ================= EYES & FACIAL EXPRESSIONS ================= */}
        {currentMood === 'sleeping' ? (
          // Sleeping curved eyes
          <g>
            <path d="M 98 96 Q 106 104 114 96" stroke="#1e1b4b" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <path d="M 126 96 Q 134 104 142 96" stroke="#1e1b4b" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            {/* ZZZ bubbles */}
            <text x="145" y="65" fill="#a78bfa" fontSize="18" fontWeight="bold" className="animate-bounce">Z</text>
            <text x="160" y="50" fill="#c084fc" fontSize="14" fontWeight="bold" className="animate-bounce" style={{ animationDelay: '0.2s' }}>z</text>
            <text x="172" y="38" fill="#e879f9" fontSize="11" fontWeight="bold" className="animate-bounce" style={{ animationDelay: '0.4s' }}>z</text>
          </g>
        ) : currentMood === 'happy' ? (
          // Overjoyed curved upward eyes
          <g>
            <path d="M 97 96 Q 106 86 115 96" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M 125 96 Q 134 86 143 96" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" fill="none" />
            {/* Sparkle hearts on cheeks */}
            <circle cx="90" cy="106" r="7" fill="#fb7185" opacity="0.6" />
            <circle cx="150" cy="106" r="7" fill="#fb7185" opacity="0.6" />
          </g>
        ) : currentMood === 'dirty' ? (
          // Uncomfortable eyes with soot dots
          <g>
            <circle cx="106" cy="95" r="7" fill="#0f172a" />
            <circle cx="134" cy="95" r="7" fill="#0f172a" />
            {/* Dirt smudges */}
            <circle cx="85" cy="120" r="5" fill="#78350f" opacity="0.7" />
            <circle cx="155" cy="125" r="4" fill="#78350f" opacity="0.7" />
            <circle cx="120" cy="80" r="3" fill="#78350f" opacity="0.7" />
          </g>
        ) : (
          // Normal Anime-style big glossy anime eyes
          <g>
            <ellipse cx="106" cy="94" rx="8" ry="11" fill="#0f172a" />
            <ellipse cx="134" cy="94" rx="8" ry="11" fill="#0f172a" />
            {/* Big glossy highlights */}
            <circle cx="104" cy="90" r="4" fill="#ffffff" />
            <circle cx="132" cy="90" r="4" fill="#ffffff" />
            <circle cx="108" cy="97" r="2" fill="#ffffff" />
            <circle cx="136" cy="97" r="2" fill="#ffffff" />
            {/* Blushing cheeks */}
            <circle cx="91" cy="104" r="6" fill="#fb7185" opacity="0.45" />
            <circle cx="149" cy="104" r="6" fill="#fb7185" opacity="0.45" />
          </g>
        )}

        {/* ================= MOUTH ================= */}
        {currentMood === 'eating' ? (
          // Chewing wide open mouth with cookie crumbs
          <g>
            <ellipse cx="120" cy="110" rx="10" ry="8" fill="#e11d48" />
            <path d="M 115 114 Q 120 117 125 114" fill="#fda4af" />
          </g>
        ) : currentMood === 'hungry' ? (
          // Wavy sad hungry mouth
          <path d="M 114 112 Q 120 107 126 112" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        ) : currentMood === 'happy' ? (
          // Big smiling open mouth with pink tongue
          <g>
            <path d="M 112 106 Q 120 120 128 106 Z" fill="#e11d48" />
            <path d="M 116 114 Q 120 118 124 114" fill="#f472b6" />
          </g>
        ) : (
          // Cute little cat 'w' smile
          <path d="M 113 107 Q 117 112 120 108 Q 123 112 127 107" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" fill="none" />
        )}

        {/* ================= EQUIPPED ACCESSORIES ================= */}
        {/* Outfit: Bowtie */}
        {pet.equipped.outfit === 'outfit_bowtie' && (
          <g id="acc-bowtie">
            <polygon points="120,130 110,123 110,137" fill="#ec4899" stroke="#be185d" strokeWidth="1" />
            <polygon points="120,130 130,123 130,137" fill="#ec4899" stroke="#be185d" strokeWidth="1" />
            <circle cx="120" cy="130" r="3.5" fill="#f43f5e" />
          </g>
        )}

        {/* Outfit: Cape */}
        {pet.equipped.outfit === 'outfit_cape' && (
          <g id="acc-cape">
            <path d="M 90 135 Q 120 142 150 135 L 160 185 Q 120 180 80 185 Z" fill="#ef4444" opacity="0.9" stroke="#b91c1c" strokeWidth="1.5" />
            <circle cx="120" cy="136" r="5" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />
          </g>
        )}

        {/* Outfit: Hoodie */}
        {pet.equipped.outfit === 'outfit_hoodie' && (
          <g id="acc-hoodie">
            <path d="M 88 135 Q 120 142 152 135 L 155 180 Q 120 186 85 180 Z" fill="#6366f1" stroke="#4338ca" strokeWidth="2" />
            <rect x="108" y="152" width="24" height="15" rx="4" fill="#4f46e5" />
            <circle cx="120" cy="142" r="3" fill="#a5b4fc" />
          </g>
        )}

        {/* Glasses: Cyberpunk */}
        {pet.equipped.glasses === 'glass_cyber' && (
          <g id="acc-cyber">
            <rect x="88" y="85" width="64" height="18" rx="4" fill="#10b981" opacity="0.85" stroke="#047857" strokeWidth="2" />
            <line x1="94" y1="94" x2="146" y2="94" stroke="#ecfdf5" strokeWidth="2" strokeDasharray="4 2" />
          </g>
        )}

        {/* Glasses: Star Glasses */}
        {pet.equipped.glasses === 'glass_star' && (
          <g id="acc-star-glasses">
            <polygon points="106,85 110,95 120,95 112,101 115,111 106,104 97,111 100,101 92,95 102,95" fill="#fbbf24" opacity="0.9" stroke="#d97706" strokeWidth="1" />
            <polygon points="134,85 138,95 148,95 140,101 143,111 134,104 125,111 128,101 120,95 130,95" fill="#fbbf24" opacity="0.9" stroke="#d97706" strokeWidth="1" />
            <line x1="117" y1="95" x2="123" y2="95" stroke="#d97706" strokeWidth="2" />
          </g>
        )}

        {/* Glasses: Monocle */}
        {pet.equipped.glasses === 'glass_monocle' && (
          <g id="acc-monocle">
            <circle cx="134" cy="94" r="11" fill="#67e8f9" opacity="0.6" stroke="#ca8a04" strokeWidth="2.5" />
            <line x1="145" y1="94" x2="155" y2="120" stroke="#ca8a04" strokeWidth="1.5" />
          </g>
        )}

        {/* Hat: Wizard Hat */}
        {pet.equipped.hat === 'hat_wizard' && (
          <g id="acc-wizard-hat">
            <ellipse cx="120" cy="58" rx="46" ry="10" fill="#7c3aed" stroke="#5b21b6" strokeWidth="2" />
            <path d="M 88 56 Q 115 5 145 15 Q 128 40 148 56 Z" fill="#6d28d9" stroke="#5b21b6" strokeWidth="2" />
            <rect x="94" y="50" width="48" height="7" rx="3" fill="#facc15" />
            <circle cx="145" cy="15" r="5" fill="#fde047" className="animate-ping" />
          </g>
        )}

        {/* Hat: Crown */}
        {pet.equipped.hat === 'hat_crown' && (
          <g id="acc-crown">
            <polygon points="98,62 94,40 108,52 120,34 132,52 146,40 142,62" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
            <circle cx="94" cy="39" r="3" fill="#ef4444" />
            <circle cx="120" cy="33" r="4" fill="#3b82f6" />
            <circle cx="146" cy="39" r="3" fill="#10b981" />
          </g>
        )}

        {/* Hat: Gamer Headset */}
        {pet.equipped.hat === 'hat_gamer' && (
          <g id="acc-gamer">
            <path d="M 72 90 C 72 35 168 35 168 90" stroke="#06b6d4" strokeWidth="7" fill="none" strokeLinecap="round" />
            {/* Ear cups */}
            <rect x="66" y="80" width="12" height="24" rx="5" fill="#0891b2" stroke="#a5f3fc" strokeWidth="2" />
            <rect x="162" y="80" width="12" height="24" rx="5" fill="#0891b2" stroke="#a5f3fc" strokeWidth="2" />
            {/* Cute kitty ears on headset */}
            <polygon points="90,45 80,25 102,36" fill="#06b6d4" />
            <polygon points="150,45 160,25 138,36" fill="#06b6d4" />
            {/* Mic */}
            <path d="M 72 100 Q 85 118 95 114" stroke="#06b6d4" strokeWidth="3" fill="none" />
            <circle cx="95" cy="114" r="3.5" fill="#ec4899" />
          </g>
        )}

        {/* Hat: Sakura Flower */}
        {pet.equipped.hat === 'hat_flower' && (
          <g id="acc-flower">
            <circle cx="146" cy="62" r="7" fill="#f472b6" />
            <circle cx="156" cy="62" r="7" fill="#f472b6" />
            <circle cx="151" cy="53" r="7" fill="#f472b6" />
            <circle cx="151" cy="71" r="7" fill="#f472b6" />
            <circle cx="151" cy="62" r="4" fill="#fde047" />
          </g>
        )}

        {/* Hat: Streetwear Cap */}
        {pet.equipped.hat === 'hat_cap' && (
          <g id="acc-cap">
            <path d="M 94 65 C 94 45 146 45 146 65 Z" fill="#6366f1" stroke="#4338ca" strokeWidth="2" />
            <path d="M 94 65 Q 70 65 65 72 Q 95 72 135 65 Z" fill="#4f46e5" stroke="#312e81" strokeWidth="1.5" />
          </g>
        )}
      </svg>

      {/* Floating Petting / Heart feedback */}
      {interactive && (
        <div className="absolute -bottom-2 px-3 py-1 bg-slate-900/80 backdrop-blur-md rounded-full border border-purple-500/30 text-[11px] font-semibold text-purple-300 shadow-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
          ✨ Toca para acariciar
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { PetState } from '../types/pet';
import { SPECIES_DATA } from '../data/speciesData';
import { soundManager } from '../utils/audio';
import { X, Send, Sparkles, MessageCircleHeart, Bot } from 'lucide-react';

interface PetOracleModalProps {
  pet: PetState;
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  sender: 'user' | 'pet';
  text: string;
}

export const PetOracleModal: React.FC<PetOracleModalProps> = ({
  pet,
  isOpen,
  onClose,
}) => {
  const species = SPECIES_DATA[pet.speciesId];
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'pet',
      text: `¡Hola mi mejor amigo humano! Soy ${pet.name}, tu ${species.tagline}. ¡Puedo entender tus pensamientos y charlar contigo gracias a la gema de telepatía mágica! ¿De qué quieres hablar hoy? ✨`,
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  if (!isOpen) return null;

  const quickQuestions = [
    '¿Cómo te sientes en este momento?',
    '¿Cuál es tu lugar favorito del universo?',
    '¿Qué poder mágico te gustaría aprender después?',
    'Dame un consejo para tener un día increíble',
  ];

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isTyping) return;

    soundManager.playClick();
    const userMsg: Message = { sender: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Generate responsive fantasy dialogue based on creature personality and current state
    setTimeout(() => {
      let reply = '';
      const lower = text.toLowerCase();

      if (lower.includes('sientes') || lower.includes('cómo estás') || lower.includes('hambre')) {
        if (pet.stats.hunger < 40) {
          reply = `¡Tengo mi pancita un poquito rugiente! Si me das una ${species.favoriteFoodId.replace('_', ' ')}, te prometo dar tres saltos de alegría cósmica.`;
        } else if (pet.stats.happiness >= 80) {
          reply = `¡Me siento en la cima de una nebulosa brillante! Contigo a mi lado mis poderes se recargan al 100%. ¡Eres el mejor! 💖`;
        } else {
          reply = `Me siento bien, pero me encantaría jugar un partidito en los minijuegos o ponerme un accesorio nuevo para lucir genial.`;
        }
      } else if (lower.includes('lugar') || lower.includes('universo') || lower.includes('planeta')) {
        if (pet.speciesId === 'dragon') {
          reply = `¡Amo las colinas de cristales de fuego de la Nebulosa Orión! Allí el cielo siempre es naranja brillante y los cometas sueltan chispas de colores.`;
        } else if (pet.speciesId === 'unicorn') {
          reply = `El mar de auroras boreales cósmicas... Flotar entre polvo de estrellas violeta escuchando el eco de las constelaciones es pura paz.`;
        } else if (pet.speciesId === 'kitsune') {
          reply = `El bosque secreto de bambú espiritual que existe entre dos dimensiones paralelas. ¡Allí puedo jugar a las escondidas con sombras traviesas!`;
        } else {
          reply = `Las corrientes de agua luminiscente en los anillos de Saturno. ¡El agua es tibia, brilla en tonos turquesa y es perfecta para chapotear!`;
        }
      } else if (lower.includes('poder') || lower.includes('magia') || lower.includes('evolución')) {
        reply = `¡Actualmente estoy en el nivel ${pet.level}! Cada vez que me cuidas y jugamos juntos, mi núcleo mágico se vuelve más fuerte. ¡Pronto podremos invocar hechizos legendarios que asombrarán a todos! ⚡`;
      } else if (lower.includes('consejo') || lower.includes('día') || lower.includes('amigo')) {
        reply = `Mi consejo mágico para ti hoy: no dejes que nada opaque tu luz interior. Si algo se pone difícil, recuerda respirar hondo, sonreír y confiar en tu propia magia. ¡Yo siempre creo en ti! ✨`;
      } else {
        const fallbacks = [
          `¡Qué interesante! Mis orejitas y mi antena mágica captaron tus palabras con mucha emoción. ¡Hagamos de este un día legendario!`,
          `¡Rooar-miau! Eso suena fascinante. En mi mundo de fantasía decimos que las mejores aventuras empiezan con una sonrisa sincera como la tuya.`,
          `¡Totalmente de acuerdo! Siento cómo se fortalece nuestro lazo espiritual cada segundo que pasamos juntos. ¿Vamos a ganar unas monedas en los minijuegos?`,
        ];
        reply = fallbacks[Math.floor(Math.random() * fallbacks.length)];
      }

      soundManager.playPet();
      setMessages((prev) => [...prev, { sender: 'pet', text: reply }]);
      setIsTyping(false);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[85vh] max-h-[650px]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400">
              <MessageCircleHeart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-white">Oráculo & Telepatía Mágica</h3>
              <p className="text-xs text-slate-400">Conversa en tiempo real con los pensamientos de {pet.name}</p>
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

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-end gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'pet' && (
                <div className="w-8 h-8 rounded-full bg-purple-500/30 border border-purple-400 flex items-center justify-center text-base shrink-0">
                  {pet.speciesId === 'dragon' ? '🐲' : pet.speciesId === 'unicorn' ? '🦄' : pet.speciesId === 'kitsune' ? '🦊' : '🦎'}
                </div>
              )}
              <div
                className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-xs'
                    : 'bg-slate-800/90 border border-slate-700 text-slate-200 rounded-bl-xs'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-purple-400 italic">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>{pet.name} está canalizando su respuesta mágica...</span>
            </div>
          )}
        </div>

        {/* Quick Question Prompts */}
        <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-950/40 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {quickQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(q)}
              className="text-[11px] whitespace-nowrap px-3 py-1 bg-slate-800/70 hover:bg-slate-700 text-slate-300 rounded-full border border-slate-700 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={`Escríbele un mensaje mágico a ${pet.name}...`}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-purple-500"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isTyping}
            className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white disabled:opacity-50 transition-opacity"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

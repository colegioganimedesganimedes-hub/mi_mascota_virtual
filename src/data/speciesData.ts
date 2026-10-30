import { SpeciesId, MagicPower } from '../types/pet';

export interface SpeciesInfo {
  id: SpeciesId;
  name: string;
  scientificName: string;
  tagline: string;
  element: 'fuego' | 'astral' | 'espíritu' | 'luz';
  elementLabel: string;
  personality: string;
  baseColor: string;
  secondaryColor: string;
  accentColor: string;
  description: string;
  stages: {
    stage: 1 | 2 | 3;
    title: string;
    description: string;
    minLevel: number;
  }[];
  powers: MagicPower[];
  favoriteFoodId: string;
  catchphrases: {
    greeting: string[];
    hungry: string[];
    sleepy: string[];
    dirty: string[];
    happy: string[];
    levelUp: string[];
  };
}

export const SPECIES_DATA: Record<SpeciesId, SpeciesInfo> = {
  dragon: {
    id: 'dragon',
    name: 'Ignis',
    scientificName: 'Draco Astromagus',
    tagline: 'Dragoncito de Fuego Cósmico',
    element: 'fuego',
    elementLabel: 'Fuego Estelar',
    personality: 'Valiente, leal y muy juguetón',
    baseColor: '#f97316', // orange-500
    secondaryColor: '#ef4444', // red-500
    accentColor: '#facc15', // yellow-400
    description: 'Nacido en el corazón de una nebulosa ígnea. Sus pequeñas alas destellan con brasas estelares inofensivas y sus estornudos lanzan chispas de confeti mágico.',
    stages: [
      {
        stage: 1,
        title: 'Chispa Bebé',
        description: 'Un cachorro dragón tierno y curioso con cuernecitos dorados y pequeñas alas.',
        minLevel: 1,
      },
      {
        stage: 2,
        title: 'Llama Celeste',
        description: 'Alas más amplias con filigrana solar, cresta de fuego azul y destreza en vuelo.',
        minLevel: 4,
      },
      {
        stage: 3,
        title: 'Guardián Cósmico',
        description: 'Majestuoso señor del cosmos con cuernos enjoyados, aura ardiente estelar y cola de supernova.',
        minLevel: 8,
      },
    ],
    powers: [
      {
        id: 'chispa_suerte',
        name: 'Chispa de Fortuna',
        description: 'Dispara una ráfaga de chispas cósmicas que multiplica tus monedas ganadas.',
        minLevel: 1,
        cooldownSeconds: 30,
        icon: 'Sparkles',
        color: '#f59e0b',
        effectType: 'coin_boost',
      },
      {
        id: 'llamarada_solar',
        name: 'Aliento de Fénix',
        description: 'Restaura al instante la energía y felicidad de Ignis con calor reconfortante.',
        minLevel: 4,
        cooldownSeconds: 60,
        icon: 'Flame',
        color: '#ef4444',
        effectType: 'stat_restore',
      },
      {
        id: 'supernova_legendaria',
        name: 'Lluvia de Supernova',
        description: 'Invoca una lluvia de gemas y meteoros estelares que otorgan 80 monedas y 50 XP.',
        minLevel: 8,
        cooldownSeconds: 120,
        icon: 'Zap',
        color: '#ec4899',
        effectType: 'meteor_shower',
      },
    ],
    favoriteFoodId: 'fuego_dulce',
    catchphrases: {
      greeting: [
        '¡Rrrroar! Bueno, más bien ¡miau-roar! ¡Qué emoción verte!',
        '¡Mis alas ya están listas para una nueva aventura hoy!',
        '¡Mira mis chispas! ¿Hacemos algo épico?',
      ],
      hungry: [
        '¡Mi barriguita ruge más fuerte que un volcán!',
        '¿Tienes algún dulce de fuego estelar a mano?',
      ],
      sleepy: [
        'Uaahh... mis fueguitos internos parpadean despacio... Zzz',
        'Necesito mi camita de cenizas celestes para soñar en grande.',
      ],
      dirty: [
        'Tengo algo de hollín cósmico en mis escamas, ¿nos damos un baño con burbujas?',
        '¡Ay! Hasta mis alitas necesitan un buen chapuzón mágico.',
      ],
      happy: [
        '¡Eres el mejor entrenador del multiverso!',
        '¡Siento una energía cósmica vibrando en mis cuernitos!',
      ],
      levelUp: [
        '¡Siento el rugido de la galaxia dentro de mí! ¡Subí de nivel!',
        '¡Nuevos poderes desbloqueados! ¡Mira cuánto he crecido!',
      ],
    },
  },
  unicorn: {
    id: 'unicorn',
    name: 'Astra',
    scientificName: 'Equus Astralis',
    tagline: 'Unicornio Astral',
    element: 'astral',
    elementLabel: 'Poder Astral',
    personality: 'Elegante, soñador y cariñoso',
    baseColor: '#a855f7', // purple-500
    secondaryColor: '#ec4899', // pink-500
    accentColor: '#38bdf8', // sky-400
    description: 'Posee una crin hecha de polvo de estrellas y un cuerno de cuarzo puro que canaliza las frecuencias del universo para llenar de paz a quien lo acaricie.',
    stages: [
      {
        stage: 1,
        title: 'Estrellita Bebé',
        description: 'Un potrillo celestial con pezuñas de luz y un tierno cuerno brillante.',
        minLevel: 1,
      },
      {
        stage: 2,
        title: 'Pegaso Crepuscular',
        description: 'Alas etéreas emplumadas de aurora, crin fluida multicolor y halo mágico.',
        minLevel: 4,
      },
      {
        stage: 3,
        title: 'Oráculo del Zodiaco',
        description: 'Corona estelar viva, alas de prisma arcoíris y constelaciones bailando a su alrededor.',
        minLevel: 8,
      },
    ],
    powers: [
      {
        id: 'aura_prismatica',
        name: 'Aura Prismática',
        description: 'Envuelve el espacio en luz estelar y aumenta la experiencia obtenida.',
        minLevel: 1,
        cooldownSeconds: 35,
        icon: 'Sparkles',
        color: '#c084fc',
        effectType: 'xp_boost',
      },
      {
        id: 'escudo_estelar',
        name: 'Escudo de Cristal',
        description: 'Protege las estadísticas de Astra para que no bajen durante 3 minutos.',
        minLevel: 4,
        cooldownSeconds: 70,
        icon: 'Shield',
        color: '#38bdf8',
        effectType: 'aura_shield',
      },
      {
        id: 'lluvia_aurora',
        name: 'Milagro de la Aurora',
        description: 'Despliega un arcoíris cósmico que cura todas las estadísticas al 100% y concede 60 monedas.',
        minLevel: 8,
        cooldownSeconds: 130,
        icon: 'Sun',
        color: '#f43f5e',
        effectType: 'stat_restore',
      },
    ],
    favoriteFoodId: 'fruta_estelar',
    catchphrases: {
      greeting: [
        '¡Las estrellas me susurraron que hoy tendríamos un día mágico!',
        '¡Relincho de luz para ti! Qué alegría tenerte aquí.',
        'Siento cómo bailan los cometas en el cielo.',
      ],
      hungry: [
        'Mi cuerno pierde un poco de brillo... ¿tendrás néctar o fruta estelar?',
        '¡Un bocadillo mágico sería el regalo más dulce!',
      ],
      sleepy: [
        'Las nubes de algodón me llaman para descansar bajo la luna llena...',
        'Apaguemos las lucecitas para contar constelaciones.',
      ],
      dirty: [
        'Mi crin de arcoíris tiene polvo estelar enredado... ¿me enjabonas?',
        '¡Amo el agua tibia llena de espuma con brillantina!',
      ],
      happy: [
        '¡Tu amistad hace brillar mi cuerno más que una supernova!',
        'Siento mariposas de luz en mi corazón.',
      ],
      levelUp: [
        '¡Una cascada de bendiciones astrales! ¡He evolucionado en poder!',
        '¡Mi luz ahora puede iluminar universos enteros!',
      ],
    },
  },
  kitsune: {
    id: 'kitsune',
    name: 'Kitsun',
    scientificName: 'Vulpes Mystica',
    tagline: 'Zorrito Místico de Tres Colas',
    element: 'espíritu',
    elementLabel: 'Fuego Espiritual',
    personality: 'Inteligente, travieso y misterioso',
    baseColor: '#06b6d4', // cyan-500
    secondaryColor: '#3b82f6', // blue-500
    accentColor: '#10b981', // emerald-500
    description: 'Criatura espiritual del bosque de bambú encantado. Puede levitar pequeñas esferas de fuego fatuo azul y se divierte jugando a las escondidas entre dimensiones.',
    stages: [
      {
        stage: 1,
        title: 'Espíritu Zorrillo',
        description: 'Zorrito pequeño y esponjoso con una hermosa cola con punta encendida.',
        minLevel: 1,
      },
      {
        stage: 2,
        title: 'Guardián de Tres Colas',
        description: 'Tres colas sinuosas con fuego fatuo azul, marcas tribales brillantes en la frente.',
        minLevel: 4,
      },
      {
        stage: 3,
        title: 'Señor Kitsune de Nueve Lunas',
        description: 'Multiples colas ondulantes de jade espiritual, orbes flotantes y máscara divina.',
        minLevel: 8,
      },
    ],
    powers: [
      {
        id: 'teletransporte_astuto',
        name: 'Paso Etéreo',
        description: 'Una ilusión mágica que recolecta monedas flotantes instantáneamente.',
        minLevel: 1,
        cooldownSeconds: 30,
        icon: 'Ghost',
        color: '#06b6d4',
        effectType: 'coin_boost',
      },
      {
        id: 'orbe_fatuo',
        name: 'Danza de Fuego Fatuo',
        description: 'Llena la barra de magia de Kitsun al máximo y multiplica los puntos de minijuegos.',
        minLevel: 4,
        cooldownSeconds: 65,
        icon: 'CircleDot',
        color: '#10b981',
        effectType: 'xp_boost',
      },
      {
        id: 'dominio_espiritual',
        name: 'Bendición de las Nueve Lunas',
        description: 'Invoca los espíritus guardianes para otorgar 100 monedas y restaurar toda la felicidad.',
        minLevel: 8,
        cooldownSeconds: 120,
        icon: 'Moon',
        color: '#6366f1',
        effectType: 'stat_restore',
      },
    ],
    favoriteFoodId: 'galleta_nube',
    catchphrases: {
      greeting: [
        '¡Aparezco como por arte de magia! ¡Listo para bromas y juegos!',
        '¡Mis colas no paran de moverse de emoción!',
        'He escondido un secreto místico hoy, ¿me ayudas a explorarlo?',
      ],
      hungry: [
        'Mi fuego azul se apaga... ¡necesito galletitas de nube o maná!',
        'Un zorro hambriento puede volverse aún más travieso, jeje.',
      ],
      sleepy: [
        'Me enrollaré en mis propias colitas esponjosas para echar una siesta.',
        'Los espíritus del bosque duermen cuando la luna canta... zzz',
      ],
      dirty: [
        '¡Tengo hojas mágicas y polvo entre mi suave pelaje!',
        '¡Hora de sumergirse en un estanque de burbujas flotantes!',
      ],
      happy: [
        '¡Eres el mejor compañero con el que una criatura mística podría soñar!',
        '¡Mis orbes de luz bailan cuando estamos juntos!',
      ],
      levelUp: [
        '¡Mis colas multiplican su fulgor! ¡He alcanzado un nuevo rango sagrado!',
        '¡Un poder milenario despierta dentro de mí!',
      ],
    },
  },
  axolotl: {
    id: 'axolotl',
    name: 'Lumina',
    scientificName: 'Ambystoma Stellaris',
    tagline: 'Ajolote Estelar de Luz',
    element: 'luz',
    elementLabel: 'Bioluminiscencia',
    personality: 'Dulce, empático y soñador',
    baseColor: '#ec4899', // pink-500
    secondaryColor: '#8b5cf6', // violet-500
    accentColor: '#34d399', // emerald-400
    description: 'Navega los ríos de luz líquida en los confines del océano cósmico. Sus branquias son coronas de coral estelar que titilan suavemente cuando siente afecto.',
    stages: [
      {
        stage: 1,
        title: 'Renacuajo de Luz',
        description: 'Bebé ajolote tierno con branquias que parecen pétalos de neón.',
        minLevel: 1,
      },
      {
        stage: 2,
        title: 'Sirena Bioluminiscente',
        description: 'Aletas ondulantes como velos de aurora, branquias de cristal y ojos que reflejan galaxias.',
        minLevel: 4,
      },
      {
        stage: 3,
        title: 'Dragón del Mar Cósmico',
        description: 'Silueta legendaria con largas aletas de plasma translúcido y corona de perlas astrales.',
        minLevel: 8,
      },
    ],
    powers: [
      {
        id: 'burbujas_curativas',
        name: 'Burbujas de Regeneración',
        description: 'Suelta burbujas que limpian al instante a Lumina y le devuelven 30 de hambre.',
        minLevel: 1,
        cooldownSeconds: 30,
        icon: 'Droplets',
        color: '#06b6d4',
        effectType: 'stat_restore',
      },
      {
        id: 'destello_oceanico',
        name: 'Destello de Coral',
        description: 'Genera un pulso calmante que duplica la ganancia de monedas en minijuegos.',
        minLevel: 4,
        cooldownSeconds: 60,
        icon: 'Waves',
        color: '#ec4899',
        effectType: 'coin_boost',
      },
      {
        id: 'marea_de_estrellas',
        name: 'Marea Cósmica Infinita',
        description: 'Desata una ola celestial que cura todas las estadísticas y otorga 90 monedas.',
        minLevel: 8,
        cooldownSeconds: 120,
        icon: 'Sparkles',
        color: '#34d399',
        effectType: 'stat_restore',
      },
    ],
    favoriteFoodId: 'cristal_miel',
    catchphrases: {
      greeting: [
        '¡Bloop bloop! ¡Qué alegría verte nadar hasta aquí!',
        'Mis branquias brillan de emoción cada vez que vienes.',
        '¿Jugamos un ratito en las corrientes de estrellas?',
      ],
      hungry: [
        'Mi pancita hace burbujitas vacías... ¿un cristal de miel?',
        '¡Un bocadito marino me haría sonreír de oreja a oreja!',
      ],
      sleepy: [
        'Me voy a flotar en mi burbuja de descanso... buenas noches... bloop...',
        'La marea está tan suavecita que me da sueño.',
      ],
      dirty: [
        '¡Mis aletas luminosas necesitan agua fresca y limpia!',
        '¡Me encantan las burbujas! ¿Jugamos a explotarlas en el baño?',
      ],
      happy: [
        '¡Siento que floto entre nubes de algodón de azúcar!',
        '¡Tu cariño me hace brillar más fuerte que una estrella marina!',
      ],
      levelUp: [
        '¡Mis aletas se llenaron de luz arcoíris! ¡He crecido!',
        '¡Un canto oceánico llena mi ser! ¡Subí de nivel!',
      ],
    },
  },
};

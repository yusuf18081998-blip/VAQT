import React from 'react';
import { TreeSpecies } from '../types';
import { Language, TRANSLATIONS } from '../utils/translations';
import { AlertTriangle, ShieldCheck, ShieldAlert, Leaf } from 'lucide-react';

interface FocusTreeVisualizerProps {
  species: TreeSpecies;
  progressPercent: number; // 0 to 100
  isWithered: boolean;
  witherWarning: boolean;
  leftAppCount: number;
  isDeepFocusActive: boolean;
  pomoRunning: boolean;
  pomoMode: 'study' | 'short_break' | 'long_break';
  taskTitle?: string;
  onOpenForest: () => void;
  onChangeSpecies: (species: TreeSpecies) => void;
  lang?: Language;
}

export const SPECIES_INFO: Record<
  TreeSpecies,
  { name: string; icon: string; desc: string; color: string; foliageColor: string; woodColor: string }
> = {
  apple: {
    name: 'Olma Daraxti',
    icon: '🍎',
    desc: 'Shirin qizil olmali mevazor daraxti',
    color: 'from-emerald-500 to-green-600',
    foliageColor: '#22c55e',
    woodColor: '#854d0e',
  },
  pine: {
    name: 'Ulugʻ Qaragʻay',
    icon: '🌲',
    desc: 'Chidamli va mustahkam yashil ignabargli',
    color: 'from-teal-600 to-emerald-700',
    foliageColor: '#0f766e',
    woodColor: '#78350f',
  },
  sakura: {
    name: 'Sakura (Gilos)',
    icon: '🌸',
    desc: 'Goʻzal pushti yapon gilos gullari',
    color: 'from-pink-400 to-rose-500',
    foliageColor: '#f472b6',
    woodColor: '#713f12',
  },
  oak: {
    name: 'Muhtasham Eman',
    icon: '🌳',
    desc: 'Qalin shoxli, ming yillik baquvvat daraxt',
    color: 'from-green-600 to-emerald-800',
    foliageColor: '#15803d',
    woodColor: '#592c0d',
  },
  bamboo: {
    name: 'Bambuk Qamish',
    icon: '🎋',
    desc: 'Tez oʻsuvchi, moslashuvchan yashil novdalar',
    color: 'from-lime-500 to-emerald-600',
    foliageColor: '#84cc16',
    woodColor: '#65a30d',
  },
  palm: {
    name: 'Tropik Palma',
    icon: '🌴',
    desc: 'Quyoshli, keng bargli tropik oazis daraxti',
    color: 'from-emerald-400 to-teal-500',
    foliageColor: '#10b981',
    woodColor: '#9a3412',
  },
};

export const FocusTreeVisualizer: React.FC<FocusTreeVisualizerProps> = ({
  species,
  progressPercent,
  isWithered,
  witherWarning,
  leftAppCount,
  isDeepFocusActive,
  pomoRunning,
  pomoMode,
  taskTitle,
  onOpenForest,
  onChangeSpecies,
  lang = 'uz',
}) => {
  const currentInfo = SPECIES_INFO[species] || SPECIES_INFO.apple;
  const t = TRANSLATIONS[lang] || TRANSLATIONS.uz;
  const speciesLocalized = t.speciesNames?.[species];
  const speciesDisplayName = speciesLocalized?.name || currentInfo.name;

  // Determine stage of growth
  // 0-15: Seed & Sprout
  // 15-45: Small Sapling
  // 45-80: Medium Young Tree
  // 80-100: Majestic Full Tree
  const stage = progressPercent < 15 ? 'sprout' : progressPercent < 50 ? 'sapling' : progressPercent < 85 ? 'growing' : 'mature';

  return (
    <div id="focus-tree-container" className="relative w-full max-w-lg mx-auto flex flex-col items-center">
      {/* Top Status & Warning Badge */}
      <div className="w-full flex items-center justify-between mb-3 px-2">
        <div className="flex items-center gap-2">
          {isWithered ? (
            <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              {t.pomodoro.treeWitheredWarning}
            </span>
          ) : witherWarning ? (
            <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-bounce">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              {t.pomodoro.leftAppWarning.replace('{count}', String(leftAppCount))}
            </span>
          ) : isDeepFocusActive && pomoRunning && pomoMode === 'study' ? (
            <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              {t.pomodoro.focusProtectionActive}
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-slate-800/60 text-slate-300 border border-slate-700/50">
              <Leaf className="w-3.5 h-3.5 text-emerald-400" />
              {t.pomodoro.treeGrowsDuringFocus}
            </span>
          )}
        </div>

        {/* Garden / Forest Button */}
        <button
          id="open-forest-modal-btn"
          type="button"
          onClick={onOpenForest}
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 transition-all hover:scale-105 active:scale-95"
        >
          <span>🌲 {t.pomodoro.myGardenBtn}</span>
        </button>
      </div>

      {/* Main Tree Island Graphic Stage */}
      <div className="relative w-full h-64 sm:h-72 rounded-3xl bg-gradient-to-b from-slate-900/60 via-slate-900/40 to-slate-950/80 border border-white/10 p-4 flex flex-col items-center justify-end overflow-hidden shadow-2xl backdrop-blur-xl">
        {/* Background Atmosphere Lights / Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {isWithered ? (
            <div className="absolute inset-0 bg-rose-950/20 mix-blend-color-burn" />
          ) : (
            <>
              <div className="absolute top-4 left-6 w-24 h-24 rounded-full bg-emerald-500/10 blur-2xl" />
              <div className="absolute top-8 right-6 w-28 h-28 rounded-full bg-teal-500/10 blur-2xl" />
            </>
          )}

          {/* Floating Leaves or Dust */}
          {pomoRunning && !isWithered && (
            <div className="absolute inset-0 overflow-hidden">
              <span className="absolute top-1/4 left-1/4 text-emerald-400/40 text-xs animate-bounce">✦</span>
              <span className="absolute top-1/3 right-1/4 text-teal-300/40 text-xs animate-pulse">✨</span>
              <span className="absolute top-2/3 left-1/5 text-green-400/30 text-xs">🍃</span>
            </div>
          )}
        </div>

        {/* Tree Species Selector Pill (When not running or during setup) */}
        {!pomoRunning && (
          <div className="absolute top-3 inset-x-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none max-w-full">
              {(Object.keys(SPECIES_INFO) as TreeSpecies[]).map((sp) => {
                const isSelected = sp === species;
                const info = SPECIES_INFO[sp];
                const spShort = t.speciesNames?.[sp]?.shortName || info.name.split(' ')[0];
                return (
                  <button
                    key={sp}
                    id={`select-tree-${sp}`}
                    type="button"
                    onClick={() => onChangeSpecies(sp)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                      isSelected
                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 ring-2 ring-white/20 scale-105'
                        : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700'
                    }`}
                  >
                    <span>{info.icon}</span>
                    <span>{spShort}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Dynamic SVG Tree Graphic */}
        <div className="relative z-10 w-48 h-48 flex items-center justify-center transition-all duration-700">
          {isWithered ? (
            /* Withered Dead Tree */
            <svg viewBox="0 0 200 200" className="w-44 h-44 drop-shadow-xl animate-pulse">
              {/* Soil mound */}
              <ellipse cx="100" cy="180" rx="65" ry="14" fill="#3f2e21" opacity="0.9" />
              <ellipse cx="100" cy="178" rx="55" ry="10" fill="#2b1f16" />

              {/* Dead Trunk & Jagged Dry Branches */}
              <path
                d="M95 180 L96 110 L82 85 L70 90 M82 85 L85 60 M96 110 L110 80 L125 75 M110 80 L108 50 M104 180 L102 110"
                stroke="#5c4033"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <path
                d="M96 125 L120 120 L130 110 M96 140 L75 135 L68 128"
                stroke="#4a3525"
                strokeWidth="5"
                strokeLinecap="round"
                fill="none"
              />

              {/* Fallen Dry Brown Leaves on ground */}
              <circle cx="75" cy="182" r="3" fill="#8c532b" />
              <circle cx="125" cy="183" r="3.5" fill="#8c532b" />
              <circle cx="110" cy="185" r="2.5" fill="#78350f" />
              <circle cx="90" cy="184" r="3" fill="#78350f" />

              {/* Sad Wither Smoke / Clouds */}
              <text x="100" y="40" textAnchor="middle" fontSize="22" className="animate-bounce">
                🥀
              </text>
            </svg>
          ) : stage === 'sprout' ? (
            /* Sprout / Seedling (0% - 15%) */
            <svg viewBox="0 0 200 200" className="w-40 h-40 drop-shadow-lg transition-transform duration-500 scale-95">
              {/* Fresh Soil Island */}
              <ellipse cx="100" cy="175" rx="60" ry="14" fill="#3a271d" />
              <ellipse cx="100" cy="173" rx="52" ry="10" fill="#4e3527" />

              {/* Little Green Sprout */}
              <path d="M100 173 Q99 150 100 135" stroke="#22c55e" strokeWidth="5" strokeLinecap="round" fill="none" />
              {/* Left Sprout Leaf */}
              <path d="M100 145 C85 140 85 125 100 135" fill="#4ade80" />
              {/* Right Sprout Leaf */}
              <path d="M100 145 C115 140 115 125 100 135" fill="#22c55e" />
              {/* Dewdrop */}
              <circle cx="93" cy="133" r="2" fill="#67e8f9" opacity="0.8" />
            </svg>
          ) : stage === 'sapling' ? (
            /* Young Sapling (15% - 50%) */
            <svg viewBox="0 0 200 200" className="w-44 h-44 drop-shadow-xl transition-all duration-500">
              {/* Soil Island */}
              <ellipse cx="100" cy="175" rx="65" ry="14" fill="#3a271d" />
              <ellipse cx="100" cy="173" rx="55" ry="10" fill="#4e3527" />
              <ellipse cx="100" cy="171" rx="45" ry="8" fill="#15803d" opacity="0.4" />

              {/* Young Stem */}
              <path d="M100 173 Q98 135 100 105" stroke="#78350f" strokeWidth="6" strokeLinecap="round" fill="none" />
              {/* Branches */}
              <path d="M99 135 Q85 125 78 115" stroke="#78350f" strokeWidth="4" strokeLinecap="round" fill="none" />
              <path d="M100 125 Q115 115 122 105" stroke="#78350f" strokeWidth="4" strokeLinecap="round" fill="none" />

              {/* Foliage Tufts */}
              <circle cx="78" cy="115" r="14" fill={currentInfo.foliageColor} opacity="0.9" />
              <circle cx="122" cy="105" r="14" fill={currentInfo.foliageColor} opacity="0.9" />
              <circle cx="100" cy="95" r="18" fill={currentInfo.foliageColor} />
              <circle cx="100" cy="90" r="14" fill="#86efac" opacity="0.3" />
            </svg>
          ) : stage === 'growing' ? (
            /* Growing Tree (50% - 85%) */
            <svg viewBox="0 0 200 200" className="w-48 h-48 drop-shadow-2xl transition-all duration-500">
              {/* Soil Island with Grass */}
              <ellipse cx="100" cy="175" rx="70" ry="15" fill="#3a271d" />
              <ellipse cx="100" cy="173" rx="60" ry="11" fill="#166534" />
              <ellipse cx="100" cy="171" rx="50" ry="8" fill="#22c55e" opacity="0.6" />

              {/* Strong Trunk */}
              <path
                d="M93 175 C94 140 96 110 97 90 M107 175 C106 140 104 110 103 90"
                stroke={currentInfo.woodColor}
                strokeWidth="7"
                strokeLinecap="round"
                fill="none"
              />
              <path d="M96 115 Q75 100 68 85" stroke={currentInfo.woodColor} strokeWidth="5" strokeLinecap="round" fill="none" />
              <path d="M104 105 Q125 90 132 75" stroke={currentInfo.woodColor} strokeWidth="5" strokeLinecap="round" fill="none" />

              {/* Lush Canopy Bulbs */}
              <circle cx="68" cy="80" r="22" fill={currentInfo.foliageColor} opacity="0.95" />
              <circle cx="132" cy="72" r="22" fill={currentInfo.foliageColor} opacity="0.95" />
              <circle cx="100" cy="65" r="30" fill={currentInfo.foliageColor} />
              <circle cx="100" cy="58" r="22" fill="#a7f3d0" opacity="0.3" />

              {/* Species Specific Adornments */}
              {species === 'apple' && (
                <>
                  <circle cx="85" cy="70" r="4.5" fill="#ef4444" />
                  <circle cx="115" cy="65" r="4.5" fill="#ef4444" />
                </>
              )}
              {species === 'sakura' && (
                <>
                  <circle cx="80" cy="65" r="4" fill="#fbcfe8" />
                  <circle cx="120" cy="60" r="4" fill="#fbcfe8" />
                </>
              )}
            </svg>
          ) : (
            /* Mature Majestic Tree (85% - 100%) */
            <svg viewBox="0 0 200 200" className="w-52 h-52 drop-shadow-2xl transition-all duration-500 scale-105">
              {/* Lush Ground / Grass Hill */}
              <ellipse cx="100" cy="175" rx="75" ry="16" fill="#2d1c14" />
              <ellipse cx="100" cy="173" rx="65" ry="12" fill="#15803d" />
              <ellipse cx="100" cy="170" rx="55" ry="9" fill="#22c55e" />

              {/* Grass Tufts on island */}
              <path d="M60 170 L62 163 L65 171" stroke="#4ade80" strokeWidth="2" fill="none" />
              <path d="M135 171 L138 164 L141 172" stroke="#4ade80" strokeWidth="2" fill="none" />

              {species === 'pine' ? (
                /* Evergreen Pine Hierarchy */
                <>
                  <rect x="94" y="125" width="12" height="50" rx="4" fill={currentInfo.woodColor} />
                  {/* Layer 3 Bottom */}
                  <polygon points="100,80 45,145 155,145" fill="#0f766e" />
                  {/* Layer 2 Mid */}
                  <polygon points="100,50 55,105 145,105" fill="#115e59" />
                  {/* Layer 1 Top */}
                  <polygon points="100,20 68,68 132,68" fill="#14b8a6" />
                  <polygon points="100,20 90,68 100,68" fill="#5eead4" opacity="0.4" />
                </>
              ) : species === 'palm' ? (
                /* Tropical Curved Palm */
                <>
                  <path d="M96 175 Q115 110 100 55" stroke={currentInfo.woodColor} strokeWidth="10" strokeLinecap="round" fill="none" />
                  {/* Fronds */}
                  <path d="M100 55 Q50 35 30 65" stroke="#10b981" strokeWidth="6" strokeLinecap="round" fill="none" />
                  <path d="M100 55 Q150 35 170 65" stroke="#10b981" strokeWidth="6" strokeLinecap="round" fill="none" />
                  <path d="M100 55 Q100 15 80 15" stroke="#34d399" strokeWidth="6" strokeLinecap="round" fill="none" />
                  <path d="M100 55 Q100 15 120 15" stroke="#059669" strokeWidth="6" strokeLinecap="round" fill="none" />
                  {/* Coconuts */}
                  <circle cx="96" cy="60" r="4.5" fill="#78350f" />
                  <circle cx="105" cy="62" r="4.5" fill="#78350f" />
                </>
              ) : species === 'bamboo' ? (
                /* Bamboo Forest */
                <>
                  <rect x="75" y="45" width="8" height="130" rx="3" fill="#84cc16" />
                  <rect x="96" y="25" width="9" height="150" rx="3" fill="#65a30d" />
                  <rect x="118" y="40" width="8" height="135" rx="3" fill="#84cc16" />
                  {/* Bamboo nodes */}
                  <line x1="73" y1="80" x2="85" y2="80" stroke="#3f6212" strokeWidth="2.5" />
                  <line x1="73" y1="120" x2="85" y2="120" stroke="#3f6212" strokeWidth="2.5" />
                  <line x1="94" y1="70" x2="107" y2="70" stroke="#3f6212" strokeWidth="2.5" />
                  <line x1="94" y1="110" x2="107" y2="110" stroke="#3f6212" strokeWidth="2.5" />
                  <line x1="116" y1="75" x2="128" y2="75" stroke="#3f6212" strokeWidth="2.5" />
                  <line x1="116" y1="115" x2="128" y2="115" stroke="#3f6212" strokeWidth="2.5" />
                  {/* Leaves */}
                  <path d="M83 80 C60 70 55 90 83 80" fill="#a3e635" />
                  <path d="M105 70 C130 60 135 80 105 70" fill="#4d7c0f" />
                  <path d="M126 75 C150 65 155 85 126 75" fill="#a3e635" />
                </>
              ) : (
                /* Broad Leaf Trees: Apple, Sakura, Oak */
                <>
                  {/* Massive Trunk */}
                  <path
                    d="M90 173 C92 130 95 95 96 75 M110 173 C108 130 105 95 104 75"
                    stroke={currentInfo.woodColor}
                    strokeWidth="10"
                    strokeLinecap="round"
                    fill="none"
                  />
                  {/* Giant Canopy Clouds */}
                  <circle cx="65" cy="75" r="28" fill={currentInfo.foliageColor} opacity="0.95" />
                  <circle cx="135" cy="75" r="28" fill={currentInfo.foliageColor} opacity="0.95" />
                  <circle cx="100" cy="52" r="38" fill={currentInfo.foliageColor} />
                  <circle cx="100" cy="42" r="28" fill="#ffffff" opacity="0.18" />

                  {/* Red Apples */}
                  {species === 'apple' && (
                    <>
                      <circle cx="65" cy="72" r="5" fill="#ef4444" />
                      <circle cx="80" cy="50" r="5" fill="#ef4444" />
                      <circle cx="120" cy="48" r="5.5" fill="#dc2626" />
                      <circle cx="135" cy="75" r="5" fill="#ef4444" />
                      <circle cx="100" cy="65" r="5.5" fill="#ef4444" />
                    </>
                  )}

                  {/* Sakura Blossoms */}
                  {species === 'sakura' && (
                    <>
                      <circle cx="62" cy="70" r="4.5" fill="#ffffff" opacity="0.9" />
                      <circle cx="85" cy="45" r="5" fill="#fbcfe8" />
                      <circle cx="118" cy="42" r="4.5" fill="#ffffff" opacity="0.9" />
                      <circle cx="138" cy="72" r="5" fill="#fbcfe8" />
                      <circle cx="100" cy="58" r="5" fill="#ffffff" opacity="0.9" />
                    </>
                  )}
                </>
              )}
            </svg>
          )}
        </div>

        {/* Tree Growth Progress Bar on Stage Floor */}
        <div className="w-full mt-2 z-10 flex flex-col items-center">
          <div className="w-full flex items-center justify-between text-xs text-slate-300 font-medium px-1 mb-1">
            <span className="flex items-center gap-1">
              <span>{currentInfo.icon}</span>
              <span className="font-semibold text-white">{speciesDisplayName}</span>
            </span>
            <span className={isWithered ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
              {isWithered ? t.pomodoro.witheredStatus : t.pomodoro.maturedStatus.replace('{percent}', String(Math.round(progressPercent)))}
            </span>
          </div>

          {/* Progress track */}
          <div className="w-full h-2 rounded-full bg-slate-800/80 border border-slate-700/60 overflow-hidden relative">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isWithered
                  ? 'bg-rose-600'
                  : witherWarning
                  ? 'bg-amber-500 animate-pulse'
                  : 'bg-gradient-to-r from-emerald-500 via-teal-400 to-green-400'
              }`}
              style={{ width: isWithered ? '100%' : `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Task or Focus Info Underneath */}
      {taskTitle && (
        <div className="mt-2.5 text-xs text-slate-400 flex items-center gap-1.5 bg-slate-900/60 px-3 py-1 rounded-full border border-slate-800">
          <span>{t.pomodoro.taskGoalLabel}</span>
          <span className="text-white font-medium truncate max-w-xs">{taskTitle}</span>
        </div>
      )}
    </div>
  );
};

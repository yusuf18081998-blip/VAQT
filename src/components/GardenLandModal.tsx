import React, { useState } from 'react';
import { PlantedTree, TreeSpecies } from '../types';
import { SPECIES_INFO } from './FocusTreeVisualizer';
import { Language, TRANSLATIONS } from '../utils/translations';
import {
  X,
  Trash2,
  Award,
  TreePine,
  AlertOctagon,
  Clock,
  Droplets,
  Sun,
  Moon,
  Layers,
  Grid3X3,
  Plus,
  Compass,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface GardenLandModalProps {
  isOpen: boolean;
  trees: PlantedTree[];
  onClose: () => void;
  onClearHistory: () => void;
  onPlantDemoTree?: (species: TreeSpecies, minutes: number, taskTitle: string) => void;
  lang?: Language;
}

type BiomeType = 'meadow' | 'autumn' | 'sakura' | 'cyber' | 'oasis';
type WeatherMode = 'sunny' | 'rain' | 'night';

const BIOME_CONFIGS: Record<
  BiomeType,
  {
    icon: string;
    groundBg: string;
    tileBorder: string;
    tileBg: string;
    tileEmptyBg: string;
    grassAccent: string;
    soilColor: string;
  }
> = {
  meadow: {
    icon: '🌿',
    groundBg: 'from-emerald-950/60 via-slate-900/90 to-emerald-950/80',
    tileBorder: 'border-emerald-500/30',
    tileBg: 'from-emerald-900/60 via-green-950/80 to-emerald-900/70',
    tileEmptyBg: 'bg-emerald-950/40 hover:bg-emerald-900/30 border-dashed border-emerald-500/20',
    grassAccent: '#22c55e',
    soilColor: '#3a271d',
  },
  autumn: {
    icon: '🍂',
    groundBg: 'from-amber-950/60 via-slate-900/90 to-amber-950/80',
    tileBorder: 'border-amber-500/30',
    tileBg: 'from-amber-900/60 via-orange-950/80 to-amber-900/70',
    tileEmptyBg: 'bg-amber-950/40 hover:bg-amber-900/30 border-dashed border-amber-500/20',
    grassAccent: '#f59e0b',
    soilColor: '#451a03',
  },
  sakura: {
    icon: '🌸',
    groundBg: 'from-pink-950/60 via-slate-900/90 to-purple-950/80',
    tileBorder: 'border-pink-500/30',
    tileBg: 'from-pink-900/60 via-rose-950/80 to-pink-900/70',
    tileEmptyBg: 'bg-pink-950/40 hover:bg-pink-900/30 border-dashed border-pink-500/20',
    grassAccent: '#f472b6',
    soilColor: '#4c1d38',
  },
  cyber: {
    icon: '🌌',
    groundBg: 'from-indigo-950/80 via-slate-950/95 to-cyan-950/80',
    tileBorder: 'border-cyan-500/40',
    tileBg: 'from-cyan-950/70 via-indigo-950/80 to-purple-950/70',
    tileEmptyBg: 'bg-cyan-950/30 hover:bg-cyan-900/20 border-dashed border-cyan-500/30',
    grassAccent: '#06b6d4',
    soilColor: '#0f172a',
  },
  oasis: {
    icon: '🌴',
    groundBg: 'from-yellow-950/60 via-slate-900/90 to-teal-950/80',
    tileBorder: 'border-teal-500/30',
    tileBg: 'from-teal-900/60 via-emerald-950/80 to-teal-900/70',
    tileEmptyBg: 'bg-teal-950/40 hover:bg-teal-900/30 border-dashed border-teal-500/20',
    grassAccent: '#14b8a6',
    soilColor: '#78350f',
  },
};

export const GardenLandModal: React.FC<GardenLandModalProps> = ({
  isOpen,
  trees,
  onClose,
  onClearHistory,
  onPlantDemoTree,
  lang = 'uz',
}) => {
  const [viewMode, setViewMode] = useState<'land' | 'list'>('land');
  const [biome, setBiome] = useState<BiomeType>('meadow');
  const [weather, setWeather] = useState<WeatherMode>('sunny');
  const [selectedTree, setSelectedTree] = useState<PlantedTree | null>(null);
  const [isWatering, setIsWatering] = useState<boolean>(false);
  const [filter, setFilter] = useState<'all' | 'alive' | 'withered'>('all');

  if (!isOpen) return null;

  const t = TRANSLATIONS[lang] || TRANSLATIONS.uz;
  const currentBiomeStyle = BIOME_CONFIGS[biome];
  const currentBiomeText = t.garden.biomes[biome] || t.garden.biomes.meadow;

  // Stats calculation
  const totalTrees = trees.length;
  const aliveTrees = trees.filter((t) => t.status === 'alive').length;
  const witheredTrees = trees.filter((t) => t.status === 'withered').length;
  const totalFocusMinutes = trees.reduce((acc, t) => acc + (t.status === 'alive' ? t.minutesFocused : 0), 0);
  const successRate = totalTrees > 0 ? Math.round((aliveTrees / totalTrees) * 100) : 100;

  // Grid dimensions
  const totalPlots = Math.max(16, Math.min(36, Math.ceil((totalTrees + 4) / 4) * 4));

  const filteredTrees = trees.filter((t) => {
    if (filter === 'alive' && t.status !== 'alive') return false;
    if (filter === 'withered' && t.status !== 'withered') return false;
    return true;
  });

  const handleWaterGarden = () => {
    setIsWatering(true);
    try {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#38bdf8', '#0284c7', '#67e8f9', '#a7f3d0'],
      });
    } catch {}

    setTimeout(() => {
      setIsWatering(false);
    }, 2500);
  };

  const handleAddDemo = () => {
    if (onPlantDemoTree) {
      const speciesList: TreeSpecies[] = ['apple', 'pine', 'sakura', 'oak', 'bamboo', 'palm'];
      const randomSpecies = speciesList[Math.floor(Math.random() * speciesList.length)];
      const sampleTasks =
        lang === 'en'
          ? ['Algorithm problem solving', 'WebGL 3D Shader', 'React Architecture', 'IELTS Reading', 'Physics assignment']
          : lang === 'ru'
          ? ['Алгоритмы и структуры', 'WebGL 3D шейдер', 'Архитектура React', 'Подготовка к экзамену', 'Чтение литературы']
          : ['Matematika tahlili', 'Dasturlash darsi', 'Kitob mutolaasi', 'Ingliz tili IELTS', 'Fizika masalalari'];
      const randomTask = sampleTasks[Math.floor(Math.random() * sampleTasks.length)];
      onPlantDemoTree(randomSpecies, 25, randomTask);
    }
  };

  const localeCode = lang === 'en' ? 'en-US' : lang === 'ru' ? 'ru-RU' : 'uz-UZ';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-slate-900/95 border border-emerald-500/30 rounded-3xl p-4 sm:p-6 flex flex-col shadow-2xl overflow-hidden">
        {/* Atmosphere background lights */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-teal-500/10 blur-3xl" />
          {weather === 'rain' && (
            <div className="absolute inset-0 bg-blue-950/20 mix-blend-overlay animate-pulse" />
          )}
          {weather === 'night' && (
            <div className="absolute inset-0 bg-indigo-950/40 mix-blend-multiply" />
          )}
        </div>

        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-green-500 text-white flex items-center justify-center text-2xl shadow-lg shadow-emerald-600/30 border border-white/20">
              🌲
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight">
                  {t.garden.title}
                </h2>
                <span className="text-xs px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                  {t.garden.aliveCountBadge.replace('{count}', String(aliveTrees))}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {t.garden.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle (Yerlar / Ro'yxat) */}
            <div className="flex items-center bg-slate-950/80 p-1 rounded-2xl border border-slate-800">
              <button
                type="button"
                onClick={() => setViewMode('land')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  viewMode === 'land'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.garden.view3D}</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  viewMode === 'list'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Grid3X3 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.garden.viewGallery}</span>
              </button>
            </div>

            <button
              id="close-garden-modal-btn"
              type="button"
              onClick={onClose}
              className="p-2.5 rounded-2xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors border border-transparent hover:border-white/10"
              title={t.actions.close}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-3 relative z-10">
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col">
            <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
              <TreePine className="w-3.5 h-3.5" /> {t.garden.aliveTreesStat}
            </span>
            <span className="text-xl sm:text-2xl font-black text-emerald-300 mt-0.5">
              {aliveTrees}
            </span>
            <span className="text-[10px] text-slate-400">{t.garden.aliveTreesDesc}</span>
          </div>

          <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex flex-col">
            <span className="text-[11px] text-rose-400 font-bold flex items-center gap-1">
              <AlertOctagon className="w-3.5 h-3.5" /> {t.garden.witheredStat}
            </span>
            <span className="text-xl sm:text-2xl font-black text-rose-300 mt-0.5">
              {witheredTrees}
            </span>
            <span className="text-[10px] text-slate-400">{t.garden.witheredDesc}</span>
          </div>

          <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex flex-col">
            <span className="text-[11px] text-blue-400 font-bold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {t.garden.focusTimeStat}
            </span>
            <span className="text-xl sm:text-2xl font-black text-blue-300 mt-0.5">
              {totalFocusMinutes} m
            </span>
            <span className="text-[10px] text-slate-400">
              {t.garden.focusTimeDesc.replace('{hours}', (totalFocusMinutes / 60).toFixed(1))}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col">
            <span className="text-[11px] text-amber-400 font-bold flex items-center gap-1">
              <Award className="w-3.5 h-3.5" /> {t.garden.gardenYieldStat}
            </span>
            <span className="text-xl sm:text-2xl font-black text-amber-300 mt-0.5">
              {successRate}%
            </span>
            <span className="text-[10px] text-slate-400">{t.garden.gardenYieldDesc}</span>
          </div>
        </div>

        {/* Biome & Interactive Land Controls Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3 border-b border-white/5 relative z-10">
          {/* Biome Selectors */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none max-w-full">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1 mr-1">
              <Compass className="w-3.5 h-3.5 text-indigo-400" /> {t.garden.landTypeLabel}
            </span>
            {(Object.keys(BIOME_CONFIGS) as BiomeType[]).map((bKey) => {
              const bStyle = BIOME_CONFIGS[bKey];
              const bText = t.garden.biomes[bKey] || t.garden.biomes.meadow;
              const isSel = biome === bKey;
              return (
                <button
                  key={bKey}
                  type="button"
                  onClick={() => setBiome(bKey)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isSel
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 scale-105 ring-1 ring-white/30'
                      : 'bg-slate-800/70 hover:bg-slate-700/70 text-slate-300 border border-slate-700/60'
                  }`}
                >
                  <span>{bStyle.icon}</span>
                  <span>{bText.name}</span>
                </button>
              );
            })}
          </div>

          {/* Interactive Actions (Water, Weather, Demo Tree) */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Water Garden Button */}
            <button
              type="button"
              onClick={handleWaterGarden}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md active:scale-95 ${
                isWatering
                  ? 'bg-cyan-500 text-white animate-bounce'
                  : 'bg-cyan-950/80 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-500/40'
              }`}
              title={t.garden.waterBtn}
            >
              <Droplets className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>{isWatering ? t.garden.wateringStatus : t.garden.waterBtn}</span>
            </button>

            {/* Weather toggle */}
            <button
              type="button"
              onClick={() => {
                setWeather((prev) => (prev === 'sunny' ? 'rain' : prev === 'rain' ? 'night' : 'sunny'));
              }}
              className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-amber-300 border border-slate-700 transition"
              title={t.garden.weatherTooltip}
            >
              {weather === 'sunny' && <Sun className="w-4 h-4 text-amber-400" />}
              {weather === 'rain' && <Droplets className="w-4 h-4 text-cyan-400" />}
              {weather === 'night' && <Moon className="w-4 h-4 text-indigo-400" />}
            </button>

            {/* Quick Demo Tree Plant */}
            {onPlantDemoTree && (
              <button
                type="button"
                onClick={handleAddDemo}
                className="px-3 py-1.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 text-xs font-bold transition flex items-center gap-1 active:scale-95"
                title={t.garden.plantTreeBtn}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.garden.plantTreeBtn}</span>
              </button>
            )}
          </div>
        </div>

        {/* MAIN DISPLAY: 3D Isometric Garden Land Plots OR List Gallery */}
        <div className="flex-1 overflow-y-auto pr-1 py-3 relative z-10">
          {viewMode === 'land' ? (
            /* 3D Isometric Garden Land View */
            <div className="flex flex-col gap-4">
              {/* Land Environment Header note */}
              <div className="flex items-center justify-between px-2 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <strong>{currentBiomeText.name}:</strong> {currentBiomeText.description}
                </span>
                <span className="font-mono text-[11px] text-emerald-400">
                  {trees.length} / {totalPlots} {t.garden.landOccupiedBadge}
                </span>
              </div>

              {/* ISOMETRIC LAND TILES GRID */}
              <div
                className={`w-full p-4 sm:p-8 rounded-3xl bg-gradient-to-b ${currentBiomeStyle.groundBg} border ${currentBiomeStyle.tileBorder} shadow-2xl backdrop-blur-2xl relative overflow-hidden`}
              >
                {/* Land plot isometric grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                  {Array.from({ length: totalPlots }).map((_, index) => {
                    const tree = trees[index];
                    const isOccupied = !!tree;
                    const isAlive = tree?.status === 'alive';
                    const info = tree ? SPECIES_INFO[tree.species] || SPECIES_INFO.apple : null;
                    const spLocalizedName =
                      tree && (t.speciesNames?.[tree.species]?.shortName || info?.name.split(' ')[0]);

                    if (isOccupied && tree && info) {
                      const isSelected = selectedTree?.id === tree.id;
                      return (
                        <div
                          key={tree.id}
                          onClick={() => setSelectedTree(tree)}
                          className={`group relative aspect-square rounded-2xl p-2 flex flex-col items-center justify-between cursor-pointer transition-all duration-300 hover:scale-105 border ${
                            isSelected
                              ? 'ring-2 ring-emerald-400 border-white shadow-xl shadow-emerald-500/40 scale-105'
                              : isAlive
                              ? `bg-gradient-to-b ${currentBiomeStyle.tileBg} ${currentBiomeStyle.tileBorder} hover:border-emerald-400 shadow-md`
                              : 'bg-gradient-to-b from-rose-950/50 to-slate-900/90 border-rose-500/40 opacity-85'
                          }`}
                        >
                          {/* Soil Land Texture */}
                          <div className="absolute inset-x-2 bottom-2 h-4 rounded-xl bg-amber-950/40 border-t border-white/5 pointer-events-none" />

                          {/* Plot Coordinate Badge */}
                          <div className="w-full flex items-center justify-between text-[9px] font-mono text-slate-400 px-1">
                            <span className="opacity-60">#{index + 1}</span>
                            {isAlive ? (
                              <span className="text-emerald-400 font-bold">+{tree.minutesFocused}m</span>
                            ) : (
                              <span className="text-rose-400 font-bold">{t.garden.witheredTag}</span>
                            )}
                          </div>

                          {/* 3D Tree Visual */}
                          <div className="relative my-auto flex items-center justify-center">
                            {isAlive ? (
                              <div className="text-4xl sm:text-5xl filter drop-shadow-xl transform group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300">
                                {info.icon}
                              </div>
                            ) : (
                              <div className="text-3xl sm:text-4xl filter grayscale opacity-70 transform group-hover:scale-110 transition-all">
                                🥀
                              </div>
                            )}

                            {/* Tree roots & soil shadow */}
                            <div className="absolute -bottom-1 w-8 h-2 bg-black/40 rounded-full blur-[1px] pointer-events-none" />
                          </div>

                          {/* Tree Name / Task Label */}
                          <div className="w-full text-center">
                            <p className="text-[11px] font-bold text-white truncate max-w-full">
                              {isAlive ? spLocalizedName : t.garden.witheredTag}
                            </p>
                          </div>
                        </div>
                      );
                    }

                    // Empty Available Land Plot
                    return (
                      <div
                        key={`empty-plot-${index}`}
                        onClick={handleAddDemo}
                        className={`aspect-square rounded-2xl p-2 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:scale-102 ${currentBiomeStyle.tileEmptyBg} group`}
                        title={t.garden.emptyPlotTooltip}
                      >
                        <span className="text-xl sm:text-2xl opacity-40 group-hover:opacity-100 group-hover:scale-125 transition-all text-emerald-400">
                          🌱
                        </span>
                        <span className="text-[10px] font-bold text-slate-500 group-hover:text-emerald-300 mt-1">
                          {t.garden.plotNumber.replace('{index}', String(index + 1))}
                        </span>
                        <span className="text-[8px] text-slate-600 group-hover:text-slate-400 text-center">
                          {t.garden.emptySoil}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Selected Tree Passport Modal / Card */}
              {selectedTree && (
                <div className="p-4 rounded-2xl bg-slate-950/90 border border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-3xl shadow-inner">
                      {selectedTree.status === 'alive'
                        ? SPECIES_INFO[selectedTree.species]?.icon || '🌳'
                        : '🥀'}
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white text-sm sm:text-base">
                          {selectedTree.status === 'alive'
                            ? t.speciesNames?.[selectedTree.species]?.name || selectedTree.name
                            : t.garden.witheredTreeName}
                        </h4>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            selectedTree.status === 'alive'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {selectedTree.status === 'alive' ? t.garden.aliveMaturedTag : t.garden.witheredTag}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-0.5">
                        {selectedTree.taskTitle ? `"${selectedTree.taskTitle}"` : t.garden.focusSessionDefault} •{' '}
                        <strong>{selectedTree.minutesFocused}m</strong> {t.garden.minutesFocusTag.replace('{mins}', String(selectedTree.minutesFocused))}
                      </p>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                        {t.garden.plantedAtLabel} {new Date(selectedTree.plantedAt).toLocaleString(localeCode)}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedTree(null)}
                    className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
                  >
                    {t.actions.close}
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Gallery List View */
            <div className="flex flex-col gap-3">
              {/* Filter Tabs */}
              <div className="flex items-center gap-2 bg-slate-950/70 p-1 rounded-2xl border border-slate-800 w-fit text-xs">
                <button
                  type="button"
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1 rounded-xl font-bold transition ${
                    filter === 'all' ? 'bg-emerald-500 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t.garden.filterAll} ({totalTrees})
                </button>
                <button
                  type="button"
                  onClick={() => setFilter('alive')}
                  className={`px-3 py-1 rounded-xl font-bold transition ${
                    filter === 'alive' ? 'bg-emerald-500 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🌲 {t.garden.filterAlive} ({aliveTrees})
                </button>
                <button
                  type="button"
                  onClick={() => setFilter('withered')}
                  className={`px-3 py-1 rounded-xl font-bold transition ${
                    filter === 'withered' ? 'bg-rose-500 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🥀 {t.garden.filterWithered} ({witheredTrees})
                </button>
              </div>

              {filteredTrees.length === 0 ? (
                <div className="h-48 flex flex-col items-center justify-center text-center p-6 border border-dashed border-white/10 rounded-2xl bg-slate-900/40">
                  <div className="text-4xl mb-2">🌱</div>
                  <h4 className="text-base font-bold text-white">{t.garden.noTreesTitle}</h4>
                  <p className="text-xs text-slate-400 max-w-sm mt-1">
                    {t.garden.noTreesDesc}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {filteredTrees.map((tItem) => {
                    const info = SPECIES_INFO[tItem.species] || SPECIES_INFO.apple;
                    const isAlive = tItem.status === 'alive';
                    const localizedSpName = t.speciesNames?.[tItem.species]?.name || info.name;
                    const dateStr = new Date(tItem.plantedAt).toLocaleDateString(localeCode, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    });

                    return (
                      <div
                        key={tItem.id}
                        className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all hover:scale-[1.02] ${
                          isAlive
                            ? 'bg-slate-950/70 border-emerald-500/30'
                            : 'bg-slate-950/70 border-rose-500/30 opacity-80'
                        }`}
                      >
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-slate-900 border border-white/5 shrink-0 shadow-inner">
                          {isAlive ? info.icon : '🥀'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-white truncate">
                            {isAlive ? localizedSpName : t.garden.witheredTreeName}
                          </p>
                          <p className="text-[11px] text-slate-400 truncate">
                            {tItem.taskTitle || t.garden.focusSessionDefault}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500">
                            <span>+{tItem.minutesFocused} min</span>
                            <span>•</span>
                            <span>{dateStr}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer info & Actions */}
        <div className="mt-3 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-bold">🌱 {t.garden.ruleTitle}</span>
            <span>{t.garden.ruleDesc}</span>
          </div>

          <div className="flex items-center gap-2">
            {totalTrees > 0 && (
              <button
                type="button"
                onClick={() => {
                  if (confirm(t.garden.clearConfirm)) {
                    onClearHistory();
                  }
                }}
                className="px-3 py-1.5 rounded-xl text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 text-xs font-semibold transition flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{t.garden.clearHistoryBtn}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition active:scale-95"
            >
              {t.actions.close}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


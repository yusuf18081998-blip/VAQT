import React, { useState, useMemo } from 'react';
import { PlantedTree, TreeSpecies } from '../types';
import { SPECIES_INFO } from './FocusTreeVisualizer';
import { X, Trash2, Award, TreePine, AlertOctagon, Clock, Calendar, CheckCircle2, Flame, RefreshCw } from 'lucide-react';

interface ForestGardenModalProps {
  isOpen: boolean;
  trees: PlantedTree[];
  onClose: () => void;
  onClearHistory: () => void;
}

export const ForestGardenModal: React.FC<ForestGardenModalProps> = ({
  isOpen,
  trees,
  onClose,
  onClearHistory,
}) => {
  const [filter, setFilter] = useState<'all' | 'alive' | 'withered'>('all');
  const [selectedSpecies, setSelectedSpecies] = useState<string>('all');

  if (!isOpen) return null;

  // Stats calculation
  const totalTrees = trees.length;
  const aliveTrees = trees.filter((t) => t.status === 'alive').length;
  const witheredTrees = trees.filter((t) => t.status === 'withered').length;
  const totalFocusMinutes = trees.reduce((acc, t) => acc + (t.status === 'alive' ? t.minutesFocused : 0), 0);
  const successRate = totalTrees > 0 ? Math.round((aliveTrees / totalTrees) * 100) : 100;

  const filteredTrees = trees.filter((t) => {
    if (filter === 'alive' && t.status !== 'alive') return false;
    if (filter === 'withered' && t.status !== 'withered') return false;
    if (selectedSpecies !== 'all' && t.species !== selectedSpecies) return false;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900/95 border border-white/10 rounded-3xl p-6 flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-xl">
              🌲
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Mening Bogʻim & Oʻrmonim
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
                  {aliveTrees} ta daraxt
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Fokuslangan darslaringiz natijasida oʻstirilgan goʻzal oʻrmon
              </p>
            </div>
          </div>
          <button
            id="close-forest-modal-btn"
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col">
            <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
              <TreePine className="w-3.5 h-3.5" /> Yashil Daraxtlar
            </span>
            <span className="text-2xl font-bold text-emerald-300 mt-1">{aliveTrees}</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Muvaffaqiyatli darslar</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex flex-col">
            <span className="text-xs text-rose-400 font-medium flex items-center gap-1">
              <AlertOctagon className="w-3.5 h-3.5" /> Qurigan Daraxtlar
            </span>
            <span className="text-2xl font-bold text-rose-300 mt-1">{witheredTrees}</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Ilovadan chiqilgan</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex flex-col">
            <span className="text-xs text-blue-400 font-medium flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Toza Fokus Vaqti
            </span>
            <span className="text-2xl font-bold text-blue-300 mt-1">{totalFocusMinutes} min</span>
            <span className="text-[10px] text-slate-400 mt-0.5">{(totalFocusMinutes / 60).toFixed(1)} soat toʻliq dars</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col">
            <span className="text-xs text-amber-400 font-medium flex items-center gap-1">
              <Award className="w-3.5 h-3.5" /> Fokus Darajasi
            </span>
            <span className="text-2xl font-bold text-amber-300 mt-1">{successRate}%</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Muvaffaqiyat unumi</span>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3 px-1">
          <div className="flex items-center gap-1.5 bg-slate-800/60 p-1 rounded-xl border border-slate-700/60 text-xs">
            <button
              id="filter-all-trees"
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                filter === 'all' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Barchasi ({totalTrees})
            </button>
            <button
              id="filter-alive-trees"
              type="button"
              onClick={() => setFilter('alive')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                filter === 'alive' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              🌲 Yashillar ({aliveTrees})
            </button>
            <button
              id="filter-withered-trees"
              type="button"
              onClick={() => setFilter('withered')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                filter === 'withered' ? 'bg-rose-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              🥀 Quriganlar ({witheredTrees})
            </button>
          </div>

          {totalTrees > 0 && (
            <button
              id="clear-trees-history-btn"
              type="button"
              onClick={() => {
                if (window.confirm("Barcha ekilgan daraxtlar tarixini tozalashni xohlaysizmi?")) {
                  onClearHistory();
                }
              }}
              className="text-xs flex items-center gap-1 text-slate-400 hover:text-rose-400 px-3 py-1.5 rounded-xl hover:bg-rose-500/10 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> Bogʻni tozalash
            </button>
          )}
        </div>

        {/* Trees Grid / Forest Canvas */}
        <div className="flex-1 overflow-y-auto pr-1">
          {filteredTrees.length === 0 ? (
            <div className="h-60 flex flex-col items-center justify-center text-center p-6 border border-dashed border-white/10 rounded-2xl bg-slate-900/40">
              <div className="text-4xl mb-2">🌱</div>
              <h3 className="text-base font-semibold text-white">Hozircha daraxtlar yoʻq</h3>
              <p className="text-xs text-slate-400 max-w-sm mt-1">
                Pomodoro dars taymerini boshlang va boshqa ilovalarga chiqmasdan toʻliq oʻtiring. Dars yakunida bogʻingizda yangi daraxt qad koʻtaradi!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {filteredTrees.map((tree) => {
                const info = SPECIES_INFO[tree.species] || SPECIES_INFO.apple;
                const isAlive = tree.status === 'alive';
                const dateStr = new Date(tree.plantedAt).toLocaleDateString('uz-UZ', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <div
                    key={tree.id}
                    className={`relative p-3.5 rounded-2xl border flex flex-col items-center text-center transition-all hover:scale-[1.02] ${
                      isAlive
                        ? 'bg-gradient-to-b from-emerald-950/40 to-slate-900/80 border-emerald-500/30'
                        : 'bg-gradient-to-b from-rose-950/30 to-slate-900/80 border-rose-500/30 opacity-80'
                    }`}
                  >
                    {/* Tree Icon / Visual */}
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-2 bg-slate-800/60 border border-white/5 shadow-inner">
                      {isAlive ? info.icon : '🥀'}
                    </div>

                    <span className="text-sm font-semibold text-white truncate max-w-full">
                      {isAlive ? info.name : 'Qurigan Daraxt'}
                    </span>

                    <span
                      className={`text-[11px] font-medium px-2 py-0.5 rounded-full mt-1 ${
                        isAlive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                      }`}
                    >
                      {isAlive ? `+${tree.minutesFocused} daqiqa fokus` : 'Qurib qoldi'}
                    </span>

                    {tree.taskTitle && (
                      <span className="text-[10px] text-slate-400 mt-1 truncate max-w-full italic">
                        "{tree.taskTitle}"
                      </span>
                    )}

                    <div className="w-full mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {dateStr}
                      </span>
                      <span>{isAlive ? '✅ Yetildi' : '⚠️ Chiqildi'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer info note */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="text-emerald-400">💡 Qoida:</span> Dars vaqtida brauzer varagʻi yoki ilovadan chiqsangiz, daraxtingiz quriy boshlaydi!
          </span>
          <button
            id="forest-modal-done-btn"
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-medium transition-all shadow-md active:scale-95"
          >
            Tushunarli
          </button>
        </div>
      </div>
    </div>
  );
};

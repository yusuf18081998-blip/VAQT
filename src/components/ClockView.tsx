import React, { useState, useEffect } from 'react';
import {
  Compass,
  Monitor,
  Globe,
  Plus,
  Trash2,
  Search,
  MapPin,
  RefreshCw,
  Sun,
  Moon,
  Sparkles,
  Check,
  X,
  SlidersHorizontal,
} from 'lucide-react';
import { ALL_WORLD_CITIES, REGION_LABELS, WorldCityData } from '../data/worldCities';
import { UserLocationInfo, requestGpsLocation, detectTimezoneLocation } from '../utils/locationService';

const INITIAL_SELECTED_CITY_IDS = [
  'tashkent',
  'samarkand',
  'mecca',
  'medina',
  'istanbul',
  'dubai',
  'london',
  'newyork',
  'tokyo',
  'seoul',
  'berlin',
  'paris',
];

const UZBEK_MONTHS = [
  'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
  'Iyul', 'Avgust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'
];

const UZBEK_WEEKDAYS = [
  'Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'
];

interface ClockViewProps {
  userLocation: UserLocationInfo;
  onUpdateLocation: (loc: UserLocationInfo) => void;
}

export const ClockView: React.FC<ClockViewProps> = ({ userLocation, onUpdateLocation }) => {
  const [time, setTime] = useState<Date>(new Date());
  const [is24Hour, setIs24Hour] = useState<boolean>(true);
  const [isAnalog, setIsAnalog] = useState<boolean>(false);
  const [selectedCities, setSelectedCities] = useState<WorldCityData[]>(() => {
    try {
      const saved = localStorage.getItem('vaqt_selected_world_cities');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return ALL_WORLD_CITIES.filter((c) => INITIAL_SELECTED_CITY_IDS.includes(c.id));
  });

  const [showAddCityModal, setShowAddCityModal] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationToast, setLocationToast] = useState<string | null>(null);

  // Har soniyada vaqtni yangilash
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const saveSelectedCities = (cities: WorldCityData[]) => {
    setSelectedCities(cities);
    try {
      localStorage.setItem('vaqt_selected_world_cities', JSON.stringify(cities));
    } catch {}
  };

  const handleAddCity = (city: WorldCityData) => {
    if (!selectedCities.some((c) => c.id === city.id)) {
      const updated = [...selectedCities, city];
      saveSelectedCities(updated);
    }
  };

  const handleRemoveCity = (id: string) => {
    const updated = selectedCities.filter((c) => c.id !== id);
    saveSelectedCities(updated);
  };

  // GPS joylashuvni aniqlash
  const handleDetectLocation = async () => {
    setIsLocating(true);
    try {
      const loc = await requestGpsLocation();
      onUpdateLocation(loc);
      setLocationToast(`📍 Joylashuvingiz aniqlandi: ${loc.city}, ${loc.country}`);
      setTimeout(() => setLocationToast(null), 4000);
    } catch {
      const loc = detectTimezoneLocation();
      onUpdateLocation(loc);
    } finally {
      setIsLocating(false);
    }
  };

  // Foydalanuvchi joylashgan hudud bo'yicha soatni hisoblash
  const userTz = userLocation?.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Tashkent';

  // Format hours
  let displayHours = time.getHours();
  let ampm = '';

  // Agar maxsus timezone bo'lsa, o'sha timezoneda soat va daqiqani olish
  let localHourStr = '';
  let localMinStr = '';
  let localSecStr = '';
  let localDayName = '';
  let localDateStr = '';

  try {
    const parts = new Intl.DateTimeFormat('uz-UZ', {
      timeZone: userTz,
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: !is24Hour,
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).formatToParts(time);

    let h = 0;
    let m = '00';
    let s = '00';
    let p = '';
    let day = '';
    let month = '';
    let year = '';
    let weekday = '';

    parts.forEach((pt) => {
      if (pt.type === 'hour') h = parseInt(pt.value, 10);
      if (pt.type === 'minute') m = pt.value;
      if (pt.type === 'second') s = pt.value;
      if (pt.type === 'dayPeriod') p = pt.value.toUpperCase();
      if (pt.type === 'weekday') weekday = pt.value;
      if (pt.type === 'day') day = pt.value;
      if (pt.type === 'month') month = pt.value;
      if (pt.type === 'year') year = pt.value;
    });

    localHourStr = String(h).padStart(2, '0');
    localMinStr = m;
    localSecStr = s;
    ampm = p;
    localDayName = weekday || UZBEK_WEEKDAYS[time.getDay()];
    localDateStr = `${day} ${month}, ${year}-yil`;
  } catch {
    if (!is24Hour) {
      ampm = displayHours >= 12 ? 'PM' : 'AM';
      displayHours = displayHours % 12 || 12;
    }
    localHourStr = String(displayHours).padStart(2, '0');
    localMinStr = String(time.getMinutes()).padStart(2, '0');
    localSecStr = String(time.getSeconds()).padStart(2, '0');
    localDayName = UZBEK_WEEKDAYS[time.getDay()];
    localDateStr = `${time.getDate()}-${UZBEK_MONTHS[time.getMonth()]}, ${time.getFullYear()}-yil`;
  }

  // Analog hands angles
  const secDeg = (time.getSeconds() / 60) * 360;
  const minDeg = ((time.getMinutes() + time.getSeconds() / 60) / 60) * 360;
  const hourDeg = (((time.getHours() % 12) + time.getMinutes() / 60) / 12) * 360;

  // Filter qilingan shaharlar
  const filteredCitiesToAdd = ALL_WORLD_CITIES.filter((c) => {
    const matchesRegion = selectedRegion === 'all' || c.region === selectedRegion;
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.timeZone.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRegion && matchesSearch;
  });

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-in">
      {/* Joylashuv bildirishnomasi */}
      {locationToast && (
        <div className="fixed top-5 right-5 z-50 p-4 rounded-2xl bg-emerald-950/90 border border-emerald-500/50 shadow-2xl text-emerald-200 text-xs font-semibold flex items-center gap-3 backdrop-blur-xl animate-fade-in">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
            <MapPin className="w-4 h-4" />
          </div>
          <span>{locationToast}</span>
        </div>
      )}

      {/* Asosiy Soat Kartasi */}
      <div className="relative rounded-3xl backdrop-blur-2xl bg-white/30 dark:bg-slate-900/40 border border-white/40 dark:border-white/10 shadow-2xl p-6 sm:p-10 flex flex-col items-center justify-center text-center overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-indigo-500/15 dark:bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-purple-500/15 dark:bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Joylashuv va Sozlamalar Boshqaruv Qatori */}
        <div className="w-full flex flex-wrap items-center justify-between gap-3 mb-6 z-10">
          {/* Joylashuv statusi */}
          <div className="flex items-center gap-2 bg-slate-900/40 dark:bg-slate-800/60 border border-white/10 px-3.5 py-1.5 rounded-full text-xs font-medium backdrop-blur-md">
            <span className="text-sm">{userLocation.flag || '📍'}</span>
            <span className="text-slate-200 font-bold">
              {userLocation.city}, {userLocation.country}
            </span>
            <button
              onClick={handleDetectLocation}
              disabled={isLocating}
              title="GPS orqali joylashuvni aniqlash"
              className="ml-1 p-1 rounded-full hover:bg-white/10 text-indigo-400 hover:text-indigo-300 transition-all flex items-center gap-1"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
              <span className="text-[10px] hidden sm:inline">Aniqlash</span>
            </button>
          </div>

          {/* Format va Rejim tugmalari */}
          <div className="flex items-center gap-2">
            <button
              id="toggleFormatBtn"
              onClick={() => setIs24Hour(!is24Hour)}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/50 dark:bg-slate-800/60 border border-slate-300/60 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-all shadow-sm"
            >
              {is24Hour ? '24 Soatlik' : '12 Soatlik (AM/PM)'}
            </button>

            <button
              id="toggleAnalogBtn"
              onClick={() => setIsAnalog(!isAnalog)}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/50 dark:bg-slate-800/60 border border-slate-300/60 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-all shadow-sm flex items-center gap-1.5"
            >
              {isAnalog ? (
                <>
                  <Monitor className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Raqamli</span>
                </>
              ) : (
                <>
                  <Compass className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Analog</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Display Content */}
        {!isAnalog ? (
          <div className="flex flex-col items-center z-10">
            {/* Raqamli Vaqt */}
            <div className="flex items-baseline justify-center font-mono tracking-tight text-slate-900 dark:text-white font-bold select-none text-5xl sm:text-7xl md:text-8xl drop-shadow-sm">
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
                {localHourStr}
              </span>
              <span className="text-indigo-500 animate-pulse px-1">:</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
                {localMinStr}
              </span>
              <span className="text-indigo-500 animate-pulse px-1">:</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                {localSecStr}
              </span>
              {ampm && (
                <span className="ml-3 text-lg sm:text-2xl font-sans font-extrabold text-purple-600 dark:text-purple-400">
                  {ampm}
                </span>
              )}
            </div>

            {/* Sana va Hudud */}
            <div className="mt-4 text-sm sm:text-base font-medium text-slate-600 dark:text-slate-300 flex flex-wrap items-center justify-center gap-2">
              <span className="px-3 py-1 rounded-lg bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-semibold border border-indigo-500/20">
                {localDayName}
              </span>
              <span>{localDateStr}</span>
              <span className="text-xs text-slate-400 font-mono">({userTz})</span>
            </div>
          </div>
        ) : (
          /* Analog Clock */
          <div className="flex flex-col items-center z-10 py-4">
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full border-4 border-slate-300/70 dark:border-white/20 bg-gradient-to-br from-white/60 to-white/20 dark:from-slate-800/60 dark:to-slate-900/40 shadow-inner flex items-center justify-center backdrop-blur-md">
              <span className="absolute top-2 text-xs font-bold text-slate-400 dark:text-slate-500 font-mono">12</span>
              <span className="absolute right-3 text-xs font-bold text-slate-400 dark:text-slate-500 font-mono">3</span>
              <span className="absolute bottom-2 text-xs font-bold text-slate-400 dark:text-slate-500 font-mono">6</span>
              <span className="absolute left-3 text-xs font-bold text-slate-400 dark:text-slate-500 font-mono">9</span>

              <div className="w-3.5 h-3.5 rounded-full bg-indigo-500 border-2 border-white dark:border-slate-900 z-30 shadow-md"></div>

              <div
                className="absolute w-1.5 h-16 bg-slate-800 dark:text-white dark:bg-slate-200 rounded-full origin-bottom z-10 shadow-sm"
                style={{
                  top: 'calc(50% - 64px)',
                  left: 'calc(50% - 3px)',
                  transform: `rotate(${hourDeg}deg)`,
                }}
              ></div>

              <div
                className="absolute w-1 h-22 bg-indigo-600 dark:bg-indigo-400 rounded-full origin-bottom z-20 shadow-sm"
                style={{
                  top: 'calc(50% - 88px)',
                  left: 'calc(50% - 2px)',
                  transform: `rotate(${minDeg}deg)`,
                }}
              ></div>

              <div
                className="absolute w-0.5 h-24 bg-rose-500 rounded-full origin-bottom z-20"
                style={{
                  top: 'calc(50% - 96px)',
                  left: 'calc(50% - 1px)',
                  transform: `rotate(${secDeg}deg)`,
                }}
              ></div>
            </div>

            <div className="mt-4 font-mono text-sm font-semibold text-slate-600 dark:text-slate-300">
              {localHourStr}:{localMinStr}:{localSecStr} {ampm}
            </div>
          </div>
        )}
      </div>

      {/* Dunyo Shaharlari Vaqtlari Bo'limi */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base">
                Butun Dunyo Shaharlari Soatlari ({selectedCities.length})
              </h3>
              <p className="text-xs text-slate-400">Dunyoning istalgan davlati va shahrini qoʻshing</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="addCityModalOpenBtn"
              onClick={() => setShowAddCityModal(true)}
              className="flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>Yangi Shahar Qoʻshish</span>
            </button>
          </div>
        </div>

        {/* Tanlangan Dunyo Shaharlari Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {selectedCities.map((city) => {
            let cityTimeStr = '--:--:--';
            let cityDateStr = '';
            let isDayTime = true;

            try {
              const formattedTime = new Intl.DateTimeFormat('uz-UZ', {
                timeZone: city.timeZone,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
              }).format(time);

              cityTimeStr = formattedTime;

              const hourNum = parseInt(formattedTime.split(':')[0], 10);
              isDayTime = hourNum >= 6 && hourNum < 19;

              cityDateStr = new Intl.DateTimeFormat('uz-UZ', {
                timeZone: city.timeZone,
                month: 'short',
                day: 'numeric',
              }).format(time);
            } catch (e) {}

            return (
              <div
                key={city.id}
                className="group relative rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-slate-900/60 border border-white/40 dark:border-white/10 p-4 shadow-sm hover:shadow-xl transition-all hover:translate-y-[-2px] flex flex-col justify-between"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl drop-shadow">{city.flag}</span>
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-100 text-sm block">
                        {city.name}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                        {city.country}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-xs p-1 rounded-lg ${
                        isDayTime
                          ? 'text-amber-400 bg-amber-400/10'
                          : 'text-indigo-300 bg-indigo-900/30'
                      }`}
                      title={isDayTime ? 'Kunduz' : 'Kecha'}
                    >
                      {isDayTime ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                    </span>

                    {selectedCities.length > 1 && (
                      <button
                        onClick={() => handleRemoveCity(city.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 transition-all"
                        title="Oʻchirish"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex items-baseline justify-between border-t border-slate-200/50 dark:border-white/5 pt-2.5">
                  <span className="font-mono text-xl sm:text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                    {cityTimeStr}
                  </span>
                  <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    {cityDateStr}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dunyo Shahri Qo'shish Modali */}
      {showAddCityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-2xl rounded-3xl bg-slate-900/95 border border-slate-800 shadow-2xl p-5 sm:p-7 max-h-[90vh] flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base sm:text-lg">
                    Dunyo Shaharlari Katalogi ({ALL_WORLD_CITIES.length}+ shahar)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Qidiruv yoki qitʼalar orqali istalgan shaharni qoʻshing
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddCityModal(false)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Qidiruv Maydoni */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Shahar yoki mamlakat nomini yozing (masalan: Toshkent, Parij, Nyu-York...)"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Qit'alar bo'yicha filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {Object.entries(REGION_LABELS).map(([regKey, regLabel]) => (
                <button
                  key={regKey}
                  onClick={() => setSelectedRegion(regKey)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedRegion === regKey
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {regLabel}
                </button>
              ))}
            </div>

            {/* Shaharlar ro'yxati */}
            <div className="flex-1 max-h-96 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2 pr-1 scrollbar-thin">
              {filteredCitiesToAdd.map((city) => {
                const isAlreadyAdded = selectedCities.some((c) => c.id === city.id);
                let cityTime = '--:--';
                try {
                  cityTime = new Intl.DateTimeFormat('uz-UZ', {
                    timeZone: city.timeZone,
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                  }).format(time);
                } catch {}

                return (
                  <div
                    key={city.id}
                    className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                      isAlreadyAdded
                        ? 'bg-slate-800/40 border-slate-800 opacity-60'
                        : 'bg-slate-950/80 border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{city.flag}</span>
                      <div>
                        <p className="text-sm font-bold text-white">{city.name}</p>
                        <p className="text-xs text-slate-400">{city.country}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-bold text-indigo-400">{cityTime}</span>
                      {isAlreadyAdded ? (
                        <button
                          onClick={() => handleRemoveCity(city.id)}
                          className="px-2.5 py-1 text-[11px] rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 font-medium"
                        >
                          Oʻchirish
                        </button>
                      ) : (
                        <button
                          onClick={() => handleAddCity(city)}
                          className="px-2.5 py-1 text-[11px] rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Qoʻshish</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

              {filteredCitiesToAdd.length === 0 && (
                <div className="col-span-2 py-10 text-center text-xs text-slate-400">
                  Ushbu mezon boʻyicha shahar topilmadi.
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-slate-800 pt-3 flex justify-end">
              <button
                onClick={() => setShowAddCityModal(false)}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition"
              >
                Tayyor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

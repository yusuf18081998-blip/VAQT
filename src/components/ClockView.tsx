import React, { useState, useEffect } from 'react';
import { Compass, Monitor, Globe, Plus, Trash2, Search, Sparkles } from 'lucide-react';
import { WorldClockCity } from '../types';

const INITIAL_CITIES: WorldClockCity[] = [
  { id: 'tashkent', name: 'Toshkent', country: 'Oʻzbekiston', timeZone: 'Asia/Tashkent', flag: '🇺🇿' },
  { id: 'mecca', name: 'Makka', country: 'Saudiya Arabistoni', timeZone: 'Asia/Riyadh', flag: '🇸🇦' },
  { id: 'istanbul', name: 'Istanbul', country: 'Turkiya', timeZone: 'Europe/Istanbul', flag: '🇹🇷' },
  { id: 'dubai', name: 'Dubay', country: 'BAA', timeZone: 'Asia/Dubai', flag: '🇦🇪' },
  { id: 'london', name: 'London', country: 'Buyuk Britaniya', timeZone: 'Europe/London', flag: '🇬🇧' },
  { id: 'newyork', name: 'Nyu-York', country: 'AQSH', timeZone: 'America/New_York', flag: '🇺🇸' },
  { id: 'tokyo', name: 'Tokio', country: 'Yaponiya', timeZone: 'Asia/Tokyo', flag: '🇯🇵' },
  { id: 'seoul', name: 'Seul', country: 'Janubiy Koreya', timeZone: 'Asia/Seoul', flag: '🇰🇷' },
];

const AVAILABLE_ADD_CITIES: WorldClockCity[] = [
  { id: 'berlin', name: 'Berlin', country: 'Germaniya', timeZone: 'Europe/Berlin', flag: '🇩🇪' },
  { id: 'paris', name: 'Parij', country: 'Fransiya', timeZone: 'Europe/Paris', flag: '🇫🇷' },
  { id: 'singapore', name: 'Singapur', country: 'Singapur', timeZone: 'Asia/Singapore', flag: '🇸🇬' },
  { id: 'kuala_lumpur', name: 'Kuala Lumpur', country: 'Malayziya', timeZone: 'Asia/Kuala_Lumpur', flag: '🇲🇾' },
  { id: 'sydney', name: 'Sidney', country: 'Avstraliya', timeZone: 'Australia/Sydney', flag: '🇦🇺' },
  { id: 'cairo', name: 'Qohira', country: 'Misr', timeZone: 'Africa/Cairo', flag: '🇪🇬' },
  { id: 'toronto', name: 'Toronto', country: 'Kanada', timeZone: 'America/Toronto', flag: '🇨🇦' },
];

const UZBEK_MONTHS = [
  'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
  'Iyul', 'Avgust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'
];

const UZBEK_WEEKDAYS = [
  'Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'
];

export const ClockView: React.FC = () => {
  const [time, setTime] = useState<Date>(new Date());
  const [is24Hour, setIs24Hour] = useState<boolean>(true);
  const [isAnalog, setIsAnalog] = useState<boolean>(false);
  const [cities, setCities] = useState<WorldClockCity[]>(INITIAL_CITIES);
  const [showAddCityModal, setShowAddCityModal] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format hours
  let displayHours = time.getHours();
  let ampm = '';
  if (!is24Hour) {
    ampm = displayHours >= 12 ? 'PM' : 'AM';
    displayHours = displayHours % 12 || 12;
  }

  const hoursStr = String(displayHours).padStart(2, '0');
  const minutesStr = String(time.getMinutes()).padStart(2, '0');
  const secondsStr = String(time.getSeconds()).padStart(2, '0');

  // Date formatting
  const dayName = UZBEK_WEEKDAYS[time.getDay()];
  const dayNum = time.getDate();
  const monthName = UZBEK_MONTHS[time.getMonth()];
  const year = time.getFullYear();

  // Analog hands angles
  const secDeg = (time.getSeconds() / 60) * 360;
  const minDeg = ((time.getMinutes() + time.getSeconds() / 60) / 60) * 360;
  const hourDeg = (((time.getHours() % 12) + time.getMinutes() / 60) / 12) * 360;

  const handleAddCity = (city: WorldClockCity) => {
    if (!cities.some((c) => c.id === city.id)) {
      setCities([...cities, city]);
    }
    setShowAddCityModal(false);
    setSearchQuery('');
  };

  const handleRemoveCity = (id: string) => {
    setCities(cities.filter((c) => c.id !== id));
  };

  const filteredCitiesToAdd = AVAILABLE_ADD_CITIES.filter(
    (c) =>
      !cities.some((existing) => existing.id === c.id) &&
      (c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.country.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-in">
      {/* Asosiy Soat Kartasi */}
      <div className="relative rounded-3xl backdrop-blur-2xl bg-white/30 dark:bg-slate-900/40 border border-white/40 dark:border-white/10 shadow-2xl p-6 sm:p-10 flex flex-col items-center justify-center text-center overflow-hidden">
        {/* Glow ambient */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-indigo-500/15 dark:bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-purple-500/15 dark:bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top Toggles */}
        <div className="flex items-center gap-2 mb-6 z-10">
          <button
            id="toggleFormatBtn"
            onClick={() => setIs24Hour(!is24Hour)}
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/50 dark:bg-slate-800/60 border border-slate-300/60 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-all shadow-sm"
          >
            {is24Hour ? '24 Soatlik format' : '12 Soatlik (AM/PM)'}
          </button>

          <button
            id="toggleAnalogBtn"
            onClick={() => setIsAnalog(!isAnalog)}
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/50 dark:bg-slate-800/60 border border-slate-300/60 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-all shadow-sm flex items-center gap-1.5"
          >
            {isAnalog ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-indigo-500" />
                <span>Raqamli rejim</span>
              </>
            ) : (
              <>
                <Compass className="w-3.5 h-3.5 text-indigo-500" />
                <span>Analog soat</span>
              </>
            )}
          </button>
        </div>

        {/* Display Content */}
        {!isAnalog ? (
          <div className="flex flex-col items-center z-10">
            {/* Raqamli Vaqt */}
            <div className="flex items-baseline justify-center font-mono tracking-tight text-slate-900 dark:text-white font-bold select-none text-5xl sm:text-7xl md:text-8xl drop-shadow-sm">
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
                {hoursStr}
              </span>
              <span className="text-indigo-500 animate-pulse px-1">:</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
                {minutesStr}
              </span>
              <span className="text-indigo-500 animate-pulse px-1">:</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                {secondsStr}
              </span>
              {ampm && (
                <span className="ml-3 text-lg sm:text-2xl font-sans font-extrabold text-purple-600 dark:text-purple-400">
                  {ampm}
                </span>
              )}
            </div>

            {/* Sana */}
            <div className="mt-4 text-sm sm:text-lg font-medium text-slate-600 dark:text-slate-300 flex items-center gap-2">
              <span className="px-3 py-1 rounded-lg bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-semibold border border-indigo-500/20">
                {dayName}
              </span>
              <span>{dayNum}-{monthName}, {year}-yil</span>
            </div>
          </div>
        ) : (
          /* Analog Clock */
          <div className="flex flex-col items-center z-10 py-4">
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full border-4 border-slate-300/70 dark:border-white/20 bg-gradient-to-br from-white/60 to-white/20 dark:from-slate-800/60 dark:to-slate-900/40 shadow-inner flex items-center justify-center backdrop-blur-md">
              {/* Dial numbers */}
              <span className="absolute top-2 text-xs font-bold text-slate-400 dark:text-slate-500 font-mono">12</span>
              <span className="absolute right-3 text-xs font-bold text-slate-400 dark:text-slate-500 font-mono">3</span>
              <span className="absolute bottom-2 text-xs font-bold text-slate-400 dark:text-slate-500 font-mono">6</span>
              <span className="absolute left-3 text-xs font-bold text-slate-400 dark:text-slate-500 font-mono">9</span>

              {/* Center point */}
              <div className="w-3.5 h-3.5 rounded-full bg-indigo-500 border-2 border-white dark:border-slate-900 z-30 shadow-md"></div>

              {/* Hour hand */}
              <div
                className="absolute w-1.5 h-16 bg-slate-800 dark:text-white dark:bg-slate-200 rounded-full origin-bottom z-10 shadow-sm"
                style={{
                  top: 'calc(50% - 64px)',
                  left: 'calc(50% - 3px)',
                  transform: `rotate(${hourDeg}deg)`,
                }}
              ></div>

              {/* Minute hand */}
              <div
                className="absolute w-1 h-22 bg-indigo-600 dark:bg-indigo-400 rounded-full origin-bottom z-20 shadow-sm"
                style={{
                  top: 'calc(50% - 88px)',
                  left: 'calc(50% - 2px)',
                  transform: `rotate(${minDeg}deg)`,
                }}
              ></div>

              {/* Second hand */}
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
              {hoursStr}:{minutesStr}:{secondsStr} {ampm}
            </div>
          </div>
        )}
      </div>

      {/* Dunyo Shaharlari Vaqtlari Bo'limi */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-500" />
            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm sm:text-base">
              Dunyo Shaharlari Vaqti
            </h3>
          </div>

          <button
            id="addCityModalOpenBtn"
            onClick={() => setShowAddCityModal(true)}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/20 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Shahar qoʻshish</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {cities.map((city) => {
            let cityTimeStr = '--:--:--';
            let cityDateStr = '';
            try {
              cityTimeStr = new Intl.DateTimeFormat('uz-UZ', {
                timeZone: city.timeZone,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
              }).format(time);

              cityDateStr = new Intl.DateTimeFormat('uz-UZ', {
                timeZone: city.timeZone,
                month: 'short',
                day: 'numeric',
              }).format(time);
            } catch (e) {
              // Ignore invalid tz
            }

            return (
              <div
                key={city.id}
                className="group relative rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 border border-white/40 dark:border-white/10 p-3.5 sm:p-4 shadow-sm hover:shadow-md transition-all hover:translate-y-[-2px] flex flex-col justify-between"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">{city.flag}</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">{city.name}</span>
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block">{city.country}</span>
                  </div>

                  {cities.length > 2 && (
                    <button
                      onClick={() => handleRemoveCity(city.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 transition-all"
                      title="Oʻchirish"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="mt-3 flex items-baseline justify-between border-t border-slate-200/50 dark:border-white/5 pt-2">
                  <span className="font-mono text-lg sm:text-xl font-bold text-indigo-600 dark:text-indigo-400">
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

      {/* Add City Modal */}
      {showAddCityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-3xl backdrop-blur-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <Globe className="w-4 h-4 text-indigo-500" />
                Dunyo shahri qoʻshish
              </h3>
              <button
                onClick={() => setShowAddCityModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-sm p-1"
              >
                ✕
              </button>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Shahar yoki davlat nomi..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="max-h-60 overflow-y-auto flex flex-col gap-1.5 scrollbar-thin">
              {filteredCitiesToAdd.length > 0 ? (
                filteredCitiesToAdd.map((city) => (
                  <button
                    key={city.id}
                    onClick={() => handleAddCity(city)}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-indigo-50 dark:hover:bg-slate-800/80 transition-colors text-left border border-transparent hover:border-indigo-100 dark:hover:border-slate-700"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{city.flag}</span>
                      <div>
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{city.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{city.country}</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">Qoʻshish +</span>
                  </button>
                ))
              ) : (
                <div className="py-6 text-center text-xs text-slate-500 dark:text-slate-400">
                  Barcha mavjud shaharlar allaqachon qoʻshilgan yoki topilmadi.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

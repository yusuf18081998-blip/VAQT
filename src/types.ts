export type TabType = 'world_clock' | 'pomodoro' | 'tasks' | 'stopwatch' | 'countdown' | 'clock' | 'source_code';

export type ThemeMode = 'dark' | 'light' | 'system';

export type PomodoroMode = 'focus' | 'shortBreak' | 'longBreak' | 'study' | 'short_break' | 'long_break';

export interface StopwatchLap {
  id: number;
  timeMs: number;
  lapTimeMs: number;
  timestamp: string;
}

export type SoundType = 'zen_bell' | 'marimba' | 'digital_alarm' | 'crystal_chime' | 'gentle_beep' | 'radar';

export interface SoundOption {
  id: SoundType;
  name: string;
  description: string;
}

export interface PomodoroConfig {
  focusTime: number;
  shortBreak: number;
  longBreak: number;
  longBreakInterval: number;
  autoStartBreaks: boolean;
  autoStartPomodoro: boolean;
  sound: SoundType;
}

export interface WorldClockCity {
  id: string;
  name: string;
  country: string;
  timeZone: string;
  flag: string;
}

export interface UserProfile {
  name: string;
  email: string;
  picture: string;
}

export interface TaskItem {
  id: string;
  title: string;
  category: 'dars' | 'ish' | 'shaxsiy' | 'loyiha';
  pomodorosEstimated: number;
  pomodorosCompleted: number;
  completed: boolean;
  createdAt: number;
}

export interface WorldCity {
  id: string;
  name: string;
  country: string;
  timezone: string;
  flag: string;
}

export interface BackgroundPreset {
  id: string;
  name: string;
  type: 'gradient' | 'image';
  value: string;
  thumbnail?: string;
}

export interface AudioTrack {
  id: string;
  title: string;
  category: 'ambient' | 'nature' | 'music' | 'uploaded';
  icon: string;
  type: 'synth' | 'url' | 'file';
  source?: string; // URL or Data URL
  synthType?: 'rain' | 'waves' | 'lofi' | 'space' | 'whitenoise' | 'forest' | 'zen';
}

export type AlarmTone = 'zen_bell' | 'marimba' | 'crystal' | 'digital' | 'cosmic_pulse';

export type TreeSpecies = 'apple' | 'pine' | 'sakura' | 'oak' | 'bamboo' | 'palm';

export interface PlantedTree {
  id: string;
  species: TreeSpecies;
  name: string;
  status: 'alive' | 'withered'; // Yashil yetilgan yoki Qurib qolgan
  minutesFocused: number;
  plantedAt: number;
  taskTitle?: string;
  witherReason?: string;
}

import { SoundType } from '../types';

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playTimerSound(type: SoundType = 'zen_bell', volume = 0.8): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(Math.max(0.05, Math.min(volume, 1)), now);
    masterGain.connect(ctx.destination);

    switch (type) {
      case 'zen_bell': {
        // Japanese Buddhist bowl chime / Zen Bell with deep resonant harmonics
        const freqs = [528, 1056, 1584, 2112];
        const decays = [2.5, 2.0, 1.4, 0.8];
        const gains = [0.6, 0.25, 0.1, 0.05];

        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);

          gain.gain.setValueAtTime(gains[idx], now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + decays[idx]);

          osc.connect(gain);
          gain.connect(masterGain);

          osc.start(now);
          osc.stop(now + decays[idx]);
        });
        break;
      }

      case 'marimba': {
        // Melodic 4-note ascending chord (C5 - E5 - G5 - C6)
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((freq, i) => {
          const startTime = now + i * 0.12;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, startTime);

          gain.gain.setValueAtTime(0.5, startTime);
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.6);

          osc.connect(gain);
          gain.connect(masterGain);

          osc.start(startTime);
          osc.stop(startTime + 0.6);
        });
        break;
      }

      case 'crystal_chime': {
        // Crystal bell with shimmering overtones
        const baseFreq = 880; // A5
        [1, 2.76, 5.4, 8.9].forEach((mult, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(baseFreq * mult, now);

          const initialGain = 0.4 / (i + 1);
          gain.gain.setValueAtTime(initialGain, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

          osc.connect(gain);
          gain.connect(masterGain);

          osc.start(now);
          osc.stop(now + 1.8);
        });
        break;
      }

      case 'digital_alarm': {
        // Energetic triple beep beep beep
        for (let burst = 0; burst < 3; burst++) {
          const burstStart = now + burst * 0.28;
          [0, 0.09].forEach((offset) => {
            const time = burstStart + offset;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(987.77, time); // B5

            gain.gain.setValueAtTime(0.2, time);
            gain.gain.setValueAtTime(0.2, time + 0.06);
            gain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);

            osc.connect(gain);
            gain.connect(masterGain);

            osc.start(time);
            osc.stop(time + 0.08);
          });
        }
        break;
      }

      case 'radar': {
        // Modern sonar / radar ping
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.7);

        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start(now);
        osc.stop(now + 0.7);
        break;
      }

      case 'gentle_beep':
      default: {
        // Gentle double ding
        [0, 0.18].forEach((offset, idx) => {
          const time = now + offset;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(idx === 0 ? 659.25 : 880, time);

          gain.gain.setValueAtTime(0.4, time);
          gain.gain.exponentialRampToValueAtTime(0.001, time + 0.4);

          osc.connect(gain);
          gain.connect(masterGain);

          osc.start(time);
          osc.stop(time + 0.4);
        });
        break;
      }
    }
  } catch (err) {
    console.warn('Audio playback not permitted yet or failed:', err);
  }
}

export function playTickSound(volume = 0.2): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.02);

    gain.gain.setValueAtTime(volume * 0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.02);
  } catch {
    // Ignore tick audio failure if not interacted
  }
}

export const SOUND_OPTIONS: { id: SoundType; name: string; description: string }[] = [
  { id: 'zen_bell', name: 'Zen Qoʻngʻiroq (Tinchlantiruvchi)', description: 'Chuqur garmonik aks-sado beruvchi mayin meditatsion qoʻngʻiroq' },
  { id: 'marimba', name: 'Marimba Melodiyasi', description: 'Koʻtarinki 4-notali yoqimli marimba akkordi' },
  { id: 'crystal_chime', name: 'Kristal Sado', description: 'Yorqin va toza yangrovchi kristall tovush' },
  { id: 'digital_alarm', name: 'Raqamli Signal', description: 'Klassik uygʻotkich kabi 3 bosqichli aniq signal' },
  { id: 'radar', name: 'Radar / Sonar Ping', description: 'Zamonaviy texnologik sonar ovozi' },
  { id: 'gentle_beep', name: 'Yumshoq Ding-Dong', description: 'Ikki bosqichli muloyim ogohlantirish' },
];

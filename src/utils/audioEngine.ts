import { AudioTrack, AlarmTone } from '../types';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private currentSynthNodes: {
    sources: (AudioNode | number)[];
    gainNode: GainNode;
    intervalId?: number;
  } | null = null;
  private audioElement: HTMLAudioElement | null = null;
  private currentTrack: AudioTrack | null = null;
  private isPlaying = false;
  private masterVolume = 0.5;
  private tickEnabled = true;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx || this.ctx.state === 'closed') {
      const AudioClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioClass) this.ctx = new AudioClass();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setVolume(vol: number) {
    this.masterVolume = Math.max(0, Math.min(1, vol));
    if (this.currentSynthNodes) {
      this.currentSynthNodes.gainNode.gain.setValueAtTime(this.masterVolume * 0.4, (this.ctx?.currentTime || 0) + 0.05);
    }
    if (this.audioElement) {
      this.audioElement.volume = this.masterVolume;
    }
  }

  public setTickEnabled(enabled: boolean) {
    this.tickEnabled = enabled;
  }

  public playTick(isStrong = false) {
    if (!this.tickEnabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      const freq = isStrong ? 1200 : 900;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.025);
      gain.gain.setValueAtTime((isStrong ? 0.08 : 0.035) * this.masterVolume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.025);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.03);
    } catch {
      // Safe audio error catch
    }
  }

  public playAlarm(tone: AlarmTone = 'marimba') {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      if (tone === 'marimba') {
        const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const st = now + idx * 0.14;
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, st);
          gain.gain.setValueAtTime(0, st);
          gain.gain.linearRampToValueAtTime(0.25 * this.masterVolume, st + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.0001, st + 1.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(st);
          osc.stop(st + 1.3);
        });
      } else if (tone === 'zen_bell') {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        osc1.type = 'sine';
        osc2.type = 'sine';
        osc1.frequency.setValueAtTime(432, now);
        osc2.frequency.setValueAtTime(432 * 2.76, now);
        gain.gain.setValueAtTime(0.3 * this.masterVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.0);
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 3.1);
        osc2.stop(now + 3.1);
      } else if (tone === 'crystal') {
        [880, 1108.73, 1318.51, 1760].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const st = now + idx * 0.09;
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, st);
          gain.gain.setValueAtTime(0.2 * this.masterVolume, st);
          gain.gain.exponentialRampToValueAtTime(0.0001, st + 1.5);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(st);
          osc.stop(st + 1.6);
        });
      } else if (tone === 'digital') {
        for (let i = 0; i < 4; i++) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const st = now + i * 0.18;
          osc.type = 'square';
          osc.frequency.setValueAtTime(1046.5, st);
          gain.gain.setValueAtTime(0.12 * this.masterVolume, st);
          gain.gain.setValueAtTime(0, st + 0.1);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(st);
          osc.stop(st + 0.12);
        }
      } else {
        // cosmic_pulse
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.8);
        gain.gain.setValueAtTime(0.2 * this.masterVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 1.9);
      }
    } catch {
      // Audio safety
    }
  }

  public playTreeSuccess() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      // Majestic harp / fanfare ascending arpeggio (C, E, G, B, C6, E6, G6)
      const freqs = [261.63, 329.63, 392.0, 493.88, 523.25, 659.25, 783.99, 1046.5];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const st = now + idx * 0.08;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, st);
        gain.gain.setValueAtTime(0, st);
        gain.gain.linearRampToValueAtTime(0.28 * this.masterVolume, st + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, st + 1.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(st);
        osc.stop(st + 1.7);
      });
    } catch {
      // Safe audio catch
    }
  }

  public playTreeWitherWarning() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      // Sad minor descending tone / cracking wood alert
      const freqs = [587.33, 523.25, 466.16, 392.0, 311.13, 246.94];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const st = now + idx * 0.12;
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, st);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.7, st + 0.2);
        gain.gain.setValueAtTime(0.22 * this.masterVolume, st);
        gain.gain.exponentialRampToValueAtTime(0.0001, st + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(st);
        osc.stop(st + 0.4);
      });
    } catch {
      // Safe audio catch
    }
  }

  // --- Ambient Procedural Sound Generator ---
  private startSynthAmbient(synthType: string) {
    const ctx = this.getContext();
    if (!ctx) return;
    this.stopAllAudio();

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.masterVolume * 0.4, ctx.currentTime);
    masterGain.connect(ctx.destination);

    const sources: (AudioNode | number)[] = [];
    let intervalId: number | undefined;

    if (synthType === 'rain' || synthType === 'whitenoise') {
      // Pink/Brown noise generator for rain/whitenoise
      const bufferSize = 2 * ctx.sampleRate;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      }
      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = synthType === 'rain' ? 'lowpass' : 'bandpass';
      filter.frequency.setValueAtTime(synthType === 'rain' ? 800 : 1000, ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(masterGain);
      whiteNoise.start();
      sources.push(whiteNoise, filter);
    } else if (synthType === 'waves') {
      // Ocean wave simulator with LFO filter modulation
      const bufferSize = 2 * ctx.sampleRate;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.15;
      }
      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(300, ctx.currentTime);

      // LFO for wave swelling
      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.12, ctx.currentTime); // ~8 sec wave cycle
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(450, ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      whiteNoise.connect(filter);
      filter.connect(masterGain);
      whiteNoise.start();
      lfo.start();
      sources.push(whiteNoise, filter, lfo, lfoGain);
    } else if (synthType === 'space' || synthType === 'lofi') {
      // Cosmic chord drone (C-minor / Ab majestic ambient pads)
      const chordFreqs = synthType === 'space' ? [130.81, 196.0, 261.63, 392.0] : [174.61, 220.0, 261.63, 329.63]; // F-Maj7 or C-Min
      chordFreqs.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, ctx.currentTime);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);
        osc.start();
        sources.push(osc, gain, filter);
      });
    } else if (synthType === 'zen') {
      // Ambient singing bowl repeating every few seconds
      const playChime = () => {
        if (!this.isPlaying) return;
        const now = ctx.currentTime;
        const chimeFreqs = [288, 576, 864, 1152];
        chimeFreqs.forEach((f, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, now);
          gain.gain.setValueAtTime((0.15 / (idx + 1)), now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 4.5);
          osc.connect(gain);
          gain.connect(masterGain);
          osc.start(now);
          osc.stop(now + 4.6);
        });
      };
      playChime();
      intervalId = window.setInterval(playChime, 6000);
    } else {
      // Forest / Nature soft breeze
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start();
      sources.push(osc, gain);
    }

    this.currentSynthNodes = { sources, gainNode: masterGain, intervalId };
    this.isPlaying = true;
  }

  // --- Track Playback ---
  public playTrack(track: AudioTrack) {
    this.stopAllAudio();
    this.currentTrack = track;

    if (track.type === 'synth' && track.synthType) {
      this.startSynthAmbient(track.synthType);
      return;
    }

    if (track.source) {
      try {
        if (!this.audioElement) {
          this.audioElement = new Audio();
        }
        this.audioElement.src = track.source;
        this.audioElement.loop = true;
        this.audioElement.volume = this.masterVolume;
        this.audioElement.play().then(() => {
          this.isPlaying = true;
        }).catch(() => {
          // Playback error or blocked
          this.isPlaying = false;
        });
      } catch {
        this.isPlaying = false;
      }
    }
  }

  public stopAllAudio() {
    if (this.currentSynthNodes) {
      if (this.currentSynthNodes.intervalId) {
        clearInterval(this.currentSynthNodes.intervalId);
      }
      this.currentSynthNodes.sources.forEach((node) => {
        if (typeof node === 'object' && 'stop' in node && typeof (node as AudioScheduledSourceNode).stop === 'function') {
          try {
            (node as AudioScheduledSourceNode).stop();
          } catch {}
        }
        if (typeof node === 'object' && 'disconnect' in node && typeof (node as AudioNode).disconnect === 'function') {
          try {
            (node as AudioNode).disconnect();
          } catch {}
        }
      });
      try {
        this.currentSynthNodes.gainNode.disconnect();
      } catch {}
      this.currentSynthNodes = null;
    }

    if (this.audioElement) {
      try {
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
      } catch {}
    }
    this.isPlaying = false;
  }

  public togglePlayPause(track?: AudioTrack) {
    if (this.isPlaying) {
      this.stopAllAudio();
      return false;
    } else {
      if (track) {
        this.playTrack(track);
      } else if (this.currentTrack) {
        this.playTrack(this.currentTrack);
      }
      return true;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getCurrentTrack(): AudioTrack | null {
    return this.currentTrack;
  }
}

export const soundEngine = new SoundEngine();

export const DEFAULT_TRACKS: AudioTrack[] = [
  { id: 'lofi_study', title: '☕ Lo-Fi Sokin Fokus', category: 'ambient', icon: '☕', type: 'synth', synthType: 'lofi' },
  { id: 'rain_storm', title: '🌧️ Yomgʻir & Momaqaldiroq', category: 'nature', icon: '🌧️', type: 'synth', synthType: 'rain' },
  { id: 'ocean_waves', title: '🌊 Okean Toʻlqinlari', category: 'nature', icon: '🌊', type: 'synth', synthType: 'waves' },
  { id: 'space_drone', title: '🌌 Kosmik Tungi Drone', category: 'ambient', icon: '🌌', type: 'synth', synthType: 'space' },
  { id: 'zen_bowl', title: '🧘 Zen Singisi & Meditatsiya', category: 'ambient', icon: '🧘', type: 'synth', synthType: 'zen' },
  { id: 'white_noise', title: '📻 Oq Shovqin (White Noise)', category: 'ambient', icon: '📻', type: 'synth', synthType: 'whitenoise' },
  { id: 'forest_breeze', title: '🌲 Oʻrmon & Shabadasi', category: 'nature', icon: '🌲', type: 'synth', synthType: 'forest' },
];

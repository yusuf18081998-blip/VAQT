// Advanced Web Audio API & Binaural Beats Synthesizer with Audio Analyser
// Designed for hyper-focus, studying, meditation, and real-time visualization

export type BinauralMode = 'none' | 'gamma' | 'beta' | 'alpha' | 'theta';
export type AmbientNoise = 'none' | 'rain' | 'waves' | 'forest' | 'cafe' | 'lofi' | 'white' | 'pink' | 'brown' | 'tick';

class BinauralAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;

  // Binaural nodes
  private leftOsc: OscillatorNode | null = null;
  private rightOsc: OscillatorNode | null = null;
  private binauralGain: GainNode | null = null;
  private activeBinaural: BinauralMode = 'none';

  // Ambient nodes
  private ambientSource: AudioNode | null = null;
  private ambientGain: GainNode | null = null;
  private activeAmbient: AmbientNoise = 'none';

  // Ticking sound
  private tickGain: GainNode | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.7;
  private listeners: Set<() => void> = new Set();

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((fn) => {
      try {
        fn();
      } catch {}
    });
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.volume;

      // Real-time Audio Analyser for Visualizer
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.8;

      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public getAnalyser(): AnalyserNode | null {
    this.initContext();
    return this.analyser;
  }

  // Get frequency byte data for waveform & visualizers
  public getAudioFrequencyData(dataArray: Uint8Array): void {
    if (this.analyser) {
      this.analyser.getByteFrequencyData(dataArray);
    }
  }

  public getAudioTimeDomainData(dataArray: Uint8Array): void {
    if (this.analyser) {
      this.analyser.getByteTimeDomainData(dataArray);
    }
  }

  // Start Binaural Beats with Stereo Channel Panning
  public setBinauralBeat(mode: BinauralMode) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    this.stopBinaural();
    this.activeBinaural = mode;

    if (mode === 'none') return;

    let baseFreq = 200;
    let diff = 10; // Alpha default

    if (mode === 'gamma') {
      baseFreq = 240;
      diff = 40; // 40 Hz Gamma
    } else if (mode === 'beta') {
      baseFreq = 200;
      diff = 20; // 20 Hz Beta
    } else if (mode === 'alpha') {
      baseFreq = 200;
      diff = 10; // 10 Hz Alpha
    } else if (mode === 'theta') {
      baseFreq = 150;
      diff = 6; // 6 Hz Theta
    }

    const merger = this.ctx.createChannelMerger(2);

    // Left channel
    this.leftOsc = this.ctx.createOscillator();
    this.leftOsc.type = 'sine';
    this.leftOsc.frequency.value = baseFreq;

    const leftGain = this.ctx.createGain();
    leftGain.gain.value = 0.15;
    this.leftOsc.connect(leftGain);
    leftGain.connect(merger, 0, 0);

    // Right channel
    this.rightOsc = this.ctx.createOscillator();
    this.rightOsc.type = 'sine';
    this.rightOsc.frequency.value = baseFreq + diff;

    const rightGain = this.ctx.createGain();
    rightGain.gain.value = 0.15;
    this.rightOsc.connect(rightGain);
    rightGain.connect(merger, 0, 1);

    this.binauralGain = this.ctx.createGain();
    this.binauralGain.gain.value = 0.35;
    merger.connect(this.binauralGain);
    this.binauralGain.connect(this.masterGain);

    this.leftOsc.start();
    this.rightOsc.start();
  }

  public stopBinaural() {
    if (this.leftOsc) {
      try { this.leftOsc.stop(); this.leftOsc.disconnect(); } catch {}
      this.leftOsc = null;
    }
    if (this.rightOsc) {
      try { this.rightOsc.stop(); this.rightOsc.disconnect(); } catch {}
      this.rightOsc = null;
    }
    if (this.binauralGain) {
      try { this.binauralGain.disconnect(); } catch {}
      this.binauralGain = null;
    }
    this.activeBinaural = 'none';
  }

  // Synthesize Ambient Noise (Rain, Waves, White/Pink/Brown noise, Cafe, Lo-Fi)
  public setAmbientSound(type: AmbientNoise) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    this.stopAmbient();
    this.activeAmbient = type;

    if (type === 'none') return;

    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    if (type === 'white') {
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
    } else if (type === 'pink') {
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
    } else if (type === 'brown' || type === 'rain') {
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
      }
    } else {
      // Waves / Cafe / Lo-Fi fallback noise baseline
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.3;
      }
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter shaping
    const filter = this.ctx.createBiquadFilter();
    if (type === 'rain') {
      filter.type = 'lowpass';
      filter.frequency.value = 1200;
    } else if (type === 'brown') {
      filter.type = 'lowpass';
      filter.frequency.value = 400;
    } else if (type === 'waves') {
      filter.type = 'bandpass';
      filter.frequency.value = 600;
      filter.Q.value = 1.0;

      // Modulate waves with LFO
      const lfo = this.ctx.createOscillator();
      lfo.frequency.value = 0.12; // 8 second wave cycle
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.value = 400;
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start();
    } else if (type === 'lofi') {
      filter.type = 'lowpass';
      filter.frequency.value = 800;
    } else {
      filter.type = 'allpass';
    }

    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.value = 0.25;

    whiteNoise.connect(filter);
    filter.connect(this.ambientGain);
    this.ambientGain.connect(this.masterGain);

    whiteNoise.start();
    this.ambientSource = whiteNoise;
    this.notify();
  }

  public stopAmbient() {
    if (this.ambientSource) {
      try { (this.ambientSource as any).stop(); this.ambientSource.disconnect(); } catch {}
      this.ambientSource = null;
    }
    if (this.ambientGain) {
      try { this.ambientGain.disconnect(); } catch {}
      this.ambientGain = null;
    }
    this.activeAmbient = 'none';
    this.notify();
  }

  // Play realistic mechanical clock tick
  public playTick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.08 * this.volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  // Play Alarm finish tone
  public playAlarm(tone: 'zen_bell' | 'marimba' | 'crystal' | 'digital' | 'cosmic_pulse' = 'zen_bell') {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;

    if (tone === 'zen_bell') {
      const freqs = [528, 528 * 1.5, 528 * 2.05];
      freqs.forEach((f, idx) => {
        const osc = this.ctx!.createOscillator();
        const g = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now);
        g.gain.setValueAtTime(0.25 / (idx + 1), now);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 3.5);
        osc.connect(g);
        g.connect(this.masterGain!);
        osc.start(now);
        osc.stop(now + 3.6);
      });
    } else if (tone === 'marimba') {
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = this.ctx!.createOscillator();
        const g = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.12);
        g.gain.setValueAtTime(0.3, now + i * 0.12);
        g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.4);
        osc.connect(g);
        g.connect(this.masterGain!);
        osc.start(now + i * 0.12);
        osc.stop(now + i * 0.12 + 0.45);
      });
    } else {
      // Crystal/Digital chime
      [880, 1174.66, 1318.51, 1760].forEach((f, i) => {
        const osc = this.ctx!.createOscillator();
        const g = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + i * 0.1);
        g.gain.setValueAtTime(0.2, now + i * 0.1);
        g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.8);
        osc.connect(g);
        g.connect(this.masterGain!);
        osc.start(now + i * 0.1);
        osc.stop(now + i * 0.1 + 0.85);
      });
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
    this.notify();
  }

  public getVolume(): number {
    return this.volume;
  }

  public setMuted(muted: boolean): boolean {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
    this.notify();
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
    this.notify();
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getActiveBinaural(): BinauralMode {
    return this.activeBinaural;
  }

  public getActiveAmbient(): AmbientNoise {
    return this.activeAmbient;
  }
}

export const binauralEngine = new BinauralAudioEngine();

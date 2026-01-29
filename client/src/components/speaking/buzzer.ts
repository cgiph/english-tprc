export function playBuzzer({ volume = 1 }: { volume?: number } = {}) {
  const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
  const ctx = new AudioCtx();

  const master = ctx.createGain();
  master.gain.value = Math.min(1, Math.max(0, volume));
  master.connect(ctx.destination);

  const now = ctx.currentTime;

  // A harsh, unmistakable "buzzer" tone: stacked sawtooths + slight detune
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const osc3 = ctx.createOscillator();
  osc1.type = 'sawtooth';
  osc2.type = 'square';
  osc3.type = 'sawtooth';

  osc1.frequency.setValueAtTime(170, now);
  osc2.frequency.setValueAtTime(340, now);
  osc3.frequency.setValueAtTime(185, now);

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(600, now);
  filter.Q.setValueAtTime(1.1, now);

  // Distortion (waveshaper)
  const shaper = ctx.createWaveShaper();
  const makeCurve = (amount: number) => {
    const n = 44100;
    const curve = new Float32Array(n);
    const k = typeof amount === 'number' ? amount : 50;
    for (let i = 0; i < n; i++) {
      const x = (i * 2) / n - 1;
      curve[i] = ((1 + k) * x) / (1 + k * Math.abs(x));
    }
    return curve;
  };
  shaper.curve = makeCurve(120);
  shaper.oversample = '4x';

  const buzzerGain = ctx.createGain();
  buzzerGain.gain.setValueAtTime(0.0001, now);
  // Fast attack
  buzzerGain.gain.exponentialRampToValueAtTime(0.95, now + 0.02);
  // Hold then decay
  buzzerGain.gain.setValueAtTime(0.95, now + 0.12);
  buzzerGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);

  osc1.connect(filter);
  osc2.connect(filter);
  osc3.connect(filter);
  filter.connect(shaper);
  shaper.connect(buzzerGain);
  buzzerGain.connect(master);

  osc1.start(now);
  osc2.start(now);
  osc3.start(now);

  const stopAt = now + 0.6;
  osc1.stop(stopAt);
  osc2.stop(stopAt);
  osc3.stop(stopAt);

  // Cleanup
  setTimeout(() => {
    try {
      osc1.disconnect();
      osc2.disconnect();
      osc3.disconnect();
      filter.disconnect();
      shaper.disconnect();
      buzzerGain.disconnect();
      master.disconnect();
      ctx.close();
    } catch {
      // ignore
    }
  }, 900);
}

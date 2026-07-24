let audioContext: AudioContext | null = null;

export function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  if (audioContext.state === "suspended") {
    void audioContext.resume();
  }
  return audioContext;
}

export function playTone(frequency: number, durationMs = 900) {
  const ctx = getAudioContext();
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.type = "triangle";
  oscillator.frequency.value = frequency;

  const now = ctx.currentTime;
  const durationSec = durationMs / 1000;
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.3, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

  oscillator.connect(gain).connect(ctx.destination);
  oscillator.start(now);
  oscillator.stop(now + durationSec + 0.05);
}

export function scheduleClick(time: number, accent: boolean) {
  const ctx = getAudioContext();
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.type = "square";
  oscillator.frequency.value = accent ? 1500 : 1000;

  gain.gain.setValueAtTime(0.0001, time);
  gain.gain.exponentialRampToValueAtTime(accent ? 0.6 : 0.4, time + 0.001);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.03);

  oscillator.connect(gain).connect(ctx.destination);
  oscillator.start(time);
  oscillator.stop(time + 0.04);
}

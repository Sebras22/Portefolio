const BPM = 74
const STEP = 60 / BPM / 4
const BAR_STEPS = 16
const LOOP_STEPS = BAR_STEPS * 4
const SCHEDULE_AHEAD = 0.3
const TICK_MS = 60

const midi = (note: number) => 440 * 2 ** ((note - 69) / 12)

const CHORDS = [
  { root: 38, notes: [53, 57, 60, 64] },
  { root: 43, notes: [53, 59, 62, 64] },
  { root: 48, notes: [52, 55, 59, 62] },
  { root: 45, notes: [55, 59, 60, 64] },
]

const MELODY = [62, 65, 67, 69, 72, 74, 77]

export class LofiEngine {
  readonly analyser: AnalyserNode

  private readonly ctx: AudioContext
  private readonly master: GainNode
  private readonly drumBus: GainNode
  private readonly reverbSend: GainNode
  private readonly echoSend: GainNode
  private readonly wobble: GainNode
  private readonly noise: AudioBuffer
  private timer: number | undefined
  private nextTime = 0
  private step = 0
  private volume = 0.6
  private playing = false

  constructor() {
    const ctx = new AudioContext()
    this.ctx = ctx

    this.master = ctx.createGain()
    this.master.gain.value = 0
    const tape = ctx.createBiquadFilter()
    tape.type = 'lowpass'
    tape.frequency.value = 7200
    const compressor = ctx.createDynamicsCompressor()
    compressor.threshold.value = -20
    compressor.ratio.value = 3
    this.analyser = ctx.createAnalyser()
    this.analyser.fftSize = 512
    this.analyser.smoothingTimeConstant = 0.78
    this.master.connect(tape).connect(compressor).connect(this.analyser).connect(ctx.destination)

    this.noise = this.makeNoise(ctx.sampleRate * 2)

    const reverb = ctx.createConvolver()
    reverb.buffer = this.makeImpulse(1.8)
    this.reverbSend = ctx.createGain()
    this.reverbSend.gain.value = 0.32
    const reverbOut = ctx.createGain()
    reverbOut.gain.value = 0.7
    this.reverbSend.connect(reverb).connect(reverbOut).connect(this.master)

    const echo = ctx.createDelay(1.5)
    echo.delayTime.value = STEP * 3
    const feedback = ctx.createGain()
    feedback.gain.value = 0.38
    const echoTone = ctx.createBiquadFilter()
    echoTone.type = 'lowpass'
    echoTone.frequency.value = 1900
    this.echoSend = ctx.createGain()
    this.echoSend.gain.value = 0.5
    this.echoSend.connect(echo)
    echo.connect(echoTone).connect(feedback).connect(echo)
    echoTone.connect(this.master)

    this.drumBus = ctx.createGain()
    this.drumBus.gain.value = 0.9
    const drumTone = ctx.createBiquadFilter()
    drumTone.type = 'lowpass'
    drumTone.frequency.value = 5800
    this.drumBus.connect(drumTone).connect(this.master)

    const lfo = ctx.createOscillator()
    lfo.frequency.value = 0.42
    this.wobble = ctx.createGain()
    this.wobble.gain.value = 9
    lfo.connect(this.wobble)
    lfo.start()

    const hiss = ctx.createBufferSource()
    hiss.buffer = this.noise
    hiss.loop = true
    const hissFilter = ctx.createBiquadFilter()
    hissFilter.type = 'highpass'
    hissFilter.frequency.value = 2400
    const hissGain = ctx.createGain()
    hissGain.gain.value = 0.006
    hiss.connect(hissFilter).connect(hissGain).connect(this.master)
    hiss.start()
  }

  get isPlaying() {
    return this.playing
  }

  async play() {
    if (this.playing) return
    this.playing = true
    await this.ctx.resume()
    const now = this.ctx.currentTime
    this.master.gain.cancelScheduledValues(now)
    this.master.gain.setValueAtTime(this.master.gain.value, now)
    this.master.gain.linearRampToValueAtTime(this.volume, now + 1.6)
    this.nextTime = now + 0.08
    this.timer = window.setInterval(() => this.schedule(), TICK_MS)
    this.schedule()
  }

  pause() {
    if (!this.playing) return
    this.playing = false
    const now = this.ctx.currentTime
    this.master.gain.cancelScheduledValues(now)
    this.master.gain.setValueAtTime(this.master.gain.value, now)
    this.master.gain.linearRampToValueAtTime(0, now + 0.5)
    window.clearInterval(this.timer)
    this.timer = undefined
    window.setTimeout(() => {
      if (!this.playing) void this.ctx.suspend()
    }, 650)
  }

  setVolume(value: number) {
    this.volume = value
    if (this.playing) {
      const now = this.ctx.currentTime
      this.master.gain.cancelScheduledValues(now)
      this.master.gain.setTargetAtTime(value, now, 0.08)
    }
  }

  hold() {
    if (this.playing) void this.ctx.suspend()
  }

  release() {
    if (this.playing) void this.ctx.resume()
  }

  destroy() {
    this.playing = false
    window.clearInterval(this.timer)
    void this.ctx.close()
  }

  private schedule() {
    while (this.nextTime < this.ctx.currentTime + SCHEDULE_AHEAD) {
      const swing = this.step % 4 === 2 ? STEP * 0.32 : 0
      this.playStep(this.step, this.nextTime + swing)
      this.nextTime += STEP
      this.step = (this.step + 1) % LOOP_STEPS
    }
  }

  private playStep(step: number, time: number) {
    const bar = Math.floor(step / BAR_STEPS)
    const inBar = step % BAR_STEPS
    const chord = CHORDS[bar]

    if (inBar === 0) {
      this.chord(chord.notes, time, 1, 3.4)
      this.bass(chord.root, time, STEP * 6)
    }
    if (inBar === 6) this.chord(chord.notes, time, 0.5, 1.1)
    if (inBar === 10) this.bass(chord.root + (bar % 2 ? 7 : 0), time, STEP * 3)

    if (inBar === 0 || inBar === 10) this.kick(time, 1)
    if (inBar === 7 && bar % 2 === 1) this.kick(time, 0.6)
    if (inBar === 4 || inBar === 12) this.snare(time, 1)
    if (inBar % 2 === 0) this.hat(time, 0.25 + Math.random() * 0.35)
    if (inBar === 15 && Math.random() < 0.4) this.hat(time, 0.2)

    if (inBar % 2 === 0 && Math.random() < 0.26) {
      const note = MELODY[Math.floor(Math.random() * MELODY.length)]
      this.pluck(note, time, 0.5 + Math.random() * 0.5)
    }
    if (Math.random() < 0.05) this.crackle(time)
  }

  private chord(notes: number[], time: number, level: number, length: number) {
    const ctx = this.ctx
    const tone = ctx.createBiquadFilter()
    tone.type = 'lowpass'
    tone.frequency.value = 1500
    tone.Q.value = 0.6
    const out = ctx.createGain()
    out.gain.value = 0.13 * level
    tone.connect(out)
    out.connect(this.master)
    out.connect(this.reverbSend)

    notes.forEach((note, index) => {
      const start = time + index * 0.014
      for (const [type, detune] of [
        ['triangle', -5],
        ['sine', 6],
      ] as const) {
        const osc = ctx.createOscillator()
        osc.type = type
        osc.frequency.value = midi(note)
        osc.detune.value = detune
        this.wobble.connect(osc.detune)
        const env = ctx.createGain()
        env.gain.setValueAtTime(0.0001, start)
        env.gain.exponentialRampToValueAtTime(0.5, start + 0.03)
        env.gain.exponentialRampToValueAtTime(0.0001, start + length)
        osc.connect(env).connect(tone)
        osc.start(start)
        osc.stop(start + length + 0.05)
        osc.onended = () => {
          this.wobble.disconnect(osc.detune)
          osc.disconnect()
          env.disconnect()
        }
      }
    })
    window.setTimeout(() => out.disconnect(), (time - ctx.currentTime + length + 0.3) * 1000)
  }

  private bass(note: number, time: number, length: number) {
    const ctx = this.ctx
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = midi(note)
    const env = ctx.createGain()
    env.gain.setValueAtTime(0.0001, time)
    env.gain.exponentialRampToValueAtTime(0.34, time + 0.02)
    env.gain.exponentialRampToValueAtTime(0.0001, time + length)
    osc.connect(env).connect(this.master)
    osc.start(time)
    osc.stop(time + length + 0.05)
    osc.onended = () => {
      osc.disconnect()
      env.disconnect()
    }
  }

  private pluck(note: number, time: number, level: number) {
    const ctx = this.ctx
    const osc = ctx.createOscillator()
    osc.type = 'triangle'
    osc.frequency.value = midi(note)
    const env = ctx.createGain()
    env.gain.setValueAtTime(0.0001, time)
    env.gain.exponentialRampToValueAtTime(0.11 * level, time + 0.008)
    env.gain.exponentialRampToValueAtTime(0.0001, time + 0.7)
    osc.connect(env)
    env.connect(this.master)
    env.connect(this.echoSend)
    env.connect(this.reverbSend)
    osc.start(time)
    osc.stop(time + 0.75)
    osc.onended = () => {
      osc.disconnect()
      env.disconnect()
    }
  }

  private kick(time: number, level: number) {
    const ctx = this.ctx
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(130, time)
    osc.frequency.exponentialRampToValueAtTime(42, time + 0.14)
    const env = ctx.createGain()
    env.gain.setValueAtTime(0.0001, time)
    env.gain.exponentialRampToValueAtTime(0.8 * level, time + 0.004)
    env.gain.exponentialRampToValueAtTime(0.0001, time + 0.4)
    osc.connect(env).connect(this.drumBus)
    osc.start(time)
    osc.stop(time + 0.45)
    osc.onended = () => {
      osc.disconnect()
      env.disconnect()
    }
  }

  private snare(time: number, level: number) {
    const ctx = this.ctx
    const src = ctx.createBufferSource()
    src.buffer = this.noise
    const band = ctx.createBiquadFilter()
    band.type = 'bandpass'
    band.frequency.value = 1700
    band.Q.value = 0.7
    const env = ctx.createGain()
    env.gain.setValueAtTime(0.0001, time)
    env.gain.exponentialRampToValueAtTime(0.38 * level, time + 0.004)
    env.gain.exponentialRampToValueAtTime(0.0001, time + 0.22)
    src.connect(band).connect(env)
    env.connect(this.drumBus)
    env.connect(this.reverbSend)
    src.start(time, Math.random())
    src.stop(time + 0.25)

    const body = ctx.createOscillator()
    body.type = 'triangle'
    body.frequency.setValueAtTime(210, time)
    body.frequency.exponentialRampToValueAtTime(150, time + 0.08)
    const bodyEnv = ctx.createGain()
    bodyEnv.gain.setValueAtTime(0.0001, time)
    bodyEnv.gain.exponentialRampToValueAtTime(0.2 * level, time + 0.004)
    bodyEnv.gain.exponentialRampToValueAtTime(0.0001, time + 0.12)
    body.connect(bodyEnv).connect(this.drumBus)
    body.start(time)
    body.stop(time + 0.15)
    src.onended = () => {
      src.disconnect()
      band.disconnect()
      env.disconnect()
    }
    body.onended = () => {
      body.disconnect()
      bodyEnv.disconnect()
    }
  }

  private hat(time: number, level: number) {
    const ctx = this.ctx
    const src = ctx.createBufferSource()
    src.buffer = this.noise
    const high = ctx.createBiquadFilter()
    high.type = 'highpass'
    high.frequency.value = 7000
    const env = ctx.createGain()
    env.gain.setValueAtTime(0.0001, time)
    env.gain.exponentialRampToValueAtTime(0.1 * level, time + 0.003)
    env.gain.exponentialRampToValueAtTime(0.0001, time + 0.05)
    src.connect(high).connect(env).connect(this.drumBus)
    src.start(time, Math.random())
    src.stop(time + 0.06)
    src.onended = () => {
      src.disconnect()
      high.disconnect()
      env.disconnect()
    }
  }

  private crackle(time: number) {
    const ctx = this.ctx
    const src = ctx.createBufferSource()
    src.buffer = this.noise
    const env = ctx.createGain()
    env.gain.setValueAtTime(0.045 * Math.random(), time)
    env.gain.exponentialRampToValueAtTime(0.0001, time + 0.012)
    src.connect(env).connect(this.master)
    src.start(time, Math.random())
    src.stop(time + 0.02)
    src.onended = () => {
      src.disconnect()
      env.disconnect()
    }
  }

  private makeNoise(length: number) {
    const buffer = this.ctx.createBuffer(1, length, this.ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1
    return buffer
  }

  private makeImpulse(seconds: number) {
    const length = Math.floor(this.ctx.sampleRate * seconds)
    const buffer = this.ctx.createBuffer(2, length, this.ctx.sampleRate)
    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel)
      for (let i = 0; i < length; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / length) ** 2.6
      }
    }
    return buffer
  }
}

// =====================================================
// audio.js — Web Audio API 정석 (사운드 폭발 및 딜레이 완벽 해결)
// =====================================================

const AudioManager = {
  bgm: new Audio(),
  sfxCache: {}, 
  bgmVolume: 0.5,
  sfxVolume: 0.8,
  muted: false,
  audioCtx: null,

  // 컨텍스트 초기화
  initContext() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    }
  },

  // 1. 사운드 사전 로드 (메모리에 파일 정보만 올려둠)
  preloadSFX() {
    this.initContext();
    for (const key in CONFIG.SOUNDS.SFX) {
      const src = CONFIG.SOUNDS.SFX[key];
      fetch(src)
        .then(res => res.arrayBuffer())
        .then(buffer => this.audioCtx.decodeAudioData(buffer))
        .then(decoded => { this.sfxCache[src] = decoded; })
        .catch(e => console.warn('SFX 로드 실패:', src));
    }
  },

  // 2. 터치 시 오디오 컨텍스트 락 해제 (단 한 번만 실행)
  initUnlock() {
    this.initContext();
    
    // Web Audio API 잠금 해제 (수십개 재생이 아닌 컨텍스트 자체만 깨움)
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    // BGM용 오디오 태그 잠금 해제 (무음 파일 딱 1개만 재생)
    const silentWav = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
    this.bgm.src = silentWav;
    this.bgm.play().then(() => this.bgm.pause()).catch(()=>{});
  },

  playBGM(src, loop = true) {
    this.stopBGM();
    this.bgm.src = src;
    this.bgm.loop = loop;
    this.bgm.volume = this.muted ? 0 : this.bgmVolume;
    this.bgm.play().catch(()=>{});
  },

  stopBGM() {
    this.bgm.pause();
    this.bgm.currentTime = 0;
  },

  fadeBGM(duration = 1000) {
    const step = this.bgm.volume / (duration / 50);
    const fade = setInterval(() => {
      if (this.bgm.volume > step) {
        this.bgm.volume -= step;
      } else {
        clearInterval(fade);
        this.stopBGM();
      }
    }, 50);
  },

  // 3. SFX 재생 (지연 없이 즉각 재생)
  playSFX(src) {
    if (this.muted || !this.audioCtx || !this.sfxCache[src]) return;
    
    // 메모리에 캐시된 소리를 가져와 일회용 스피커(Source)에 연결 후 발사
    const source = this.audioCtx.createBufferSource();
    source.buffer = this.sfxCache[src];
    
    const gainNode = this.audioCtx.createGain();
    gainNode.gain.value = this.sfxVolume;
    
    source.connect(gainNode);
    gainNode.connect(this.audioCtx.destination);
    source.start(0);
  },

  toggleMute() {
    this.muted = !this.muted;
    this.bgm.volume = this.muted ? 0 : this.bgmVolume;
    return this.muted;
  }
};
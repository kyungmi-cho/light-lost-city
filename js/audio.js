// =====================================================
// AudioManager — Web Audio API 적용 (모바일 SFX 재생 보장)
// =====================================================

const AudioManager = {
  bgm: new Audio(),
  sfxCache: {}, 
  bgmVolume: 0.5,
  sfxVolume: 0.8,
  muted: false,
  audioCtx: null, // 💡 Web Audio API 컨텍스트 추가

  // 💡 1. 사운드 사전 로드 (Web Audio API로 디코딩하여 메모리에 저장)
  preloadSFX() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      this.audioCtx = new AudioContext();
    }

    for (const key in CONFIG.SOUNDS.SFX) {
      const src = CONFIG.SOUNDS.SFX[key];
      
      if (this.audioCtx) {
        // Web Audio API 방식 (모바일 권장)
        fetch(src)
          .then(res => res.arrayBuffer())
          .then(buffer => this.audioCtx.decodeAudioData(buffer))
          .then(decoded => { this.sfxCache[src] = decoded; })
          .catch(e => console.warn('SFX fetch error', e));
      } else {
        // 구형 브라우저 대비 Fallback
        const audio = new Audio(src);
        audio.preload = 'auto';
        this.sfxCache[src] = audio;
      }
    }
  },

  // 💡 2. 터치 발생 시 오디오 락 해제 (Context Resume)
  initUnlock() {
    try {
      // Web Audio API 잠금 해제
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      // BGM용 HTML5 Audio 잠금 해제
      const silentWav = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
      this.bgm.src = silentWav;
      const playPromise = this.bgm.play();
      if (playPromise !== undefined) {
        playPromise.then(() => { this.bgm.pause(); }).catch(()=>{});
      }
    } catch(e) {
      console.warn("오디오 락 해제 중단 (무시됨)");
    }
  },

  playBGM(src, loop = true) {
    this.stopBGM();
    this.bgm.src = src;
    this.bgm.loop = loop;
    this.bgm.volume = this.muted ? 0 : this.bgmVolume;
    this.bgm.play().catch(e => console.warn('BGM Play Error:', e));
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

  // 💡 3. SFX 재생 (BufferSource 사용으로 모바일 정책 우회 및 지연율 0%)
  playSFX(src) {
    if (this.muted) return;
    
    // Web Audio API를 지원하고 캐시된 버퍼가 있는 경우
    if (this.audioCtx && this.sfxCache[src] instanceof AudioBuffer) {
      const source = this.audioCtx.createBufferSource();
      source.buffer = this.sfxCache[src];
      
      const gainNode = this.audioCtx.createGain();
      gainNode.gain.value = this.sfxVolume;
      
      source.connect(gainNode);
      gainNode.connect(this.audioCtx.destination);
      source.start(0);
    } 
    // Fallback: HTML5 Audio 방식
    else {
      let baseAudio = this.sfxCache[src];
      if (!baseAudio || baseAudio instanceof AudioBuffer) {
        baseAudio = new Audio(src);
        this.sfxCache[src] = baseAudio;
      }
      const sound = baseAudio.cloneNode();
      sound.volume = this.sfxVolume;
      sound.play().catch(()=>{});
    }
  },

  toggleMute() {
    this.muted = !this.muted;
    this.bgm.volume = this.muted ? 0 : this.bgmVolume;
    return this.muted;
  }
};
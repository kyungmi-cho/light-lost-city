// =====================================================
// AudioManager — BGM / SFX 관리 (사운드 누락 및 겹침 완벽 해결)
// =====================================================

const AudioManager = {
  bgm: new Audio(),
  sfxCache: {}, // 💡 SFX를 미리 담아둘 캐시 저장소
  bgmVolume: 0.5,
  sfxVolume: 0.8,
  muted: false,

  // 💡 1. 사운드 사전 로드 (크롬 SFX 누락 방지)
  preloadSFX() {
    for (const key in CONFIG.SOUNDS.SFX) {
      const src = CONFIG.SOUNDS.SFX[key];
      const audio = new Audio(src);
      audio.preload = 'auto'; // 미리 디코딩
      this.sfxCache[src] = audio;
    }
  },

  initUnlock() {
    try {
      const silentWav = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
      
      this.bgm.src = silentWav;
      const playPromise = this.bgm.play();
      if (playPromise !== undefined) {
        playPromise.then(() => { this.bgm.pause(); }).catch(()=>{});
      }
      
      const tempSfx = new Audio(silentWav);
      const sfxPromise = tempSfx.play();
      if (sfxPromise !== undefined) {
        sfxPromise.then(() => { tempSfx.pause(); }).catch(()=>{});
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

  // 💡 2. SFX 재생 시 캐시된 객체를 cloneNode()로 복제하여 즉시 재생
  playSFX(src) {
    if (this.muted) return;
    
    let baseAudio = this.sfxCache[src];
    if (!baseAudio) {
      // 혹시 캐시에 없다면 새로 생성하여 캐시에 넣음
      baseAudio = new Audio(src);
      this.sfxCache[src] = baseAudio;
    }
    
    const sound = baseAudio.cloneNode(); // 복제하여 동시 재생/겹침 완벽 대응
    sound.volume = this.sfxVolume;
    sound.play().catch(()=>{});
  },

  toggleMute() {
    this.muted = !this.muted;
    this.bgm.volume = this.muted ? 0 : this.bgmVolume;
    return this.muted;
  }
};
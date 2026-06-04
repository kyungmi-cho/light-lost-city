// =====================================================
// audio.js — HTML5 Audio Pool (굉음 폭발 방지 & 모바일 호환)
// =====================================================

const AudioManager = {
  bgm: new Audio(),
  sfxPool: {},
  POOL_SIZE: 2, // 💡 무거운 메모리 방지를 위해 최소한의 풀 사이즈 적용
  bgmVolume: 0.5,
  sfxVolume: 0.8,
  muted: false,
  isUnlocked: false,

  // 1. 사운드 사전 로드 (각 효과음마다 2개씩 미리 생성하여 준비)
  preloadSFX() {
    for (const key in CONFIG.SOUNDS.SFX) {
      const src = CONFIG.SOUNDS.SFX[key];
      this.sfxPool[src] = [];
      for (let i = 0; i < this.POOL_SIZE; i++) {
        const audio = new Audio(src);
        audio.preload = 'auto'; // 미리 로딩
        this.sfxPool[src].push(audio);
      }
    }
  },

  // 2. 터치 시 오디오 권한 일괄 해제 (굉음 없이 조용하고 안전하게)
  initUnlock() {
    if (this.isUnlocked) return;
    this.isUnlocked = true;

    try {
      // BGM은 무음 파일로 짧게 재생하여 백그라운드 권한 획득
      const silentWav = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
      this.bgm.src = silentWav;
      this.bgm.play().then(() => this.bgm.pause()).catch(()=>{});

      // 💡 핵심: SFX 풀은 .play()가 아닌 .load()를 사용!
      // 소리를 내지 않고 브라우저에게 "이 오디오들 쓸 거니까 허락해 둬"라고 신고만 함
      for (const src in this.sfxPool) {
        this.sfxPool[src].forEach(audio => {
          audio.load();
        });
      }
    } catch(e) {
      console.warn("오디오 락 해제 중단");
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

  // 3. SFX 재생 (미리 권한을 얻은 풀에서 꺼내어 즉시 발사)
  playSFX(src) {
    if (this.muted || !this.sfxPool[src]) return;

    const pool = this.sfxPool[src];
    
    // 현재 쉬고 있거나 재생이 끝난 오디오 객체 찾기
    let availableAudio = pool.find(a => a.paused || a.currentTime === 0 || a.ended);
    
    // 비어있는 객체가 없다면 가장 첫 번째 것을 강제로 리셋해서 사용
    if (!availableAudio) {
      availableAudio = pool[0];
    }

    availableAudio.pause();
    availableAudio.currentTime = 0;
    availableAudio.volume = this.sfxVolume;
    
    // 딜레이(sleep) 이후에 호출되어도, 이미 .load()로 승인받았기 때문에 막히지 않음
    availableAudio.play().catch(e => console.warn('SFX Play Error:', e));
  },

  toggleMute() {
    this.muted = !this.muted;
    this.bgm.volume = this.muted ? 0 : this.bgmVolume;
    return this.muted;
  }
};
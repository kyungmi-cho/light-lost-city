// =====================================================
// audio.js — HTML5 Audio Pool 방식 (모바일 호환성 100%)
// =====================================================

const AudioManager = {
  bgm: new Audio(),
  sfxPool: {}, // 💡 개별 오디오가 아닌, 동일한 오디오 객체들의 배열(Pool)을 저장
  POOL_SIZE: 3, // 💡 겹쳐서 들릴 수 있는 타격음 등의 최대 동시 재생 허용 개수
  bgmVolume: 0.5,
  sfxVolume: 0.8,
  muted: false,
  isUnlocked: false,

  // 1. 사운드 사전 로드 (각 효과음마다 POOL_SIZE 만큼 미리 생성)
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

  // 2. 터치 시 오디오 권한 일괄 해제
  initUnlock() {
    if (this.isUnlocked) return;
    this.isUnlocked = true;

    try {
      const silentWav = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
      
      // BGM 락 해제
      this.bgm.src = silentWav;
      this.bgm.play().then(() => this.bgm.pause()).catch(()=>{});

      // SFX 풀 락 해제 (무음으로 일괄 짧게 재생 후 정지)
      for (const src in this.sfxPool) {
        this.sfxPool[src].forEach(audio => {
          audio.volume = 0; // 무음 처리
          const playPromise = audio.play();
          if (playPromise !== undefined) {
            playPromise.then(() => {
              audio.pause();
              audio.currentTime = 0;
              audio.volume = this.sfxVolume; // 볼륨 원상복구
            }).catch(()=>{});
          }
        });
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

  // 3. SFX 재생 (풀에서 비어있는 오디오 객체를 찾아 재생)
  playSFX(src) {
    if (this.muted || !this.sfxPool[src]) return;
    
    const pool = this.sfxPool[src];
    
    // 현재 재생 중이지 않거나, 재생이 완전히 끝난 오디오 객체 찾기
    let availableAudio = pool.find(a => a.paused || a.currentTime === 0 || a.ended);
    
    // 만약 풀이 꽉 차서 쉬고 있는 객체가 없다면, 강제로 첫 번째 객체를 뺏어서 리셋
    if (!availableAudio) {
      availableAudio = pool[0];
    }

    // 초기화 및 재생
    availableAudio.pause();
    availableAudio.currentTime = 0;
    availableAudio.volume = this.sfxVolume;
    availableAudio.play().catch(()=>{});
  },

  toggleMute() {
    this.muted = !this.muted;
    this.bgm.volume = this.muted ? 0 : this.bgmVolume;
    return this.muted;
  }
};
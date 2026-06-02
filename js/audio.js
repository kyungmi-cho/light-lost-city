// =====================================================
// AudioManager — BGM / SFX 관리 (사파리 완벽 대응)
// =====================================================

const AudioManager = {
  bgm: new Audio(), // 💡 전역으로 1개만 만들어 계속 재사용 (사파리 차단 우회)
  sfxCache: {},
  bgmVolume: 0.5,
  sfxVolume: 0.8,
  muted: false,

  // 💡 화면 첫 터치 시 무음으로 재생했다가 바로 멈춰서 브라우저에 오디오 권한 등록
  initUnlock() {
    try {
      // 소리 없는 0.1초짜리 투명 음원을 임시로 삽입하여 에러 원천 차단
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

  playSFX(src) {
    if (this.muted) return;
    const audio = new Audio(src);
    audio.volume = this.sfxVolume;
    audio.play().catch(()=>{});
  },

  toggleMute() {
    this.muted = !this.muted;
    this.bgm.volume = this.muted ? 0 : this.bgmVolume;
    return this.muted;
  }
};
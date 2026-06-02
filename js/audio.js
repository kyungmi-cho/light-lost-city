// =====================================================
// AudioManager — BGM / SFX 관리
// =====================================================

const AudioManager = {
  bgm: null,
  sfxCache: {},
  bgmVolume: 0.5,
  sfxVolume: 0.8,
  muted: false,

  // BGM 재생
  playBGM(src, loop = true) {
    this.stopBGM();
    this.bgm = new Audio(src);
    this.bgm.loop = loop;
    this.bgm.volume = this.muted ? 0 : this.bgmVolume;
    this.bgm.play().catch(() => {});
  },

  // BGM 정지
  stopBGM() {
    if (this.bgm) {
      this.bgm.pause();
      this.bgm.currentTime = 0;
      this.bgm = null;
    }
  },

  // BGM 페이드아웃
  fadeBGM(duration = 1000) {
    if (!this.bgm) return;
    const step = this.bgm.volume / (duration / 50);
    const fade = setInterval(() => {
      if (this.bgm && this.bgm.volume > step) {
        this.bgm.volume -= step;
      } else {
        clearInterval(fade);
        this.stopBGM();
      }
    }, 50);
  },

  // SFX 재생
  playSFX(src) {
    if (this.muted) return;
    const audio = new Audio(src);
    audio.volume = this.sfxVolume;
    audio.play().catch(() => {});
  },

  // 뮤트 토글
  toggleMute() {
    this.muted = !this.muted;
    if (this.bgm) this.bgm.volume = this.muted ? 0 : this.bgmVolume;
    return this.muted;
  }
};

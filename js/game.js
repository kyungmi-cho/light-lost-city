// =====================================================
// game.js — 메인 게임 컨트롤러
// 화면 전환 / 상태 관리 / 전체 흐름 제어
// =====================================================

const Game = {

  // ── 초기화 ──
  init() {
    this.setupEventListeners();
    // 스플래시 대신 첫 터치 화면을 띄움
    this.showScreen('init');
    document.getElementById('screen-init').addEventListener('click', () => {
      // 빈 사운드를 재생하여 오디오 권한을 얻어냄
      AudioManager.playSFX(CONFIG.SOUNDS.SFX.CLICK); 
      this.showScreen('splash');
      this.runSplash();
    }, { once: true });
  },

  // ── 화면 전환 ──
  showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const el = document.getElementById('screen-' + id);
    if (el) el.classList.add('active');
    GameState.currentScreen = id;
  },

  // ── 이벤트 리스너 ──
  setupEventListeners() {
    // 뮤트 버튼
    document.getElementById('mute-btn').addEventListener('click', () => {
      const muted = AudioManager.toggleMute();
      document.getElementById('mute-btn').textContent = muted ? '🔇' : '🔊';
      AudioManager.playSFX(CONFIG.SOUNDS.SFX.CLICK);
    });

    // 이탈 경고
    window.addEventListener('beforeunload', (e) => {
      if (['battle','visual-novel','character','roulette','login'].includes(GameState.currentScreen)) {
        e.preventDefault();
        e.returnValue = '';
      }
    });

    // 팝업 버튼
    document.getElementById('popup-ok').addEventListener('click', () => {
      document.getElementById('exit-popup').classList.remove('show');
      GameState.reset();
      AudioManager.stopBGM();
      this.showScreen('title');
      AudioManager.playBGM(CONFIG.SOUNDS.BGM.START);
    });
    document.getElementById('popup-cancel').addEventListener('click', () => {
      document.getElementById('exit-popup').classList.remove('show');
    });
  },

  // ── 1. 스플래시 ──
  async runSplash() {
    const logo1 = document.getElementById('splash-logo-jeil');
    const logo2 = document.getElementById('splash-logo-inclass');

    // 제일전기 로고
    AudioManager.playSFX(CONFIG.SOUNDS.SFX.LOGO_JEIL);
    logo1.classList.add('show');
    await sleep(2000);
    logo1.classList.remove('show');
    await sleep(600);

    // 인클래스 로고
    AudioManager.playSFX(CONFIG.SOUNDS.SFX.LOGO_INCLASS);
    logo2.classList.add('show');
    await sleep(2000);
    logo2.classList.remove('show');
    await sleep(600);

    // 타이틀로
    this.showScreen('title');
    AudioManager.playBGM(CONFIG.SOUNDS.BGM.START);
  },

  // ── 2. 타이틀 ──
  initTitle() {
    document.getElementById('screen-title').addEventListener('click', () => {
      AudioManager.playSFX(CONFIG.SOUNDS.SFX.START_BTN);
      this.showScreen('character');
      Screens.initCharacterSelect();
    }, { once: true });
  },

  // ── 로딩 표시 ──
  showLoading(msg) {
    const el = document.getElementById('loading-overlay');
    document.getElementById('loading-text').textContent = msg || '잠시만요...';
    el.classList.add('show');
  },
  hideLoading() {
    document.getElementById('loading-overlay').classList.remove('show');
  },

  // ── 이탈 경고 팝업 ──
  showExitPopup() {
    document.getElementById('exit-popup').classList.add('show');
  }
};

// ── 유틸 ──
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ── 시작 ──
window.addEventListener('DOMContentLoaded', () => {
  Game.init();
  Game.initTitle();
});

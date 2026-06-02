// =====================================================
// game.js — 메인 게임 컨트롤러 (최종 에러 방어 완벽 적용)
// =====================================================

const Game = {
  isStarted: false, // 중복 클릭 방지용 안전장치

  // ── 초기화 ──
  init() {
    this.setupEventListeners();
    this.showScreen('init');
    
    const initScreen = document.getElementById('screen-init');
    
    // 💡 이벤트 중복 실행(오디오 겹침) 완벽 차단 핸들러
    const startHandler = (e) => {
      // 모바일에서 touchstart가 발생하면 뒤따라오는 click을 무시하도록 처리
      if (e && e.type === 'touchstart') {
        e.preventDefault(); 
      }
      
      if (this.isStarted) return; 
      this.isStarted = true;
      
      try { 
        if (typeof AudioManager !== 'undefined') {
          if (AudioManager.initUnlock) AudioManager.initUnlock(); 
          if (AudioManager.playSFX) AudioManager.playSFX(CONFIG.SOUNDS.SFX.CLICK); 
        }
      } catch(err) {}
      
      try {
        const docEl = document.documentElement;
        if (docEl.requestFullscreen) docEl.requestFullscreen().catch(()=>{});
        else if (docEl.webkitRequestFullscreen) docEl.webkitRequestFullscreen();
      } catch(err) {}

      this.showScreen('splash');
      this.runSplash();
    };

    if (initScreen) {
      // 터치와 클릭을 모두 걸어두되, 터치가 작동하면 클릭은 방어되도록 설계
      initScreen.addEventListener('touchstart', startHandler, { passive: false });
      initScreen.addEventListener('click', startHandler);
    }
  },

  showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const el = document.getElementById('screen-' + id);
    if (el) el.classList.add('active');
    
    if (typeof GameState !== 'undefined') {
      GameState.currentScreen = id;
    }
  },

  setupEventListeners() {
    const muteBtn = document.getElementById('mute-btn');
    if (muteBtn) {
      muteBtn.addEventListener('click', () => {
        if (typeof AudioManager !== 'undefined' && AudioManager.toggleMute) {
          const muted = AudioManager.toggleMute();
          muteBtn.textContent = muted ? '🔇' : '🔊';
          if (AudioManager.playSFX) AudioManager.playSFX(CONFIG.SOUNDS.SFX.CLICK);
        }
      });
    }

    window.addEventListener('beforeunload', (e) => {
      if (typeof GameState !== 'undefined' && ['battle','visual-novel','character','roulette','login'].includes(GameState.currentScreen)) {
        e.preventDefault();
        e.returnValue = '';
      }
    });
  },

  async runSplash() {
    const logo1 = document.getElementById('splash-logo-jeil');
    const logo2 = document.getElementById('splash-logo-inclass');

    if (typeof AudioManager !== 'undefined' && AudioManager.playSFX) {
      AudioManager.playSFX(CONFIG.SOUNDS.SFX.LOGO_JEIL);
    }
    if (logo1) logo1.classList.add('show');
    await sleep(2000);
    if (logo1) logo1.classList.remove('show');
    await sleep(600);

    if (typeof AudioManager !== 'undefined' && AudioManager.playSFX) {
      AudioManager.playSFX(CONFIG.SOUNDS.SFX.LOGO_INCLASS);
    }
    if (logo2) logo2.classList.add('show');
    await sleep(2000);
    if (logo2) logo2.classList.remove('show');
    await sleep(600);

    this.showScreen('title');
    if (typeof AudioManager !== 'undefined' && AudioManager.playBGM) {
      AudioManager.playBGM(CONFIG.SOUNDS.BGM.START);
    }
    this.initTitle(); // 타이틀 진입 시 버튼 활성화
  },

  initTitle() {
    const titleScreen = document.getElementById('screen-title');
    if (titleScreen) {
      titleScreen.addEventListener('click', () => {
        if (typeof AudioManager !== 'undefined' && AudioManager.playSFX) {
          AudioManager.playSFX(CONFIG.SOUNDS.SFX.START_BTN);
        }
        this.showScreen('character');
        if (typeof Screens !== 'undefined' && Screens.initCharacterSelect) {
          Screens.initCharacterSelect();
        }
      }, { once: true });
    }
  },

  showLoading(msg) {
    const el = document.getElementById('loading-overlay');
    const textEl = document.getElementById('loading-text');
    if (textEl) textEl.textContent = msg || '잠시만요...';
    if (el) el.classList.add('show');
  },
  
  hideLoading() {
    const el = document.getElementById('loading-overlay');
    if (el) el.classList.remove('show');
  }
};

// 공통 대기 함수
function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// =====================================================
// 💡 이 부분이 빠져서 그동안 클릭이 안 되었던 것입니다! (게임 실행 코드)
// =====================================================
window.onload = () => {
  Game.init();
};
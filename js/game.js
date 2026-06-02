// =====================================================
// game.js — 메인 게임 컨트롤러 (최종 에러 방어 완벽 적용)
// =====================================================

const Game = {
  isStarted: false, // 중복 클릭 방지용 안전장치

  init() {
    this.setupEventListeners();
    this.showScreen('init');
    
    const initScreen = document.getElementById('screen-init');
    
    // 💡 가장 안전한 클릭/터치 통합 핸들러 (에러 무시하고 강제 진행)
    const startHandler = () => {
      if (this.isStarted) return; 
      this.isStarted = true;
      
      // 오디오 권한 요청 (에러 나도 무시)
      try { 
        if (typeof AudioManager !== 'undefined') {
          if (AudioManager.initUnlock) AudioManager.initUnlock(); 
          if (AudioManager.playSFX) AudioManager.playSFX(CONFIG.SOUNDS.SFX.CLICK); 
        }
      } catch(err) { console.warn("오디오 권한 획득 스킵"); }
      
      // 전체화면 강제 시도 (에러 나도 무시)
      try {
        const docEl = document.documentElement;
        if (docEl.requestFullscreen) docEl.requestFullscreen().catch(()=>{});
        else if (docEl.webkitRequestFullscreen) docEl.webkitRequestFullscreen();
      } catch(err) { console.warn("전체화면 스킵"); }

      // 💡 무조건 다음 스플래시 화면으로 강제 이동
      this.showScreen('splash');
      this.runSplash();
    };

    // 화면을 멈추게 할 수 있는 요소를 모두 제거하고 단순 이벤트만 등록
    if (initScreen) {
      initScreen.addEventListener('click', startHandler);
      initScreen.addEventListener('touchstart', startHandler);
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
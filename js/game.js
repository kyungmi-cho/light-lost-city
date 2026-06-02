// =====================================================
// game.js — 메인 게임 컨트롬러 (최종 에러 방어 완벽 적용)
// =====================================================

const Game = {
  isStarted: false, // 중복 클릭 방지용 안전장치

  // ── 초기화 ──
  // ── 초기화 ──
  init() {
    this.setupEventListeners();
    this.showScreen('init');
    
    const initScreen = document.getElementById('screen-init');
    
    const startHandler = (e) => {
      // 터치 이벤트 중복 차단
      if (e && e.type === 'touchstart') e.preventDefault(); 
      
      if (this.isStarted) return; 
      this.isStarted = true;
      
      try { 
        if (typeof AudioManager !== 'undefined') {
          if (AudioManager.initUnlock) AudioManager.initUnlock(); 
          if (AudioManager.playSFX) AudioManager.playSFX(CONFIG.SOUNDS.SFX.CLICK); 
        }
      } catch(err) {}
      
      // 🚨 문제의 원인이었던 전체화면(Fullscreen) 강제 요청 로직을 완전히 삭제했습니다.
      // 이제 브라우저 기본 창 크기에 맞춰 자연스럽게 렌더링되며, 알럿 창이 떠도 화면이 깨지지 않습니다.

      this.showScreen('splash');
      this.runSplash();
    };

    if (initScreen) {
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
// 📱 모바일 뷰포트 높이 보정 (--vh)
// style.css 의 calc(var(--vh, 1vh) * 100) 에서 쓰는 실제 화면 높이 값.
// iOS Safari / 구형 안드로이드는 주소창이 100vh 에 포함되어 하단 UI 가
// 잘리거나 스크롤 시 레이아웃이 튀는데, window.innerHeight 기준으로
// 실측해서 채워주면 그 문제가 사라진다.
// =====================================================
function setVH() {
  document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
}

// 스크립트 로드 즉시 1회 적용 (첫 페인트 전에 최대한 반영)
setVH();

// 창 크기 변경 / 화면 회전 시 갱신
//  - resize: 주소창이 접혔다 펴질 때도 발생
//  - orientationchange: 회전 직후엔 innerHeight 가 갱신 전인 경우가 있어
//    약간의 지연 후 다시 측정한다.
window.addEventListener('resize', setVH);
window.addEventListener('orientationchange', () => setTimeout(setVH, 200));

// =====================================================
// 💡 이 부분이 빠져서 그동안 클릭이 안 되었던 것입니다! (게임 실행 코드)
// =====================================================
window.onload = () => {
  setVH(); // 로드 완료 후 최종 확정
  Game.init();
};
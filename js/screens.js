// =====================================================
// screens.js — 각 화면 렌더링 / 인터랙션
// =====================================================

const Screens = {

  // ── 3. 캐릭터 선택 ──
  initCharacterSelect() {
    let selected = null;
    const cards = document.querySelectorAll('.char-card');
    const confirmBtn = document.getElementById('char-confirm-btn');

    cards.forEach(card => {
      card.addEventListener('click', () => {
        AudioManager.playSFX(CONFIG.SOUNDS.SFX.CHARACTER);
        cards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        selected = card.dataset.char;
        confirmBtn.disabled = false;
      });
    });

    confirmBtn.addEventListener('click', () => {
      if (!selected) return;
      AudioManager.playSFX(CONFIG.SOUNDS.SFX.CLICK);
      GameState.character = selected;
      GameState.resetPlayerStats();
      Game.showScreen('roulette');
      this.initRoulette();
    });
  },

  // ── 4. 닉네임 룰렛 ──
  initRoulette() {
    let spinning = false;
    let confirmed = false;
    let currentNick = '';
    const display = document.getElementById('roulette-name');
    const spinBtn = document.getElementById('btn-spin');
    const confirmBtn = document.getElementById('btn-confirm');

    const spin = () => {
      if (spinning) return;
      spinning = true;
      confirmed = false;
      confirmBtn.disabled = true;
      AudioManager.playSFX(CONFIG.SOUNDS.SFX.SPIN);
      display.classList.add('spinning');

      let count = 0;
      const total = 20 + Math.floor(Math.random() * 15);
      const interval = setInterval(() => {
        const adj = CONFIG.NICKNAME.adjectives[Math.floor(Math.random() * CONFIG.NICKNAME.adjectives.length)];
        const noun = CONFIG.NICKNAME.nouns[Math.floor(Math.random() * CONFIG.NICKNAME.nouns.length)];
        display.textContent = adj + ' ' + noun;
        count++;
        if (count >= total) {
          clearInterval(interval);
          spinning = false;
          confirmed = false;
          display.classList.remove('spinning');
          currentNick = display.textContent;
          confirmBtn.disabled = false;
        }
      }, 80);
    };

    spinBtn.addEventListener('click', spin);
    confirmBtn.addEventListener('click', () => {
      if (!currentNick) return;
      AudioManager.playSFX(CONFIG.SOUNDS.SFX.CLICK);
      GameState.nickname = currentNick;
      Game.showScreen('login');
      this.initLogin();
    });

    // 자동으로 한번 돌리기
    spin();
  },

  // ── 5. 로그인 게이트웨이 ──
  initLogin() {
    const startBtn = document.getElementById('btn-start-journey');
    const guestBtn = document.getElementById('btn-guest');
    const userIdInput = document.getElementById('input-user-id');
    const marketingCheck = document.getElementById('check-marketing');

    startBtn.addEventListener('click', async () => {
      const userId = userIdInput.value.trim();
      if (!userId) {
        userIdInput.focus();
        userIdInput.style.borderColor = 'var(--c-red)';
        setTimeout(() => userIdInput.style.borderColor = '', 1500);
        return;
      }
      AudioManager.playSFX(CONFIG.SOUNDS.SFX.START_BTN);
      GameState.userId = userId;
      GameState.marketing = marketingCheck.checked;
      GameState.isGuest = false;
      if (GameState.marketing) GameState.lives += CONFIG.GAME.MARKETING_BONUS_LIVES;
      await this.startGame();
    });

    guestBtn.addEventListener('click', () => {
      if (!confirm('Guest로 진행하면 할인쿠폰 및 이벤트 혜택을 받을 수 없습니다.\n그래도 진행하시겠습니까?')) return;
      AudioManager.playSFX(CONFIG.SOUNDS.SFX.CLICK);
      GameState.isGuest = true;
      GameState.userId = 'Guest';
      this.startGame();
    });
  },

  // ── 게임 시작 (오프닝) ──
  async startGame() {
    GameState.gameStartTime = Date.now(); // 💡 여정 시작(스타트)을 누른 시점 기록!
    Game.showLoading('오프닝 로딩 중...');
    await sleep(500);
    Game.hideLoading();
    AudioManager.fadeBGM(800);
    await sleep(900);
    AudioManager.playBGM(CONFIG.SOUNDS.BGM.OPENING, false);
    Game.showScreen('visual-novel');
    VisualNovel.playOpening(() => {
      Battle.startLevel(1);
    });
  },

  // ── 11. 레벨 클리어 인터미션 ──
  // ── 11. 레벨 클리어 인터미션 ──
  showClear(level) {
    AudioManager.stopBGM(); // 💡 4번 문제 해결: 모바일 배경음 무한 겹침 방지 (강제 종료)
    AudioManager.playSFX(CONFIG.SOUNDS.SFX.WIN);
    Game.showScreen('clear');

    const lv = CONFIG.LEVELS[level];
    const quotes = {
      1: '윙... 고작 기초 상식에서 막힐 줄은... 다음엔 더 센 친구가 기다릴 거야!',
      2: '......인정합니다. 당신의 전기 상식 훌륭하군요. 하지만 다음은 더 복잡할 거예요...',
      3: '으아아... 내가 이렇게 졌다고?! 하지만 보스는 차원이 달라!',
    };
    const stats = {
      1: '⚡ 공격력 +5 상승!',
      2: '❤️ 최대 HP +20 상승!',
      3: '⚡ 공격력 +10 상승!',
    };

    document.getElementById('clear-villain-quote').textContent = quotes[level] || '';
    document.getElementById('clear-stat').textContent = stats[level] || '';

    // 스탯 실제 적용
    if (level === 1) GameState.player.atk += 5;
    if (level === 2) { 
      GameState.player.maxHp += 20; 
      GameState.player.hp = GameState.player.maxHp; 
    }
    if (level === 3) GameState.player.atk += 10;

    GameState.player.hp = GameState.player.maxHp;
    document.getElementById('btn-next-level').onclick = () => {
      AudioManager.playSFX(CONFIG.SOUNDS.SFX.CLICK);
      Battle.startLevel(level + 1);
    };
  },

  // ── 게임 오버 ──
  showGameOver() {
    AudioManager.fadeBGM(800);
    AudioManager.playSFX(CONFIG.SOUNDS.SFX.GAME_OVER);
    Game.showScreen('gameover');

    const hasLives = GameState.lives > 0;
    document.getElementById('gameover-msg').textContent = hasLives
      ? `패배...! 아직 기회가 있다.\n다시 일어서라, ${GameState.nickname}!`
      : `모든 목숨을 잃었다...\n처음부터 다시 시작해야 한다. 포기하지 말거라!`;

    document.getElementById('btn-retry').style.display = hasLives ? 'block' : 'none';
    document.getElementById('btn-retry').onclick = () => {
  AudioManager.playSFX(CONFIG.SOUNDS.SFX.CLICK);
  GameState.player.hp = GameState.player.maxHp; // ❤️ HP 회복 로직 추가
  Battle.startLevel(GameState.currentLevel);
};
    document.getElementById('btn-restart').onclick = () => {
      AudioManager.playSFX(CONFIG.SOUNDS.SFX.CLICK);
      GameState.reset();
      AudioManager.stopBGM();
      Game.showScreen('title');
      AudioManager.playBGM(CONFIG.SOUNDS.BGM.START);
      Game.initTitle(); // 💡 타이틀 클릭 이벤트를 다시 활성화! (이 줄 추가)
    };
  },

  // ── 엔딩 ──
  async showEnding() {
    AudioManager.stopBGM(); // 💡 4번 문제 해결: 엔딩 진입 시 모바일 브라우저 버그 방지
    await sleep(500); // 딜레이 살짝 단축
    AudioManager.playBGM(CONFIG.SOUNDS.BGM.ENDING, false);
    Game.showScreen('visual-novel');
    VisualNovel.playEnding(() => {
      this.showReward();
    });
  },

  // ── 보상 화면 ──
  async showReward() {
    Game.showScreen('reward');
    document.getElementById('badge-nickname').textContent = GameState.nickname;

    const couponEl = document.getElementById('reward-coupon');
    if (!GameState.isGuest) {
      couponEl.innerHTML = `⚡ 전기도둑 소탕 완료! 쿠폰 발급 중...`;
    }

    let issuedCoupon = "발급 실패 (관리자 문의)";
    
    // 💡 플레이 타임 계산 (초 단위)
    const playTimeSec = GameState.gameStartTime ? Math.floor((Date.now() - GameState.gameStartTime) / 1000) : 0;

    try {
      // 서버에 클리어 정보와 플레이 타임 전송 & 쿠폰 번호 받아오기
      const res = await API.saveLog({
        nickname: GameState.nickname,
        userId: GameState.userId,
        marketing: GameState.marketing,
        character: GameState.character,
        level: 4,
        cleared: true,
        playTime: playTimeSec
      });

      if (res.success && res.couponCode) {
        issuedCoupon = res.couponCode;
      } else if (res.error) {
        issuedCoupon = res.error;
      }
    } catch (err) {
      console.error("쿠폰 수신 실패:", err);
    }

    const rewardScreen = document.getElementById('screen-reward');

    if (GameState.isGuest) {
      document.getElementById('reward-coupon').style.display = 'none';
      document.getElementById('reward-msg').textContent = '모든 퀘스트를 해결하였습니다.';
    } else {
      document.getElementById('reward-msg').innerHTML =
        `모든 퀘스트를 해결하여 영웅의 칭호를 획득하였습니다.<br>
         아래 쿠폰 번호를 복사하여 제일전기기술학원 > 마이페이지 > 쿠폰 에 등록하면<br>
         패스 <b style="color:var(--c-gold)">10% 할인</b>을 받으실 수 있습니다.`;
      // 💡 쿠폰 복사 UI 및 자동 응모 문구 렌더링
      couponEl.innerHTML = `
        <div style="font-size: 0.9em; margin-bottom: 8px;">🎉 완주 인증 이벤트는 <b style="color:var(--hp-green);">자동으로 응모</b>되었습니다! (~6/30까지)</div>
        <div style="display: inline-flex; align-items: center; gap: 8px; background: rgba(0,0,0,0.3); padding: 8px 16px; border-radius: 8px; border: 1px solid rgba(255,215,0,0.3);">
          <span style="color: var(--c-gray); font-size: 0.9em;">나만의 쿠폰 번호:</span>
          <b id="coupon-code-text" style="color:var(--c-gold); font-size:1.2em; letter-spacing: 1px;">${issuedCoupon}</b>
          <button id="btn-copy-coupon" style="padding: 4px 8px; background: rgba(255,215,0,0.2); border: 1px solid var(--c-gold); color: var(--c-gold); border-radius: 4px; cursor: pointer; font-family: var(--font-ko); font-size: 11px; margin-left: 5px; transition: 0.2s;">
            복사하기
          </button>
        </div>
        <div style="font-size: 0.8em; color: var(--c-gray); margin-top: 8px;">쿠폰은 발급 후 3일 내 사용 가능</div>
      `;

      // 복사 버튼 클릭 이벤트
      setTimeout(() => {
        const copyBtn = document.getElementById('btn-copy-coupon');
        if (copyBtn) {
          copyBtn.onclick = () => {
            AudioManager.playSFX(CONFIG.SOUNDS.SFX.CLICK);
            navigator.clipboard.writeText(issuedCoupon).then(() => {
              copyBtn.textContent = "복사 완료!";
              copyBtn.style.background = "var(--c-gold)";
              copyBtn.style.color = "var(--c-dark)";
              setTimeout(() => {
                copyBtn.textContent = "복사하기";
                copyBtn.style.background = "rgba(255,215,0,0.2)";
                copyBtn.style.color = "var(--c-gold)";
              }, 2000);
            }).catch(() => {
              alert("URL 복사에 실패했습니다. 직접 드래그해서 복사해주세요.");
            });
          };
        }
      }, 100);
    }

    // 종료 5.5초 후 인터랙션 버튼 페이드인 (기존과 동일)
    setTimeout(() => {
      const existingBtns = document.getElementById('reward-final-btns');
      if (existingBtns) existingBtns.remove();

      const btnHTML = `
        <div id="reward-final-btns" style="display:flex; gap:15px; margin-top:25px; animation: fadeIn 1.5s ease; z-index:10;">
          <button id="btn-final-return" style="padding: 12px 20px; background: transparent; border: 2px solid var(--c-gold); color: var(--c-gold); font-family: var(--font-ko); font-size: clamp(10px, 1.5vw, 18px); border-radius: 8px; cursor: pointer; transition: 0.2s;">
            처음으로 돌아가기 ↺
          </button>
        </div>
      `;
      rewardScreen.insertAdjacentHTML('beforeend', btnHTML);

      document.getElementById('btn-final-return').onclick = () => {
        AudioManager.playSFX(CONFIG.SOUNDS.SFX.CLICK);
        GameState.reset();
        AudioManager.stopBGM();
        Game.showScreen('title');
        AudioManager.playBGM(CONFIG.SOUNDS.BGM.START);
        Game.initTitle(); 
      };
    }, 5500);
  }
}
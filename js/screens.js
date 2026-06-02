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
      if (!confirm('ID 없이 진행하면 할인 쿠폰 및 이벤트 혜택을 받을 수 없습니다.\n그래도 Guest로 진행하시겠습니까?')) return;
      AudioManager.playSFX(CONFIG.SOUNDS.SFX.CLICK);
      GameState.isGuest = true;
      GameState.userId = 'Guest';
      this.startGame();
    });
  },

  // ── 게임 시작 (오프닝) ──
  async startGame() {
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
  showClear(level) {
    AudioManager.playSFX(CONFIG.SOUNDS.SFX.WIN);
    Game.showScreen('clear');

    const lv = CONFIG.LEVELS[level];
    const quotes = {
      1: '윙... 고작 기초 상식에서 막힐 줄은... 다음엔 더 센 친구가 기다릴 거야!',
      2: '......인정합니다. 전기 이론에서 제가 졌군요. 다음은 더 복잡할 거예요...',
      3: '으아아... 회로이론까지 꿰고 있다고?! 위에 보스는 차원이 달라!',
    };
    const stats = {
      1: '⚡ 공격력 +5 상승!',
      2: '❤️ 최대 HP +20 상승!',
      3: '⚡ 공격력 +10 상승!',
    };

    document.getElementById('clear-villain-quote').textContent = quotes[level] || '';
    document.getElementById('clear-stat').textContent = stats[level] || '';

    // 스탯 실제 적용 (수정 부분)
    if (level === 1) GameState.player.atk += 5;
    if (level === 2) { 
      GameState.player.maxHp += 20; // 💡 10에서 20으로 상향!
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
    AudioManager.fadeBGM(1000);
    await sleep(1100);
    AudioManager.playBGM(CONFIG.SOUNDS.BGM.ENDING, false);
    Game.showScreen('visual-novel');
    VisualNovel.playEnding(() => {
      this.showReward();
    });
  },

  // ── 보상 화면 ──
  showReward() {
    Game.showScreen('reward');
    document.getElementById('badge-nickname').textContent = GameState.nickname;

    // 로그 저장
    API.saveLog({
      nickname: GameState.nickname,
      userId: GameState.userId,
      marketing: GameState.marketing,
      character: GameState.character,
      level: 4,
      cleared: true,
    });

    if (GameState.isGuest) {
      document.getElementById('reward-coupon').style.display = 'none';
      document.getElementById('reward-msg').textContent = '모든 퀘스트를 해결하였습니다.';
      setTimeout(() => {
        document.getElementById('screen-reward').style.animation = 'fadeOut 2s ease forwards';
      }, 4000);
    } else {
      document.getElementById('reward-msg').innerHTML =
        `모든 퀘스트를 해결하여 영웅의 칭호를 획득하였습니다.<br>익일 전기기사/산업기사 패스 <b style="color:var(--c-gold)">15% 할인권</b>이 지급됩니다.`;
      document.getElementById('reward-coupon').innerHTML =
        `🎉 이벤트 응모 완료 (~6/30까지)<br>쿠폰은 발급 후 7일 내 사용 가능`;
    }
  }
};

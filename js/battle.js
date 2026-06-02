// =====================================================
// battle.js — 배틀 시스템
// HP / 타이머 / 퀴즈 / 콤보 / 크리티컬
// =====================================================

const Battle = {

  // ── 레벨 시작 ──
  async startLevel(level) {
    GameState.currentLevel = level;
    GameState.resetBattle();
    const bg = CONFIG.IMAGES.BG_BATTLE[level];
    
    // 💡 시퀀스가 천천히 넘어가도록 대기 시간 추가
    Game.showLoading('전기 도둑의 기운이 느껴진다...');
    await sleep(1500); 
    Game.hideLoading();

    // 💡 대화 시작 전, 빌런 등장부터 배틀 브금을 웅장하게 미리 재생
    if (level === 4) {
      AudioManager.playBGM(CONFIG.SOUNDS.BGM.BOSS); // Lv.4는 보스 BGM
    } else {
      AudioManager.playBGM(CONFIG.SOUNDS.BGM.BATTLE); // 나머지는 일반 배틀 BGM
    }

    VisualNovel.playVillainIntro(level, bg, async () => {
      Game.showLoading('전투 준비 중...');
      try {
        const data = await API.fetchQuiz(level);
        GameState.battle.questions = data.questions;
      } catch (e) {
        Game.hideLoading();
        alert('퀴즈 로딩 실패. 다시 시도해주세요.');
        return;
      }
      Game.hideLoading();
      
      this.renderBattleScreen(level);
      Game.showScreen('battle');

      // 💡 바로 타이머를 시작하지 않고 카운트다운 시퀀스로 넘김
      this.startBattleSequence(level);
    });
  },

// ── 카운트다운 & 튜토리얼 관리 함수 ──
  async startBattleSequence(level) {
    // 💡 피드백 3번 반영: 카운트다운 시작 전 타이머와 HP바를 화면에 즉시 120초/풀피로 렌더링
    const timerEl = document.getElementById('timer-value');
    timerEl.textContent = GameState.battle.timer;
    timerEl.className = 'timer-value';
    this.updateHPBars();

    const runCountdown = async () => {
      const cdOverlay = document.getElementById('countdown-overlay');
      const cdText = document.getElementById('countdown-text');
      cdOverlay.style.display = 'flex';
      
      for(let i = 3; i > 0; i--) {
        cdText.textContent = i;
        // 💡 피드백 2번 반영: 3, 2, 1 틱 사운드
        AudioManager.playSFX(CONFIG.SOUNDS.SFX.COUNT_TICK);
        await sleep(1000);
      }
      
      cdText.textContent = 'START!';
      // 💡 피드백 2번 반영: START 사운드
      AudioManager.playSFX(CONFIG.SOUNDS.SFX.COUNT_START);
      await sleep(800);
      cdOverlay.style.display = 'none';
      
      this.startTimer();
      this.nextQuestion();
    };

    if (level === 1) {
      const tut = document.getElementById('tutorial-overlay');
      tut.style.display = 'flex';
      document.getElementById('btn-close-tutorial').onclick = () => {
        AudioManager.playSFX(CONFIG.SOUNDS.SFX.CLICK);
        tut.style.display = 'none';
        runCountdown();
      };
    } else {
      await sleep(500);
      runCountdown();
    }
  },

  // ── 배틀 화면 렌더링 ──
  renderBattleScreen(level) {
    const bg = document.querySelector('.battle-bg');
    bg.style.backgroundImage = `url(${CONFIG.IMAGES.BG_BATTLE[level]})`;

    const ch = CONFIG.CHARACTERS[GameState.character];
    const lv = CONFIG.LEVELS[level];

    // 플레이어 스프라이트
    document.getElementById('battle-player-img').src = CONFIG.IMAGES.PLAYER[GameState.character].idle;

    // 빌런 스프라이트
    const villainImg = document.getElementById('battle-villain-img');
    villainImg.src = CONFIG.IMAGES.VILLAIN[level].idle;
    villainImg.className = 'battle-villain' + (level === 4 ? ' boss' : '');

    this.updateHPBars();
    this.updateLives();
  },

  // ── HP바 업데이트 ──
  updateHPBars() {
    // 💡 새로 추가: 룰렛에서 설정된 주인공의 닉네임으로 HP바 이름 즉시 변경
    document.getElementById('player-name').textContent = GameState.nickname;

    // 플레이어
    const pRatio = GameState.player.hp / GameState.player.maxHp * 100;
    const pBar = document.getElementById('player-hp-bar');
    // ... 이하 기존 코드 유지 ...
    pBar.style.width = Math.max(0, pRatio) + '%';
    pBar.className = 'hp-bar' + (pRatio <= 30 ? ' red' : pRatio <= 60 ? ' yellow' : '');
    document.getElementById('player-hp-text').textContent = `${GameState.player.hp}/${GameState.player.maxHp}`;

    // 빌런
    const vRatio = GameState.villain.hp / GameState.villain.maxHp * 100;
    const vBar = document.getElementById('villain-hp-bar');
    vBar.style.width = Math.max(0, vRatio) + '%';
    vBar.className = 'hp-bar' + (vRatio <= 30 ? ' red' : vRatio <= 60 ? ' yellow' : '');
    document.getElementById('villain-hp-text').textContent = `${GameState.villain.hp}/${GameState.villain.maxHp}`;

    document.getElementById('villain-name').textContent = CONFIG.LEVELS[GameState.currentLevel].name;

    // HP 경고음
    if (pRatio <= 30) {
      if (!this._alertPlaying) {
        this._alertPlaying = true;
        AudioManager.playSFX(CONFIG.SOUNDS.SFX.ALERT);
      }
    } else {
      this._alertPlaying = false;
    }
  },

  // ── 목숨 업데이트 ──
  updateLives() {
    const wrap = document.getElementById('lives-wrap');
    wrap.innerHTML = '';
    const maxLives = CONFIG.GAME.BASE_LIVES + (GameState.marketing ? CONFIG.GAME.MARKETING_BONUS_LIVES : 0);
    for (let i = 0; i < maxLives; i++) {
      const span = document.createElement('span');
      span.className = 'life-icon' + (i < GameState.lives ? '' : ' empty');
      span.textContent = '❤️';
      wrap.appendChild(span);
    }
  },

  // ── 타이머 ──
  startTimer() {
    GameState.battle.timerInterval = setInterval(() => {
      GameState.battle.timer--;
      const el = document.getElementById('timer-value');
      el.textContent = GameState.battle.timer;
      el.className = 'timer-value' + (GameState.battle.timer <= 30 ? ' warning' : '');

      if (GameState.battle.timer <= 0) {
        clearInterval(GameState.battle.timerInterval);
        this.onPlayerDefeat();
      }
    }, 1000);
  },

  // ── 다음 문제 ──
  nextQuestion() {
    const { questions, currentQ } = GameState.battle;
    if (currentQ >= questions.length) {
      // 문제 소진 — 남은 HP 있으면 그대로 계속 (재도전 시 중복 허용)
      GameState.battle.questions = [...questions];
      GameState.battle.currentQ = 0;
    }

    const q = GameState.battle.questions[GameState.battle.currentQ];
    this.showQuizModal(q);
  },

  // ── 퀴즈 모달 표시 ──
  showQuizModal(q) {
    const modal = document.getElementById('quiz-modal');
    const total = GameState.battle.questions.length;
    const cur = GameState.battle.currentQ + 1;

    document.getElementById('quiz-progress').textContent = `문제 ${cur} / ${total}`;
    document.getElementById('quiz-question').textContent = q.question;
    document.getElementById('quiz-explanation').textContent = '';
    document.getElementById('quiz-explanation').classList.remove('show');
    document.getElementById('hint-panel').classList.remove('show');
    document.getElementById('hint-panel').innerHTML = '';

    // O/X or 객관식
    const oxWrap = document.getElementById('quiz-ox');
    const optWrap = document.getElementById('quiz-options');
    oxWrap.style.display = 'none';
    optWrap.style.display = 'none';

    if (q.type === 'O/X') {
      oxWrap.style.display = 'flex';
      oxWrap.querySelectorAll('.quiz-ox-btn').forEach(btn => {
        btn.disabled = false;
        btn.className = 'quiz-ox-btn ' + btn.dataset.val;
        btn.onclick = () => this.submitAnswer(btn.dataset.val, q);
      });
    } else {
      optWrap.style.display = 'flex';
      optWrap.innerHTML = '';
      q.options.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option';
        btn.textContent = `${i+1}. ${opt}`;
        btn.onclick = () => this.submitAnswer(String(i+1), q, btn);
        optWrap.appendChild(btn);
      });
    }

    // 힌트 버튼
    const hintBtn = document.getElementById('quiz-hint-btn');
    hintBtn.textContent = (GameState.currentLevel >= 3 && q.hint.includes('youtube')) ? '🎬 영상 힌트 보기' : '💡 힌트 보기';
    hintBtn.onclick = () => this.showHint(q);

    modal.style.display = 'flex';
  },

  // ── 힌트 표시 ──
  showHint(q) {
    AudioManager.playSFX(CONFIG.SOUNDS.SFX.CLICK);
    const panel = document.getElementById('hint-panel');
    panel.classList.add('show');

    if (q.hint.includes('youtube.com/embed')) {
      panel.innerHTML = `<iframe src="${q.hint}" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
    } else {
      panel.textContent = q.hint || '힌트가 없습니다.';
    }
  },

  // ── 정답 제출 ──
  // ── 정답 제출 ──
  async submitAnswer(answer, q, btn) {
    const isCorrect = answer === q.answer;

    AudioManager.playSFX(isCorrect ? CONFIG.SOUNDS.SFX.CORRECT : CONFIG.SOUNDS.SFX.INCORRECT);
    
    // 버튼 비활성화
    document.querySelectorAll('.quiz-option, .quiz-ox-btn').forEach(b => b.disabled = true);

    // 정오답 표시 (안전장치 추가)
    if (q.type === 'O/X') {
      const btns = document.querySelectorAll('.quiz-ox-btn');
      
      // 💡 시트 데이터의 공백을 제거하고 무조건 대문자로 변환하여 비교
      const correctAns = String(q.answer).trim().toUpperCase(); 
      
      btns.forEach(b => {
        if (b.dataset.val === correctAns) {
          b.classList.add('highlight-answer'); // 정답 점등
        } else {
          b.classList.add('dimmed'); // 오답 소등
        }
      });
    } else if (btn) {
      // (이하 객관식 로직 기존과 동일)
      btn.classList.add(isCorrect ? 'correct' : 'wrong');
      if (!isCorrect) {
        document.querySelectorAll('.quiz-option').forEach((b, i) => {
          if (String(i+1) === String(q.answer).trim()) b.classList.add('correct');
        });
      }
    }

    // 해설
    if (q.explanation) {
      const expEl = document.getElementById('quiz-explanation');
      expEl.textContent = `💡 ${q.explanation}`;
      expEl.classList.add('show');
    }

    await sleep(1200);
    document.getElementById('quiz-modal').style.display = 'none';

    // 정오답 처리
    if (isCorrect) {
      await this.onCorrect(q);
    } else {
      await this.onWrong(q);
    }
  },

  // ── 정답 처리 ──
  async onCorrect(q) {
    
    GameState.battle.combo++;
    GameState.battle.turn++;

    // 💡 정답 사운드가 끝날 수 있도록 0.4초 대기 후 공격 애니메이션/사운드 시작
    await sleep(400); 

    // 플레이어 공격 애니메이션
    const playerImg = document.getElementById('battle-player-img');
    playerImg.src = CONFIG.IMAGES.PLAYER[GameState.character].attack;
    AudioManager.playSFX(CONFIG.SOUNDS.SFX.BASIC_PUNCH);

   // 콤보 보너스 계산
    let atk = GameState.player.atk;
    
    // 💡 3콤보 '배수'가 아니라 3콤보 '이상'인지 체크
    const isCombo = GameState.battle.combo >= CONFIG.GAME.COMBO_THRESHOLD; 
    
    if (isCombo) {
      // 💡 3콤보는 +2, 4콤보는 +4, 5콤보는 +6 ... 식으로 데미지가 점점 눈덩이처럼 불어남!
      const comboBonus = (GameState.battle.combo - CONFIG.GAME.COMBO_THRESHOLD + 1) * 2;
      atk += comboBonus;
      
      AudioManager.playSFX(CONFIG.SOUNDS.SFX.COMBO);
      
      // 화면에도 추가 데미지가 얼마 들어갔는지 시각적으로 띄워주면 타격감이 훨씬 좋아집니다
      this.showHitEffect(`COMBO! (+${comboBonus})`, 'crit', 'right'); 
    } else {
      this.showHitEffect('HIT!', 'hit', 'right');
    }
    // 콤보 표시
    if (GameState.battle.combo >= CONFIG.GAME.COMBO_THRESHOLD) {
      const comboEl = document.getElementById('combo-display');
      comboEl.textContent = `${GameState.battle.combo} COMBO!`;
      comboEl.classList.add('show');
    }

    await sleep(400);

    // 빌런 피격
    const villainImg = document.getElementById('battle-villain-img');
    villainImg.src = CONFIG.IMAGES.VILLAIN[GameState.currentLevel].hit;
    GameState.villain.hp = Math.max(0, GameState.villain.hp - atk);
    this.updateHPBars();

    await sleep(600);

    // 원상복구
    playerImg.src = CONFIG.IMAGES.PLAYER[GameState.character].idle;
    villainImg.src = CONFIG.IMAGES.VILLAIN[GameState.currentLevel].idle;
    document.getElementById('combo-display').classList.remove('show');

    // 빌런 사망 체크
    if (GameState.villain.hp <= 0) {
      await this.onVillainDefeat();
      return;
    }

    // 빌런 반격
    await this.villainAttack();
  },

  // ── 오답 처리 ──
  async onWrong(q) {
    GameState.battle.combo = 0;
    GameState.battle.turn++;

    // 💡 1. 플레이어 공격 애니메이션 (헛스윙)
    const playerImg = document.getElementById('battle-player-img');
    playerImg.src = CONFIG.IMAGES.PLAYER[GameState.character].attack;
    
    // 휙~ (Miss) 사운드 재생
    AudioManager.playSFX(CONFIG.SOUNDS.SFX.MISS);

    await sleep(400); // 헛스윙 동작 대기
    
    // 원상복구
    playerImg.src = CONFIG.IMAGES.PLAYER[GameState.character].idle;

    // 💡 2. 적 방향('right')에 MISS 이펙트 띄우기 (HP 변화 없음)
    if (GameState.currentLevel === 4) {
      const recover = CONFIG.LEVELS[4].hpRecoverOnWrong;
      GameState.villain.hp = Math.min(GameState.villain.maxHp, GameState.villain.hp + recover);
      this.showHitEffect(`MISS! (+${recover}HP)`, 'miss', 'right'); // 'right'로 변경
      this.updateHPBars();
      await sleep(600);
    } else {
      this.showHitEffect('MISS!', 'miss', 'right'); // 'right'로 변경
      await sleep(600);
    }

    // 3. 빌런 반격
    await this.villainAttack();
  },

  // ── 빌런 반격 ──
  async villainAttack() {
    GameState.battle.turn++;
    const isCritical = GameState.battle.turn % CONFIG.GAME.CRITICAL_TURN === 0;

    await sleep(300);

    // 빌런 공격 애니메이션
    const villainImg = document.getElementById('battle-villain-img');
    villainImg.src = CONFIG.IMAGES.VILLAIN[GameState.currentLevel].attack;

    let dmg = GameState.villain.atk;
    if (isCritical) {
      dmg += CONFIG.GAME.CRITICAL_DMG_BONUS;
      AudioManager.playSFX(CONFIG.SOUNDS.SFX.HARD_PUNCH);
      this.showHitEffect('CRITICAL!', 'crit', 'left');
    } else {
      AudioManager.playSFX(CONFIG.SOUNDS.SFX.BASIC_PUNCH);
      this.showHitEffect(`-${dmg}HP`, 'hit', 'left');
    }

    await sleep(400);

    // 플레이어 피격
    const playerImg = document.getElementById('battle-player-img');
    playerImg.src = CONFIG.IMAGES.PLAYER[GameState.character].hit;
    document.getElementById('screen-battle').classList.add('shake');

    GameState.player.hp = Math.max(0, GameState.player.hp - dmg);
    this.updateHPBars();

    await sleep(500);
    document.getElementById('screen-battle').classList.remove('shake');
    playerImg.src = CONFIG.IMAGES.PLAYER[GameState.character].idle;
    villainImg.src = CONFIG.IMAGES.VILLAIN[GameState.currentLevel].idle;

    // 플레이어 사망 체크
    if (GameState.player.hp <= 0) {
      await this.onPlayerDefeat();
      return;
    }

    // 다음 문제
    GameState.battle.currentQ++;
    await sleep(300);
    this.nextQuestion();
  },

  // ── 빌런 패배 ──
  async onVillainDefeat() {
    clearInterval(GameState.battle.timerInterval);
    AudioManager.fadeBGM(600);
    AudioManager.playSFX(CONFIG.SOUNDS.SFX.WIN);

    const villainImg = document.getElementById('battle-villain-img');
    villainImg.src = CONFIG.IMAGES.VILLAIN[GameState.currentLevel].dead;

    await sleep(1500);

    const level = GameState.currentLevel;
    const bg = CONFIG.IMAGES.BG_BATTLE[level];

    // 패배 대사 → 클리어 화면
    VisualNovel.playVillainDefeat(level, bg, () => {
      if (level >= 4) {
        Screens.showEnding();
      } else {
        Screens.showClear(level);
      }
    });
  },

  // ── 플레이어 패배 ──
  async onPlayerDefeat() {
    clearInterval(GameState.battle.timerInterval);
    GameState.lives--;
    this.updateLives();
    await sleep(800);
    Screens.showGameOver();
  },

  // ── HIT 이펙트 표시 ──
  showHitEffect(text, type, side) {
    const el = document.getElementById('hit-effect');
    el.textContent = text;
    el.className = `hit-effect ${type}`;
    el.style.left = side === 'left' ? '10%' : '55%';
    el.style.top = '40%';
    el.classList.add('show');
    setTimeout(() => { el.className = 'hit-effect'; }, 1000);
  }
};

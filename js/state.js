// =====================================================
// GameState — 전역 게임 상태 관리
// =====================================================

const GameState = {
  // 화면 상태
  currentScreen: 'splash',

  // 유저 정보
  nickname: '',
  userId: '',
  marketing: false,
  isGuest: false,
  character: null,   // 'pig' | 'eel' | 'firefly'

  // 게임 진행
  lives: 3,
  currentLevel: 1,

  // 플레이어 전투 스탯
  player: {
    hp: 100,
    maxHp: 100,
    atk: 15,
  },

  // 빌런 전투 스탯
  villain: {
    hp: 100,
    maxHp: 100,
    atk: 8,
  },

  // 배틀 상태
  battle: {
    questions: [],
    currentQ: 0,
    combo: 0,
    turn: 0,
    timer: 120,
    timerInterval: null,
    phase: 'idle', // 'idle' | 'quiz' | 'result' | 'villain_attack'
  },

  // 초기화
  reset() {
    this.nickname = '';
    this.userId = '';
    this.marketing = false;
    this.isGuest = false;
    this.character = null;
    this.lives = CONFIG.GAME.BASE_LIVES;
    this.currentLevel = 1;
    this.resetPlayerStats();
  },

  resetPlayerStats() {
    const ch = CONFIG.CHARACTERS[this.character] || CONFIG.CHARACTERS.pig;
    this.player.hp = ch.hp;
    this.player.maxHp = ch.hp;
    this.player.atk = ch.atk;
  },

  resetBattle() {
    this.battle.questions = [];
    this.battle.currentQ = 0;
    this.battle.combo = 0;
    this.battle.turn = 0;
    this.battle.timer = CONFIG.GAME.BATTLE_TIME;
    this.battle.phase = 'idle';
    if (this.battle.timerInterval) {
      clearInterval(this.battle.timerInterval);
      this.battle.timerInterval = null;
    }
    // 빌런 스탯 설정
    const lv = CONFIG.LEVELS[this.currentLevel];
    this.villain.hp = lv.hp;
    this.villain.maxHp = lv.hp;
    this.villain.atk = lv.atk;
  }
};

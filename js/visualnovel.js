// =====================================================
// visualnovel.js — 비주얼 노벨 / 오프닝 / 엔딩
// =====================================================

const VisualNovel = {
  scenes: [],
  currentIdx: 0,
  onComplete: null,
  isTyping: false,
  typeTimer: null,

  // ── 오프닝 스크립트 ──
  OPENING_SCENES: [
    { bg: 'images/backgrounds/bg_opening.png', speaker: '행인 1', portrait: null, text: '너무... 괴로워... 에어컨... 적어도 선풍기만이라도....' },
    { bg: 'images/backgrounds/bg_opening.png', speaker: '행인 2', portrait: null, text: '대... 대기전력이... 부족...ㅎ...ㅐ...' },
    { bg: 'images/backgrounds/bg_opening.png', speaker: '행인 3', portrait: null, text: '제발 이 열대야에서 우릴 구해줄 영웅이... 나타났으면...!' },
    { bg: 'images/backgrounds/bg_opening.png', speaker: '마스터 이종칠', portrait: 'master_silhouette', text: '[NICKNAME]이여...' },
    { bg: 'images/backgrounds/bg_opening.png', speaker: '마스터 이종칠', portrait: 'master', text: '보이다시피 한 때 찬란히 빛나던 이 도시는, 곳곳에 숨어든 전기 도둑들로 인해 거리가 칠흑 같은 어둠에 잠식되어 가고 있소.' },
    { bg: 'images/backgrounds/bg_opening.png', speaker: '마스터 이종칠', portrait: 'master', text: '이 혼란을 잠재우고 빛을 되찾기 위해선... 전기의 흐름을 완벽히 통제할 수 있는 지식을 가진 이가 필요하오.' },
    { bg: 'images/backgrounds/bg_opening.png', speaker: '마스터 이종칠', portrait: 'master', text: '오, 나의 부름을 받고 이 곳에 온 [NICKNAME]이여!' },
    { bg: 'images/backgrounds/bg_opening.png', speaker: '마스터 이종칠', portrait: 'master', text: '이제 이 도시를 구원할 유일한 희망인 그대, 부디 지식의 스파크를 모아 도둑들을 토벌하고 도시의 전원을 켜주시오!' },
    { bg: 'images/backgrounds/bg_opening.png', speaker: GameState.nickname || '영웅', portrait: null, isPlayer: true, text: '...반드시 해내겠습니다. 이 도시의 빛은 내가 되찾겠어요!' },
  ],

  // ── 배틀 진입 전 결의 대사 ──
  BATTLE_ENTRY: {
    1: [{ speaker: null, portrait: null, isPlayer: true, text: '첫 번째 전기 도둑... 가볍게 상대해주지. 덤벼라!' }],
    2: [{ speaker: null, portrait: null, isPlayer: true, text: '점점 만만치 않아지는군... 하지만 물러설 수 없어!' }],
    3: [{ speaker: null, portrait: null, isPlayer: true, text: '불법으로 전기를 훔치다니... 용서할 수 없다! 반드시 막아내겠어!' }],
    4: [{ speaker: null, portrait: null, isPlayer: true, text: '...드디어 최후의 적. 여기서 지면 모든 게 끝이야. 절대 물러서지 않겠어!' }],
  },

  // ── 빌런 등장 대사 ──
  VILLAIN_INTRO: {
    1: [
      { speaker: '대기전력 모기', portrait: 'villain_1', text: '윙~♪ 여기 콘센트 맛 좋은데~? 맛있는 대기전력 내가 쪽쪽 빨아줄게~' },
      { speaker: '대기전력 모기', portrait: 'villain_1', text: '그냥 꽂혀 있기만 해도 전기를 먹는 대기전력~ 윙~! 쭈~욱!' },
      { speaker: GameState.nickname, portrait: null, isPlayer: true, text: '콘센트에서 당장 그 주둥이 빼! 네 소행 때문에 이 도시가 어두워지고 있다고!' },
    ],
    2: [
      { speaker: '멀티탭 문어', portrait: 'villain_2', text: '......뭐가 문제죠? 카페에서 충전 안 하면 어디서 합니까.' },
      { speaker: '멀티탭 문어', portrait: 'villain_2', text: '제 다리 여덟 개로 동시에 쓸 수 있는데, 이 멀티탭 하나로는 아직도 부족하다고요.' },
      { speaker: GameState.nickname, portrait: null, isPlayer: true, text: '멀티탭 하나에 그렇게 꽂으면 과부하 걸려요! 그 전력이 어디서 오는지는 알고 있는 거예요?' },
    ],
    3: [
      { speaker: '전기도둑 두더지', portrait: 'villain_3', text: '켁! 누, 누가 여기까지 내려온 거야?! 이 지하 배선은 나만 아는 루트라고!' },
      { speaker: '전기도둑 두더지', portrait: 'villain_3', text: '산업용 전기를 가정집으로 끌어다 쓰면 어때~? 어차피 아무도 모르는 거잖아.' },
      { speaker: GameState.nickname, portrait: null, isPlayer: true, text: '그게 바로 도전(전기 훔치기)이야! 불법인 거 알면서 왜 하는 거야!' },
    ],
    4: [
      { speaker: '블랙아웃 골렘', portrait: 'villain_4', text: '......' },
      { speaker: '블랙아웃 골렘', portrait: 'villain_4', text: '이 도시의 전력... 모두 내 것이다.' },
      { speaker: '블랙아웃 골렘', portrait: 'villain_4', text: '변전소를 삼키면... 모든 빛은 영원히 꺼진다.' },
      { speaker: GameState.nickname, portrait: null, isPlayer: true, text: '...이 도시의 빛은 내가 반드시 지킨다. 물러서지 않겠어!' },
    ],
  },

  // ── 빌런 패배 대사 ──
  VILLAIN_DEFEAT: {
    1: [
      { speaker: '대기전력 모기', portrait: 'villain_1', text: '으으... 이럴 수가... 전기 상식 문제에서 지다니...' },
      { speaker: GameState.nickname, portrait: null, isPlayer: true, text: '기초 전기 상식도 모르면서 이 도시 전기를 훔쳐? 이제 꺼져!' },
    ],
    2: [
      { speaker: '멀티탭 문어', portrait: 'villain_2', text: '......인정합니다. 말도 안 되지만 제가 졌군요.' },
      { speaker: GameState.nickname, portrait: null, isPlayer: true, text: '기초 전기 지식도 없이 쓰는 전기는 도둑질이나 마찬가지예요.' },
    ],
    3: [
      { speaker: '전기도둑 두더지', portrait: 'villain_3', text: '으아아... 이 정도까지 전기 지식을 꿰고 있다고?! 이건 말도 안 돼!' },
      { speaker: GameState.nickname, portrait: null, isPlayer: true, text: '불법 도전은 도시 전체를 위협하는 범죄야. 그 배선 당장 걷어!' },
    ],
    4: [
      { speaker: '블랙아웃 골렘', portrait: 'villain_4', text: '......불가능하다. 이런 지식을 가진 자가... 아직 남아 있었다니.' },
      { speaker: '블랙아웃 골렘', portrait: 'villain_4', text: '......이 도시의 빛은... 네가 있기에.. 지켜지겠군.' },
      { speaker: GameState.nickname, portrait: null, isPlayer: true, text: '모든 어려움을 극복하고... 이 도시의 빛... 내가 지켜냈다..!' },
    ],
  },

  // ── 엔딩 스크립트 ──
  ENDING_SCENES: [
    { bg: 'images/backgrounds/bg_ending.png', speaker: '마스터 이종칠', portrait: 'master_happy', text: '훌륭하도다, [NICKNAME]이여!' },
    { bg: 'images/backgrounds/bg_ending.png', speaker: '마스터 이종칠', portrait: 'master_happy', text: '결코 쉽지 않은 여정이었음에도... 결국 해내었다!' },
    { bg: 'images/backgrounds/bg_ending.png', speaker: '마스터 이종칠', portrait: 'master_happy', text: '이로써 모든 전기 도둑을 토벌하여, 도시를 삼켰던 어둠은 그 힘을 잃었고, 우리는 다시 평화를 되찾았다.' },
    { bg: 'images/backgrounds/bg_ending.png', speaker: '마스터 이종칠', portrait: 'master_happy', text: '이제 나와 같은 전기 마스터로서의 조건을 충분히 갖추었네. 정말 수고하였다네!' },
  ],

  // ── 재생 시작 ──
  play(scenes, onComplete, bg) {
    this.scenes = scenes.map(s => ({
      ...s,
      text: s.text.replace(/\[NICKNAME\]/g, GameState.nickname),
      speaker: s.speaker ? s.speaker.replace(/\[NICKNAME\]/g, GameState.nickname) : s.speaker,
    }));
    this.currentIdx = 0;
    this.onComplete = onComplete;
    if (bg) document.querySelector('.vn-bg').style.backgroundImage = `url(${bg})`;
    Game.showScreen('visual-novel');
    this.renderScene();
    document.getElementById('screen-visual-novel').onclick = () => this.next();
    document.getElementById('vn-skip-btn').onclick = () => {
  if (this.typeTimer) clearInterval(this.typeTimer);  // 타이핑 강제 중단
  this.isTyping = false;
  document.getElementById('screen-visual-novel').onclick = null;  // 화면 클릭 제거
  document.getElementById('vn-skip-btn').onclick = null;          // 스킵 중복 방지
  this.onComplete && this.onComplete();
};
  },

  playOpening(onComplete) { this.play(this.OPENING_SCENES, onComplete, 'images/backgrounds/bg_opening.png'); },
  playEnding(onComplete)  { this.play(this.ENDING_SCENES, onComplete, 'images/backgrounds/bg_ending.png'); },
  playVillainIntro(level, bg, onComplete) { this.play([...this.BATTLE_ENTRY[level], ...this.VILLAIN_INTRO[level]], onComplete, bg); },
  playVillainDefeat(level, bg, onComplete) { this.play(this.VILLAIN_DEFEAT[level], onComplete, bg); },

  // ── 현재 씬 렌더링 ──
  renderScene() {
  if (this.currentIdx >= this.scenes.length) {
    document.getElementById('screen-visual-novel').onclick = null; // ← 추가
    document.getElementById('vn-skip-btn').onclick = null;         // ← 추가
    this.onComplete && this.onComplete();
    return;
  }
    const scene = this.scenes[this.currentIdx];
    AudioManager.playSFX(CONFIG.SOUNDS.SFX.BUBBLE);

    // 배경
    if (scene.bg) document.querySelector('.vn-bg').style.backgroundImage = `url(${scene.bg})`;

    // 화자명
    const speakerEl = document.getElementById('vn-speaker');
    if (scene.isPlayer) {
      speakerEl.textContent = GameState.nickname;
      speakerEl.style.color = 'var(--c-green)';
    } else {
      speakerEl.textContent = scene.speaker || '';
      speakerEl.style.color = 'var(--c-gold)';
    }

    // 초상화 및 배경 스탠딩 CG 처리
const portrait = document.getElementById('vn-portrait-img');
const bgChar = document.getElementById('vn-bg-char');

let portraitKey = scene.portrait;
// 주인공 대사일 경우 선택한 캐릭터로 초상화 강제 할당
if (scene.isPlayer) portraitKey = GameState.character;

if (portraitKey && CONFIG.IMAGES.DIALOG[portraitKey]) {
  portrait.src = CONFIG.IMAGES.DIALOG[portraitKey];
  portrait.style.display = 'block';
  
  // 배경에 캐릭터 크게 띄우기
  if (bgChar) {
    bgChar.src = CONFIG.IMAGES.DIALOG[portraitKey];
    bgChar.style.display = 'block';
  }
} else {
  portrait.style.display = 'none';
  if (bgChar) bgChar.style.display = 'none';
}

    // 타자기 효과
    this.typeText(document.getElementById('vn-text'), scene.text);
  },

  // 수정 후
typeText(el, text) {
  if (this.typeTimer) clearInterval(this.typeTimer);
  el.textContent = '';
  this.isTyping = true;
  const scrollArea = el.closest('.vn-text-area'); // ← 스크롤 영역 참조
  let i = 0;
  this.typeTimer = setInterval(() => {
    el.textContent += text[i];
    i++;
    if (scrollArea) scrollArea.scrollTop = scrollArea.scrollHeight; // ← 최하단 추적
    if (i >= text.length) {
      clearInterval(this.typeTimer);
      this.isTyping = false;
    }
  }, 40);
},

  // 수정 후
next() {
  if (this.isTyping) {
    if (this.typeTimer) clearInterval(this.typeTimer);
    const scene = this.scenes[this.currentIdx];
    const textEl = document.getElementById('vn-text');
    const scrollArea = textEl.closest('.vn-text-area');
    textEl.textContent = scene.text.replace(/\[NICKNAME\]/g, GameState.nickname);
    if (scrollArea) scrollArea.scrollTop = scrollArea.scrollHeight;
    this.isTyping = false;
    return;
  }
  // 타이핑 중 아닐 때 → 다음 씬으로
  this.currentIdx++;
  this.renderScene();
}
}
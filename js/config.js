// =====================================================
// 빛을 잃은 도시 : 전기도둑 토벌전 — CONFIG
// =====================================================

const CONFIG = {
  API_URL: 'https://script.google.com/macros/s/AKfycbyUUciVmojRBiY8t6PBVXWUGVNc3PuNHPQO-xIIyZyMr6sgK6iUMXZIxGncu2MF9IY/exec',

  GAME: {
    BASE_LIVES: 3,
    MARKETING_BONUS_LIVES: 1,
    BATTLE_TIME: 120,
    COMBO_THRESHOLD: 3,
    COMBO_ATK_BONUS: 5,
    CRITICAL_TURN: 3,
    CRITICAL_DMG_BONUS: 5,
  },

  LEVELS: {
    1: { name: '대기전력 빠는 모기',    hp: 100, atk: 8,  atkBonus: 5,  hpBonus: 0,  hpRecoverOnWrong: 0  },
    2: { name: '카페 멀티탭 문어',      hp: 120, atk: 10, atkBonus: 5,  hpBonus: 10, hpRecoverOnWrong: 0  },
    3: { name: '얌체 전기도둑 두더지',  hp: 150, atk: 12, atkBonus: 10, hpBonus: 0,  hpRecoverOnWrong: 0  },
    4: { name: '블랙아웃 골렘',         hp: 200, atk: 15, atkBonus: 0,  hpBonus: 0,  hpRecoverOnWrong: 15 }, // 💡 atk: 15, hpRecover: 15로 하향
  },

  CHARACTERS: {
    pig:     { id: 'pig',     name: '꼬마 노란돼지',    hp: 100, atk: 15 },
    eel:     { id: 'eel',     name: '찌리리 전기뱀장어', hp: 100,  atk: 15 },
    firefly: { id: 'firefly', name: '반짝이 반딧불이',   hp: 100, atk: 15 },
  },

  NICKNAME: {
    adjectives: [
      '번개같은','찌릿한','방전된','충전중인','스파크튀는',
      '전압높은','감전된','단락된','잔류하는','빛나는',
      '불꽃튀는','초고속의','무적의','전설의','용감한',
      '과부하된','고압의','저항없는','직렬로연결된','병렬의',
      '교류하는','도전하는','절연된','역률높은','무손실의',
      '공진하는','대전된','형광빛의','정전기가득한','전류넘치는'
    ],
    nouns: [
      '꼬마전구','번개창','전신주','전기뱀장어','노란돼지',
      '반딧불이','변압기','스파크','볼트','암페어',
      '와트','콘덴서','인덕터','코일','커패시터',
      '안전모','멀티탭','퓨즈','차단기','절연장갑',
      '접지봉','전력계','배전반','옴의법칙사','저항전사',
      '도통맨','회로왕','전기기사','마스터','영웅'
    ]
  },

  IMAGES: {
    BG_TITLE:    'images/backgrounds/bg_title.png',
    BG_OPENING:  'images/backgrounds/bg_opening.png',
    BG_ENDING:   'images/backgrounds/bg_ending.png',
    BG_BATTLE:   { 1:'images/backgrounds/bg_battle_lv1.png', 2:'images/backgrounds/bg_battle_lv2.png', 3:'images/backgrounds/bg_battle_lv3.png', 4:'images/backgrounds/bg_battle_lv4.png' },
    TITLE_TEXT:  'images/title/title_text.png',
    TITLE_PRESS: 'images/title/title_pressstart.png',
    PLAYER: {
      pig:     { idle:'images/players/player_pig_idle.png',     attack:'images/players/player_pig_attack.png',     hit:'images/players/player_pig_hit.png' },
      eel:     { idle:'images/players/player_eel_idle.png',     attack:'images/players/player_eel_attack.png',     hit:'images/players/player_eel_hit.png' },
      firefly: { idle:'images/players/player_firefly_idle.png', attack:'images/players/player_firefly_attack.png', hit:'images/players/player_firefly_hit.png' },
    },
    VILLAIN: {
      1:{ idle:'images/villains/villain_lv1_idle.png', attack:'images/villains/villain_lv1_attack.png', hit:'images/villains/villain_lv1_hit.png', dead:'images/villains/villain_lv1_dead.png' },
      2:{ idle:'images/villains/villain_lv2_idle.png', attack:'images/villains/villain_lv2_attack.png', hit:'images/villains/villain_lv2_hit.png', dead:'images/villains/villain_lv2_dead.png' },
      3:{ idle:'images/villains/villain_lv3_idle.png', attack:'images/villains/villain_lv3_attack.png', hit:'images/villains/villain_lv3_hit.png', dead:'images/villains/villain_lv3_dead.png' },
      4:{ idle:'images/villains/villain_lv4_idle.png', attack:'images/villains/villain_lv4_attack.png', hit:'images/villains/villain_lv4_hit.png', dead:'images/villains/villain_lv4_dead.png' },
    },
    DIALOG: {
      pig:'images/dialogs/dialog_pig.png', eel:'images/dialogs/dialog_eel.png', firefly:'images/dialogs/dialog_firefly.png',
      master:'images/dialogs/dialog_master_front.png', master_happy:'images/dialogs/dialog_happy_master_front.png',
      master_silhouette:'images/dialogs/dialog_master_silhouette.png',
      villain_1:'images/dialogs/dialog_villain_lv1.png', villain_2:'images/dialogs/dialog_villain_lv2.png',
      villain_3:'images/dialogs/dialog_villain_lv3.png', villain_4:'images/dialogs/dialog_villain_lv4.png',
    },
    DIALOG_FRAME: 'images/ui/ui_dialog_frame.png',
    MASTER_BADGE: 'images/ui/ui_master_badge.png',
    LOGO_JEIL:    'images/logos/logo_jeil.png',
    LOGO_INCLASS: 'images/logos/logo_inclass.png',
  },

  SOUNDS: {
    BGM: {
      START:   'sounds/bgm/BGM_START.wav',
      CHARACTER_SELECT: 'audio/SFX_caracter.mp3',
      OPENING: 'sounds/bgm/BGM_OPENING.wav',
      BATTLE:  'sounds/bgm/BGM_BATTLE.mp3',
      ENDING:  'sounds/bgm/BGM_ENDING.mp3',
    },
    SFX: {
      CLICK:       'sounds/sfx/SFX_CLICK.mp3',
      START_BTN:   'sounds/sfx/SFX_start button.mp3',
      SPIN:        'sounds/sfx/SFX_spin.mp3',
      CORRECT:     'sounds/sfx/SFX_correct.mp3',
      INCORRECT:   'sounds/sfx/SFX_incorrect.mp3',
      BASIC_PUNCH: 'sounds/sfx/SFX_basic punch.mp3',
      HARD_PUNCH:  'sounds/sfx/SFX_hard punch.mp3',
      ALERT:       'sounds/sfx/SFX_alert.mp3',
      MISS:        'sounds/sfx/SFX_miss.mp3',
      COMBO:       'sounds/sfx/SFX_combo.mp3',
      LEVELUP:     'sounds/sfx/SFX_LEVELUP.mp3',
      WIN:         'sounds/sfx/SFX_win.mp3',
      WIN2:        'sounds/sfx/SFX_win2.mp3',
      GAME_OVER:   'sounds/sfx/SFX_GAME OVER.mp3',
      BUBBLE:      'sounds/sfx/SFX_bubble.mp3',
      LOGO_INCLASS:'sounds/sfx/SFX_inclass_LOGO_splash.mp3',
      LOGO_JEIL:   'sounds/sfx/SFX_제일전기_LOGO_splash.mp3',
      COUNT_TICK:  'sounds/sfx/SFX_countdown_tick.mp3',
      COUNT_START: 'sounds/sfx/SFX_countdown_start.mp3',
    }
  },

  EVENT: { END_DATE: '2025-06-30', COUPON_VALID_DAYS: 7 }
};

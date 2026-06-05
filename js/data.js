// =====================================================
// data.js — 게임 데이터 (닉네임, 대사, 캐릭터 정보)
// =====================================================

// 닉네임 룰렛 단어
const NICKNAME_DATA = {
  adjectives: [
    '번개같은','찌릿한','방전된','충전중인','스파크튀는',
    '전압높은','감전된','단락된','잔류하는','빛나는',
    '불꽃튀는','초고속의','무적의','전설의','용감한',
    '과부하된','고압의','저항없는','직렬연결된','병렬의',
    '교류하는','도전하는','절연된','전설의','무손실의',
    '공진하는','대전된','형광빛의','정전기난','짜릿한'
  ],
  nouns: [
    '꼬마전구','번개','전신주','전기뱀장어','노란돼지',
    '반딧불이','변압기','스파크','볼트','암페어',
    '와트','콘덴서','인덕터','코일','커패시터',
    '안전모','멀티탭','퓨즈','차단기','절연장갑',
    '접지봉','전력계','배전반','옴의법칙','저항',
    '전기인','배터리','전기기사','마스터','영웅'
  ]
};

// 캐릭터 정보
const CHARACTERS = {
  pig: {
    key: 'pig',
    name: '꼬마 노란돼지',
    desc: '마스터의 정신을 가장 닮은 꼬마 영웅. 작지만 번개처럼 강한 의지를 가졌다!',
    skill: '강력한 번개 주먹',
    dialogImg: 'dialog_pig',
    idleImg: 'player_pig_idle',
    attackImg: 'player_pig_attack',
    hitImg: 'player_pig_hit'
  },
  eel: {
    key: 'eel',
    name: '찌리리 전기뱀장어',
    desc: '전기의 흐름을 온몸으로 통제하는 신비로운 존재. 몸 전체에서 전기를 방출한다!',
    skill: '전신 방전 공격',
    dialogImg: 'dialog_eel',
    idleImg: 'player_eel_idle',
    attackImg: 'player_eel_attack',
    hitImg: 'player_eel_hit'
  },
  firefly: {
    key: 'firefly',
    name: '반짝이 반딧불이',
    desc: '어둠 속에서도 빛을 잃지 않는 용감한 전사. 뱃속의 빛을 모아 강렬한 빔을 발사한다!',
    skill: '루미네선스 빔',
    dialogImg: 'dialog_firefly',
    idleImg: 'player_firefly_idle',
    attackImg: 'player_firefly_attack',
    hitImg: 'player_firefly_hit'
  }
};

// 빌런 정보
const VILLAINS = {
  lv1: {
    name: '대기전력 모기',
    dialogImg: 'dialog_villain_lv1',
    idleImg: 'villain_lv1_idle',
    attackImg: 'villain_lv1_attack',
    hitImg: 'villain_lv1_hit',
    deadImg: 'villain_lv1_dead'
  },
  lv2: {
    name: '카페 멀티탭 문어',
    dialogImg: 'dialog_villain_lv2',
    idleImg: 'villain_lv2_idle',
    attackImg: 'villain_lv2_attack',
    hitImg: 'villain_lv2_hit',
    deadImg: 'villain_lv2_dead'
  },
  lv3: {
    name: '전기도둑 두더지',
    dialogImg: 'dialog_villain_lv3',
    idleImg: 'villain_lv3_idle',
    attackImg: 'villain_lv3_attack',
    hitImg: 'villain_lv3_hit',
    deadImg: 'villain_lv3_dead'
  },
  lv4: {
    name: '블랙아웃 골렘',
    dialogImg: 'dialog_villain_lv4',
    idleImg: 'villain_lv4_idle',
    attackImg: 'villain_lv4_attack',
    hitImg: 'villain_lv4_hit',
    deadImg: 'villain_lv4_dead'
  }
};

// 대사 데이터
const DIALOGUES = {
  // 오프닝 시네마틱
  opening: [
    { speaker: '행인 1', portrait: null, text: '너무... 괴로워... 에어컨... 적어도 선풍기만이라도....' },
    { speaker: '행인 2', portrait: null, text: '대... 대기전력이... 부족...ㅎ...ㅐ...' },
    { speaker: '행인 3', portrait: null, text: '제발 이 열대야에서 우릴 구해줄 영웅이... 나타났으면...!' },
    { speaker: '마스터 이종칠', portrait: 'dialog_master_silhouette', text: '[user_nickname]이여...' },
    { speaker: '마스터 이종칠', portrait: 'dialog_master_front', text: '보이다시피 한 때 찬란히 빛나던 이 도시는, 곳곳에 숨어든 전기 도둑들로 인해 거리가 칠흑 같은 어둠에 잠식되어 가고 있소.' },
    { speaker: '마스터 이종칠', portrait: 'dialog_master_front', text: '이 혼란을 잠재우고 빛을 되찾기 위해선... 빌런의 허점을 잡고 전기의 흐름을 완벽히 통제할 수 있는 지식을 가진 이가 필요하오.' },
    { speaker: '마스터 이종칠', portrait: 'dialog_master_front', text: '오, 나의 부름을 받고 이 곳에 온 [user_nickname]이여!' },
    { speaker: '마스터 이종칠', portrait: 'dialog_master_front', text: '이제 이 도시를 구원할 유일한 희망인 그대, 부디 지식의 스파크를 모아 도둑들을 토벌하고 도시의 전원을 켜주시오!' },
    { speaker: '[user_nickname]', portrait: null, text: '...반드시 해내겠습니다. 이 도시의 빛은 내가 되찾겠어요!', isPlayer: true }
  ],

  // 레벨 진입 전 유저 결의
  playerReady: {
    1: '첫 번째 전기 도둑이군... 가볍게 상대해주지. 덤벼라!',
    2: '점점 만만치 않아지는군... 하지만 물러설 수 없어!',
    3: '불법으로 전기를 훔치다니... 용서할 수 없다! 반드시 막아내겠어!',
    4: '...드디어 최후의 적. 여기서 지면 모든 게 끝이야. 절대 물러서지 않겠어!'
  },

  // 배틀 전 대사
  battleIntro: {
    lv1: [
      { speaker: '대기전력 모기', portrait: 'dialog_villain_lv1', isVillain: true, text: '윙~♪ 여기 콘센트 맛 좀 봐라! 아무도 안 쓰는 거 내가 쪽쪽 빨아줄게~' },
      { speaker: '대기전력 모기', portrait: 'dialog_villain_lv1', isVillain: true, text: '대기전력이 뭔지 알아? 그냥 꽂혀 있기만 해도 전기 먹는다고~ 이 도시 콘센트는 다 내 밥이야, 윙~!' },
      { speaker: '[user_nickname]', portrait: null, isPlayer: true, text: '콘센트에서 당장 그 주둥이 빼! 네 소행 때문에 이 도시가 어두워지고 있다고!' },
      { speaker: '대기전력 모기', portrait: 'dialog_villain_lv1', isVillain: true, text: '흥~ 전기 좀 안다고? 어디 한번 덤벼봐. 근데 질 텐데~? 윙윙~!' }
    ],
    lv2: [
      { speaker: '멀티탭 문어', portrait: 'dialog_villain_lv2', isVillain: true, text: '......노트북 충전에 태블릿 충전, 데스크톱까지. 뭐가 문제죠? 카페에서 충전 안 하면 어디서 합니까.' },
      { speaker: '멀티탭 문어', portrait: 'dialog_villain_lv2', isVillain: true, text: '제 촉수 여덟 개가 동시에 쓸 수 있는데, 이 멀티탭 하나로는 아직도 부족하다고요.' },
      { speaker: '[user_nickname]', portrait: null, isPlayer: true, text: '멀티탭 하나에 그렇게 꽂으면 과부하 걸려요! 그 전력이 어디서 오는지는 알고 있는 거예요?' },
      { speaker: '멀티탭 문어', portrait: 'dialog_villain_lv2', isVillain: true, text: '...흥. 전기 좀 안다고 나한테 설교하러 왔어요? 어디 한번 실력 보여주시죠. 안경 닦고 기다릴게요.' }
    ],
    lv3: [
      { speaker: '전기도둑 두더지', portrait: 'dialog_villain_lv3', isVillain: true, text: '켁! 누, 누가 여기까지 내려온 거야?! 이 지하 배선은 나만 아는 루트라고!' },
      { speaker: '전기도둑 두더지', portrait: 'dialog_villain_lv3', isVillain: true, text: '산업용 전기를 가정집으로 끌어다 쓰면 어때? 어차피 아무도 모르는 거잖아.' },
      { speaker: '[user_nickname]', portrait: null, isPlayer: true, text: '그게 바로 도전(전기 훔치기)이야! 불법인 거 알면서 왜 하는 거야!' },
      { speaker: '전기도둑 두더지', portrait: 'dialog_villain_lv3', isVillain: true, text: '흠... 회로이론도 아는 척하네. 근데 아는 거랑 이기는 건 다르지~ 어디 덤벼봐!' }
    ],
    lv4: [
      { speaker: '블랙아웃 골렘', portrait: 'dialog_villain_lv4', isVillain: true, text: '......' },
      { speaker: '블랙아웃 골렘', portrait: 'dialog_villain_lv4', isVillain: true, text: '이 도시의 전력... 모두 내 것이다.' },
      { speaker: '블랙아웃 골렘', portrait: 'dialog_villain_lv4', isVillain: true, text: '변전소를 삼키면... 모든 빛은 영원히 꺼진다. 너 하나쯤은... 문제가 되지 않는다.' },
      { speaker: '[user_nickname]', portrait: null, isPlayer: true, text: '...이 도시의 빛은 내가 반드시 지킨다. 물러서지 않겠어!' },
      { speaker: '블랙아웃 골렘', portrait: 'dialog_villain_lv4', isVillain: true, text: '......덤벼라.' }
    ]
  },

  // 배틀 승리 후 대사
  battleWin: {
    lv1: [
      { speaker: '대기전력 모기', portrait: 'dialog_villain_lv1', isVillain: true, text: '으으... 이럴 수가... 전기 상식 문제에서 지다니...' },
      { speaker: '대기전력 모기', portrait: 'dialog_villain_lv1', isVillain: true, text: '다음엔 더 센 친구가 기다리고 있을 거야! 윙...' },
      { speaker: '[user_nickname]', portrait: null, isPlayer: true, text: '대기전력 하나도 모르면서 이 도시 전기를 훔쳐? 이제 꺼져!' }
    ],
    lv2: [
      { speaker: '멀티탭 문어', portrait: 'dialog_villain_lv2', isVillain: true, text: '......인정합니다. 전기 이론에서 제가 졌군요.' },
      { speaker: '멀티탭 문어', portrait: 'dialog_villain_lv2', isVillain: true, text: '하지만 다음 단계는 저보다 훨씬 복잡할 거예요.' },
      { speaker: '[user_nickname]', portrait: null, isPlayer: true, text: '지식 없이 쓰는 전기는 도둑질이나 마찬가지예요.' }
    ],
    lv3: [
      { speaker: '전기도둑 두더지', portrait: 'dialog_villain_lv3', isVillain: true, text: '으아아... 회로이론까지 꿰고 있다고?! 이건 좀 억울한데...' },
      { speaker: '전기도둑 두더지', portrait: 'dialog_villain_lv3', isVillain: true, text: '알았어, 알았다고. 지하 배선 원상복구할게...' },
      { speaker: '[user_nickname]', portrait: null, isPlayer: true, text: '불법 도전은 도시 전체를 위협하는 범죄야. 당장 걷어!' }
    ],
    lv4: [
      { speaker: '블랙아웃 골렘', portrait: 'dialog_villain_lv4', isVillain: true, text: '......불가능하다. 이런 지식을 가진 자가... 아직 남아 있었다니.' },
      { speaker: '블랙아웃 골렘', portrait: 'dialog_villain_lv4', isVillain: true, text: '......이 도시의 빛은... 네가 지켜라.' },
      { speaker: '[user_nickname]', portrait: null, isPlayer: true, text: '전기는 지식이 있는 사람이 지켜야 한다. 이 도시의 빛... 이제 내가 지킨다.' }
    ]
  },

  // 배틀 패배 후 대사
  battleLose: {
    lv1: [
      { speaker: '대기전력 모기', portrait: 'dialog_villain_lv1', isVillain: true, text: '윙윙~♪ 역시 내가 이겼지~ 전기 상식도 모르면서 날 막으러 왔어?' },
      { speaker: '대기전력 모기', portrait: 'dialog_villain_lv1', isVillain: true, text: '이 콘센트는 내 거야~ 다음엔 제대로 공부하고 와, 윙~!' }
    ],
    lv2: [
      { speaker: '멀티탭 문어', portrait: 'dialog_villain_lv2', isVillain: true, text: '......역시. 전기 상식이 이 정도면 저를 이기기엔 부족하죠.' },
      { speaker: '멀티탭 문어', portrait: 'dialog_villain_lv2', isVillain: true, text: '좀 더 공부하고 오세요. 저는 계속 충전할 테니까요.' }
    ],
    lv3: [
      { speaker: '전기도둑 두더지', portrait: 'dialog_villain_lv3', isVillain: true, text: 'ㅋㅋ 봐봐, 말은 번지르르하게 해도 회로이론 앞에선 꼼짝 못하잖아~' },
      { speaker: '전기도둑 두더지', portrait: 'dialog_villain_lv3', isVillain: true, text: '공부 더 하고 와. 나는 계속 여기서 전기 빼먹고 있을 테니까!' }
    ],
    lv4: [
      { speaker: '블랙아웃 골렘', portrait: 'dialog_villain_lv4', isVillain: true, text: '......지식이 없으면... 빛도 없다.' },
      { speaker: '블랙아웃 골렘', portrait: 'dialog_villain_lv4', isVillain: true, text: '이 변전소는... 이미 내 것이다.' }
    ]
  },

  // 보스 오답 시 HP 회복 대사
  bossRecovery: [
    '......그 정도 지식으론 어림없다.',
    '틀린 답은... 나를 더 강하게 만들 뿐이다.',
    '......아직 멀었다.'
  ],

  // 레벨 클리어 인터미션 마스터 멘트
  clearMaster: {
    1: '잘 했네! 첫 번째 전기 도둑을 물리쳤군. 그 경험이 자네를 더 강하게 만들었네!',
    2: '두 번째 도둑도 물리쳤군! 전기 이론이 점점 자네 손에 익어가고 있네. 이제 반환점이야!',
    3: '세 번째 도둑마저 물리쳤네! 이제 마지막 한 놈만 남았다. 마음을 단단히 먹게!'
  },

  // 엔딩 마스터 멘트
  ending: [
    { speaker: '마스터 이종칠', portrait: 'dialog_happy_master', text: '훌륭하도다, [user_nickname]이여!' },
    { speaker: '마스터 이종칠', portrait: 'dialog_happy_master', text: '결코 쉽지 않은 여정이었음에도... 결국 해내었다!' },
    { speaker: '마스터 이종칠', portrait: 'dialog_happy_master', text: '이로써 모든 전기 도둑을 토벌하여, 도시를 삼켰던 어둠은 그 힘을 잃었고, 우리는 다시 평화를 되찾았다.' },
    { speaker: '마스터 이종칠', portrait: 'dialog_happy_master', text: '이 도시를 구한 영웅, [user_nickname]이여.' },
    { speaker: '마스터 이종칠', portrait: 'dialog_happy_master', text: '이제 나와 같은 전기 마스터로서의 조건을 충분히 갖추었네. 정말 수고하였다네!' }
  ]
};

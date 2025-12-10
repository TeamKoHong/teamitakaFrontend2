// Mock project summary fixtures for RatingProjectPage (Step B)
// Use local assets for avatars; keep structure aligned with future API response

import avatar1 from '../assets/icons/avatar1.png';
import avatar2 from '../assets/icons/avatar2.png';
import avatar3 from '../assets/icons/avatar3.png';
// import avatar4 from '../assets/icons/avatar4.png';

const byId = {
  2: {
    id: 2,
    name: '대학생 중고거래 플랫폼 "캠퍼스마켓"',
    period: '2024.09.01 ~ 2024.12.20',
    meetingTime: '매주 월요일 19:00',
    avatars: [avatar1, avatar2, avatar3],
    dday: { value: 47, percent: 75 },
    resultLink: 'https://any_link.com',
    ratingSummary: { average: 4.0 },
    // 프로젝트 및 평가 상태
    status: 'COMPLETED',
    evaluation_status: 'COMPLETED',
    // 팀원 목록 (새로 추가)
    members: [
      { id: 1, name: '팀원실명', role: '담당업무', avatar: avatar1 },
      { id: 2, name: '팀원실명', role: '담당업무', avatar: avatar2 },
      { id: 3, name: '팀원실명', role: '담당업무', avatar: avatar3 },
    ],
    sliders: [
      { key:'participation', name:'참여도', desc:'해당 팀원의 프로젝트 내에서 참여도를 점수로 평가 해주세요', value:4 },
      { key:'communication', name:'소통', desc:'해당 팀원과의 의사소통 태도를 점수로 평가 해주세요', value:2 },
      { key:'responsibility', name:'책임감', desc:'해당 팀원의 프로젝트 책임감을 점수로 평가 해주세요', value:5 },
      { key:'collaboration', name:'협력', desc:'해당 팀원의 프로젝트 내에서 보인 협동심을 점수로 평가 해주세요', value:4 },
      { key:'individualAbility', name:'개인 능력', desc:'해당 팀원의 프로젝트 수행 능력을 점수로 평가 해주세요', value:3 }
    ],
    comments: [
      { memberId: 'member1', avatar: avatar1, text:'다른 팀원이 내게 남긴 평가 한마디가 들어갑...' },
      { memberId: 'member2', avatar: avatar2, text:'다른 팀원이 내게 남긴 평가 한마디가 들어갑...' },
      { memberId: 'member3', avatar: avatar3, text:'다른 팀원이 내게 남긴 평가 한마디가 들어갑...' }
    ],
    roles: [
      '구체적인 역할은 어쩌구어쩌구 입니다.',
      '구체적인 역할은 어쩌구어쩌구 입니다.',
      '문서 정리와 QA를 병행했습니다.'
    ],
    summary: {
      oneLiner: '일정 준수와 실행력이 돋보인 프로젝트였습니다.',
      keywords: ['책임감있는','성실함','배려심'],
      highlighted: '책임감있는',
      good: ['업무 능력이 뛰어나요.', '열정이 넘치는 팀원이에요.'],
      improve: ['의사 소통이 원활하면 좋겠어요.', '열심히 성장하는 모습이 필요해요.'],
      keywordComments: {
        '책임감있는': ['항상 마감 기한을 잘 지켜주셔서 좋았어요!', '책임감 있는 태도로 프로젝트에 임한 점이 인상적이었어요.'],
        '성실함': ['성실하게 참여했어요.', '빠른 실행력이 돋보였어요.'],
        '배려심': ['소통이 원활하고 배려심이 있어요.', '팀워크에 큰 도움이 되었어요.']
      },
      aggregateKeywords: ['리더십','소통','정확성']
    },
    // 내가 한 평가 (새로 추가)
    myGivenRatings: [
      {
        targetMember: { id: 2, name: '김OO', avatar: avatar2 },
        overallScore: 4.0,
        categoryScores: [
          { key:'participation', name:'참여도', desc:'해당 팀원의 프로젝트 내에서 참여도를 점수로 평가 해주세요', value:4 },
          { key:'communication', name:'소통', desc:'해당 팀원과의 의사소통 태도를 점수로 평가 해주세요', value:2 },
          { key:'responsibility', name:'책임감', desc:'해당 팀원의 프로젝트 책임감을 점수로 평가 해주세요', value:5 },
          { key:'collaboration', name:'협력', desc:'해당 팀원의 프로젝트 내에서 보인 협동심을 점수로 평가 해주세요', value:4 },
          { key:'individualAbility', name:'개인 능력', desc:'해당 팀원의 프로젝트 수행 능력을 점수로 평가 해주세요', value:3 }
        ],
        comment: '다른 팀원이 내게 남긴 평가 한마디가 들어갑...'
      }
    ]
  },
  6: {
    id: 6,
    name: '예비 졸업전시 부스 준비 위원 프로젝트',
    period: '2024.05.01 ~ 2024.11.15',
    meetingTime: '매주 토 14:00',
    avatars: [avatar1, avatar2, avatar3],
    dday: { value: 30, percent: 50 },
    resultLink: 'https://any_link.com',
    ratingSummary: { average: 4.0 },
    // 프로젝트 및 평가 상태
    status: 'COMPLETED',
    evaluation_status: 'COMPLETED',
    members: [
      { id: 1, name: '팀원실명', role: '담당업무', avatar: avatar1 },
      { id: 2, name: '팀원실명', role: '담당업무', avatar: avatar2 },
      { id: 3, name: '팀원실명', role: '담당업무', avatar: avatar3 },
    ],
    sliders: [
      { key:'participation', name:'참여도', desc:'해당 팀원의 프로젝트 내에서 참여도를 점수로 평가 해주세요', value:4 },
      { key:'communication', name:'소통', desc:'해당 팀원과의 의사소통 태도를 점수로 평가 해주세요', value:3 },
      { key:'responsibility', name:'책임감', desc:'해당 팀원의 프로젝트 책임감을 점수로 평가 해주세요', value:4 },
      { key:'collaboration', name:'협력', desc:'해당 팀원의 프로젝트 내에서 보인 협동심을 점수로 평가 해주세요', value:3 },
      { key:'individualAbility', name:'개인 능력', desc:'해당 팀원의 프로젝트 수행 능력을 점수로 평가 해주세요', value:4 }
    ],
    comments: [
      { memberId: 'member1', avatar: avatar1, text:'다른 팀원이 내게 남긴 평가 한마디가 들어갑...' },
      { memberId: 'member2', avatar: avatar2, text:'다른 팀원이 내게 남긴 평가 한마디가 들어갑...' }
    ],
    roles: [
      '구체적인 역할은 어쩌구어쩌구 입니다.',
      '구체적인 역할은 어쩌구어쩌구 입니다.',
      '협업 툴 세팅과 일정 조율을 담당했습니다.'
    ],
    summary: {
      oneLiner: '',
      keywords: ['책임감있는','성실함','배려심'],
      highlighted: '책임감있는',
      good: ['업무 능력이 뛰어나요', '열정이 넘치는 팀원이에요.'],
      improve: ['의사 소통이 원활하면 좋겠어요.', '열심히 성장하는 모습이 필요해요.'],
      keywordComments: {
        '책임감있는': ['항상 마감 기한을 잘 지켜주셔서 좋았어요!', '책임감 있는 태도로 프로젝트에 임한 점이 인상적이었어요.'],
        '성실함': ['성실하게 참여했어요.', '꾸준히 참여해 신뢰를 줬어요.'],
        '배려심': ['팀원 의견을 잘 경청해요.', '협업 과정에서 배려가 느껴졌어요.']
      },
      aggregateKeywords: ['주도성','협업','문서화']
    },
    myGivenRatings: [
      {
        targetMember: { id: 2, name: '김OO', avatar: avatar2 },
        overallScore: 4.0,
        categoryScores: [
          { key:'participation', name:'참여도', desc:'해당 팀원의 프로젝트 내에서 참여도를 점수로 평가 해주세요', value:4 },
          { key:'communication', name:'소통', desc:'해당 팀원과의 의사소통 태도를 점수로 평가 해주세요', value:3 },
          { key:'responsibility', name:'책임감', desc:'해당 팀원의 프로젝트 책임감을 점수로 평가 해주세요', value:4 },
          { key:'collaboration', name:'협력', desc:'해당 팀원의 프로젝트 내에서 보인 협동심을 점수로 평가 해주세요', value:3 },
          { key:'individualAbility', name:'개인 능력', desc:'해당 팀원의 프로젝트 수행 능력을 점수로 평가 해주세요', value:4 }
        ],
        comment: '다른 팀원이 내게 남긴 평가 한마디가 들어갑...'
      }
    ]
  }
};

export function getMockProjectSummary(projectId) {
  const id = Number(projectId);
  if (byId[id]) return byId[id];
  return {
    id,
    name: `Project ${id}`,
    period: '기간 정보 없음',
    meetingTime: '미팅 정보 없음',
    avatars: [avatar1, avatar2, avatar3],
    dday: { value: 0, percent: 0 },
    resultLink: '',
    ratingSummary: { average: 0 },
    members: [
      { id: 1, name: '팀원실명', role: '담당업무', avatar: avatar1 },
      { id: 2, name: '팀원실명', role: '담당업무', avatar: avatar2 },
      { id: 3, name: '팀원실명', role: '담당업무', avatar: avatar3 },
    ],
    roles: [],
    sliders: [
      { key:'participation', name:'참여도', desc:'해당 팀원의 프로젝트 내에서 참여도를 점수로 평가 해주세요', value:3 },
      { key:'communication', name:'소통', desc:'해당 팀원과의 의사소통 태도를 점수로 평가 해주세요', value:3 },
      { key:'responsibility', name:'책임감', desc:'해당 팀원의 프로젝트 책임감을 점수로 평가 해주세요', value:3 },
      { key:'collaboration', name:'협력', desc:'해당 팀원의 프로젝트 내에서 보인 협동심을 점수로 평가 해주세요', value:3 },
      { key:'individualAbility', name:'개인 능력', desc:'해당 팀원의 프로젝트 수행 능력을 점수로 평가 해주세요', value:3 }
    ],
    comments: [
      { memberId: 'member1', avatar: avatar1, text:'다른 팀원이 내게 남긴 평가 한마디가 들어갑...' }
    ],
    summary: { keywords: [], highlighted: '', good: [], improve: [] },
    myGivenRatings: []
  };
}



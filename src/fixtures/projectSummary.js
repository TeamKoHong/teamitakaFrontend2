// Mock project summary fixtures for RatingProjectPage (Step B)
// Use local assets for avatars; keep structure aligned with future API response

import avatar1 from '../assets/icons/avatar1.png';
import avatar2 from '../assets/icons/avatar2.png';

const byId = {
  2: {
    id: 2,
    name: '연합동아리 부스전 기획 프로젝트',
    period: '2024-03-01 ~ 2024-06-30',
    meetingTime: '매주 수 19:00',
    avatars: [avatar1, avatar2],
    dday: { value: 47, percent: 75 },
    resultLink: 'https://any_link.com',
    ratingSummary: { average: 4.0 },
    sliders: [
      { key:'participation', name:'참여도', desc:'해당 팀원의 프로젝트 내에서 참여도를 점수로 평가해주세요', value:4 },
      { key:'communication', name:'소통', desc:'해당 팀원과의 의사소통 태도를 점수로 평가해주세요', value:2 },
      { key:'responsibility', name:'책임감', desc:'해당 팀원의 프로젝트 책임감을 점수로 평가해주세요', value:4 },
      { key:'collaboration', name:'협력', desc:'해당 팀원의 프로젝트 내에서 보인 협동심을 점수로 평가해주세요', value:3 },
      { key:'individualAbility', name:'개인 능력', desc:'해당 팀원의 프로젝트 수행 능력을 점수로 평가해주세요', value:4 }
    ],
    comments: [
      { text:'마감 기한을 잘 지켜주며 흐름이 효율적으로 마무리 되었습니다.', tone:'light' },
      { text:'소소한 문서화 습관이 좀 더 많이 보였으면 좋겠습니다.', tone:'dark' }
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
      aggregateKeywords: ['리더십','소통','정확성']
    }
  },
  6: {
    id: 6,
    name: '예비 졸업전시 부스 준비 위원 프로젝트',
    period: '2024-05-01 ~ 2024-11-15',
    meetingTime: '매주 토 14:00',
    avatars: [avatar1, avatar2],
    dday: { value: 30, percent: 50 },
    resultLink: 'https://any_link.com',
    ratingSummary: { average: 4.0 },
    sliders: [
      { key:'participation', name:'참여도', desc:'해당 팀원의 프로젝트 내에서 참여도를 점수로 평가해주세요', value:4 },
      { key:'communication', name:'소통', desc:'해당 팀원과의 의사소통 태도를 점수로 평가해주세요', value:3 },
      { key:'responsibility', name:'책임감', desc:'해당 팀원의 프로젝트 책임감을 점수로 평가해주세요', value:4 },
      { key:'collaboration', name:'협력', desc:'해당 팀원의 프로젝트 내에서 보인 협동심을 점수로 평가해주세요', value:3 },
      { key:'individualAbility', name:'개인 능력', desc:'해당 팀원의 프로젝트 수행 능력을 점수로 평가해주세요', value:4 }
    ],
    comments: [
      { text:'마감 기한을 잘 지켜서 팀워크에 큰 도움이 되었습니다.', tone:'light' },
      { text:'소통 트랙이 조금 더 많아지면 좋겠습니다.', tone:'dark' }
    ],
    roles: [
      '구체적인 역할은 어쩌구어쩌구 입니다.',
      '구체적인 역할은 어쩌구어쩌구 입니다.',
      '협업 툴 세팅과 일정 조율을 담당했습니다.'
    ],
    summary: {
      oneLiner: '꾸준한 참여와 빠른 실행이 강점입니다.',
      keywords: ['책임감있는','성실함','배려심'],
      highlighted: '책임감있는',
      good: ['성실하게 참여했어요.', '빠른 실행력이 돋보여요.'],
      improve: ['문서화가 조금 더 필요해요.', '회의 안건 정리가 있으면 더 좋아요.'],
      aggregateKeywords: ['주도성','협업','문서화']
    }
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
    avatars: [avatar1, avatar2],
    dday: { value: 0, percent: 0 },
    resultLink: '',
    ratingSummary: { average: 0 },
    roles: [],
    sliders: [],
    comments: [],
    summary: { keywords: [], highlighted: '', good: [], improve: [] }
  };
}



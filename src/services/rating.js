// src/services/rating.js

// 더미 데이터 (실제 API 연동 시 삭제/교체)
const allDummyProjects = [
  {
    id: 1,
    name: "신규 서비스 개발 프로젝트",
    description: "2024년 하반기 출시 예정 신규 웹 서비스 개발",
    period: "2024-07-01 ~ 2024-12-31",
    createdAt: "2024-07-01T09:00:00Z",
    imageUrl: "/icons/team-group-icon.svg",
    myRatingStatus: "PENDING",
    myScore: null,
    isRatedByMe: false,
  },
  {
    id: 2,
    name: "AI 기반 데이터 분석 시스템 구축",
    description: "사내 데이터 분석 효율성 증대를 위한 AI 시스템 개발",
    period: "2024-05-01 ~ 2024-11-15",
    createdAt: "2024-05-01T10:30:00Z",
    imageUrl: "/icons/team-group-icon.svg",
    myRatingStatus: "COMPLETED",
    myScore: 4.0,
    isRatedByMe: true,
  },
  {
    id: 3,
    name: "모바일 앱 UI/UX 개선 프로젝트",
    description: "사용자 경험 향상을 위한 기존 모바일 앱 디자인 개선",
    period: "2025-01-01 ~ 2025-01-20",
    createdAt: "2025-01-01T11:00:00Z",
    imageUrl: "/icons/team-group-icon.svg",
    myRatingStatus: "VIEW_ONLY",
    myScore: null,
    isRatedByMe: false,
  },
  {
    id: 4,
    name: "웹사이트 리뉴얼 프로젝트",
    description: "노후된 회사 웹사이트 전면 리뉴얼 및 기능 추가",
    period: "2024-08-01 ~ 2025-01-31",
    createdAt: "2024-08-01T14:00:00Z",
    imageUrl: "/icons/team-group-icon.svg",
    myRatingStatus: "PENDING",
    myScore: null,
    isRatedByMe: false,
  },
  {
    id: 5,
    name: "데이터베이스 시스템 구축",
    description: "새로운 서비스에 필요한 데이터베이스 시스템 설계 및 구현",
    period: "2023-11-01 ~ 2024-03-31",
    createdAt: "2023-11-01T15:00:00Z",
    imageUrl: "/icons/team-group-icon.svg",
    myRatingStatus: "COMPLETED",
    myScore: 4.2,
    isRatedByMe: true,
  },
];

export async function fetchUserProjects(tab = 'received', sortBy = 'createdAt', sortOrder = 'desc') {
  // 실제 API 연동 시 axios/fetch로 대체
  let filteredByTab = [];
  if (tab === 'received') {
    filteredByTab = allDummyProjects.filter(project =>
      project.myRatingStatus === 'COMPLETED' || project.myRatingStatus === 'VIEW_ONLY'
    );
  } else {
    filteredByTab = allDummyProjects.filter(project =>
      project.myRatingStatus === 'PENDING' || project.isRatedByMe === true
    );
  }
  const sorted = [...filteredByTab].sort((a, b) => {
    if (sortBy === 'createdAt') {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === 'desc' ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
    }
    return 0;
  });
  // 네트워크 지연 시뮬레이션
  await new Promise(res => setTimeout(res, 300));
  return sorted;
}

export async function fetchProjectStatus(projectId) {
  // 실제 API 연동 시 axios/fetch로 대체
  const dummyStatus = {
    id: parseInt(projectId),
    name: `Project ${projectId} - 평가 현황`,
    status: "평가 완료",
    averageRating: 4.2,
    totalMembers: 5,
    completedRatings: 3,
    categories: [
      { name: "협업 능력", average: 4.5 },
      { name: "문제 해결 능력", average: 4.0 },
      { name: "소통 능력", average: 4.1 },
    ],
    individualReviews: [
      {
        id: 1,
        reviewerName: "익명1",
        ratingDate: "2024-05-20",
        averageScore: 5,
        categories: [
          { name: "협업", score: 5 },
          { name: "문제 해결", score: 5 },
          { name: "소통", score: 5 },
        ],
        comment: "매우 협조적이고 탁월한 문제 해결 능력을 보여주었습니다."
      },
      {
        id: 2,
        reviewerName: "익명2",
        ratingDate: "2024-05-18",
        averageScore: 4,
        categories: [
          { name: "협업", score: 4 },
          { name: "문제 해결", score: 3.5 },
          { name: "소통", score: 4.5 },
        ],
        comment: "적극적으로 소통하며 팀에 기여했습니다."
      },
      {
        id: 3,
        reviewerName: "익명3",
        ratingDate: "2024-05-15",
        averageScore: 4.2,
        categories: [
          { name: "협업", score: 4 },
          { name: "문제 해결", score: 4 },
          { name: "소통", score: 4.5 },
        ],
        comment: "피드백을 잘 수용하고 발전하려는 의지가 강합니다."
      },
    ],
  };
  // 네트워크 지연 시뮬레이션
  await new Promise(res => setTimeout(res, 300));
  return dummyStatus;
} 
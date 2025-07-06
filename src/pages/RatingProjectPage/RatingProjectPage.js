import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './RatingProjectPage.module.scss';
import DefaultHeader from '../../components/Common/DefaultHeader';
import RatingInputStars from '../../components/RatingManagement/RatingInputStars/RatingInputStars';
import RatingCategoryItem from '../../components/RatingManagement/RatingCategoryItem/RatingCategoryItem';
import ProjectInfoCard from '../../components/RatingProjectPage/ProjectInfoCard';
import ProjectSummaryCard from '../../components/RatingProjectPage/ProjectSummaryCard';
import TeamMemberEvaluation from '../../components/RatingProjectPage/TeamMemberEvaluation';
import BottomNav from '../../components/Common/BottomNav/BottomNav';
import ProjectResultCard from '../../components/RatingProjectPage/ProjectResultCard';

function RatingProjectPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ratings, setRatings] = useState({}); // Stores ratings for each member and category

  useEffect(() => {
    const fetchProjectData = async () => {
      setLoading(true);
      try {
        // Simulate API call to fetch project details and members
        const dummyProject = {
          id: parseInt(projectId),
          name: `Project ${projectId} - 팀원 평가`,
          description: `프로젝트 ${projectId}의 팀원 평가 페이지입니다.`,
          members: [
            {
              id: 101,
              name: "김철수",
              position: "프론트엔드 개발자",
              categories: [
                { id: 1, name: "협업 능력" },
                { id: 2, name: "문제 해결 능력" },
                { id: 3, name: "소통 능력" },
              ],
            },
            {
              id: 102,
              name: "이영희",
              position: "백엔드 개발자",
              categories: [
                { id: 1, name: "협업 능력" },
                { id: 2, name: "문제 해결 능력" },
                { id: 3, name: "소통 능력" },
              ],
            },
            {
              id: 103,
              name: "박민수",
              position: "디자이너",
              categories: [
                { id: 1, name: "협업 능력" },
                { id: 2, name: "문제 해결 능력" },
                { id: 3, name: "소통 능력" },
              ],
            },
          ],
        };
        setProjectData(dummyProject);

        // Initialize ratings state
        const initialRatings = {};
        dummyProject.members.forEach(member => {
          member.categories.forEach(category => {
            initialRatings[`<span class="math-inline">\{member\.id\}\-</span>{category.id}`] = 0; // Initialize with 0 stars
          });
        });
        setRatings(initialRatings);

      } catch (err) {
        setError("프로젝트 정보를 불러오는데 실패했습니다.");
        console.error("Failed to fetch project data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [projectId]);

  const handleRatingChange = (memberId, categoryId, rating) => {
    setRatings(prevRatings => ({
      ...prevRatings,
      [`<span class="math-inline">\{memberId\}\-</span>{categoryId}`]: rating,
    }));
  };

  const handleSubmit = async () => {
    if (!projectData) return;

    // Prepare the data to be sent to the backend
    const submittedRatings = projectData.members.map(member => ({
      memberId: member.id,
      memberRatings: member.categories.map(category => ({
        categoryId: category.id,
        rating: ratings[`<span class="math-inline">\{member\.id\}\-</span>{category.id}`],
      })),
    }));

    console.log("Submitted Ratings:", submittedRatings);

    try {
      // Simulate API call to submit ratings
      // In a real app: await api.post('/submit-ratings', { projectId, submittedRatings });
      alert('평가가 성공적으로 제출되었습니다!');
      navigate(`/rating-project-status/${projectId}`); // Navigate to status page after submission
    } catch (err) {
      setError("평가 제출에 실패했습니다.");
      console.error("Failed to submit ratings:", err);
      alert('평가 제출에 실패했습니다.');
    }
  };

  if (loading) {
    return <div className={styles.loading}>로딩 중...</div>;
  }

  if (error) {
    return <div className={styles.error}>오류: {error}</div>;
  }

  if (!projectData) {
    return <div className={styles.noData}>프로젝트 데이터를 찾을 수 없습니다.</div>;
  }

  // 실제 데이터는 props 또는 API로 받아옴
  const project = {
    id: 47,
    name: '프로젝트명',
    period: '2024.01.01 ~ 2024.02.01',
    meetingTime: '매주 수요일 19:00',
    avatars: ['/assets/icons/avatar1.png', '/assets/icons/avatar2.png'],
    dday: { value: 47, percent: 80 },
    resultLink: 'https://any_link.com'
  };
  const summary = {
    good: ['업무 능력이 뛰어나요.', '열정이 넘치는 팀원이에요.'],
    improve: ['의사 소통이 원활하면 좋겠어요.', '열심히 성장하는 모습이 필요해요.']
  };
  const evaluation = {
    question: '업무 분담 및 구체적인 역할은 무엇이었나요?',
    answers: [
      '구체적인 역할은 어쩌구어쩌구 입니다.',
      '구체적인 역할은 어쩌구어쩌구 입니다.'
    ]
  };

  return (
    <div className={styles.pageBg}>
      <DefaultHeader title="프로젝트 별점" />
      <div className={styles.scrollArea}>
        <ProjectInfoCard {...project} id={project.id} />
        <ProjectResultCard resultLink={project.resultLink} />
        <ProjectSummaryCard {...summary} />
        <TeamMemberEvaluation {...evaluation} />
      </div>
      <BottomNav />
    </div>
  );
}

export default RatingProjectPage;
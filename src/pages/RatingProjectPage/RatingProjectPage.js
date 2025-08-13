import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import styles from './RatingProjectPage.module.scss';
import DefaultHeader from '../../components/Common/DefaultHeader';
import RatingInputStars from '../../components/RatingManagement/RatingInputStars/RatingInputStars';
import KeywordChips from '../../components/RatingProjectPage/KeywordChips';
import OneLinerSummary from '../../components/RatingProjectPage/OneLinerSummary';
import MyRatingSection from '../../components/RatingProjectPage/MyRatingSection';
import ProjectInfoCard from '../../components/RatingProjectPage/ProjectInfoCard';
import ProjectSummaryCard from '../../components/RatingProjectPage/ProjectSummaryCard';
import ProsConsCards from '../../components/RatingProjectPage/ProsConsCards';
import CategorySlidersGroup from '../../components/RatingProjectPage/CategorySlidersGroup';
import CommentPills from '../../components/RatingProjectPage/CommentPills';
import StickyCTA from '../../components/RatingProjectPage/StickyCTA';
import TeamMemberEvaluation from '../../components/RatingProjectPage/TeamMemberEvaluation';
import BottomNav from '../../components/Common/BottomNav/BottomNav';
import ProjectResultCard from '../../components/RatingProjectPage/ProjectResultCard';
import { getMockProjectSummary } from '../../fixtures/projectSummary';

function RatingProjectPage(props) {
  const { projectId: propProjectId } = props;
  const { projectId: paramProjectId } = useParams();
  const projectId = propProjectId || paramProjectId;
  const location = useLocation();
  const navigate = useNavigate();
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ratings, setRatings] = useState({}); // Stores ratings for each member and category
  const [overallRating, setOverallRating] = useState(0); // 전체 별점
  const [comment, setComment] = useState(''); // 추가 코멘트
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const [chipsActive, setChipsActive] = useState('');
  const [detailOpen, setDetailOpen] = useState(false);

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
                { id: 1, name: "참여도" },
                { id: 2, name: "소통" },
                { id: 3, name: "책임감" },
                { id: 4, name: "협력" },
                { id: 5, name: "개인 능력" },
              ],
            },
          ],
        };
        setProjectData(dummyProject);
        // Initialize ratings state
        const initialRatings = {};
        dummyProject.members.forEach(member => {
          member.categories.forEach(category => {
            initialRatings[`${member.id}-${category.id}`] = 0;
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
      [`${memberId}-${categoryId}`]: rating,
    }));
  };

  const handleTagAdd = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleTagRemove = (tag) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleSubmit = async () => {
    if (!projectData) return;
    // Prepare the data to be sent to the backend
    const submittedRatings = projectData.members.map(member => ({
      memberId: member.id,
      memberRatings: member.categories.map(category => ({
        categoryId: category.id,
        rating: ratings[`${member.id}-${category.id}`],
      })),
    }));
    console.log("Submitted Ratings:", submittedRatings, overallRating, tags, comment);
    try {
      // Simulate API call to submit ratings
      alert('평가가 성공적으로 제출되었습니다!');
      navigate(`/project/${projectId}/rating-status`); // 평가 완료 후 결과 페이지로 이동
    } catch (err) {
      setError("평가 제출에 실패했습니다.");
      alert('평가 제출에 실패했습니다.');
    }
  };

          const handleMemberEvaluation = (memberId) => {
          // 선택된 팀원으로 평가 페이지 이동
          const targetMemberId = memberId || 101;
          navigate(`/project/${projectId}/evaluate/${targetMemberId}`);
        };

        // 평가 상태 확인 함수
        const getEvaluationStatus = (memberId) => {
          // 실제로는 API에서 평가 상태를 가져와야 함
          // 임시로 하드코딩된 상태 반환
          const statusMap = {
            101: 'completed', // 김재원 - 완료
            102: 'pending',   // 이영희 - 대기
            103: 'pending'    // 박철수 - 대기
          };
          return statusMap[memberId] || 'pending';
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

  // Step B: Use location.state first (if provided), then fall back to fixtures
  const stateProject = location.state && location.state.projectSummary ? location.state.projectSummary : null;
  const mock = getMockProjectSummary(projectId);
  const project = {
    id: mock.id,
    name: stateProject?.name ?? mock.name,
    period: stateProject?.period ?? mock.period,
    meetingTime: stateProject?.meetingTime ?? mock.meetingTime,
    avatars: stateProject?.avatars ?? mock.avatars,
    dday: stateProject?.dday ?? mock.dday,
    resultLink: stateProject?.resultLink ?? mock.resultLink,
  };
  const summary = stateProject?.summary ?? mock.summary;
  const ratingSummary = stateProject?.ratingSummary ?? mock.ratingSummary;

  return (
    <div className={styles.pageBg}>
      <DefaultHeader
        title="프로젝트 별점"
        onBack={() => {
          const from = location.state && location.state.from;
          const searchParams = new URLSearchParams(location.search);
          const tab = from?.tab || searchParams.get('tab');
          if (from?.path === '/project-management' || tab === 'completed') {
            navigate('/project-management?tab=completed', { replace: true });
          } else {
            navigate(-1);
          }
        }}
      />
      <div className={styles.scrollArea}>
        <ProjectInfoCard {...project} id={project.id} />
        <ProjectResultCard resultLink={project.resultLink} />
        <OneLinerSummary text={summary?.oneLiner} />
        <KeywordChips items={summary?.keywords || []} active={chipsActive || summary?.highlighted} />
        {typeof ratingSummary?.average === 'number' && (
          <MyRatingSection score={ratingSummary.average} />
        )}
        <ProsConsCards good={summary?.good || []} improve={summary?.improve || []} />
        <CategorySlidersGroup items={mock.sliders || []} onChange={() => {}} hideDescription />
        <CommentPills items={mock.comments || []} />
        <div id="detail-accordion" hidden={!detailOpen}>
          <TeamMemberEvaluation
            question="구체적인 역할은 무엇이었나요?"
            answers={mock.roles || []}
          />
          <div style={{ marginTop: 12 }}>
            <h3 style={{ fontSize: 14, margin: '0 0 8px 0', color: '#222' }}>종합적 키워드</h3>
            <KeywordChips items={summary?.aggregateKeywords || summary?.keywords || []} active={chipsActive || summary?.highlighted} />
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}

export default RatingProjectPage;
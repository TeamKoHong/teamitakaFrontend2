import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import styles from './RatingProjectPage.module.scss';
import DefaultHeader from '../../components/Common/DefaultHeader';
// import RatingInputStars from '../../components/RatingManagement/RatingInputStars/RatingInputStars';
import KeywordChips from '../../components/RatingProjectPage/KeywordChips';
import KeywordBubble from '../../components/RatingProjectPage/KeywordBubble';
import OneLinerSummary from '../../components/RatingProjectPage/OneLinerSummary';
import ProjectInfoCard from '../../components/RatingProjectPage/ProjectInfoCard';
// import ProjectSummaryCard from '../../components/RatingProjectPage/ProjectSummaryCard';
import ProsConsCards from '../../components/RatingProjectPage/ProsConsCards';
import CategorySlidersGroup from '../../components/RatingProjectPage/CategorySlidersGroup';
import CommentPills from '../../components/RatingProjectPage/CommentPills';
import CommentsBubble from '../../components/RatingProjectPage/CommentsBubble';
// import StickyCTA from '../../components/RatingProjectPage/StickyCTA';
import TeamMemberEvaluation from '../../components/RatingProjectPage/TeamMemberEvaluation';
import BottomNav from '../../components/Common/BottomNav/BottomNav';
import ProjectResultCard from '../../components/RatingProjectPage/ProjectResultCard';
import MyRatingSection from '../../components/RatingProjectPage/MyRatingSection';
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
  // const [ratings, setRatings] = useState({}); // 평가 입력 폼 제거됨
  const [chipsActive, setChipsActive] = useState('');
  const [detailOpen] = useState(false);

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
      } catch (err) {
        setError("프로젝트 정보를 불러오는데 실패했습니다.");
        console.error("Failed to fetch project data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjectData();
  }, [projectId]);

  // 입력 폼 관련 핸들러 제거됨 (UI 읽기 전용 구조)

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
    resultLink: (stateProject?.resultLink && stateProject.resultLink.trim()) || mock.resultLink,
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
        {/* 1) 섹션 재배치: 프로젝트 카드 → 결과물 → 한 줄 요약 → 키워드 */}
        <ProjectInfoCard {...project} id={project.id} />
        <ProjectResultCard resultLink={project.resultLink} />
        <div className={styles.oneLinerTitle}>한 줄 요약</div>
        {/* 3) 하단: 팀원 평가지 / 종합적 키워드 (아코디언으로 유지) */}
        <ProsConsCards good={summary?.good || []} improve={summary?.improve || []} />
        <div className={styles.sectionLabel}>팀원 평가지</div>
        <div className={styles.sectionLabel}>종합적 키워드</div>
        <KeywordChips
          items={summary?.keywords || []}
          active={chipsActive || summary?.highlighted}
          onSelect={(kw) => setChipsActive((prev) => (prev === kw ? '' : kw))}
        />
        <KeywordBubble
          items={(summary?.keywordComments && (summary.keywordComments[chipsActive || summary.highlighted] || []))}
        />
        {/* 5) 슬라이더 카드: 설명 문구 활성화 */}
        <div className={styles.sectionLabel} style={{ marginTop: 6 }}>해당 팀원의 능력별 점수는 몇 점인가요?</div>
        <CategorySlidersGroup items={mock.sliders || []} onChange={() => {}} hideDescription={false} />
        {/* 전체 총점 블록 + MyRatingSection (별만 표시) */}
        <div className={styles.overallIntro}>
          <h2 className={styles.overallTitle}>전체 총점은 몇 점인가요?</h2>
          <p className={styles.overallCaption}>받은 전체 총점의 평균치입니다.</p>
        </div>
        <div className={styles.myRatingNoTitle}>
          <MyRatingSection score={ratingSummary?.average ?? 0} />
        </div>
        {/* 4) 개별 코멘트 두 개를 하단에 개별 박스로 */}
        <CommentsBubble items={mock.comments || []} />
        <div id="detail-accordion" hidden={!detailOpen}>
        <div className={styles.sectionLabelTight}>팀원 평가지</div>
        <div className={styles.sectionLabelTight}>종합적 키워드</div>
          <KeywordChips
            items={summary?.aggregateKeywords || summary?.keywords || []}
            active={chipsActive || summary?.highlighted}
            onSelect={(kw) => setChipsActive((prev) => (prev === kw ? '' : kw))}
          />
          <TeamMemberEvaluation
            question="구체적인 역할은 무엇이었나요?"
            answers={mock.roles || []}
          />
          <div style={{ marginTop: 12 }}>
            
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}

export default RatingProjectPage;
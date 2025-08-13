import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import styles from './RatingProjectPage.module.scss';
import DefaultHeader from '../../components/Common/DefaultHeader';
import RatingInputStars from '../../components/RatingManagement/RatingInputStars/RatingInputStars';
import KeywordChips from '../../components/RatingProjectPage/KeywordChips';
import MyRatingSection from '../../components/RatingProjectPage/MyRatingSection';
import ProjectInfoCard from '../../components/RatingProjectPage/ProjectInfoCard';
import ProjectSummaryCard from '../../components/RatingProjectPage/ProjectSummaryCard';
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
        <KeywordChips items={summary?.keywords || []} active={summary?.highlighted} />
        {typeof ratingSummary?.average === 'number' && (
          <MyRatingSection score={ratingSummary.average} />
        )}
        <ProjectSummaryCard {...summary} />
        {/* 평가 입력 UI */}
        <div className={styles.ratingForm}>
          <div className={styles.tagSection}>
            <div className={styles.tagList}>
              {tags.map(tag => (
                <span key={tag} className={styles.tag} onClick={() => handleTagRemove(tag)}>
                  #{tag} <span className={styles.removeTag}>×</span>
                </span>
              ))}
              <input
                className={styles.tagInput}
                type="text"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleTagAdd()}
                placeholder="#키워드 입력"
              />
              <button className={styles.addTagBtn} onClick={handleTagAdd}>추가</button>
            </div>
          </div>
          <div className={styles.memberSection}>
            {projectData.members.map(member => {
              const evaluationStatus = getEvaluationStatus(member.id);
              return (
                <div key={member.id} className={styles.memberBox}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h4>{member.name} ({member.position})</h4>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      backgroundColor: evaluationStatus === 'completed' ? '#52c41a' : '#faad14',
                      color: 'white'
                    }}>
                      {evaluationStatus === 'completed' ? '평가 완료' : '평가 대기'}
                    </span>
                  </div>
                  <button 
                    onClick={() => handleMemberEvaluation(member.id)}
                    style={{ 
                      marginBottom: '16px',
                      padding: '8px 16px',
                      backgroundColor: evaluationStatus === 'completed' ? '#52c41a' : '#FF4D4F',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: evaluationStatus === 'completed' ? 'default' : 'pointer',
                      opacity: evaluationStatus === 'completed' ? 0.7 : 1
                    }}
                    disabled={evaluationStatus === 'completed'}
                  >
                    {evaluationStatus === 'completed' ? '평가 완료' : '상세 평가하기'}
                  </button>
                {member.categories.map(category => (
                  <div key={category.id} className={styles.categoryRow}>
                    <div className={styles.categoryTextWrap}>
                      <div className={styles.categoryName}>{category.name}</div>
                      <div className={styles.categoryDesc}>
                        {category.name === '참여도' && '해당 팀원의 프로젝트 내에서 참여도를 점수로 평가해주세요'}
                        {category.name === '소통' && '해당 팀원과의 의사소통 태도를 점수로 평가해주세요'}
                        {category.name === '책임감' && '해당 팀원의 프로젝트 책임감을 점수로 평가해주세요'}
                        {category.name === '협력' && '해당 팀원의 프로젝트 내에서 보인 협동심을 점수로 평가해주세요'}
                        {category.name === '개인 능력' && '해당 팀원의 프로젝트 수행 능력을 점수로 평가해주세요'}
                      </div>
                    </div>
                    <div className={styles.sliderWrap}>
                      <input
                        type="range"
                        min={1}
                        max={5}
                        step={1}
                        value={ratings[`${member.id}-${category.id}`] || 1}
                        onChange={e => handleRatingChange(member.id, category.id, Number(e.target.value))}
                        className={styles.ratingSlider}
                        style={{ '--value': ratings[`${member.id}-${category.id}`] || 1 }}
                      />
                    </div>
                    <div className={styles.sliderLabels}>
                      {[1,2,3,4,5].map(n => <span key={n}>{n}</span>)}
                    </div>
                  </div>
                ))}
              </div>
            );
            })}
          </div>
          <div className={styles.overallRatingSection}>
            <div className={styles.overallLabel} style={{ textAlign: 'center', width: '100%' }}>전체 총점은 몇 점인가요?</div>
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <RatingInputStars
                initialRating={overallRating}
                onRatingChange={setOverallRating}
                readOnly={false}
              />
            </div>
          </div>
          <textarea
            className={styles.commentInput}
            placeholder="추가 코멘트가 있다면 입력해 주세요."
            value={comment}
            onChange={e => setComment(e.target.value)}
          />
          <button className={styles.submitButton} onClick={handleSubmit}>
            평가 제출
          </button>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}

export default RatingProjectPage;
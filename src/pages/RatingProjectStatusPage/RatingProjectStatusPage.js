import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate, Navigate } from 'react-router-dom';
import styles from './RatingProjectStatusPage.module.scss';
import DefaultHeader from '../../components/Common/DefaultHeader';
import { fetchProjectStatus } from '../../services/rating';
import RatingInputStars from '../../components/RatingManagement/RatingInputStars/RatingInputStars';
import ProjectInfoCard from '../../components/RatingProjectPage/ProjectInfoCard';
import CategoryRatingRow from '../../components/RatingProjectPage/CategoryRatingRow';

function RatingProjectStatusPage() {
  const { projectId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const isGiven = location.pathname.endsWith('/given');
  const isReceived = location.pathname.endsWith('/received');
  const [projectStatus, setProjectStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeDetailTab, setActiveDetailTab] = useState(isGiven ? 'given' : 'received');
  const [showAllRoles, setShowAllRoles] = React.useState(false);

  useEffect(() => {
    setActiveDetailTab(isGiven ? 'given' : 'received');
  }, [isGiven]);

  useEffect(() => {
    const getProjectStatus = async () => {
      setLoading(true);
      try {
        const status = await fetchProjectStatus(projectId);
        setProjectStatus(status);
      } catch (err) {
        setError("평가 현황을 불러오는데 실패했습니다.");
        console.error("Failed to fetch project status:", err);
      } finally {
        setLoading(false);
      }
    };
    getProjectStatus();
  }, [projectId]);

  if (loading) {
    return <div className={styles.loading}>로딩 중...</div>;
  }

  if (error) {
    return <div className={styles.error}>오류: {error}</div>;
  }

  if (!projectStatus) {
    return <div className={styles.noData}>평가 현황 데이터를 찾을 수 없습니다.</div>;
  }

  const completionPercentage = projectStatus.totalMembers > 0
    ? (projectStatus.completedRatings / projectStatus.totalMembers) * 100
    : 0;

  return (
    <div className={styles.container}>
      <DefaultHeader title="평가 현황" />
      <div className={styles.content}>
        <h1 className={styles.pageTitle}>{projectStatus.name}</h1>
        {/* 탭은 given일 때만 노출 */}
        {isGiven && (
          <div className={styles.detailTabs}>
            <button
              className={activeDetailTab === 'received' ? styles.active : ''}
              onClick={() => { navigate(`/project/${projectId}/rating-status/received`); }}
            >
              내가 받은 평가
            </button>
            <button
              className={activeDetailTab === 'given' ? styles.active : ''}
              onClick={() => { navigate(`/project/${projectId}/rating-status/given`); }}
            >
              내가 한 평가
            </button>
          </div>
        )}
        {/* 받은 평가만 보여줌 */}
        {isReceived && (
          <div className={styles.receivedDetailPage}>
            {/* 프로젝트 정보 카드 (상단) */}
            <div style={{ marginBottom: 24 }}>
              <ProjectInfoCard
                name={projectStatus.name}
                period={projectStatus.period || '기간 정보 없음'}
                meetingTime={projectStatus.meetingTime || '미팅 정보 없음'}
                avatars={projectStatus.avatars || []}
                dday={projectStatus.dday || { value: 0, percent: 0 }}
                id={projectStatus.id}
              />
            </div>
            {/* 카테고리별 평균/총점 카드 */}
            <div className={styles.sectionCard + ' ' + styles.card + ' ' + styles.categorySummaryCard}>
              <h2 className={styles.sectionTitle}>카테고리별 평균</h2>
              <div className={styles.categoryAverages}>
                {projectStatus.categories && projectStatus.categories.map(cat => (
                  <CategoryRatingRow
                    key={cat.name}
                    label={cat.name}
                    value={cat.average.toFixed(1)}
                    stars={cat.average}
                  />
                ))}
              </div>
              <CategoryRatingRow
                label="총점 평균"
                value={projectStatus.averageRating.toFixed(1)}
                stars={projectStatus.averageRating}
                bold
              />
            </div>
            {/* 팀원별 평가 상세 카드 */}
            <div className={styles.sectionCard + ' ' + styles.card + ' ' + styles.memberReviewCardSection}>
              <h2 className={styles.sectionTitle}>팀원별 평가 상세</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {(() => {
                  const realisticReviews = [
                    {
                      categories: [
                        { name: '협업', score: 4.5 },
                        { name: '문제 해결', score: 4.0 },
                        { name: '소통', score: 4.2 }
                      ],
                      averageScore: 4.2,
                      comment: "항상 회의 시간에 먼저 의견을 내주셔서 팀 분위기가 활발해졌어요. 맡은 역할도 책임감 있게 완수해줘서 고마웠습니다."
                    },
                    {
                      categories: [
                        { name: '협업', score: 4.0 },
                        { name: '문제 해결', score: 3.5 },
                        { name: '소통', score: 4.5 }
                      ],
                      averageScore: 4.0,
                      comment: "문제 상황에서도 침착하게 해결책을 제시해줘서 든든했습니다. 소통도 원활해서 일하기 편했어요."
                    },
                    {
                      categories: [
                        { name: '협업', score: 4.2 },
                        { name: '문제 해결', score: 4.3 },
                        { name: '소통', score: 3.8 }
                      ],
                      averageScore: 4.1,
                      comment: "조금 더 적극적으로 소통해주면 더 좋을 것 같아요. 그래도 항상 성실하게 임해줘서 고마웠어요."
                    }
                  ];
                  return realisticReviews.map((review, idx) => (
                    <div className={styles.reviewCard + ' ' + styles.card + ' ' + styles.memberReviewCard} key={idx}>
                      <div className={styles.memberCategoryTable}>
                        <div className={styles.categoryRow + ' ' + styles.reviewerRow}>
                          <span className={styles.reviewerName}>{`익명${idx + 1}`}</span>
                          <span></span>
                          <span></span>
                        </div>
                        {review.categories.map(cat => (
                          <CategoryRatingRow
                            key={cat.name}
                            label={cat.name}
                            value={cat.score.toFixed(1)}
                            stars={cat.score}
                          />
                        ))}
                        <CategoryRatingRow
                          label="총점"
                          value={review.averageScore.toFixed(1)}
                          stars={review.averageScore}
                          bold
                        />
                      </div>
                      {review.comment && (
                        <div className={styles.reviewComment}>
                          <span>💬</span>
                          <span>{review.comment}</span>
                        </div>
                      )}
                    </div>
                  ));
                })()}
              </div>
            </div>
          </div>
        )}
        {/* 내가 한 평가 탭 분기 */}
        {isGiven && (
          activeDetailTab === 'given' && projectStatus.myRatingStatus === 'PENDING' ? (
            <Navigate to={`/project/${projectId}/rating-project`} replace />
          ) : (
            activeDetailTab === 'given' && (
              (() => {
                // 더미 데이터 예시 (실제 데이터로 교체 필요)
                const myGiven = {
                  good: [
                    "업무 능력이 뛰어나요.",
                    "열정이 넘치는 팀원이에요."
                  ],
                  improve: [
                    "의사 소통이 원활하면 좋겠어요.",
                    "열심히 성장하는 모습이 필요해요."
                  ],
                  roles: [
                    "구체적인 역할은 어쩌구어쩌구 입니다.",
                    "구체적인 역할은 어쩌구어쩌구 입니다."
                  ]
                };
                const visibleRoles = showAllRoles ? myGiven.roles : myGiven.roles.slice(0, 2);
                return (
                  <section className={styles.givenResultSection}>
                    <h2 className={styles.sectionTitle}>내가 남긴 평가</h2>
                    <div className={styles.summaryRow}>
                      <div className={styles.goodBox}>
                        <div className={styles.goodTitle}>이런 점이 좋아요👍</div>
                        <ul>
                          {myGiven.good.map((item, idx) => <li key={idx}>{item}</li>)}
                        </ul>
                      </div>
                      <div className={styles.improveBox}>
                        <div className={styles.improveTitle}>이런 점은 개선이 필요해요🚨</div>
                        <ul>
                          {myGiven.improve.map((item, idx) => <li key={idx}>{item}</li>)}
                        </ul>
                      </div>
                    </div>
                    <div className={styles.givenDetailSection}>
                      <h3 className={styles.sectionSubTitle}>업무 분담 및 구체적인 역할은 무엇이었나요?</h3>
                      {visibleRoles.map((role, idx) => (
                        <div className={styles.roleCard} key={idx}>{role}</div>
                      ))}
                      {myGiven.roles.length > 2 && (
                        <button className={styles.showMoreBtn} onClick={() => setShowAllRoles(v => !v)}>
                          {showAllRoles ? '상세 내용 접기 ▲' : '상세 내용 더보기 ▼'}
                        </button>
                      )}
                    </div>
                  </section>
                );
              })()
            )
          )
        )}
      </div>
    </div>
  );
}

export default RatingProjectStatusPage;
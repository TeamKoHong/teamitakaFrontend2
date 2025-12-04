import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./RecruitingProject.scss";
import { TbEyeFilled } from "react-icons/tb";
import { RiFileList2Fill } from "react-icons/ri";
import DefaultHeader from "./Common/DefaultHeader";
import ApplicantListSlide from "./ApplicantListSlide";
import { getRecruitment, getRecruitmentApplicants } from "../services/recruitment";
import avatar1 from "../assets/icons/avatar1.png";

const RecruitingProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showApplicantSlide, setShowApplicantSlide] = useState(false);
  const [recruitment, setRecruitment] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        const [recruitmentData, applicantsData] = await Promise.all([
          getRecruitment(id),
          getRecruitmentApplicants(id).catch(() => ({ applications: [] }))
        ]);

        setRecruitment(recruitmentData);
        // Handle both array (new format) and object (old format) responses
        const applicantsList = Array.isArray(applicantsData)
          ? applicantsData
          : (applicantsData.applications || []);
        setApplicants(applicantsList);
      } catch (err) {
        console.error("Failed to fetch recruitment data:", err);
        if (err.code === 'UNAUTHORIZED') {
          navigate('/login');
          return;
        }
        setError("데이터를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  // D-Day 계산
  const calculateDDay = (endDate) => {
    if (!endDate) return "D-DAY";
    const end = new Date(endDate);
    const now = new Date();
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    if (diff === 0) return "D-DAY";
    if (diff > 0) return `D-${diff}`;
    return `D+${Math.abs(diff)}`;
  };

  if (loading) {
    return (
      <div className="recruiting-project-container">
        <DefaultHeader title="모집 중인 프로젝트" onBack={() => navigate(-1)} />
        <div style={{ padding: 20, textAlign: 'center' }}>로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recruiting-project-container">
        <DefaultHeader title="모집 중인 프로젝트" onBack={() => navigate(-1)} />
        <div style={{ padding: 20, textAlign: 'center', color: '#F76241' }}>
          {error}
          <button onClick={() => window.location.reload()} style={{ marginLeft: 10 }}>
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  const applicantCount = applicants.length;
  const displayAvatars = applicants.slice(0, 5).map(app => app.User?.profile_image || avatar1);

  return (
    <div className="recruiting-project-container">
      <DefaultHeader title="모집 중인 프로젝트" onBack={() => navigate(-1)} />

      <div className="recruiting-content">
        <div className="recruiting-card">
          <h3>{recruitment?.title || "프로젝트명"}</h3>
          <p className="description">
            {recruitment?.description || "프로젝트 설명이 없습니다."}
          </p>
          <div className="info">
            <div className="info-left">
              <div className="views">
                <TbEyeFilled className="info-view-icon" />
                <span>{recruitment?.views || 0}</span>
              </div>
              <div className="comments">
                <RiFileList2Fill className="info-icon" />
                <span>{applicantCount}</span>
              </div>
            </div>
            <span className="d-day">{calculateDDay(recruitment?.recruitment_end)}</span>
          </div>
        </div>

        <div className="apply-status">
          <p className="apply-count">{recruitment?.title || "모집 중인 프로젝트명"}</p>
          <h2>{applicantCount}명</h2>
          <p className="apply-desc">
            총 <span className="highlight">{applicantCount}명</span>의 지원서가 도착했어요!
          </p>
          <div className="avatars">
            {displayAvatars.length > 0 ? (
              displayAvatars.map((avatar, idx) => (
                <img key={idx} src={avatar} alt="avatar" />
              ))
            ) : (
              <p style={{ fontSize: 14, color: '#999' }}>아직 지원자가 없습니다</p>
            )}
          </div>
        </div>

        <button className="team-btn" onClick={() => setShowApplicantSlide(true)}>
          팀원 선정하러 가기
        </button>
      </div>

      <ApplicantListSlide
        open={showApplicantSlide}
        onClose={() => setShowApplicantSlide(false)}
        recruitmentId={id}
      />
    </div>
  );
};

export default RecruitingProject;

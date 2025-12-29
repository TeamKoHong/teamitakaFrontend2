import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DefaultHeader from "../../components/Common/DefaultHeader";
import "./ProjectMemberPage.scss";
import defaultProfile from "../../assets/default_profile.png";

import NextArrow from "../../components/Common/UI/NextArrow";
import MemberTaskSlide from "../../components/ProjectMemberPage/MemberTaskSlide";
import { fetchProjectMembers } from "../../services/projects";

export default function ProjectMemberPage() {
  const { id: projectId } = useParams();
  const [selected, setSelected] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!projectId) {
      setError("프로젝트 ID가 없습니다.");
      setLoading(false);
      return;
    }

    const loadMembers = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("🔍 팀원 목록 조회 시작 - projectId:", projectId);
        const response = await fetchProjectMembers(projectId);
        console.log("📦 API 응답 전체:", response);
        
        // API 응답 구조에 맞게 데이터 변환
        const membersData = response.data?.items || response.items || response.data || response;
        console.log("📋 추출된 membersData:", membersData);
        console.log("📋 membersData 타입:", typeof membersData, "isArray:", Array.isArray(membersData));
        
        if (!Array.isArray(membersData)) {
          console.error("❌ 배열이 아닌 데이터:", membersData);
          throw new Error("팀원 데이터 형식이 올바르지 않습니다.");
        }

        // 백엔드 응답을 프론트엔드 형식으로 변환
        const formattedMembers = membersData.map((member, index) => {
          console.log(`👤 멤버 ${index + 1}:`, member);
          return {
            id: member.user_id,
            name: member.User?.username || "알 수 없음",
            role: member.role || "팀원",
            avatar: member.User?.avatar || defaultProfile,
            email: member.User?.email || "",
            joined_at: member.joined_at,
            // tasks는 현재 API에서 제공하지 않으므로 빈 배열로 초기화
            tasks: [],
          };
        });

        console.log("✅ 변환된 멤버 목록:", formattedMembers);
        setMembers(formattedMembers);
      } catch (err) {
        console.error("❌ 팀원 목록 조회 실패:", err);
        setError(err.message || "팀원 목록을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadMembers();
  }, [projectId]);

  return (
    <div className="team-page">
      <DefaultHeader title="팀원 정보" showChat={false} />

      {loading ? (
        <div style={{ padding: "40px", textAlign: "center", color: "#666" }}>
          <p>팀원 정보를 불러오는 중...</p>
        </div>
      ) : error ? (
        <div style={{ padding: "40px", textAlign: "center", color: "#e74c3c" }}>
          <p>{error}</p>
        </div>
      ) : members.length === 0 ? (
        <div style={{ padding: "40px", textAlign: "center", color: "#666" }}>
          <p>팀원이 없습니다.</p>
        </div>
      ) : (
        <ul className="team-list">
          {members.map((m) => (
            <li
              key={m.id}
              className="team-list-item"
              onClick={() => setSelected(m)}
            >
              <div className="team-info">
                <img src={m.avatar} alt={`${m.name} 아바타`} className="avatar" />
                <div className="text">
                  <p className="name">{m.name}</p>
                  <p className="role">{m.role}</p>
                </div>
              </div>
              <NextArrow className="chevron" />
            </li>
          ))}
        </ul>
      )}

      <MemberTaskSlide
        open={!!selected}
        onClose={() => setSelected(null)}
        member={selected}
      />
    </div>
  );
}

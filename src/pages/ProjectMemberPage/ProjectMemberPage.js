import React, { useState } from "react";
import DefaultHeader from "../../components/Common/DefaultHeader";
import "./ProjectMemberPage.scss";
import avatar1 from "../../assets/icons/avatar1.png";
import avatar2 from "../../assets/icons/avatar2.png";

import NextArrow from "../../components/Common/UI/NextArrow";
import MemberTaskSlide from "../../components/ProjectMemberPage/MemberTaskSlide";
export default function ProjectMemberPage() {
  // 1) 선택된 멤버 상태
  const [selected, setSelected] = useState(null);
  const members = [
    {
      id: 1,
      name: "김철수",
      role: "조장",
      tasks: ["디자인", "발표"],
      avatar: avatar1,
    },
    {
      id: 2,
      name: "이영희",
      role: "개발",
      tasks: ["API연동", "테스트"],
      avatar: avatar2,
    },
    {
      id: 3,
      name: "유현상",
      role: "조원",
      tasks: ["디자인", "발표"],
      avatar: avatar1,
    },
    {
      id: 4,
      name: "이조혁",
      role: "개발",
      tasks: ["집가기", "테스트"],
      avatar: avatar2,
    },
    {
      id: 5,
      name: "이훈수",
      role: "조장",
      tasks: ["디자인", "발표"],
      avatar: avatar1,
    },
    {
      id: 6,
      name: "이지인",
      role: "개발",
      tasks: ["API연동", "테스트"],
      avatar: avatar2,
    },
  ];
  return (
    <div className="team-page">
      <DefaultHeader title="팀원 정보" showChat={false} backPath="/project/1" />

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

      <MemberTaskSlide
        open={!!selected}
        onClose={() => setSelected(null)}
        member={selected}
      />
    </div>
  );
}

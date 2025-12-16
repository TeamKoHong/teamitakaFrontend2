import React from "react";
import "./PentagonChart.scss";

const PentagonChart = ({ 
  skills = {
    업무능력: 80,
    노력: 70,
    열정: 90,
    실력: 60,
    소통: 85
  }
}) => {
  // 스킬 값을 0-100 범위로 정규화하고 SVG 좌표로 변환
  const normalizeValue = (value) => Math.max(0, Math.min(100, value));
  
  // 각 꼭짓점의 기본 좌표 (가장 큰 바깥 오각형 기준)
  const points = [
    { x: 74.5, y: 0.5, label: "업무능력" },       // 상단
    { x: 149.5, y: 62, label: "노력" },           // 우상단 (격자선 좌표 기준)
    { x: 118.677, y: 147, label: "열정" },        // 우하단
    { x: 30, y: 147, label: "실력" },             // 좌하단
    { x: 1, y: 62.3403, label: "소통" }           // 좌상단
  ];

  // 중심점 (격자선 교차 지점과 동일)
  const center = { x: 74.5, y: 85 };

  // 스킬 값에 따른 실제 좌표 계산
  const calculatePoint = (basePoint, skillValue) => {
    const ratio = normalizeValue(skillValue) / 100;
    return {
      x: center.x + (basePoint.x - center.x) * ratio,
      y: center.y + (basePoint.y - center.y) * ratio
    };
  };

  // 실제 데이터 포인트들 계산
  const dataPoints = points.map((point, index) => {
    const skillKeys = Object.keys(skills);
    const skillValue = skills[skillKeys[index]] || 0;
    return calculatePoint(point, skillValue);
  });

  // SVG path 생성
  const createPath = (points) => {
    return points.map((point, index) => 
      `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
    ).join(' ') + ' Z';
  };

  return (
    <div className="pentagon-chart">
      <svg xmlns="http://www.w3.org/2000/svg" width="151" height="148" viewBox="0 0 151 148" fill="none">
        {/* 외곽 오각형 */}
        <path d="M150 61.8333L74.7424 1L1 61.8333L29.7898 147H118.685L150 61.8333Z" stroke="#515151"/>
        
        {/* 중간 오각형들 */}
        <path d="M129 69.1667L74.5 26L21 69.1667L41.8678 131H106.302L129 69.1667Z" stroke="#515151" strokeDasharray="2 2"/>
        <path d="M105 76.1667L74.5 51.5L45 76.1667L56.5932 110H92.3898L105 76.1667Z" stroke="#515151" strokeDasharray="2 2"/>
        
        {/* 격자선 */}
        <path d="M74.5 0.5V85M74.5 85L1 62.3403M74.5 85L30 147M74.5 85L118.677 147M74.5 85L149.5 62" stroke="#515151" strokeDasharray="2 2"/>
        
        {/* 실제 데이터 영역 */}
        <path 
          d={createPath(dataPoints)} 
          fill="rgba(247, 98, 65, 0.6)" 
          stroke="#F76241" 
          strokeWidth="2"
        />
      </svg>
      
      {/* 라벨들 (가장 큰 오각형 꼭짓점에 정확히 위치) */}
      <div className="chart-labels">
        {points.map(({ x, y, label }) => {
          // 보기 좋게 바깥쪽으로 오프셋 적용 (차트 선과 겹치지 않도록)
          const offset =
            label === "업무능력" ? { dx: 0, dy: -18 } :
            label === "노력" ? { dx: 18, dy: -8 } :
            label === "열정" ? { dx: 12, dy: 18 } :
            label === "실력" ? { dx: -12, dy: 18 } :
            { dx: -18, dy: -8 }; // 소통
          const style = { left: x + offset.dx, top: y + offset.dy };
          return (
            <div key={label} className="label" style={style}>{label}</div>
          );
        })}
      </div>
    </div>
  );
};

export default PentagonChart;

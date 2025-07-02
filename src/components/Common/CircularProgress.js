// 원형 프로그레스 바
const CircularProgress = ({ percentage }) => {
  const radius = 20;
  const strokeWidth = 4;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <svg width="64" height="64" viewBox="0 0 44 44">
      {/* 배경 원 */}
      <circle
        cx="22"
        cy="22"
        r={radius}
        fill="none"
        stroke="#eee"
        strokeWidth={strokeWidth}
      />
      {/* 진행 바 */}
      <circle
        cx="22"
        cy="22"
        r={radius}
        fill="none"
        stroke="#F76241"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={isNaN(offset) ? 0 : offset}
        strokeLinecap="round"
        transform="rotate(-90 22 22)"
      />
      {/* D-Day 텍스트 */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        fontFamily="KIMM_Bold"
        fontStyle="normal"
        dy=".3em"
        fontSize="12px"
        fontWeight="400"
        fill="#F76241"
      >
        D-07
      </text>
    </svg>
  );
};

export default CircularProgress;

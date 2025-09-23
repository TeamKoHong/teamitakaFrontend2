import React from "react";
import { useNavigate } from "react-router-dom";
import { getMe } from "../../services/user";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await getMe();
        if (res?.success && res.user) {
          setUser(res.user);
        } else {
          throw new Error("SERVER_ERROR");
        }
      } catch (e) {
        if (e?.code === "UNAUTHORIZED") {
          localStorage.removeItem("authToken");
          localStorage.removeItem("user");
          navigate("/login", { replace: true });
          return;
        }
        setError("일시적인 오류가 발생했습니다. 다시 시도해주세요.");
      } finally {
        setIsLoading(false);
      }
    };
    load();
    // eslint-disable-next-line
  }, []);

  const onLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  return (
    <main style={{ padding: 16 }}>
      <h2>프로필</h2>
      {isLoading && <div>불러오는 중...</div>}
      {error && (
        <div style={{ color: "#F76241", margin: "12px 0" }}>
          {error} <button onClick={() => window.location.reload()}>새로고침</button>
        </div>
      )}
      {user && (
        <section style={{ display: "grid", gap: 8, marginTop: 12 }}>
          <div><strong>닉네임</strong>: {user.username}</div>
          <div><strong>이메일</strong>: {user.email}</div>
        </section>
      )}
      <div style={{ marginTop: 24 }}>
        <button onClick={onLogout} style={{ padding: "10px 16px" }}>로그아웃</button>
      </div>
    </main>
  );
};

export default ProfilePage;

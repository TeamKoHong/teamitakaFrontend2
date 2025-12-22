import React, { useState, useEffect } from "react";
import axios from "axios"; // API 호출용
import "./TodoBox.scss";

import { getApiConfig } from "../../services/auth";

// projectId props를 받아야 해당 프로젝트의 투두를 불러올 수 있습니다.
function TodoBox({ showFeed = true, projectId, projectName = "현재 프로젝트" }) {
  // 초기 상태는 비워둠 (API로 채움)
  const [projects, setProjects] = useState([]); 
  const { API_BASE_URL } = getApiConfig();
  const [projectFeeds] = useState([
    { id: 1, text: "글자글자글자글자글자글자글자글자글자글자", timestamp: "3시간 전" },
    { id: 2, text: "글자글자글자글자글자글자글자글자글자글자", timestamp: "24시간 전" },
    { id: 3, text: "글자글자글자글자글자글자글자글자글자글자", timestamp: "1주일 전" },
    { id: 4, text: "글자글자글자글자글자글자글자글자글자글자", timestamp: "00.00.00" },
  ]);

  const [isTodoExpanded, setIsTodoExpanded] = useState(false);

  // ✅ 1. 투두 리스트 불러오기 (Read)
  useEffect(() => {
    if (!projectId) return;

    const fetchTodos = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/todos/${projectId}`);
        // 백엔드 데이터(response.data)를 UI 형식에 맞게 변환
        // 백엔드는 [{ todo_id, title, status, ... }] 형태로 줌
        const fetchedTodos = response.data.map(todo => ({
            id: todo.todo_id,
            text: todo.title,
            checked: todo.status === 'COMPLETED'
        }));

        // 화면 구성을 위해 projects 배열 형태로 설정
        setProjects([
            {
                id: projectId,
                name: projectName,
                todos: fetchedTodos
            }
        ]);
      } catch (error) {
        console.error("투두 불러오기 실패:", error);
      }
    };

    fetchTodos();
  }, [projectId, projectName]);


  // ✅ 2. 투두 체크/해제 (Update)
  const toggleTodo = async (projId, todoId, currentStatus) => {
    try {
        // 1. 백엔드에 상태 업데이트 요청
        const newStatus = !currentStatus; // true/false 반전
        await axios.put(`${API_BASE_URL}/api/todos/${todoId}`, {
            status: newStatus ? "COMPLETED" : "PENDING" // DB ENUM 값에 맞춤
        }, { withCredentials: true });

        // 2. 성공 시 프론트엔드 상태 업데이트
        setProjects(
            projects.map((project) => {
              if (project.id === projId) {
                const updatedTodos = project.todos.map((todo) =>
                  todo.id === todoId ? { ...todo, checked: newStatus } : todo
                );
      
                // 완료된 투두를 맨 아래로 정렬
                const sortedTodos = updatedTodos.sort((a, b) => {
                  if (a.checked === b.checked) return 0;
                  return a.checked ? 1 : -1;
                });
      
                return { ...project, todos: sortedTodos };
              }
              return project;
            })
          );

    } catch (error) {
        console.error("투두 상태 업데이트 실패:", error);
        alert("상태 변경에 실패했습니다.");
    }
  };

  const totalIncompleteTodos = projects.reduce(
    (total, project) => total + project.todos.filter((todo) => !todo.checked).length,
    0
  );

  return (
    <div className="todo-box-container">
      {/* 할 일 요약 섹션 */}
      <div className="todo-summary" onClick={() => setIsTodoExpanded(!isTodoExpanded)}>
        <div className="todo-summary-content">
          <span className="todo-summary-text">
            오늘 총 <span className="todo-count-highlight">{totalIncompleteTodos}건</span>의 할 일이 있어요.
          </span>
          <div className="todo-summary-icon">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className={`chevron-icon ${isTodoExpanded ? "expanded" : ""}`}
            >
              <path
                d="M6 9L12 15L18 9"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* 할 일 펼쳐진 상태 */}
      {isTodoExpanded && (
        <div className="todo-expanded-container">
          <div className="project-todo-box">
            {projects.length > 0 ? projects.map((project) => (
              <div key={project.id} className="project-section">
                <div className="project-header">
                  <h3>{project.name}</h3>
                </div>

                <div className="project-todos-list">
                  {project.todos.length > 0 ? project.todos.map((todo) => (
                    <div key={todo.id} className={`todo-item ${todo.checked ? "completed" : ""}`}>
                      <div className="todo-content">
                        <span className="todo-text">{todo.text}</span>
                      </div>

                      <div className="todo-checkbox-container">
                        <input
                          type="checkbox"
                          id={`project-${project.id}-todo-${todo.id}`}
                          checked={todo.checked}
                          onChange={() => toggleTodo(project.id, todo.id, todo.checked)}
                          className="todo-checkbox"
                        />
                        <label
                          htmlFor={`project-${project.id}-todo-${todo.id}`}
                          className="checkbox-label"
                        >
                          <div className="custom-checkbox">
                            {todo.checked && (
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <path
                                  d="M2 6L5 9L10 3"
                                  stroke="white"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                          </div>
                        </label>
                      </div>
                    </div>
                  )) : (
                    <div style={{padding: '10px', color: '#999'}}>등록된 할 일이 없습니다.</div>
                  )}
                </div>
              </div>
            )) : (
                 <div style={{padding: '20px', textAlign: 'center', color: '#666'}}>
                    불러올 프로젝트가 없거나 로딩 중입니다.
                 </div>
            )}
          </div>
        </div>
      )}

      {/* 프로젝트 피드 섹션 */}
      {showFeed && (
        <div className="project-feed-section">
          <div className="project-feed-header">
            <h3>프로젝트 피드</h3>
            <button className="add-feed-btn">+</button>
          </div>

          <div className="project-feed-list">
            {projectFeeds.map((feed) => (
              <div key={feed.id} className="feed-item">
                <div className="feed-avatar">
                  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                    <circle cx="18" cy="18" r="18" fill="#EBEBEB" />
                    <path
                      d="M18 9C21.3 9 24 11.7 24 15C24 18.3 21.3 21 18 21C14.7 21 12 18.3 12 15C12 11.7 14.7 9 18 9ZM18 22.5C23.25 22.5 27.5 26.75 27.5 32H8.5C8.5 26.75 12.75 22.5 18 22.5Z"
                      fill="#999"
                    />
                  </svg>
                </div>

                <div className="feed-content">
                  <span className="feed-text">{feed.text}</span>
                  <span className="feed-timestamp">{feed.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default TodoBox;
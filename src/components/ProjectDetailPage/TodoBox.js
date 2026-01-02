import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // API 호출용
import "./TodoBox.scss";

import { getApiConfig } from "../../services/auth";

// projectId props를 받아야 해당 프로젝트의 투두를 불러올 수 있습니다.
function TodoBox({ showFeed = true, projectId }) {
  const navigate = useNavigate();
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
  const [newTodoText, setNewTodoText] = useState("");
  const [isAddingTodo, setIsAddingTodo] = useState(false);

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
                
                todos: fetchedTodos
            }
        ]);
      } catch (error) {
        console.error("투두 불러오기 실패:", error);
      }
    };

    fetchTodos();
  }, [projectId]);


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

  // 팀 회의록 작성하기 페이지로 이동
  const handleCreateMeeting = () => {
    if (!projectId) {
      alert("프로젝트 정보가 없습니다.");
      return;
    }
    navigate(`/project/${projectId}/proceedings/create`);
  };

  // 새 투두 추가 (로컬 상태만)
  const handleAddTodo = () => {
    if (!newTodoText.trim()) return;

    const newTodo = {
      id: Date.now(), // 임시 ID
      text: newTodoText.trim(),
      checked: false
    };

    setProjects(prevProjects => {
      if (prevProjects.length === 0) {
        // 프로젝트가 없으면 새로 만들기
        return [{
          id: projectId,
          todos: [newTodo]
        }];
      }
      // 첫 번째 프로젝트에 투두 추가
      return prevProjects.map((project, index) => {
        if (index === 0) {
          return {
            ...project,
            todos: [newTodo, ...project.todos] // 맨 위에 추가
          };
        }
        return project;
      });
    });

    setNewTodoText("");
    setIsAddingTodo(false);
  };

  // 엔터 키 핸들러
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddTodo();
    }
  };

  // 플러스 버튼 클릭
  const handlePlusClick = () => {
    setIsTodoExpanded(true);
    setIsAddingTodo(true);
  };

  return (
    <div className="todo-box-container">
      {/* 할 일 요약 섹션 */}
      <div className="todo-summary">
        <div className="todo-summary-content">
          <span className="todo-summary-text" onClick={() => setIsTodoExpanded(!isTodoExpanded)}>
            오늘 총 <span className="todo-count-highlight">{totalIncompleteTodos}건</span>의 할 일이 있어요.
          </span>
          <button className="todo-add-btn" onClick={handlePlusClick}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 5V19M5 12H19"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* 할 일 펼쳐진 상태 */}
      {isTodoExpanded && (
        <div className="todo-expanded-container">
          <div className="project-todo-box">
            {projects.length > 0 ? projects.map((project) => (
              <div key={project.id} className="project-section">
                {/* 투두 입력 창 */}
                {isAddingTodo && (
                  <div className="todo-input-wrapper">
                    <input
                      type="text"
                      className="todo-input"
                      placeholder="할 일을 입력하세요..."
                      value={newTodoText}
                      onChange={(e) => setNewTodoText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      autoFocus
                    />
                  </div>
                )}

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

      {/* 팀원 활동 로그 섹션 */}
      {showFeed && (
        <div className="project-feed-section">
          <div className="project-feed-header">
            <h3>팀원 활동 로그</h3>
            <p>팀원들이 완료한 투두리스트를 살펴보세요.</p>
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
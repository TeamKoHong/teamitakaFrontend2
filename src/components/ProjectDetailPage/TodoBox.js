import React, { useState } from "react";
import "./TodoBox.scss";

function TodoBox() {
  // 프로젝트별 투두 데이터
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "프로젝트명",
      todos: [
        { id: 1, text: "완료 전 투두리스트1(25자 이하)", checked: false },
        { id: 2, text: "완료 전 투두리스트2(25자 이하)", checked: false },
        { id: 3, text: "완료 전 투두리스트3(25자 이하)", checked: false },
        { id: 4, text: "완료 전 투두리스트4(25자 이하)", checked: false },
      ]
    },
    {
      id: 2,
      name: "프로젝트명",
      todos: [
        { id: 5, text: "완료 전 투두리스트5(25자 이하)", checked: false },
        { id: 6, text: "완료 전 투두리스트6(25자 이하)", checked: false },
        { id: 7, text: "완료 전 투두리스트7(25자 이하)", checked: false },
        { id: 8, text: "완료 전 투두리스트8(25자 이하)", checked: false },
      ]
    }
  ]);

  // 프로젝트 피드 데이터
  const [projectFeeds, setProjectFeeds] = useState([
    { id: 1, text: "글자글자글자글자글자글자글자글자글자글자", timestamp: "3시간 전" },
    { id: 2, text: "글자글자글자글자글자글자글자글자글자글자", timestamp: "24시간 전" },
    { id: 3, text: "글자글자글자글자글자글자글자글자글자글자", timestamp: "1주일 전" },
    { id: 4, text: "글자글자글자글자글자글자글자글자글자글자", timestamp: "00.00.00" },
  ]);

  const [isTodoExpanded, setIsTodoExpanded] = useState(false);

  const toggleTodo = (projectId, todoId) => {
    setProjects(projects.map(project => {
      if (project.id === projectId) {
        const updatedTodos = project.todos.map(todo =>
          todo.id === todoId ? { ...todo, checked: !todo.checked } : todo
        );
        // 완료된 투두를 맨 아래로 정렬
        const sortedTodos = updatedTodos.sort((a, b) => {
          if (a.checked === b.checked) return 0;
          return a.checked ? 1 : -1;
        });
        return { ...project, todos: sortedTodos };
      }
      return project;
    }));
  };

  const totalIncompleteTodos = projects.reduce((total, project) => 
    total + project.todos.filter(todo => !todo.checked).length, 0
  );

  return (
    <div className="todo-box-container">
      {/* 할 일 요약 섹션 */}
      <div 
        className="todo-summary"
        onClick={() => setIsTodoExpanded(!isTodoExpanded)}
      >
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
              className={`chevron-icon ${isTodoExpanded ? 'expanded' : ''}`}
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
            {projects.map((project) => (
              <div key={project.id} className="project-section">
                <div className="project-header">
                  <h3>{project.name}</h3>
                </div>
                <div className="project-todos-list">
                  {project.todos.map((todo) => (
                    <div key={todo.id} className={`todo-item ${todo.checked ? 'completed' : ''}`}>
                      <div className="todo-content">
                        <span className="todo-text">{todo.text}</span>
                      </div>
                      
                      <div className="todo-checkbox-container">
                        <input
                          type="checkbox"
                          id={`project-${project.id}-todo-${todo.id}`}
                          checked={todo.checked}
                          onChange={() => toggleTodo(project.id, todo.id)}
                          className="todo-checkbox"
                        />
                        <label htmlFor={`project-${project.id}-todo-${todo.id}`} className="checkbox-label">
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
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 프로젝트 피드 섹션 */}
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
                  <circle cx="18" cy="18" r="18" fill="#EBEBEB"/>
                  <path d="M18 9C21.3 9 24 11.7 24 15C24 18.3 21.3 21 18 21C14.7 21 12 18.3 12 15C12 11.7 14.7 9 18 9ZM18 22.5C23.25 22.5 27.5 26.75 27.5 32H8.5C8.5 26.75 12.75 22.5 18 22.5Z" fill="#999"/>
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
    </div>
  );
}

export default TodoBox;

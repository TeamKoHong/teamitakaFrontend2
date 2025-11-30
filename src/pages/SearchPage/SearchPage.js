// src/pages/SearchPage/SearchPage.js
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import search_icon from "../../assets/search_icon.png";
import './SearchPage.scss';

const initialTags = ['동아리', '포트폴리오', '디자인'];
const popularKeywords = ['전공강의', '체육', '4학년 팀플', '축보', '전시 프로젝트', '제품 디자인'];

export default function SearchPage() {
  const [searchText, setSearchText] = useState('');
  const [tags, setTags] = useState(initialTags);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const handleTagRemove = (tagToRemove) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  // ★ 검색 실행 함수 (키워드를 인자로 받을 수 있게 수정)
  const handleSearch = (keyword) => {
    const query = keyword || searchText; // 인자로 받은 키워드가 없으면 입력창 값 사용

    if (!query.trim()) {
      alert("검색어를 입력해주세요.");
      return;
    }

    console.log('검색어:', query);

    // ★ 중요: 목록 페이지(/team-matching)로 이동하면서 'searchQuery' 상태를 함께 전달
    navigate('/team-matching', { 
      state: { searchQuery: query } 
    });
  };

  return (
    <div className="search-page">
      <header className="search-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          &lt;
        </button>
        <h1 className="header-title">검색</h1>
      </header>

      <div
        className="search-box"
        onClick={() => inputRef.current?.focus()}
        style={{ cursor: 'text' }}
      >
        <input
          ref={inputRef}
          type="text"
          className="search-input"
          placeholder="검색어를 입력하세요"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        {/* ★ 아이콘 렌더링 방식 수정 */}
        <button className="search-btn" onClick={() => handleSearch()}>
          <img src={search_icon} alt="검색" style={{width: '20px', height: '20px'}} />
        </button>
      </div>

      <div className="tag-list">
        {tags.map(tag => (
          <span key={tag} className="tag-item">
            {/* 태그 클릭 시 검색되게 하려면 아래 onClick 추가 */}
            <span onClick={() => handleSearch(tag)}>{tag}</span>
            <button onClick={() => handleTagRemove(tag)}>×</button>
          </span>
        ))}
      </div>

      <div className="popular-section">
        <h2 className="section-title">인기 검색어</h2>
        <div className="popular-tags">
          {popularKeywords.map(keyword => (
            // ★ 클릭 시 해당 키워드로 검색 실행
            <button key={keyword} className="popular-tag" onClick={() => handleSearch(keyword)}>
              {keyword}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
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

  const handleSearch = () => {
    // TODO: 검색 로직 추가 (API 요청 등)
    console.log('검색:', searchText);
    // 예시로 모집글 페이지로 이동
    navigate('/recruitment');
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
        <button className="search-btn">
          <search_icon />
        </button>
      </div>

      <div className="tag-list">
        {tags.map(tag => (
          <span key={tag} className="tag-item">
            {tag} <button onClick={() => handleTagRemove(tag)}>×</button>
          </span>
        ))}
      </div>

      <div className="popular-section">
        <h2 className="section-title">인기 검색어</h2>
        <div className="popular-tags">
          {popularKeywords.map(keyword => (
            <button key={keyword} className="popular-tag" onClick={() => setSearchText(keyword)}>
              {keyword}
            </button>
          ))}
        </div>
      </div>
    </div>
)}

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import search_icon from "../../assets/search_icon.png";
import './SearchPage.scss';
import { getAllRecruitments } from '../../api/recruit';

export default function SearchPage() {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const [searchText, setSearchText] = useState('');
  const [recentTags, setRecentTags] = useState([]);   
  const [popularTags, setPopularTags] = useState([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedHistory = localStorage.getItem('recentSearches');
    if (storedHistory) {
      setRecentTags(JSON.parse(storedHistory));
    }

    const fetchPopularKeywords = async () => {
      try {
        const data = await getAllRecruitments();
        const tagCounts = {};
        data.forEach(post => {
          const tags = post.Hashtags || post.hashtags || [];
          tags.forEach(tagObj => {
             const tagName = typeof tagObj === 'string' ? tagObj : tagObj.name;
             if (tagName) {
                tagCounts[tagName] = (tagCounts[tagName] || 0) + 1;
             }
          });
        });
        const sortedTags = Object.entries(tagCounts)
          .sort(([, countA], [, countB]) => countB - countA)
          .map(([tag]) => tag)
          .slice(0, 10);

        setPopularTags(sortedTags);
      } catch (error) {
        console.error("인기 검색어 로딩 실패:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPopularKeywords();
  }, []);

  const handleTagRemove = (tagToRemove, e) => {
    e.stopPropagation(); 
    const updatedTags = recentTags.filter(tag => tag !== tagToRemove);
    setRecentTags(updatedTags);
    localStorage.setItem('recentSearches', JSON.stringify(updatedTags));
  };

  const handleClearHistory = () => {
    setRecentTags([]);
    localStorage.removeItem('recentSearches');
  };

  const handleSearch = (keyword) => {
    const query = keyword || searchText; 

    if (!query.trim()) {
      alert("검색어를 입력해주세요.");
      return;
    }

    const newHistory = [query, ...recentTags.filter(tag => tag !== query)].slice(0, 10);
    setRecentTags(newHistory);
    localStorage.setItem('recentSearches', JSON.stringify(newHistory));

    navigate('/team-matching', { 
      state: { searchQuery: query } 
    });
  };

  return (
    <div className="search-page">
      <header className="search-header">
        <button className="back-button" onClick={() => navigate('/team-matching')}>
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
        <button className="search-btn" onClick={() => handleSearch()}>
          <img src={search_icon} alt="검색" style={{width: '20px', height: '20px'}} />
        </button>
      </div>

      <div className="recent-section" style={{marginTop: '20px', padding: '0 20px'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px'}}>
            <h2 className="section-title" style={{margin:0}}>최근 검색어</h2>
            {recentTags.length > 0 && (
                <button onClick={handleClearHistory} style={{fontSize:'12px', color:'#999', background:'none', border:'none', cursor:'pointer'}}>
                    전체 삭제
                </button>
            )}
        </div>
        
        <div className="tag-list">
          {recentTags.length === 0 ? (
            <div style={{color:'#999', fontSize:'13px', padding:'10px 0'}}>최근 검색 내역이 없습니다.</div>
          ) : (
            recentTags.map(tag => (
              <span key={tag} className="tag-item" onClick={() => handleSearch(tag)} style={{cursor:'pointer'}}>
                <span>{tag}</span>
                <button onClick={(e) => handleTagRemove(tag, e)} style={{marginLeft:'6px', cursor:'pointer'}}>×</button>
              </span>
            ))
          )}
        </div>
      </div>

      <div className="popular-section">
        <h2 className="section-title">인기 검색어</h2>
        <div className="popular-tags">
          {loading ? (
             <div style={{color:'#999', fontSize:'13px'}}>데이터 분석 중...</div>
          ) : popularTags.length === 0 ? (
             <div style={{color:'#999', fontSize:'13px'}}>인기 태그가 없습니다.</div>
          ) : (
            popularTags.map((keyword, index) => (
              <button 
                key={keyword} 
                className="popular-tag" 
                onClick={() => handleSearch(keyword)}
              >
                <span style={{fontWeight:'bold', marginRight:'6px', color:'#FF6442'}}>{index + 1}</span>
                {keyword}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
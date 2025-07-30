// src/pages/TeamMatching/TeamMatchingPage.js
import React, { useState, useEffect } from 'react';
import './TeamMatchingPage.scss'; // SCSS 파일 임포트
import DefaultHeader from '../../components/Common/DefaultHeader'; // 기존 헤더 컴포넌트 활용
import BottomNav from '../../components/Common/BottomNav/BottomNav'; // 기존 하단 내비게이션 활용
import MatchingCard from '../../components/TeamMatchingPage/MatchingCard'; // 개별 매칭 카드 컴포넌트

// 예시 데이터 (실제로는 API에서 가져올 데이터)
const initialMatchingData = [
  {
    id: 'm1',
    type: '모집 중',
    title: '스마트 주차 시스템 개발',
    tags: ['IT', 'IoT', '백엔드개발'],
    description: '스마트 주차 시스템 개발을 위한 열정적인 팀원 모집합니다.',
    roles: '백엔드 개발자 1명, 프론트엔드 개발자 1명',
    dueDate: 'D-7',
    isBookmarked: false,
    isRecommended: true, // 추천 매칭으로 표시
  },
  {
    id: 'm2',
    type: '모집 중',
    title: '감성 카페 브랜딩 프로젝트',
    tags: ['브랜딩', '마케팅', '기획'],
    description: '신규 카페 브랜딩 및 마케팅 전략 수립에 참여할 팀원 모집.',
    roles: '기획 1명, 마케터 1명',
    dueDate: '2025.08.15 시작',
    isBookmarked: true,
    isRecommended: false,
  },
  {
    id: 'm3',
    type: '모집 중',
    title: '웹 기반 포트폴리오 사이트 제작',
    tags: ['프론트엔드', '디자인', 'React'],
    description: '개인 및 팀 포트폴리오를 위한 웹사이트 개발 프로젝트.',
    roles: '프론트엔드 개발자 1명',
    dueDate: 'D-30',
    isBookmarked: false,
    isRecommended: false,
  },
  {
    id: 'm4',
    type: '매칭 완료', // 예시로 완료된 매칭도 포함
    title: 'AI 챗봇 서비스 기획 및 개발',
    tags: ['IT', 'AI', '기획'],
    description: '사용자 친화적인 AI 챗봇 서비스 기획부터 개발까지.',
    roles: '기획 1명, 백엔드 1명, 프론트 1명',
    dueDate: '매칭 완료',
    isBookmarked: false,
    isRecommended: false,
  },
];

const filterOptions = [
  { label: '마케팅', value: '마케팅' },
  { label: '디자인', value: '디자인' },
  { label: 'IT', value: 'IT' },
  { label: '서비스 개발', value: '서비스 개발' },
  { label: '기획', value: '기획' },
  // 더 많은 필터 옵션 추가 가능
];

export default function TeamMatchingPage() {
  const [matchingList, setMatchingList] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('latest'); // 'latest', 'leastMembers' 등

  useEffect(() => {
    // 실제 앱에서는 여기서 API 호출하여 매칭 데이터를 가져옵니다.
    // 여기서는 초기 데이터 사용
    setMatchingList(initialMatchingData);
  }, []);

  const handleFilterChange = (filterValue) => {
    setSelectedFilters((prevFilters) =>
      prevFilters.includes(filterValue)
        ? prevFilters.filter((f) => f !== filterValue)
        : [...prevFilters, filterValue]
    );
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const filteredAndSortedList = React.useMemo(() => {
    let filtered = matchingList.filter((matching) => {
      const matchesFilter = selectedFilters.length === 0 ||
        matching.tags.some((tag) => selectedFilters.includes(tag));
      const matchesSearch = matching.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        matching.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });

    if (sortBy === 'latest') {
      // 최신순 정렬 로직 (예시: id를 기준으로 내림차순)
      filtered.sort((a, b) => b.id.localeCompare(a.id));
    } else if (sortBy === 'leastMembers') {
      // 인원 적은순 정렬 로직 (이 예시에서는 'roles' 필드를 파싱해야 해서 복잡하므로 간단히 스킵)
      // 실제로는 matching.roles에서 인원 수를 추출하여 정렬해야 합니다.
    }
    return filtered;
  }, [matchingList, selectedFilters, searchQuery, sortBy]);

  const recommendedMatching = matchingList.find(m => m.isRecommended);

  return (
    <div className="team-matching-page">
      <DefaultHeader title="팀 매칭" hasSearch hasAlarm /> {/* 검색, 알림 아이콘 포함 */}

      <div className="page-content">
        {/* 오늘의 추천 매칭 섹션 */}
        {recommendedMatching && (
          <div className="recommended-section">
            <h2 className="section-title">오늘의 추천 매칭</h2>
            <div className="recommend-card">
              <span className="badge">Best</span>
              <h3>{recommendedMatching.title}</h3>
              <p>{recommendedMatching.description}</p>
              <div className="info-bar">
                <span className="views">👀 172</span>
                <span className="comments">💬 80</span>
                <span className="slots">{recommendedMatching.roles}</span>
              </div>
            </div>
          </div>
        )}

        {/* 필터 및 검색 바 */}
        <div className="filter-section">
          <div className="filter-tags">
            {filterOptions.map((option) => (
              <span
                key={option.value}
                className={`filter-tag ${selectedFilters.includes(option.value) ? 'active' : ''}`}
                onClick={() => handleFilterChange(option.value)}
              >
                {option.label}
              </span>
            ))}
            <span className="filter-more">더보기 &gt;</span> {/* '상세히 보기' 또는 '더보기' */}
          </div>

          <div className="search-bar">
            <input
              type="text"
              placeholder="프로젝트명, 기술 스택 등으로 검색"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            {/* 검색 아이콘은 input 내부에 배치하거나 별도 버튼으로 만들 수 있습니다. */}
          </div>

          <div className="sort-options">
            <select value={sortBy} onChange={handleSortChange}>
              <option value="latest">최신순</option>
              <option value="leastMembers">인원 적은순</option>
              {/* 기타 정렬 옵션 */}
            </select>
          </div>
        </div>

        {/* 매칭 공고 목록 */}
        <div className="matching-list">
          {filteredAndSortedList.length > 0 ? (
            filteredAndSortedList.map((matching) => (
              <MatchingCard key={matching.id} matching={matching} />
            ))
          ) : (
            <p className="no-results">
              현재 조건에 맞는 매칭 공고가 없습니다.
            </p>
          )}
        </div>
      </div>

      <BottomNav activeTab="teamMatching" /> {/* '팀 매칭' 탭 활성화 */}
    </div>
  );
}
import React from 'react';
import './VerificationLoadingCard.scss';

/**
 * 대학 인증 로딩 컴포넌트 (카드 버전)
 * - 뷰포트 전체를 꽉 채우는 레이아웃
 * - iOS Safari 100vh 문제 해결
 * - 카드 스타일 유지
 * - 접근성 고려
 */
const VerificationLoadingCard = ({ 
    title = "대학 인증을 확인하고 있어요",
    subtitle = "잠시만 기다려주세요. 보통 10-30초 정도 소요됩니다.",
    tip = "화면이 멈춘 것 같다면 새로고침 해주세요",
    showSteps = false 
}) => {
    return (
        <div className="verification-loading-container">
            <div className="verification-card">
                <div className="verification-content">
                    <h1 className="verification-title">
                        {title}
                    </h1>
                    <p className="verification-subtitle">
                        {subtitle}
                    </p>
                    
                    {/* 단일 스피너 로딩 애니메이션 */}
                    <div className="loading-spinner">
                        <div 
                            className="spinner" 
                            role="status" 
                            aria-label="로딩 중"
                        ></div>
                    </div>
                    
                    {/* 선택적 단계 표시 */}
                    {showSteps && (
                        <div className="progress-steps">
                            <div className="step-item completed">
                                <div className="step-number">1</div>
                                <div className="step-text">정보 입력</div>
                            </div>
                            <div className="step-line"></div>
                            <div className="step-item completed">
                                <div className="step-number">2</div>
                                <div className="step-text">인증 요청</div>
                            </div>
                            <div className="step-line"></div>
                            <div className="step-item active">
                                <div className="step-number">3</div>
                                <div className="step-text">인증 확인 중</div>
                            </div>
                            <div className="step-line"></div>
                            <div className="step-item">
                                <div className="step-number">4</div>
                                <div className="step-text">완료</div>
                            </div>
                        </div>
                    )}
                    
                    {/* 추가 안내 메시지 */}
                    <p className="verification-tip">
                        {tip}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default VerificationLoadingCard;

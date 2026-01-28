import React from 'react';
import { useRouter, useLocation } from 'shared/shims/useNextRouterShim';

export default function IntroPage() {
    const router = useRouter();
    const location = useLocation();
    const from = (location.state as { from?: string })?.from || '/';

    const handleStartTest = () => {
        router.push('/type-test/quiz', { state: { from } });
    };

    const handleShare = async () => {
        const shareData = {
            title: '티미타카 캐릭터 찾기',
            text: '프로젝트 가치관으로 알아보는 나의 티미타카 캐릭터는?',
            url: window.location.href,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(window.location.href);
                alert('링크가 복사되었습니다!');
            }
        } catch (error) {
            console.error('공유 실패:', error);
        }
    };

    const handleSkip = () => {
        router.push(from);
    };

    return (
        <div
            className="tw-min-h-screen tw-flex tw-flex-col tw-relative tw-overflow-hidden"
            style={{
                fontFamily: 'Pretendard, sans-serif',
                backgroundColor: '#403e3e',
            }}
        >
            {/* Header */}
            <div className="tw-pt-14 tw-pb-4 tw-text-center">
                <p className="tw-text-white tw-text-xl tw-font-semibold" style={{ letterSpacing: '-1.5px' }}>
                    프로젝트 가치관으로 알아보는
                </p>
                <h1 className="tw-text-white tw-text-3xl tw-font-bold tw-mt-2" style={{ letterSpacing: '-3px' }}>
                    티미타카 <span style={{ color: '#f76241' }}>캐릭터</span> 찾기
                </h1>
            </div>

            {/* Character Image */}
            <div className="tw-flex-1 tw-flex tw-items-center tw-justify-center tw-px-4">
                <img
                    src="/assets/main/character.png"
                    alt="티미타카 캐릭터"
                    className="tw-max-w-[287px] tw-max-h-[330px] tw-object-contain"
                />
            </div>

            {/* Participant Count Banner */}
            <div className="tw-flex tw-flex-col tw-items-center tw-px-8 tw-mb-4">
                <div className="tw-relative">
                    <img
                        src="/assets/main/2358.png"
                        alt="참여자 배경"
                        className="tw-w-[226px] tw-h-auto"
                    />
                    <p
                        className="tw-absolute tw-inset-0 tw-flex tw-items-center tw-justify-center tw-text-white tw-text-xs tw-font-medium"
                        style={{ letterSpacing: '-1px' }}
                    >
                        현재 2,358 명이 나의 티미를 찾았어요!
                    </p>
                </div>
            </div>

            {/* Buttons */}
            <div className="tw-px-4 tw-pb-6">
                <button
                    onClick={handleStartTest}
                    className="tw-w-full tw-h-[54px] tw-rounded-lg tw-text-white tw-font-bold tw-text-base"
                    style={{ backgroundColor: '#f76241', letterSpacing: '-1.5px' }}
                >
                    테스트 시작하기
                </button>

                <button
                    onClick={handleShare}
                    className="tw-w-full tw-h-[54px] tw-rounded-lg tw-font-bold tw-text-base tw-mt-2"
                    style={{ backgroundColor: '#fffdfc', color: '#f76241', letterSpacing: '-1.5px' }}
                >
                    테스트 공유하기
                </button>

                <div className="tw-text-center tw-mt-4">
                    <button
                        onClick={handleSkip}
                        className="tw-text-xs tw-font-medium tw-underline"
                        style={{ color: '#d1cccb', letterSpacing: '-1px' }}
                    >
                        나중에 할래요
                    </button>
                </div>
            </div>
        </div>
    );
}

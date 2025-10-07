// src/Pages/ProjectRecruitImage/ProjectRecruitImage.js
import { useEffect, useRef, useState } from 'react';
import './ProjectRecruitImage.scss';
import { loadRecruitDraft, saveRecruitDraft } from '../../../api/recruit';
import { useNavigate } from 'react-router-dom';

export default function ProjectRecruitImage() {
    const nav = useNavigate();
    const fileRef = useRef(null);

    const [imageDataUrl, setImageDataUrl] = useState(null);
    const [sheetOpen, setSheetOpen] = useState(false);

    // 초안 불러오기 (coverImage.dataUrl 있으면 미리보기)
    // useEffect(() => {
    //     const d = loadRecruitDraft();
    //     if (d && d.coverImage && d.coverImage.dataUrl) {
    //         setImageDataUrl(d.coverImage.dataUrl);
    //     }
    // }, []);

    const openSheet = () => setSheetOpen(true);
    const closeSheet = () => setSheetOpen(false);

    const triggerPick = () => {
        closeSheet();
        if (fileRef.current) fileRef.current.click();
    };

    const onPick = async (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        // 타입/용량 유효성
        if (!file.type.startsWith('image/')) {
            alert('이미지 파일만 업로드할 수 있어요.');
            return;
        }
        const MAX = 10 * 1024 * 1024; // 10MB
        if (file.size > MAX) {
            alert('10MB 이하 이미지만 업로드할 수 있어요.');
            return;
        }

        const reader = new FileReader();
        reader.onload = () => setImageDataUrl(reader.result);
        reader.onerror = () => alert('이미지를 불러오지 못했어요. 다시 시도해주세요.');
        reader.readAsDataURL(file);
        e.target.value = ''; // 같은 파일 재선택 가능하도록 초기화
    };

    const removeImage = () => {
        setImageDataUrl(null);
        closeSheet();
    };

    const saveDraft = () => {
        const base = loadRecruitDraft() || {};
        saveRecruitDraft({
            ...base,
            coverImage: imageDataUrl ? { dataUrl: imageDataUrl } : null,
        });
        alert('임시 저장되었어요.');
    };

    const goNext = () => {
        // 필요 시 여기서 서버 업로드 → url 저장 로직 추가 가능
        nav('/recruit/preview'); // 다음 단계 라우트로 이동(없으면 임시로 알럿)
    };

    return (
        <div className="page recruit-image-page">
            {/* 상단바 */}
            <div className="topbar">
                <button className="back" onClick={() => nav(-1)} aria-label="뒤로">
                    <span className="chevron" aria-hidden="true"></span>
                </button>
                <button className="save-text" onClick={saveDraft}>임시 저장</button>
            </div>

            <div className="container">
                <h2 className="h2">모집글의 대표 이미지를{'\n'}추가해주세요!</h2>

                {/* 업로드 카드 */}
                <button
                    type="button"
                    className="cover-card"
                    onClick={openSheet}
                    aria-label="대표 이미지 업로드"
                >
                    {imageDataUrl ? (
                        <img src={imageDataUrl} alt="대표 이미지 미리보기" />
                    ) : (
                        <span className="plus" aria-hidden="true" />
                    )}
                </button>

                <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={onPick}
                />
            </div>

            {/* 하단 CTA */}
            <div className="footer">
                {imageDataUrl ? (
                    <button
                        type="button"
                        className="next-btn on"
                        onClick={goNext}
                    >
                        다음
                    </button>
                ) : (
                    <button
                        type="button"
                        className="skip-btn"
                        onClick={goNext}
                    >
                        건너뛰기
                    </button>
                )}
            </div>

            {/* 바텀시트 */}
            {sheetOpen && (
                <>
                    <div className="sheet-backdrop" onClick={closeSheet} />
                    <div className="sheet" role="dialog" aria-modal="true">
                        <div className="sheet-panel">
                            <div className="item" role="button" onClick={triggerPick}>
                                라이브러리에서 선택
                            </div>
                            {imageDataUrl && (
                                <div className="item" role="button" onClick={removeImage}>
                                    현재 사진 삭제
                                </div>
                            )}
                        </div>
                        <div className="cancel" role="button" onClick={closeSheet}>
                            취소
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

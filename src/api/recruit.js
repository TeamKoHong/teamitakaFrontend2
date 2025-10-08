// src/api/recruit.js

// ───────── 단일 진행중 드래프트(기존 호환) ─────────
const SINGLE_KEY = 'recruit.draft';

export const loadRecruitDraft = () => {
  try {
    const raw = localStorage.getItem(SINGLE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const saveRecruitDraft = (draft) => {
  localStorage.setItem(SINGLE_KEY, JSON.stringify(draft));
};

export const clearRecruitDraft = () => {
  localStorage.removeItem(SINGLE_KEY);
};

// ───────── 드래프트 리스트(여러 개 저장/불러오기) ─────────
const LIST_KEY = 'recruit.drafts';
const CURRENT_ID_KEY = 'recruit.currentDraftId';
const MAX_DRAFTS = 50;

export const loadDrafts = () => {
  try {
    return JSON.parse(localStorage.getItem(LIST_KEY) || '[]');
  } catch {
    return [];
  }
};

export const getDraftById = (id) => loadDrafts().find((d) => d.id === id);

export const deleteDrafts = (ids) => {
  const next = loadDrafts().filter((d) => !ids.includes(d.id));
  localStorage.setItem(LIST_KEY, JSON.stringify(next));
};

export const saveDraftToList = (partial) => {
  const now = Date.now();
  const list = loadDrafts();

  // id 없으면 신규 발급
  let id = partial.id;
  if (!id) {
    id =
      (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : String(now) + Math.random().toString(36).slice(2, 8));
  }

  const item = {
    id,
    title: partial.title || '',
    type: partial.type || '', // 'course' | 'side' | ''
    updatedAt: now,
    data: partial.data || {},
  };

  const idx = list.findIndex((d) => d.id === id);
  if (idx >= 0) list[idx] = { ...list[idx], ...item, updatedAt: now };
  else list.unshift(item);

  // 최대 개수 유지
  if (list.length > MAX_DRAFTS) list.length = MAX_DRAFTS;

  localStorage.setItem(LIST_KEY, JSON.stringify(list));
  localStorage.setItem(CURRENT_ID_KEY, id);
  return id;
};

export const getCurrentDraftId = () => localStorage.getItem(CURRENT_ID_KEY);
export const setCurrentDraftId = (id) => localStorage.setItem(CURRENT_ID_KEY, id);

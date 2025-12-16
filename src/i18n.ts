export type Language = "ko" | "en";

export const strings: Record<Language, Record<string, string>> = {
  ko: {
    appTitle: "🔍 추리소설 정리 - 사건 분석 도구",
    appSubtitle: "용의자, 증거, 타임라인을 정리하고 관계를 파악해보세요.",
    timeline: "타임라인",
    startTime: "시작 시간:",
    endTime: "종료 시간:",
    deathStart: "사망 추정 시작:",
    deathEnd: "사망 추정 끝:",
    suspectFilter: "용의자 필터:",
    all: "모두 보기",

    suspectsList: "용의자 목록",
    addSuspect: "+ 용의자 추가",
    cancel: "취소",
    name: "이름:",
    characteristics: "특징:",
    motive: "동기:",
    add: "추가",
    delete: "삭제",
    edit: "수정",
    save: "저장",

    alibis: "알리바이 목록:",
    noAlibi: "추가된 알리바이가 없습니다",
    newAlibi: "새로운 알리바이 추가:",
    place: "위치",
    activity: "활동",

    evidenceAnalysis: "증거 분석",
    addCluePlaceholder: "새로운 단서를 입력하세요",
    addClue: "+ 단서 추가",
    suspect: "용의자",
    where: "어디서?",
    how: "어떻게?",
    why: "왜?",
  },
  en: {
    appTitle: "🔍 Mystery Organizer - Case Analysis Tool",
    appSubtitle:
      "Organize suspects, evidence, and timeline to find connections.",
    timeline: "Timeline",
    startTime: "Start time:",
    endTime: "End time:",
    deathStart: "Estimated death start:",
    deathEnd: "Estimated death end:",
    suspectFilter: "Suspect Filter:",
    all: "All",

    suspectsList: "Suspect List",
    addSuspect: "+ Add Suspect",
    cancel: "Cancel",
    name: "Name:",
    characteristics: "Characteristics:",
    motive: "Motive:",
    add: "Add",
    delete: "Delete",
    edit: "Edit",
    save: "Save",

    alibis: "Alibi List:",
    noAlibi: "No alibis added",
    newAlibi: "Add New Alibi:",
    place: "Place",
    activity: "Activity",

    evidenceAnalysis: "Evidence Analysis",
    addCluePlaceholder: "Enter a new clue",
    addClue: "+ Add Clue",
    suspect: "Suspect",
    where: "Where?",
    how: "How?",
    why: "Why?",
  },
};

export const t = (lang: Language, key: string): string => {
  const table = strings[lang] || strings.ko;
  return table[key] ?? key;
};

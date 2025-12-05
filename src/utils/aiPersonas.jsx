import { Brain, Newspaper, MessageCircle, BarChart3, Globe2 } from "lucide-react";

// --- AI Personas (백엔드 저장형 분석 5종) ---
export const AI_PERSONAS = {
  integrated: {
    id: "integrated",
    name: "통합 분석 (Gemini)",
    desc: "가격·수급·뉴스·재무를 통합한 저장형 리포트",
    style: "균형 잡힌 요약형 톤",
    icon: <Brain className="w-5 h-5 text-purple-500" />,
    getComment: () => "모든 신호를 묶어 전체 그림을 보여줍니다.",
  },
  news: {
    id: "news",
    name: "뉴스 분석 (Gemini)",
    desc: "헤드라인 영향도와 이벤트 리스크 요약",
    style: "팩트 중심의 브리핑 톤",
    icon: <Newspaper className="w-5 h-5 text-blue-500" />,
    getComment: () => "주요 이슈와 이벤트를 빠르게 스캔합니다.",
  },
  reddit: {
    id: "reddit",
    name: "Reddit 분석 (Gemini)",
    desc: "커뮤니티 감성·언급량 스냅샷",
    style: "커뮤니티 슬랭이 섞인 캐주얼 톤",
    icon: <MessageCircle className="w-5 h-5 text-emerald-500" />,
    getComment: () => "실시간 여론 대신 저장된 센티먼트를 보여줍니다.",
  },
  financial: {
    id: "financial",
    name: "재무제표 분석 (Gemini)",
    desc: "실적·현금흐름·밸류에이션 포인트",
    style: "냉정한 애널리스트 톤",
    icon: <BarChart3 className="w-5 h-5 text-amber-500" />,
    getComment: () => "마진과 성장률을 기준으로 보수적으로 평가합니다.",
  },
  macro: {
    id: "macro",
    name: "거시경제 분석 (Gemini)",
    desc: "금리·환율·사이클 상관도 체크",
    style: "리스크 관리 중심 톤",
    icon: <Globe2 className="w-5 h-5 text-indigo-500" />,
    getComment: () => "거시 변수와의 상관도를 미리 계산해둔 결과입니다.",
  },
};


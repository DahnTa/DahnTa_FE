import {
  TrendingUp,
  DollarSign,
  AlertCircle,
} from "lucide-react";

// --- AI Personas ---
export const AI_PERSONAS = {
  trend: {
    id: "trend",
    name: "불꽃 슈터 (추세 추종)",
    desc: "오르는 말에 올라타라! 강한 상승세를 좋아합니다.",
    style: "매우 공격적이고 흥분한 어조",
    icon: <TrendingUp className="w-5 h-5 text-red-500" />,
    getComment: (change) => {
      if (change > 3) return "기세가 아주 좋습니다! 지금이 탑승 기회입니다! 🚀";
      if (change > 0) return "상승 흐름이 보입니다. 주시할 필요가 있어요.";
      if (change < -3) return "떨어지는 칼날은 잡지 않습니다. 도망치세요! 💨";
      return "추세가 확실치 않네요. 관망합시다.";
    },
  },
  value: {
    id: "value",
    name: "워렌 버핏 빙의 (가치 투자)",
    desc: "공포에 사고 환희에 팔아라. 저평가를 노립니다.",
    style: "차분하고 현학적이며 진지한 어조",
    icon: <DollarSign className="w-5 h-5 text-yellow-500" />,
    getComment: (change) => {
      if (change < -5) return "이 가격이면 바겐세일입니다! 매수하세요. 💎";
      if (change < 0) return "조금씩 모아가기 좋은 가격대입니다.";
      if (change > 5) return "너무 과열되었습니다. 이익 실현을 고려하세요.";
      return "기업의 가치는 변하지 않았습니다. 인내심을 가지세요.";
    },
  },
  timid: {
    id: "timid",
    name: "소심한 김대리 (안정 지향)",
    desc: "원금 보장이 최우선입니다. 변동성을 싫어합니다.",
    style: "겁이 많고 조심스러운 존댓말 어조",
    icon: <AlertCircle className="w-5 h-5 text-blue-300" />,
    getComment: (change) => {
      if (Math.abs(change) > 4) return "으악! 변동성이 너무 커요! 무서워요! 😱";
      if (change > 0) return "오, 조금 벌었네요? 지금 팔아서 확정 짓죠?";
      if (change < 0) return "손해 보고 있어요... 어떡하죠? ㅠㅠ";
      return "조용해서 좋네요. 이대로만 갑시다.";
    },
  },
};


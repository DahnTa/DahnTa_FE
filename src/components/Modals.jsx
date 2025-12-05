import React from "react";
import { X, AlertTriangle, RefreshCw, FileText, KeyRound } from "lucide-react";
import { formatCurrency } from "../utils/formatters";
import { MARKET_DATA } from "../utils/marketData";

export const SettingsModal = ({ isOpen, onClose, onEditId, onEditPw, isDarkMode }) => {
  if (!isOpen) return null;

  const theme = isDarkMode
    ? {
        bg: "bg-slate-800",
        border: "border-slate-700",
        text: "text-slate-100",
        subText: "text-slate-400",
        btnBg: "bg-slate-700 hover:bg-slate-600",
        btnText: "text-slate-200",
      }
    : {
        bg: "bg-white",
        border: "border-slate-300",
        text: "text-slate-900",
        subText: "text-slate-500",
        btnBg: "bg-slate-100 hover:bg-slate-200",
        btnText: "text-slate-800",
      };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div
        className={`${theme.bg} ${theme.border} border rounded-2xl w-full max-w-sm p-6 shadow-2xl relative`}
      >
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 ${theme.subText} hover:${theme.text} transition-colors`}
        >
          <X size={20} />
        </button>

        <h3 className={`text-xl font-bold ${theme.text} mb-2 text-center`}>
          회원정보 수정
        </h3>
        <p className={`text-sm ${theme.subText} text-center mb-6`}>
          수정할 항목을 선택해주세요.
        </p>

        <div className="space-y-3">
          <button
            onClick={onEditId}
            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all ${theme.btnBg} ${theme.btnText}`}
          >
            <FileText size={20} />
            아이디 변경
          </button>
          <button
            onClick={onEditPw}
            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all ${theme.btnBg} ${theme.btnText}`}
          >
            <KeyRound size={20} />
            비밀번호 변경
          </button>
        </div>
      </div>
    </div>
  );
};

export const ConfirmModal = ({ isOpen, onClose, onConfirm, isDarkMode }) => {
  if (!isOpen) return null;

  const theme = isDarkMode
    ? {
        bg: "bg-slate-800",
        border: "border-slate-700",
        text: "text-slate-100",
        subText: "text-slate-400",
        cancelBg: "bg-slate-700 hover:bg-slate-600",
        cancelText: "text-slate-300",
      }
    : {
        bg: "bg-white",
        border: "border-slate-300",
        text: "text-slate-900",
        subText: "text-slate-500",
        cancelBg: "bg-slate-100 hover:bg-slate-200",
        cancelText: "text-slate-700",
      };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div
        className={`${theme.bg} ${theme.border} border rounded-2xl w-full max-w-sm p-6 shadow-2xl relative`}
      >
        <div className="flex justify-center mb-4 text-amber-500">
          <AlertTriangle size={48} />
        </div>

        <h3 className={`text-xl font-bold ${theme.text} mb-2 text-center`}>
          게임 종료
        </h3>
        <p className={`text-sm ${theme.subText} text-center mb-6`}>
          정말로 게임을 그만두시겠습니까?
          <br />
          현재까지의 수익률로 최종 기록됩니다.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className={`flex-1 py-3 rounded-xl font-bold transition-all ${theme.cancelBg} ${theme.cancelText}`}
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-xl font-bold bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/30 transition-all"
          >
            종료하기
          </button>
        </div>
      </div>
    </div>
  );
};

export const GameOverModal = ({ gameState, onReset }) => {
  if (!gameState || !gameState.isGameOver) return null;

  let stockValue = 0;
  Object.entries(gameState.portfolio).forEach(([sid, data]) => {
    const currentPrice =
      MARKET_DATA[sid].prices[
        gameState.startDayIndex + gameState.currentDayOffset
      ];
    stockValue += data.quantity * currentPrice;
  });
  const finalTotal = gameState.balance + stockValue;
  const initial = 10000;
  const profit = finalTotal - initial;
  const profitRate = (profit / initial) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-800 border-2 border-slate-600 rounded-2xl max-w-md w-full p-8 text-center shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500"></div>

        <h2 className="text-3xl font-bold mb-2 text-white">게임 종료!</h2>
        <p className="text-slate-400 mb-8">20일간의 투자가 끝났습니다.</p>

        <div className="bg-slate-900 rounded-xl p-6 mb-8 border border-slate-700">
          <div className="mb-4">
            <p className="text-sm text-slate-400">최종 수익률</p>
            <p
              className={`text-5xl font-bold mt-2 ${
                profit >= 0 ? "text-red-400" : "text-blue-400"
              }`}
            >
              {profit >= 0 ? "+" : ""}
              {profitRate.toFixed(2)}%
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm border-t border-slate-800 pt-4 mt-4">
            <div>
              <p className="text-slate-500">초기 자본금</p>
              <p className="font-mono text-slate-300">
                {formatCurrency(initial)}
              </p>
            </div>
            <div>
              <p className="text-slate-500">최종 평가액</p>
              <p className="font-mono text-white">
                {formatCurrency(finalTotal)}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onReset}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl text-lg shadow-lg shadow-purple-900/30 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
        >
          <RefreshCw size={20} />
          새로운 게임 시작하기
        </button>
      </div>
    </div>
  );
};


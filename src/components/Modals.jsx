import React, { useState } from "react";
import { X, AlertTriangle, RefreshCw, Lock, Loader2, CheckCircle, Eye, EyeOff } from "lucide-react";
import { formatCurrency } from "../utils/formatters";

export const ChangePasswordModal = ({ isOpen, onClose, onSubmit, isDarkMode, isLoading }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const resetForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setSuccess("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    if (!newPassword) {
      setError("새 비밀번호를 입력해주세요.");
      return;
    }
    if (newPassword.length < 4) {
      setError("비밀번호는 4자 이상이어야 합니다.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      await onSubmit({ userPassword: newPassword });
      setSuccess("비밀번호가 변경되었습니다!");
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (err) {
      setError(err?.data?.message || err?.message || "비밀번호 변경에 실패했습니다.");
    }
  };

  if (!isOpen) return null;

  const theme = isDarkMode
    ? {
        bg: "bg-slate-800",
        border: "border-slate-700",
        text: "text-slate-100",
        subText: "text-slate-400",
        inputBg: "bg-slate-900",
        inputBorder: "border-slate-600",
        inputText: "text-slate-100",
        btnBg: "bg-slate-700 hover:bg-slate-600",
        btnText: "text-slate-200",
      }
    : {
        bg: "bg-white",
        border: "border-slate-300",
        text: "text-slate-900",
        subText: "text-slate-500",
        inputBg: "bg-slate-50",
        inputBorder: "border-slate-300",
        inputText: "text-slate-900",
        btnBg: "bg-slate-100 hover:bg-slate-200",
        btnText: "text-slate-800",
      };

  const inputClass = `w-full ${theme.inputBg} border ${theme.inputBorder} ${theme.inputText} text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block pl-10 pr-10 p-3.5 outline-none transition-all placeholder-slate-500`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div
        className={`${theme.bg} ${theme.border} border rounded-2xl w-full max-w-sm p-6 shadow-2xl relative`}
      >
        <button
          onClick={handleClose}
          className={`absolute top-4 right-4 ${theme.subText} hover:${theme.text} transition-colors`}
        >
          <X size={20} />
        </button>

        <div className="flex justify-center mb-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
            <Lock size={24} className="text-white" />
          </div>
        </div>

        <h3 className={`text-xl font-bold ${theme.text} mb-2 text-center`}>
          비밀번호 변경
        </h3>
        <p className={`text-sm ${theme.subText} text-center mb-6`}>
          새로운 비밀번호를 입력해주세요.
        </p>

        <div className="space-y-3 mb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock size={18} className={theme.subText} />
            </div>
            <input
              type={showNew ? "text" : "password"}
              placeholder="새 비밀번호 (4자 이상)"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setError("");
              }}
              className={inputClass}
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className={`absolute inset-y-0 right-0 pr-3 flex items-center ${theme.subText} hover:${theme.text}`}
            >
              {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock size={18} className={theme.subText} />
            </div>
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="새 비밀번호 확인"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              className={inputClass}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className={`absolute inset-y-0 right-0 pr-3 flex items-center ${theme.subText} hover:${theme.text}`}
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {error && (
          <p className="text-red-400 text-xs text-center mb-4 animate-in fade-in">
            {error}
          </p>
        )}
        {success && (
          <div className="flex items-center justify-center gap-2 text-emerald-400 text-sm mb-4 animate-in fade-in bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20">
            <CheckCircle size={18} />
            {success}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleClose}
            className={`flex-1 py-3 rounded-xl font-bold transition-all ${theme.btnBg} ${theme.btnText}`}
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex-1 py-3 rounded-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-900/30 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : "변경하기"}
          </button>
        </div>
      </div>
    </div>
  );
};

export const SettingsModal = ({ isOpen, onClose, onEditPw, isDarkMode, isChangingPw }) => {
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
            onClick={onEditPw}
            disabled={isChangingPw}
            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all ${theme.btnBg} ${theme.btnText} disabled:opacity-60`}
          >
            {isChangingPw ? "변경 중..." : "비밀번호 변경"}
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

export const GameOverModal = ({ isGameOver, gameResult, asset, onReset }) => {
  if (!isGameOver) return null;

  const finalAmount = gameResult?.finalAmount ?? asset?.totalAmount ?? 0;
  const initialFunds = gameResult?.initialFunds ?? 10000000; // 백엔드 스펙: 시드머니 천만원
  const profit = finalAmount - initialFunds;
  const profitRate = gameResult?.finalReturnRate ?? (profit / initialFunds) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-800 border-2 border-slate-600 rounded-2xl max-w-md w-full p-8 text-center shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500"></div>

        <h2 className="text-3xl font-bold mb-2 text-white">게임 종료!</h2>
        <p className="text-slate-400 mb-8">투자가 종료되었습니다.</p>

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
              <p className="font-mono text-slate-300">{formatCurrency(initialFunds)}</p>
            </div>
            <div>
              <p className="text-slate-500">최종 평가액</p>
              <p className="font-mono text-white">{formatCurrency(finalAmount)}</p>
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

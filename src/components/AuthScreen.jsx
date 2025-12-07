import React, { useState } from "react";
import {
  TrendingUp,
  User,
  Lock,
  UserPlus,
  Loader2,
  Mail,
  ArrowLeft,
  CheckCircle,
  Wifi,
  AlertTriangle,
  ShieldAlert,
} from "lucide-react";
import { signupApi } from "../api/api";
import ApiTestPanel from "./ApiTestPanel";

const AuthScreen = ({ onLogin, onGuestLogin }) => {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showApiTest, setShowApiTest] = useState(false);
  const [showAiDisclaimer, setShowAiDisclaimer] = useState(true);

  // 로그인 폼
  const [loginId, setLoginId] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // 회원가입 폼
  const [signupAccount, setSignupAccount] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupPasswordConfirm, setSignupPasswordConfirm] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupNickName, setSignupNickName] = useState("");

  const resetForms = () => {
    setLoginId("");
    setLoginPassword("");
    setSignupAccount("");
    setSignupPassword("");
    setSignupPasswordConfirm("");
    setSignupName("");
    setSignupNickName("");
    setError("");
    setSuccess("");
  };

  const switchMode = (newMode) => {
    resetForms();
    setMode(newMode);
  };

  const handleLogin = async () => {
    setError("");
    if (!loginId || !loginPassword) {
      setError("아이디와 비밀번호를 입력해주세요.");
      return;
    }
    try {
      setIsLoading(true);
      await onLogin({ userAccount: loginId, userPassword: loginPassword });
    } catch (err) {
      const msg =
        err?.data?.message ||
        err?.message ||
        "로그인에 실패했습니다. 네트워크 또는 API URL을 확인해주세요.";
      console.error("Login failed", err);
      setError(msg || "로그인에 실패했습니다.");
      setIsLoading(false);
      return;
    }
  };

  const handleSignup = async () => {
    setError("");
    setSuccess("");

    // 유효성 검사
    if (!signupAccount || !signupPassword || !signupName || !signupNickName) {
      setError("모든 필수 항목을 입력해주세요.");
      return;
    }
    if (signupPassword.length < 4) {
      setError("비밀번호는 4자 이상이어야 합니다.");
      return;
    }
    if (signupPassword !== signupPasswordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      setIsLoading(true);
      await signupApi({
        userAccount: signupAccount,
        userPassword: signupPassword,
        userName: signupName,
        userNickName: signupNickName,
        userProfileImageUrl: "", // 기본값
      });
      setSuccess("회원가입이 완료되었습니다! 로그인해주세요.");
      setTimeout(() => {
        switchMode("login");
        setLoginId(signupAccount);
      }, 1500);
    } catch (err) {
      const msg =
        err?.data?.message || err?.message || "회원가입에 실패했습니다.";
      console.error("Signup failed", err);
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block pl-10 p-3.5 outline-none transition-all placeholder-slate-500";

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>
        {mode === "signup" && (
          <div className="absolute top-[30%] right-[-5%] w-[30%] h-[30%] bg-emerald-600/15 rounded-full blur-[100px] animate-pulse delay-500"></div>
        )}
      </div>

      <div className="z-10 text-center max-w-sm w-full bg-slate-900/60 backdrop-blur-xl p-8 rounded-3xl border border-slate-800 shadow-2xl transform transition-all">
        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg shadow-blue-900/40">
            <TrendingUp size={40} className="text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-black text-white mb-2 tracking-tighter italic">
          StockSim
        </h1>
        <p className="text-slate-400 mb-6 text-sm font-medium">
          {mode === "login"
            ? "실전 투자 시뮬레이션에 오신 것을 환영합니다."
            : "새 계정을 만들어 시작하세요."}
        </p>

        {/* Tab Buttons */}
        <div className="flex bg-slate-950/50 p-1 rounded-xl mb-6 border border-slate-800">
          <button
            onClick={() => switchMode("login")}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              mode === "login"
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <User size={16} />
            로그인
          </button>
          <button
            onClick={() => switchMode("signup")}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              mode === "signup"
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <UserPlus size={16} />
            회원가입
          </button>
        </div>

        {/* Login Form */}
        {mode === "login" && (
          <div className="space-y-3 mb-6 animate-in fade-in duration-300">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={18} className="text-slate-500" />
              </div>
              <input
                type="text"
                placeholder="아이디"
                value={loginId}
                onChange={(e) => {
                  setLoginId(e.target.value);
                  setError("");
                }}
                className={inputClass}
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-slate-500" />
              </div>
              <input
                type="password"
                placeholder="비밀번호"
                value={loginPassword}
                onChange={(e) => {
                  setLoginPassword(e.target.value);
                  setError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className={inputClass}
              />
            </div>
          </div>
        )}

        {/* Signup Form */}
        {mode === "signup" && (
          <div className="space-y-3 mb-6 animate-in fade-in duration-300">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={18} className="text-slate-500" />
              </div>
              <input
                type="text"
                placeholder="아이디 (계정)"
                value={signupAccount}
                onChange={(e) => {
                  setSignupAccount(e.target.value);
                  setError("");
                }}
                className={inputClass}
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-slate-500" />
              </div>
              <input
                type="password"
                placeholder="비밀번호 (4자 이상)"
                value={signupPassword}
                onChange={(e) => {
                  setSignupPassword(e.target.value);
                  setError("");
                }}
                className={inputClass}
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-slate-500" />
              </div>
              <input
                type="password"
                placeholder="비밀번호 확인"
                value={signupPasswordConfirm}
                onChange={(e) => {
                  setSignupPasswordConfirm(e.target.value);
                  setError("");
                }}
                className={inputClass}
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={18} className="text-slate-500" />
              </div>
              <input
                type="text"
                placeholder="이름"
                value={signupName}
                onChange={(e) => {
                  setSignupName(e.target.value);
                  setError("");
                }}
                className={inputClass}
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserPlus size={18} className="text-slate-500" />
              </div>
              <input
                type="text"
                placeholder="닉네임"
                value={signupNickName}
                onChange={(e) => {
                  setSignupNickName(e.target.value);
                  setError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSignup()}
                className={inputClass}
              />
            </div>
          </div>
        )}

        {/* Error & Success Messages */}
        {error && (
          <p className="text-red-400 text-xs text-left pl-1 mb-4 animate-in fade-in">
            {error}
          </p>
        )}
        {success && (
          <div className="flex items-center gap-2 text-emerald-400 text-sm mb-4 animate-in fade-in bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20">
            <CheckCircle size={18} />
            {success}
          </div>
        )}

        {/* Submit Button */}
        {mode === "login" ? (
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl text-lg shadow-lg shadow-blue-900/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 disabled:opacity-60 disabled:transform-none"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              "로그인"
            )}
          </button>
        ) : (
          <button
            onClick={handleSignup}
            disabled={isLoading}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-lg shadow-lg shadow-emerald-900/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 disabled:opacity-60 disabled:transform-none"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>
                <UserPlus size={18} />
                회원가입
              </>
            )}
          </button>
        )}

        {mode === "login" && (
          <button
            onClick={onGuestLogin}
            className="mt-3 w-full py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 border border-slate-700"
          >
            게스트 모드로 둘러보기
          </button>
        )}

        {/* Footer Text */}
        <p className="text-slate-500 text-xs mt-6">
          {mode === "login"
            ? "계정이 없으신가요? 위 탭에서 회원가입을 선택하세요."
            : "이미 계정이 있으신가요? 위 탭에서 로그인을 선택하세요."}
        </p>

        {/* API Test Button */}
        <button
          onClick={() => setShowApiTest(true)}
          className="mt-4 text-slate-600 hover:text-slate-400 text-xs flex items-center justify-center gap-1 transition-colors"
        >
          <Wifi size={12} />
          API 연결 테스트
        </button>
      </div>

      {/* API Test Panel */}
      {showApiTest && <ApiTestPanel onClose={() => setShowApiTest(false)} />}

      {/* AI 주의문구 팝업 */}
      {showAiDisclaimer && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-amber-500/30 rounded-2xl w-full max-w-md p-6 shadow-2xl shadow-amber-900/20 animate-in fade-in zoom-in duration-300">
            {/* 헤더 */}
            <div className="flex items-center gap-3 mb-5">
              <div className="p-3 bg-amber-500/20 rounded-xl">
                <ShieldAlert size={28} className="text-amber-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">AI 투자 주의사항</h3>
                <p className="text-amber-400/80 text-xs font-medium">Important Notice</p>
              </div>
            </div>

            {/* 본문 */}
            <div className="space-y-4 mb-6">
              <div className="flex gap-3 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                <AlertTriangle size={20} className="text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-slate-300 text-sm leading-relaxed">
                  본 AI가 제공하는 분석·예측 및 투자 의견은 <span className="text-amber-400 font-semibold">참고용 정보</span>일 뿐이며, 실제 투자 판단의 책임은 <span className="text-white font-semibold">투자자 본인</span>에게 있습니다.
                </p>
              </div>
              
              <div className="flex gap-3 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                <AlertTriangle size={20} className="text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-slate-300 text-sm leading-relaxed">
                  AI 모델의 한계로 인해 <span className="text-amber-400 font-semibold">오류·불완전한 정보</span>가 포함될 수 있으며, 이를 단순 신뢰한 의사결정으로 발생하는 손실에 대해 <span className="text-white font-semibold">서비스 제공자는 책임을 지지 않습니다.</span>
                </p>
              </div>
            </div>

            {/* 동의 버튼 */}
            <button
              onClick={() => setShowAiDisclaimer(false)}
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold rounded-xl text-lg shadow-lg shadow-amber-900/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
            >
              <CheckCircle size={20} />
              동의합니다
            </button>

            <p className="text-slate-500 text-xs text-center mt-4">
              위 내용을 확인하고 동의해야 서비스를 이용할 수 있습니다.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthScreen;

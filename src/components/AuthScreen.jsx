import React, { useState } from "react";
import { TrendingUp, User, Lock, UserPlus } from "lucide-react";

const AuthScreen = ({ onLogin }) => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (id === "1111" && password === "1111") {
      onLogin();
    } else {
      setError("아이디 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>
      </div>

      <div className="z-10 text-center max-w-sm w-full bg-slate-900/60 backdrop-blur-xl p-8 rounded-3xl border border-slate-800 shadow-2xl transform transition-all">
        <div className="mb-6 flex justify-center">
          <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg shadow-blue-900/40">
            <TrendingUp size={40} className="text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-black text-white mb-2 tracking-tighter italic">
          StockSim
        </h1>
        <p className="text-slate-400 mb-8 text-sm font-medium">
          실전 투자 시뮬레이션에 오신 것을 환영합니다.
        </p>

        <div className="space-y-3 mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User size={18} className="text-slate-500" />
            </div>
            <input
              type="text"
              placeholder="아이디"
              value={id}
              onChange={(e) => {
                setId(e.target.value);
                setError("");
              }}
              className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block pl-10 p-3.5 outline-none transition-all placeholder-slate-500"
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock size={18} className="text-slate-500" />
            </div>
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block pl-10 p-3.5 outline-none transition-all placeholder-slate-500"
            />
          </div>
          {error && (
            <p className="text-red-400 text-xs text-left pl-1">{error}</p>
          )}
        </div>

        <div className="space-y-3">
          <button
            onClick={handleLogin}
            className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl text-lg shadow-lg shadow-blue-900/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
          >
            로그인
          </button>

          <button
            className="w-full py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 border border-slate-700"
            onClick={() =>
              alert(
                "현재 회원가입은 닫혀있습니다. 아이디 '1111', 비밀번호 '1111'로 로그인해주세요."
              )
            }
          >
            <UserPlus size={16} />
            회원가입
          </button>
        </div>

        <p className="mt-8 text-[10px] text-slate-600 font-mono">
          Demo Account: 1111 / 1111
        </p>
      </div>
    </div>
  );
};

export default AuthScreen;


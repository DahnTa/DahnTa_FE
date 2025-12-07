import React, { useState } from "react";
import { Wifi, WifiOff, Loader2, CheckCircle, XCircle, Server, RefreshCw } from "lucide-react";

/**
 * API 연결 테스트 패널
 * - .env의 VITE_API_BASE_URL 설정 확인
 * - 서버 연결 테스트
 * - 로그인 API 테스트
 */
const ApiTestPanel = ({ onClose }) => {
  const [testResults, setTestResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "(설정 안됨)";

  const addResult = (name, success, message, details = null) => {
    setTestResults((prev) => [
      ...prev,
      { name, success, message, details, timestamp: new Date().toISOString() },
    ]);
  };

  const clearResults = () => setTestResults([]);

  const runAllTests = async () => {
    clearResults();
    setIsLoading(true);

    // 1. 환경변수 체크
    addResult(
      "환경변수 체크",
      !!import.meta.env.VITE_API_BASE_URL,
      import.meta.env.VITE_API_BASE_URL
        ? `VITE_API_BASE_URL = ${import.meta.env.VITE_API_BASE_URL}`
        : "VITE_API_BASE_URL이 설정되지 않았습니다. .env 파일을 생성하세요."
    );

    // 2. 서버 연결 테스트 (CORS 및 기본 연결)
    try {
      const startTime = Date.now();
      const res = await fetch(`${BASE_URL}/api/stocks`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const elapsed = Date.now() - startTime;

      if (res.status === 401) {
        addResult(
          "서버 연결",
          true,
          `서버 응답 OK (${elapsed}ms) - 인증 필요 (401)`,
          `Status: ${res.status}, 서버는 정상 작동 중`
        );
      } else if (res.ok) {
        addResult(
          "서버 연결",
          true,
          `서버 응답 OK (${elapsed}ms)`,
          `Status: ${res.status}`
        );
      } else {
        addResult(
          "서버 연결",
          false,
          `서버 응답 실패 (${elapsed}ms)`,
          `Status: ${res.status}`
        );
      }
    } catch (err) {
      addResult(
        "서버 연결",
        false,
        "서버에 연결할 수 없습니다",
        `Error: ${err.message}`
      );
    }

    // 3. 로그인 API 테스트 (잘못된 자격증명으로 테스트)
    try {
      const startTime = Date.now();
      const res = await fetch(`${BASE_URL}/api/auths/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userAccount: "__test_connection__",
          userPassword: "__test_connection__",
        }),
      });
      const elapsed = Date.now() - startTime;
      const data = await res.text();

      if (res.status === 401 || res.status === 400 || res.status === 404) {
        addResult(
          "로그인 API",
          true,
          `API 응답 OK (${elapsed}ms) - 예상된 인증 실패`,
          `Status: ${res.status}, Response: ${data.substring(0, 100)}...`
        );
      } else if (res.ok) {
        addResult(
          "로그인 API",
          true,
          `API 응답 OK (${elapsed}ms)`,
          `Status: ${res.status}`
        );
      } else {
        addResult(
          "로그인 API",
          false,
          `API 응답 실패 (${elapsed}ms)`,
          `Status: ${res.status}, Response: ${data.substring(0, 100)}`
        );
      }
    } catch (err) {
      addResult(
        "로그인 API",
        false,
        "로그인 API에 연결할 수 없습니다",
        `Error: ${err.message}`
      );
    }

    // 4. CORS 체크
    try {
      const res = await fetch(`${BASE_URL}/api/auths/login`, {
        method: "OPTIONS",
      });
      addResult(
        "CORS 설정",
        true,
        "CORS preflight 요청 성공",
        `Status: ${res.status}`
      );
    } catch (err) {
      if (err.message.includes("CORS") || err.message.includes("cross-origin")) {
        addResult(
          "CORS 설정",
          false,
          "CORS 오류 - 백엔드에서 CORS 설정이 필요합니다",
          `Error: ${err.message}`
        );
      } else {
        addResult(
          "CORS 설정",
          true,
          "CORS 체크 완료 (OPTIONS 요청은 지원하지 않을 수 있음)",
          `Info: ${err.message}`
        );
      }
    }

    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Server size={20} className="text-blue-500" />
            API 연결 테스트
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* 현재 설정 표시 */}
        <div className="bg-slate-800 rounded-xl p-4 mb-4 border border-slate-700">
          <p className="text-xs text-slate-500 uppercase font-bold mb-1">
            현재 API Base URL
          </p>
          <p className="font-mono text-sm text-emerald-400 break-all">
            {BASE_URL || "(설정 안됨)"}
          </p>
          {!import.meta.env.VITE_API_BASE_URL && (
            <p className="text-xs text-amber-400 mt-2">
              ⚠️ .env 파일에 VITE_API_BASE_URL을 설정하세요
            </p>
          )}
        </div>

        {/* 테스트 버튼 */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={runAllTests}
            disabled={isLoading}
            className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <RefreshCw size={18} />
            )}
            {isLoading ? "테스트 중..." : "연결 테스트 실행"}
          </button>
          {testResults.length > 0 && (
            <button
              onClick={clearResults}
              className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold rounded-xl transition-all"
            >
              초기화
            </button>
          )}
        </div>

        {/* 테스트 결과 */}
        {testResults.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-slate-500 uppercase font-bold mb-2">
              테스트 결과
            </p>
            {testResults.map((result, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg border ${
                  result.success
                    ? "bg-emerald-500/10 border-emerald-500/30"
                    : "bg-red-500/10 border-red-500/30"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {result.success ? (
                    <CheckCircle size={16} className="text-emerald-500" />
                  ) : (
                    <XCircle size={16} className="text-red-500" />
                  )}
                  <span
                    className={`font-bold text-sm ${
                      result.success ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {result.name}
                  </span>
                </div>
                <p className="text-xs text-slate-300 ml-6">{result.message}</p>
                {result.details && (
                  <p className="text-xs text-slate-500 ml-6 mt-1 font-mono break-all">
                    {result.details}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* 도움말 */}
        <div className="mt-4 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
          <p className="text-xs text-slate-400">
            <strong className="text-slate-300">💡 설정 방법:</strong>
            <br />
            1. 프로젝트 루트에 <code className="text-emerald-400">.env</code>{" "}
            파일 생성
            <br />
            2. <code className="text-emerald-400">
              VITE_API_BASE_URL=http://your-api-url
            </code>{" "}
            추가
            <br />
            3. 개발 서버 재시작 (<code className="text-emerald-400">
              npm run dev
            </code>)
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApiTestPanel;


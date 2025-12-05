import React, { useState, useEffect, useRef } from "react";
import {
  Home,
  User,
  Calendar,
  Sun,
  Moon,
  Power,
  ChevronDown,
  LogOut,
  UserCog,
  Sparkles,
  Menu,
} from "lucide-react";
import { SettingsModal } from "./Modals";

const Header = ({
  currentPage,
  setPage,
  gameState,
  onLogout,
  onQuitGame,
  isDarkMode,
  toggleTheme,
  toggleSidebar,
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const theme = isDarkMode
    ? {
        headerBg: "bg-slate-900",
        borderColor: "border-slate-700",
        textColor: "text-slate-500",
        navBg: "bg-slate-800/80",
        navBorder: "border-slate-700/50",
        navActive: "bg-blue-600 text-white",
        navInactive: "text-slate-400 hover:text-white hover:bg-slate-700",
        dayBg: "bg-slate-800",
        dayBorder: "border-slate-600",
        dayText: "text-slate-600",
        iconColor: "text-slate-400 hover:text-white",
        profileBg:
          "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700",
        dropdownBg: "bg-slate-800 border-slate-700",
        dropdownText: "text-slate-200",
        dropdownHover: "hover:bg-slate-700",
      }
    : {
        headerBg: "bg-white",
        borderColor: "border-slate-300",
        textColor: "text-slate-400",
        navBg: "bg-slate-100/80",
        navBorder: "border-slate-300/50",
        navActive: "bg-blue-600 text-white shadow-md",
        navInactive: "text-slate-500 hover:text-slate-900 hover:bg-slate-200",
        dayBg: "bg-slate-100",
        dayBorder: "border-slate-300",
        dayText: "text-slate-400",
        iconColor: "text-slate-500 hover:text-slate-900",
        profileBg:
          "bg-slate-100 border-slate-300 text-slate-600 hover:bg-slate-200",
        dropdownBg: "bg-white border-slate-200",
        dropdownText: "text-slate-800",
        dropdownHover: "hover:bg-slate-50",
      };

  const handleEditId = () => {
    setIsSettingsOpen(false);
    const newId = prompt("새로운 아이디를 입력하세요:");
    if (newId) alert(`아이디가 '${newId}'(으)로 변경되었습니다. (데모)`);
  };

  const handleEditPassword = () => {
    setIsSettingsOpen(false);
    const newPw = prompt("새로운 비밀번호를 입력하세요:");
    if (newPw) alert("비밀번호가 변경되었습니다. (데모)");
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full h-16 ${theme.headerBg} border-b ${theme.borderColor} z-50 flex items-center justify-between px-4 md:px-6 shadow-sm transition-colors duration-300`}
      >
        {/* Left: Logo & Mobile Menu */}
        <div className="flex items-center gap-2 md:pl-6">
          <button
            onClick={toggleSidebar}
            className={`md:hidden p-2 rounded-full ${theme.iconColor}`}
          >
            <Menu size={24} />
          </button>

          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setPage("dashboard")}
          >
            <h1 className="text-xl md:text-2xl font-black italic tracking-tighter bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
              StockSim
            </h1>
            <span
              className={`hidden lg:flex text-[10px] font-bold ${theme.textColor} items-center gap-1 border-l ${theme.borderColor} pl-3 ml-2 uppercase tracking-widest`}
            >
              <Sparkles size={10} className="text-yellow-500" /> AI Trading
            </span>
          </div>
        </div>

        {/* Center: Navigation (Desktop) */}
        <nav
          className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center gap-2 ${theme.navBg} p-1.5 rounded-full border ${theme.navBorder} backdrop-blur-sm`}
        >
          <button
            onClick={() => setPage("dashboard")}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold transition-all ${
              currentPage === "dashboard" ? theme.navActive : theme.navInactive
            }`}
          >
            <Home size={16} />홈
          </button>
          <button
            onClick={() => setPage("mypage")}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold transition-all ${
              currentPage === "mypage" ? theme.navActive : theme.navInactive
            }`}
          >
            <User size={16} />
            마이페이지
          </button>
        </nav>

        {/* Right: Day Status & Profile */}
        <div className="flex items-center gap-2 md:gap-3 pr-1 md:pr-2">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-colors ${
              isDarkMode
                ? "text-slate-400 hover:text-yellow-400 hover:bg-slate-800"
                : "text-slate-500 hover:text-orange-500 hover:bg-slate-100 border border-transparent hover:border-slate-300"
            }`}
            title={isDarkMode ? "라이트 모드로 변경" : "다크 모드로 변경"}
          >
            {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          {gameState && (
            <>
              {!gameState.isGameOver && (
                <button
                  onClick={onQuitGame}
                  className={`p-2 rounded-full border flex items-center justify-center transition-all ${
                    isDarkMode
                      ? "border-red-500/30 text-red-400 hover:bg-red-500/10"
                      : "border-red-200 text-red-500 hover:bg-red-50"
                  }`}
                  title="게임 종료"
                >
                  <Power size={16} />
                </button>
              )}

              <div
                className={`flex items-center ${theme.dayBg} rounded-lg px-3 py-1.5 md:px-4 md:py-2 border ${theme.dayBorder} shadow-sm group ml-1`}
              >
                <Calendar
                  size={14}
                  className="text-indigo-500 mr-1 md:mr-2 group-hover:text-blue-500 transition-colors hidden sm:block"
                />
                <div className="flex items-baseline gap-1">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500 text-[10px] md:text-xs font-black mr-0.5 md:mr-1">
                    DAY
                  </span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500 font-black font-mono text-lg md:text-xl tracking-tight">
                    {gameState.currentDayOffset + 1}
                  </span>
                  <span
                    className={`${theme.dayText} text-xs md:text-sm font-bold`}
                  >
                    / 20
                  </span>
                </div>
              </div>
            </>
          )}

          <div
            className={`h-6 md:h-8 w-px ${theme.borderColor} mx-1 hidden sm:block`}
          ></div>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className={`flex items-center gap-1 md:gap-2 pl-1 md:pl-2 pr-1 py-1 rounded-full border transition-all ${theme.profileBg}`}
            >
              <div
                className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-sm`}
              >
                <User size={14} />
              </div>
              <ChevronDown
                size={14}
                className="opacity-70 mr-1 hidden sm:block"
              />
            </button>

            {isProfileOpen && (
              <div
                className={`absolute right-0 top-full mt-2 w-52 rounded-xl shadow-2xl border ${theme.dropdownBg} overflow-hidden z-50 animate-in slide-in-from-top-2 fade-in duration-200`}
              >
                <div className={`px-4 py-3 border-b ${theme.borderColor}`}>
                  <p
                    className={`text-xs font-bold ${theme.textColor} uppercase tracking-wider mb-0.5`}
                  >
                    Signed in as
                  </p>
                  <p
                    className={`text-sm font-bold ${theme.dropdownText} truncate`}
                  >
                    User #1111
                  </p>
                </div>

                <button
                  onClick={() => {
                    setIsSettingsOpen(true);
                    setIsProfileOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 ${theme.dropdownHover} ${theme.dropdownText} transition-colors`}
                >
                  <UserCog size={16} className="opacity-70" />
                  회원정보 수정
                </button>

                <div className={`border-t ${theme.borderColor}`}></div>

                <button
                  onClick={() => {
                    onLogout();
                    setIsProfileOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 ${theme.dropdownHover} text-red-500 font-medium transition-colors`}
                >
                  <LogOut size={16} />
                  로그아웃
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onEditId={handleEditId}
        onEditPw={handleEditPassword}
        isDarkMode={isDarkMode}
      />
    </>
  );
};

export default Header;


import React, { useState, useEffect } from 'react';
import { Search, UserRound } from "lucide-react";
import { useNavigate, useLocation } from 'react-router-dom';



export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태
  const [showMenu, setShowMenu] = useState(false); // 메뉴 토글
  const [showAuthOverlay, setShowAuthOverlay] = useState(false);

  const toggleMenu = () => setShowMenu(prev => !prev);

  const handleLoginClick = () => {
    setShowMenu(false); // 드롭다운 메뉴 닫기
    setShowAuthOverlay(true); // 로그인 오버레이 열기
    navigate('/login'); // URL에 #login 해시 추가
  };

  const handleSignupClick = () => {
    setShowMenu(false); // 드롭다운 메뉴 닫기
    navigate('/signup'); // 회원가입 페이지로 이동
  };

  const handleCloseAuthOverlay = () => {
    setShowAuthOverlay(false);
    navigate(location.pathname); // 해시 제거
  };

  useEffect(() => {
    if (location.hash === '#login') {
      setShowAuthOverlay(true);
      const loginForm = document.getElementById('login-form-container');
      if (loginForm) {
        loginForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      setShowAuthOverlay(false);
    }
  }, [location.hash]); // location.hash가 변경될 때마다 실행

  return (
    <header className="w-full bg-[#1A1A1A] px-6 py-4 border-b border-[#333] relative z-10">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* 로고 */}
        <div className="justify-start text-white text-2xl font-normal font-mono leading-loose tracking-wide">
          <a href='/'>FastJobAPI</a>
        </div>

        {/* 검색창 */}
        <div className="flex items-center w-full max-w-md mx-4 border border-[#444] rounded overflow-hidden">
          <input
            type="text"
            placeholder="검색어를 입력하세요"
            className="w-full bg-transparent text-white px-4 py-2 outline-none placeholder:text-gray-400"
          />
          <button className="px-3 text-white">
            <Search size={20} />
          </button>
        </div>

        {/* 사용자 아이콘 */}
        <div className="relative">
          <button
            onClick={toggleMenu}
            className="text-white hover:text-gray-300"
          >
            <UserRound size={24} />
          </button>

          {/* 드롭다운 메뉴 */}
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-[#2a2a2a] text-white border border-[#444] rounded shadow-lg overflow-hidden">
              {isLoggedIn ? (
                // 로그인 후 메뉴
                <ul>
                  <li className="px-4 py-2 hover:bg-[#3a3a3a] cursor-pointer">개인회원 홈</li>
                  <li className="px-4 py-2 hover:bg-[#3a3a3a] cursor-pointer">이력서관리</li>
                  <li className="px-4 py-2 hover:bg-[#3a3a3a] cursor-pointer">AI 회사추천</li>
                  <li className="px-4 py-2 hover:bg-[#3a3a3a] cursor-pointer">채용공고</li>
                  <li className="px-4 py-2 hover:bg-[#3a3a3a] cursor-pointer">마이프로필</li>
                  <li className="px-4 py-2 hover:bg-[#3a3a3a] cursor-pointer">로그아웃</li>
                </ul>
              ) : (
                // 로그인 전 메뉴
                <ul>
                  <li className="px-4 py-2 hover:bg-[#3a3a3a] cursor-pointer" onClick={handleLoginClick}>로그인</li>
                  <li className="px-4 py-2 hover:bg-[#3a3a3a] cursor-pointer" onClick={handleSignupClick}>회원가입</li>
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

// src/components/layout/Header.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Search, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const publicMenu = [
    { label: '로그인', to: '/auth/login' },
    { label: '회원가입', to: '/auth/signup' },
  ];
  const privateMenu = [
    { label: '개인회원 홈', to: '/user/home' },
    { label: '이력서관리', to: '/user/resume' },
    { label: 'AI 회사추천', to: '/user/ai-recommend' },
    { label: '채용공고', to: '/jobs' },
    { label: '마이프로필', to: '/user/profile' },
  ];

  return (
    <header className="w-full bg-[#0f0f11] px-8 py-4 flex items-center">
      {/* Logo */}
      <Link to="/" className="text-white font-mono text-lg">
        FastJobAPI
      </Link>

      {/* Search */}
      <div className="flex-1 mx-8 relative">
        <input
          type="text"
          placeholder="검색"
          className="w-full max-w-lg pl-4 pr-10 py-2 bg-[#2c2c31] rounded-md text-sm text-white focus:outline-none"
        />
        <Search className="absolute top-1/2 right-4 -translate-y-1/2 text-[#7a7a82]" size={18} />
      </div>

      {/* User menu */}
      <div className="relative" ref={menuRef}>
        <button onClick={() => setMenuOpen(o => !o)}>
          <User className="text-[#7a7a82]" size={24} />
        </button>
        {menuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-[#2c2c31] rounded-md shadow-lg z-10">
            <ul className="flex flex-col">
              {user
                ? (
                  <>
                    {privateMenu.map(item => (
                      <li key={item.to}>
                        <Link
                          to={item.to}
                          className="block px-4 py-2 text-sm text-white hover:bg-[#3a3a3f]"
                          onClick={() => setMenuOpen(false)}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                    <li>
                      <button
                        onClick={() => { logout(); setMenuOpen(false); }}
                        className="w-full text-left px-4 py-2 text-sm text-white hover:bg-[#3a3a3f]"
                      >
                        로그아웃
                      </button>
                    </li>
                  </>
                )
                : (
                  publicMenu.map(item => (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        className="block px-4 py-2 text-sm text-white hover:bg-[#3a3a3f]"
                        onClick={() => setMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))
                )
              }
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

// src/components/layout/Header.tsx
import { type FC, useState, useEffect, useRef } from 'react';
import { Search, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface MenuItem {
  label: string;
  to: string;
}

const publicMenu: MenuItem[] = [
  { label: '로그인', to: '/login' },
  { label: '회원가입', to: '/signup' },
];
const userMenu: MenuItem[] = [
  { label: '개인회원 홈', to: '/user/home' },
  { label: '이력서관리', to: '/user/resume' },
  { label: 'AI 회사추천', to: '/user/ai-recommend' },
  { label: '채용공고', to: '/jobs' },
  { label: '마이프로필', to: '/user/profile' },
];

const companyMenu: MenuItem[] = [
  { label: '기업회원 홈', to: '/company/home' },
  { label: '기업소개관리', to: '/company/resume' },
  { label: 'AI 인재추천', to: '/company/ai-recommend' },
  { label: '채용진행관리', to: '/company' },
  { label: '기업프로필', to: '/company/profile' },
];

interface HeaderProps {
  isLoggedIn: boolean;
  userType: 'user' | 'company' | null;
  onLogout: () => void;
}

const Header: FC<HeaderProps> = ({ isLoggedIn, userType, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // 바깥 클릭 시 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 비로그인, 개인, 기업에 따라 메뉴 결정
  let menuList: MenuItem[] = publicMenu;
  if (isLoggedIn) {
    menuList = userType === 'company' ? companyMenu : userMenu;
  }

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
              {menuList.map(item => (
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

              {isLoggedIn && (
                <li>
                  <button
                    onClick={() => {
                      onLogout();
                      setMenuOpen(false);
                      navigate('/');
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-white hover:bg-[#3a3a3f]"
                  >
                    로그아웃
                  </button>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

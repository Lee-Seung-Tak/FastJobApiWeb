// src/components/Header.tsx
import { Link } from "react-router-dom";

interface HeaderProps {
  isLoggedIn: boolean;
  onLogout: () => void;
}

export default function Header({ isLoggedIn, onLogout }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm py-4 px-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* 사이트 타이틀 */}
        <Link to="/" className="text-2xl font-bold text-blue-600">
          FastJobAPI
        </Link>

        {/* 네비게이션 메뉴 */}
        <nav className="space-x-4">
          {!isLoggedIn ? (
            <>
              <Link to="/login" className="text-black px-4 py-2 rounded hover:bg-blue-600 transition">
                로그인
              </Link>
              <Link to="/signup" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                회원가입
              </Link>
            </>
          ) : (
            <>
              <Link to="/mypage" className="text-black px-4 py-2 rounded hover:bg-blue-600 transition">
                마이페이지
              </Link>
              <button
                onClick={onLogout}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                로그아웃
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
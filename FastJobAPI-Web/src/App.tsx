// App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import MainPage from './pages/main';
import LoginPage from './pages/login';
import SignupPage from './pages/signup';
import UserHome from './pages/userhome';
import CompanyHome from './pages/companyhome';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 초기값은 false
  const [role, setRole] = useState<string | null>(null); // 초기값은 null

  useEffect(() => {
    // 앱이 처음 로드될 때 localStorage에서 값을 가져와 상태 업데이트
    const token = localStorage.getItem("access_token");
    const storedRole = localStorage.getItem("role");

    if (token) {
      setIsLoggedIn(true);
      setRole(storedRole);
    } else {
      setIsLoggedIn(false);
      setRole(null);
    }
  }, []);

  // 로그아웃 시 자동 처리 예시
  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    setRole(null);
  };

  // 로그인 성공 시 LoginPage 등에서 setRole("user") 같이 호출하면 됨

  // 메인 진입 시 role 기반 리디렉션
  const renderMain = () => {
    if (!isLoggedIn) return <MainPage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />;
    if (role === 'user') return <Navigate to="/userhome" />;
    if (role === 'company') return <Navigate to="/companyhome" />;
    return <MainPage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={renderMain()} />
        <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} setRole={setRole} />} />
        <Route path="/login/:section" element={<LoginPage setIsLoggedIn={setIsLoggedIn} setRole={setRole} />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/signup/:section" element={<SignupPage />} />
        <Route path="/userhome" element={<UserHome setIsLoggedIn={setIsLoggedIn} setRole={setRole} />} />
        <Route path="/companyhome" element={<CompanyHome setIsLoggedIn={setIsLoggedIn} setRole={setRole} />} />

        {/* 보호된 라우트 */}
        {/* <Route path="/userhome" element={isLoggedIn && role === 'user' ? <UserHome logout={logout} /> : <Navigate to="/login" />} />
        <Route path="/companyhome" element={isLoggedIn && role === 'company' ? <CompanyHome logout={logout} /> : <Navigate to="/login" />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

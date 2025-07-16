// App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import MainPage from './pages/main';
import LoginPage from './pages/login';
import SignupPage from './pages/signup';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem("access_token");
  });

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/signup" element={<SignupPage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} onSignUpSuccess={() => {
        // 회원가입 성공 후 처리할 동작 정의
        setIsLoggedIn(true);
        // 예: navigate('/home'); 등을 추가할 수도 있습니다.
      }}/>} />
      </Routes>
    </BrowserRouter>
  );
}
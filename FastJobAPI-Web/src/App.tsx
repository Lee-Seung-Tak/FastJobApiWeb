// src/App.tsx
import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from './pages/Main';
import Header from './components/layout/Header';
import LoginForm from './components/loginForm';
import SignupForm from './components/signupForm';
import UserHome from './pages/user/UserHome';
import CompanyHome from './pages/company/CompanyHome';
import './styles/global.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() =>
    Boolean(localStorage.getItem('access_token'))
  );

  const [userType, setUserType] = useState<'user' | 'company' | null>(
    () => (localStorage.getItem('userType') as 'user' | 'company') ?? null
  );

  return (
    <BrowserRouter>
      <Header
        isLoggedIn={isLoggedIn}
        userType={userType}
        onLogout={() => {
          localStorage.removeItem('access_token');
          localStorage.removeItem('userType');
          setIsLoggedIn(false);
          setUserType(null);
        }} />
      <Routes>
        <Route
          path="/"
          element={<Main setIsLoggedIn={setIsLoggedIn} setUserType={setUserType} />}
        />
        <Route
          path="/login"
          element={<LoginForm setIsLoggedIn={setIsLoggedIn} setUserType={setUserType} />}
        />
        <Route
          path="/signup"
          element={<SignupForm setIsLoggedIn={setIsLoggedIn} setUserType={setUserType} />}
        />
        <Route
          path="/user/home"
          element={<UserHome isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route
          path="/company/home"
          element={<CompanyHome isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

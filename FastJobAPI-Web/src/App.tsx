import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Main from './pages/Main';
import Header from './components/layout/Header';
import LoginForm from './components/loginForm';
import UserFindId from './pages/user/FindId';
import UserFindPassword from './pages/user/FindPassword';
import CompanyFindId from './pages/company/FindId';
import CompanyFindPassword from './pages/company/FindPassword';
import SignupForm from './components/signupForm';
import VerifyEmail from './pages/VerifyEmail';
import UserHome from './pages/user/UserHome';
import CompanyHome from './pages/company/CompanyHome';
import './styles/global.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    () => Boolean(localStorage.getItem('access_token'))
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
        }}
      />

      <Routes>
        {/* Public home, redirected if logged in */}
        <Route
          path="/"
          element={
            !isLoggedIn ? (
              <Main setIsLoggedIn={setIsLoggedIn} setUserType={setUserType} />
            ) : (
              <Navigate
                to={userType === 'company' ? '/company/home' : '/user/home'}
                replace
              />
            )
          }
        />

        {/* Login and Signup, only for logged-out users */}
        <Route
          path="/login"
          element={
            !isLoggedIn ? (
              <LoginForm setIsLoggedIn={setIsLoggedIn} setUserType={setUserType} />
            ) : (
              <Navigate
                to={userType === 'company' ? '/company/home' : '/user/home'}
                replace
              />
            )
          }
        />

        <Route path="/user/find-id" element={<UserFindId />} />
        <Route path="/user/find-password" element={<UserFindPassword />} />

        <Route path="/company/find-id" element={<CompanyFindId />} />
        <Route path="/company/find-password" element={<CompanyFindPassword />} />


        <Route
          path="/signup"
          element={
            !isLoggedIn ? (
              <SignupForm setIsLoggedIn={setIsLoggedIn} setUserType={setUserType} />
            ) : (
              <Navigate
                to={userType === 'company' ? '/company/home' : '/user/home'}
                replace
              />
            )
          }
        />

        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* Protected routes */}
        <Route
          path="/user/home"
          element={
            isLoggedIn && userType === 'user' ? (
              <UserHome
                isLoggedIn={isLoggedIn}
                setIsLoggedIn={setIsLoggedIn}

              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/company/home"
          element={
            isLoggedIn && userType === 'company' ? (
              <CompanyHome
                isLoggedIn={isLoggedIn}
                setIsLoggedIn={setIsLoggedIn}

              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

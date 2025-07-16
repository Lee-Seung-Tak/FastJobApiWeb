import React from 'react';
// import Header from '../components/layout/Header';
import LoginForm from '../components/loginForm';

const Login: React.FC = () => {
  // const [loginOpen, setLoginOpen] = React.useState(true);
  // const [signupOpen, setSignupOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-[#0f0f11]">
      {/* Header
      <Header /> */}
      {/* Authentication Panels */}
      <section className="mx-auto space-y-2 ">
        <LoginForm setIsLoggedIn={function (_value: React.SetStateAction<boolean>): void {
          throw new Error('Function not implemented.');
        }} setUserType={function (_value: React.SetStateAction<'user' | 'company' | null>): void {
          throw new Error('Function not implemented.');
        }} />
      </section>
    </div>
  );
};

export default Login;

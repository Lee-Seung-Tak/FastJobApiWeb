// src/pages/Main.tsx
import React from 'react';
import Header from '../components/layout/Header';
import Login from './Login';
import Signup from './Signup';

const Main: React.FC = () => {
  const [loginOpen, setLoginOpen] = React.useState(true);
  const [signupOpen, setSignupOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-[#0f0f11]">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="p-8 text-white">
        {/* Hero Section */}
        <section className="max-w-3xl mx-auto mb-12">
          <h1 className="text-3xl font-semibold">AI 기반 개발자 매칭 플랫폼</h1>
          <p className="text-yellow-400 text-xl my-2 font-mono">{`{ FastJobAPI }`}</p>
          <p className="text-[#7a7a82]">최소한의 입력으로, 가장 적합한 연결을 만듭니다.</p>
        </section>

        {/* Authentication Panels */}
        <section className="max-w-3xl mx-auto space-y-2">
          <Login />
          <Signup />
        </section>
      </main>
    </div>
  );
};

export default Main;

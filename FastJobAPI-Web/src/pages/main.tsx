import React, { type FC } from 'react';
import LoginForm from '../components/loginForm';
import SignupForm from '../components/signupForm';
import KeyPoint from '../components/layout/keypoint';

interface MainProps {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  setUserType: React.Dispatch<React.SetStateAction<'user' | 'company' | null>>;
}


const Main: FC<MainProps> = ({ setIsLoggedIn, setUserType }) => {
  return (
    <div className="min-h-screen bg-[#0f0f11]">
      <main className="p-10 text-white">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto mb-12 px-4 py-6">
          <h1 className="text-3xl font-semibold">AI 기반 개발자 매칭 플랫폼</h1>
          <p className="text-yellow-400 text-xl my-2 font-mono">{`{ FastJobAPI }`}</p>
          <p className="text-[#7a7a82]">최소한의 입력으로, 가장 적합한 연결을 만듭니다.</p>
        </section>

        {/* Authentication Panels */}
        <section className="mx-auto space-y-2">
          <LoginForm setIsLoggedIn={setIsLoggedIn} setUserType={setUserType} />
          <SignupForm setIsLoggedIn={setIsLoggedIn} setUserType={setUserType} />
          <KeyPoint />
        </section>
      </main>
    </div>
  );
};

export default Main;
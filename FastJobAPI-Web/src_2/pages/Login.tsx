// src/pages/Login.tsx
import React, { useRef, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Login: React.FC = () => {
  const indUserIdRef = useRef<HTMLInputElement>(null);
  const indPasswordRef = useRef<HTMLInputElement>(null);
  const compUserIdRef = useRef<HTMLInputElement>(null);
  const compPasswordRef = useRef<HTMLInputElement>(null);

  const [indOpen, setIndOpen] = useState(false);
  const [compOpen, setCompOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 공통 로그인 핸들러
  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>,
    url: string,
    idRef: React.RefObject<HTMLInputElement>,
    pwRef: React.RefObject<HTMLInputElement>
  ) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const userId = idRef.current?.value || '';
    const password = pwRef.current?.value || '';
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, password }),
      });
      if (!res.ok) throw new Error('로그인 실패');
      const { access_token } = await res.json();



      console.log(res.json());
      // 토큰 저장
      localStorage.setItem('access_token', access_token);
      alert('로그인 성공!');
      console.log(res.headers);
      // TODO: 리다이렉트 또는 사용자 상태 업데이트
    } catch (err) {
      setError('아이디 또는 비밀번호가 올바르지 않습니다.');
    } finally {
      setLoading(false);
    }
  };

  const AuthForm = () => (
    <form onSubmit={e => handleLogin(e, 'http://localhost:4000/auth/login', indUserIdRef, indPasswordRef)} className="space-y-4 px-6 pb-6 pt-4">
      <div>
        <label className="block text-xs text-[#7a7a82]">id</label>
        <Input placeholder="아이디" ref={indUserIdRef} />
      </div>
      <div>
        <label className="block text-xs text-[#7a7a82]">password</label>
        <Input type="password" placeholder="비밀번호" ref={indPasswordRef} />
      </div>
      {/* ... 아이디/비번 찾기, 회원가입 버튼들 ... */}
      {error && <div className="text-red-500 text-xs">{error}</div>}
      <Button variant="primary" type="submit" disabled={loading}>
        {loading ? '로그인 중...' : '로그인'}
      </Button>
    </form>
  );

  const CompanyAuthForm = () => (
    <form onSubmit={e => handleLogin(e, 'http://localhost:4000/companys/login', compUserIdRef, compPasswordRef)} className="space-y-4 px-6 pb-6 pt-4">
      <div>
        <label className="block text-xs text-[#7a7a82]">id</label>
        <Input placeholder="아이디" ref={compUserIdRef} />
      </div>
      <div>
        <label className="block text-xs text-[#7a7a82]">password</label>
        <Input type="password" placeholder="비밀번호" ref={compPasswordRef} />
      </div>
      {/* ... 아이디/비번 찾기, 회원가입 버튼들 ... */}
      {error && <div className="text-red-500 text-xs">{error}</div>}
      <Button variant="secondary" type="submit" disabled={loading}>
        {loading ? '로그인 중...' : '로그인'}
      </Button>
    </form>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
      <h2 className="pt-10 justify-start text-white text-2xl font-normal font-pretendard">로그인</h2>

      {/* 개인회원 */}
      <div className={`bg-[#2c2c31] rounded-md overflow-hidden transition-all duration-300 ${indOpen ? 'mb-6' : 'mb-2'}`}>
        <button
          className="w-full flex items-center px-6 py-4"
          onClick={() => setIndOpen(prev => !prev)}
        >
          <span className="px-3 py-1 bg-[#2077ff] text-white rounded-md text-sm">개인회원</span>
          <span className="ml-auto">
            {indOpen ? <ChevronUp className="text-[#7a7a82]" /> : <ChevronDown className="text-[#7a7a82]" />}
          </span>
        </button>
        {indOpen && <AuthForm />}
      </div>

      {/* 기업회원 */}
      <div className={`bg-[#2c2c31] rounded-md overflow-hidden transition-all duration-300 ${compOpen ? 'mb-6' : 'mb-2'}`}>
        <button
          className="w-full flex items-center px-6 py-4"
          onClick={() => setCompOpen(prev => !prev)}
        >
          <span className="px-3 py-1 bg-[#00b14f] text-white rounded-md text-sm">기업회원</span>
          <span className="ml-auto">
            {compOpen ? <ChevronUp className="text-[#7a7a82]" /> : <ChevronDown className="text-[#7a7a82]" />}
          </span>
        </button>
        {compOpen && <CompanyAuthForm />}
      </div>
    </div>
  );
};

export default Login;

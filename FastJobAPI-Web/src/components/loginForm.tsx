// src/pages/LoginForm.tsx
import React, { type FC, useRef, useState, type FormEvent } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from './ui/Button';
import Input from './ui/Input';
import api from '../lib/axios';

interface LoginFormProps {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  setUserType: React.Dispatch<React.SetStateAction<'user' | 'company' | null>>;
}

const LoginForm: FC<LoginFormProps> = ({ setIsLoggedIn, setUserType }) => {
  const indUserIdRef = useRef<HTMLInputElement>(null);
  const indPasswordRef = useRef<HTMLInputElement>(null);
  const compUserIdRef = useRef<HTMLInputElement>(null);
  const compPasswordRef = useRef<HTMLInputElement>(null);

  const [indOpen, setIndOpen] = useState(false);
  const [compOpen, setCompOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (
    e: FormEvent<HTMLFormElement>,
    url: string,
    idRef: React.MutableRefObject<HTMLInputElement | null>,
    pwRef: React.MutableRefObject<HTMLInputElement | null>,
    redirectPath: string
  ) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const userId = idRef.current?.value.trim() ?? '';
    const password = pwRef.current?.value ?? '';
    const isCompany = url.includes('/companys/login');
    const payload = isCompany
      ? { companyId: userId, password }
      : { userId, password };

    try {
      const endpoint = url.replace(/^http:\/\/localhost:4000/, '');
      const response = await api.post(endpoint, payload);
      const { access_token, refresh_token } = response.data;

      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      localStorage.setItem('userType', isCompany ? 'company' : 'user');

      setIsLoggedIn(true);
      setUserType(isCompany ? 'company' : 'user');

      navigate(redirectPath);
    } catch (err: any) {
      console.error('Login error:', err);
      setError(
        err.response?.data?.message ||
        err.message ||
        '아이디 또는 비밀번호가 올바르지 않습니다.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
      <h2 className="pt-5 text-white text-2xl font-normal font-pretendard">로그인</h2>

      {/* 개인회원 */}
      <div className={`bg-[#2c2c31] rounded-md overflow-hidden transition-all duration-300 ${indOpen ? 'mb-6' : 'mb-2'}`}>
        <button
          className="w-full flex items-center px-6 py-4"
          onClick={() => setIndOpen(o => !o)}
        >
          <span className="px-3 py-1 bg-[#2077ff] text-white rounded-md text-sm">개인회원</span>
          <span className="ml-4 text-xs font-mono text-[#7a7a82]">/auth/login</span>
          <span className="ml-4 text-xs text-white">개인회원 로그인</span>
          <span className="ml-auto">
            {indOpen ? <ChevronUp className="text-[#7a7a82]" /> : <ChevronDown className="text-[#7a7a82]" />}
          </span>
        </button>
        {indOpen && (
          <form
            onSubmit={e =>
              handleLogin(
                e,
                'http://localhost:4000/auth/login',
                indUserIdRef,
                indPasswordRef,
                '/user/home'
              )
            }
            className="space-y-4 px-6 pb-6 pt-4"
          >
            <div>
              <label htmlFor="ind-id" className="block text-xs text-[#7a7a82]">ID</label>
              <Input id="ind-id" placeholder="아이디" ref={indUserIdRef} />
            </div>
            <div>
              <label htmlFor="ind-pw" className="block text-xs text-[#7a7a82]">Password</label>
              <Input id="ind-pw" type="password" placeholder="비밀번호" ref={indPasswordRef} />
            </div>
            {error && <div className="text-red-500 text-xs">{error}</div>}
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? '로그인 중...' : '로그인'}
            </Button>
          </form>
        )}
      </div>

      {/* 기업회원 */}
      <div className={`bg-[#2c2c31] rounded-md overflow-hidden transition-all duration-300 ${compOpen ? 'mb-6' : 'mb-2'}`}>
        <button
          className="w-full flex items-center px-6 py-4"
          onClick={() => setCompOpen(o => !o)}
        >
          <span className="px-3 py-1 bg-[#00b14f] text-white rounded-md text-sm">기업회원</span>
          <span className="ml-4 text-xs font-mono text-[#7a7a82]">/companys/login</span>
          <span className="ml-4 text-xs text-white">기업회원 로그인</span>
          <span className="ml-auto">
            {compOpen ? <ChevronUp className="text-[#7a7a82]" /> : <ChevronDown className="text-[#7a7a82]" />}
          </span>
        </button>
        {compOpen && (
          <form
            onSubmit={e =>
              handleLogin(
                e,
                'http://localhost:4000/companys/login',
                compUserIdRef,
                compPasswordRef,
                '/company/home'
              )
            }
            className="space-y-4 px-6 pb-6 pt-4"
          >
            <div>
              <label htmlFor="comp-id" className="block text-xs text-[#7a7a82]">ID</label>
              <Input id="comp-id" placeholder="아이디" ref={compUserIdRef} />
            </div>
            <div>
              <label htmlFor="comp-pw" className="block text-xs text-[#7a7a82]">Password</label>
              <Input id="comp-pw" type="password" placeholder="비밀번호" ref={compPasswordRef} />
            </div>
            {error && <div className="text-red-500 text-xs">{error}</div>}
            <Button variant="secondary" type="submit" disabled={loading}>
              {loading ? '로그인 중...' : '로그인'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginForm;

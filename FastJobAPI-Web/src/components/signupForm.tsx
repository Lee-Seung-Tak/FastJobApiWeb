import React, { type FC, useState, type FormEvent } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import axios from 'axios';
import UserSignupForm from './shared/signup/UserSignupForm';
import CompanySignupForm from './shared/signup/CompanySignupForm';
import { useNavigate } from 'react-router-dom';

interface SignupFormProps {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  setUserType: React.Dispatch<React.SetStateAction<'user' | 'company' | null>>;
}

const SignupForm: FC<SignupFormProps> = ({ setIsLoggedIn, setUserType }) => {
  const navigate = useNavigate();
  const [indOpen, setIndOpen] = useState(false);
  const [compOpen, setCompOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [indError, setIndError] = useState<string | null>(null);
  const [compError, setCompError] = useState<string | null>(null);

  const submitIndividual = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setIndError(null);

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);

      const res = await axios.post(
        'http://localhost:4000/auth/signup',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      console.log('개인회원 가입 성공:', res.data);
      // 로그인 상태 올리기
      setIsLoggedIn(true);
      // 토큰 저장 (응답 필드에 맞춰 변경)
      localStorage.setItem('access_token', res.data.access_token);
      // 유저 타입 저장
      localStorage.setItem('userType', 'user');
      setUserType('user');
      // 개인회원 홈으로 이동
      navigate('/user/home');
    } catch (err: any) {
      console.error(err);
      setIndError(err.response?.data?.message || '가입 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const submitCompany = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setCompError(null);

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);

      const res = await axios.post(
        'http://localhost:4000/companys/signup',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      console.log('기업회원 가입 성공:', res.data);
      // 로그인 상태 올리기
      setIsLoggedIn(true);
      // 토큰 저장 (응답 필드에 맞춰 변경)
      localStorage.setItem('access_token', res.data.access_token);
      // 유저 타입 저장
      localStorage.setItem('userType', 'company');
      setUserType('company');
      // 기업회원 홈으로 이동
      navigate('/company/home');
    } catch (err: any) {
      console.error(err);
      setCompError(err.response?.data?.message || '가입 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
      <h2 className="pt-5 text-white text-2xl font-normal font-pretendard">회원가입</h2>

      {/* 개인회원 */}
      <div className={`bg-[#2c2c31] rounded-md overflow-hidden transition-all duration-300 ${indOpen ? 'mb-6' : 'mb-2'}`}>
        <button
          className="w-full flex items-center px-6 py-4"
          onClick={() => setIndOpen(o => !o)}
        >
          <span className="px-3 py-1 bg-[#2077ff] text-white rounded-md text-sm">개인회원</span>
          <span className="ml-4 text-xs font-mono text-[#7a7a82]">/auth/signup</span>
          <span className="ml-4 text-xs text-[#fff]">개인회원 회원가입</span>
          <span className="ml-auto">
            {indOpen ? <ChevronUp className="text-[#7a7a82]" /> : <ChevronDown className="text-[#7a7a82]" />}
          </span>
        </button>
        {indOpen && (
          <div className="px-6 pb-6 pt-4">
            <UserSignupForm
              onSubmit={submitIndividual}
              loading={loading}
              error={indError}
            />
          </div>
        )}
      </div>

      {/* 기업회원 */}
      <div className={`bg-[#2c2c31] rounded-md overflow-hidden transition-all duration-300 ${compOpen ? 'mb-6' : 'mb-2'}`}>
        <button
          className="w-full flex items-center px-6 py-4"
          onClick={() => setCompOpen(o => !o)}
        >
          <span className="px-3 py-1 bg-[#00b14f] text-white rounded-md text-sm">기업회원</span>
          <span className="ml-4 text-xs font-mono text-[#7a7a82]">/companis/signup</span>
          <span className="ml-4 text-xs text-[#fff]">기업회원 회원가입</span>
          <span className="ml-auto">
            {compOpen ? <ChevronUp className="text-[#7a7a82]" /> : <ChevronDown className="text-[#7a7a82]" />}
          </span>
        </button>
        {compOpen && (
          <div className="px-6 pb-6 pt-4">
            <CompanySignupForm
              onSubmit={submitCompany}
              loading={loading}
              error={compError}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SignupForm;

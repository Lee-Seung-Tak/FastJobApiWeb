import React, { useState, FormEvent } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import axios from 'axios';
import UserSignupForm from '../components/shared/signup/UserSignupForm';
import CompanySignupForm from '../components/shared/signup/CompanySignupForm';

const Signup: React.FC = () => {
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
      // TODO: 가입 후 처리 (리다이렉트 등)
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
      // TODO: 가입 후 처리 (리다이렉트 등)
    } catch (err: any) {
      console.error(err);
      setCompError(err.response?.data?.message || '가입 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl">
      <h2 className="text-white text-xl font-semibold mb-4">회원가입</h2>

      {/* 개인회원 */}
      <div className={`bg-[#2c2c31] rounded-md overflow-hidden transition-all duration-300 ${indOpen ? 'mb-6' : 'mb-2'}`}>
        <button
          className="w-full flex items-center px-6 py-4"
          onClick={() => setIndOpen(o => !o)}
        >
          <span className="px-3 py-1 bg-[#2077ff] text-white rounded-md text-sm">개인회원</span>
          <span className="ml-4 text-xs font-mono text-[#7a7a82]">/auth/signup</span>
          <span className="ml-4 text-xs">개인회원 회원가입</span>
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
          <span className="ml-4 text-xs font-mono text-[#7a7a82]">/companys/signup</span>
          <span className="ml-4 text-xs">기업회원 회원가입</span>
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

export default Signup;
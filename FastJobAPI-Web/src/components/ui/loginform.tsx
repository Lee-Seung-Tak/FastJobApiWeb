import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface LoginPageProps {
  // onLoginSuccess: () => void; // 이 prop은 이제 setIsLoggedIn과 setRole로 대체될 수 있습니다.
  setIsLoggedIn: (status: boolean) => void; // App.tsx로부터 전달받을 함수
  setRole: (role: string | null) => void; // App.tsx로부터 전달받을 함수
  initialSection?: string;
  onClose?: () => void;
}

export default function LoginPage({ setIsLoggedIn, setRole, initialSection, onClose }: LoginPageProps) { // props 구조 변경
  const [openSection, setOpenSection] = useState<string | null>(null);
  const navigate = useNavigate();

  const userContentRef = useRef<HTMLDivElement>(null);
  const companyContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialSection) {
      setOpenSection(initialSection);
    }
  }, [initialSection]);

  const toggle = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const LoginForm = ({ userType }: { userType: "user" | "company" }) => {
    const [userId, setId] = useState('');
    const [password, setPassword] = useState('');

    const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => setId(e.target.value);
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      handleLoginSubmit({ id: userId, password: password, userType: userType }); // LoginPage의 handleLoginSubmit 호출
      setId('');
      setPassword('');
    };

    const handleSignupClick = () => {
      navigate('/signup');
    };

    return (
      <div className="bg-[#2d2d2d] p-6 rounded-b-md">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex items-center space-x-6">
            <label className="text-white font-mono w-24">id</label>
            <input
              type="text"
              placeholder="아이디"
              className="bg-[#1f1f1f] text-white px-4 py-2 w-full rounded"
              value={userId}
              onChange={handleIdChange}
            />
          </div>
          <div className="flex items-center space-x-6">
            <label className="text-white font-mono w-24">password</label>
            <input
              type="password"
              placeholder="비밀번호"
              className="bg-[#1f1f1f] text-white px-4 py-2 w-full rounded"
              value={password}
              onChange={handlePasswordChange}
            />
          </div>
          <div className="flex justify-start space-x-6 text-sm text-white pt-2">
            <span>아이디 찾기</span>
            <span>|</span>
            <span>비밀번호 찾기</span>
            <span>|</span>
            <span onClick={handleSignupClick} className="cursor-pointer hover:text-gray-400 transition-colors duration-200">회원가입</span>
          </div>
          <button
            type="submit"
            className={`w-full mt-4 py-2 text-white rounded ${userType === "user" ? "bg-[#0078D4]" : "bg-[#16BB79]"}`}
          >
            로그인
          </button>
        </form>
      </div>
    );
  };

  const [isLoading, setIsLoading] = useState(false);
  const [currentErrorMessage, setCurrentErrorMessage] = useState<string | null>(null);

  const handleLoginSubmit = async (data: { id: string; password: string; userType: "user" | "company" }) => {
    setIsLoading(true);
    setCurrentErrorMessage(null);

    try {
      const apiUrl = data.userType === "user" ? "http://localhost:4000/auth/login" : "http://localhost:4000/companys/login";
      const response = await axios.post(apiUrl, {
        id: data.id,
        password: data.password,
      });

      console.log('로그인 성공:', response.data);

      if (response.data.token) {
        localStorage.setItem('access_token', response.data.token); // access_token으로 변경
        localStorage.setItem('role', data.userType); // 역할(user/company) 저장

        // App.tsx의 상태를 업데이트하는 함수 호출
        setIsLoggedIn(true);
        setRole(data.userType);

        if (onClose) onClose();

        // 로그인 성공 후 해당 홈 페이지로 이동
        if (data.userType === 'user') {
          navigate('/userhome');
        } else if (data.userType === 'company') {
          navigate('/companyhome');
        }

      } else {
        console.warn('No token received from login API. Check backend response format.');
        alert('로그인에 성공했지만, 토큰을 받지 못했습니다. 문제가 발생할 수 있습니다.');
      }

    } catch (error: any) {
      console.error('로그인 실패:', error.response ? error.response.data : error.message);
      const msg = error.response?.data?.message || '로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.';
      setCurrentErrorMessage(msg);
      alert(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
      <div className='pt-10 justify-start text-white text-2xl font-normal font-pretendard'>
        <h3>로그인</h3>
      </div>
      {/* 개인회원 섹션 */}
      <div className="bg-[#333] rounded-md overflow-hidden">
        <button
          onClick={() => toggle("user")}
          className="flex items-center justify-between w-full p-4"
        >
          <div className="flex items-center space-x-4 text-white">
            <span className="bg-[#0078D4] text-white px-4 py-2 rounded">
              개인회원
            </span>
            <code className="text-sm text-gray-300">/auth/login</code>
            <span className="text-white">개인회원 로그인</span>
          </div>
          {openSection === "user" ? (
            <ChevronUp className="text-white" />
          ) : (
            <ChevronDown className="text-white" />
          )}
        </button>
        <div
          ref={userContentRef}
          style={{
            maxHeight: openSection === "user" ? `${userContentRef.current?.scrollHeight}px` : '0',
            transition: 'max-height 0.3s ease-in-out',
            overflow: 'hidden'
          }}
        >
          <LoginForm userType="user" />
          {openSection === "user" && currentErrorMessage && (
            <p className="text-red-500 text-sm mt-2 px-6 pb-4">{currentErrorMessage}</p>
          )}
        </div>
      </div>

      {/* 기업회원 섹션 */}
      <div className="bg-[#333] rounded-md overflow-hidden">
        <button
          onClick={() => toggle("company")}
          className="flex items-center justify-between w-full p-4"
        >
          <div className="flex items-center space-x-4 text-white">
            <span className="bg-[#16BB79] text-white px-4 py-2 rounded">
              기업회원
            </span>
            <code className="text-sm text-gray-300">/companys/login</code>
            <span className="text-white">기업회원 로그인</span>
          </div>
          {openSection === "company" ? (
            <ChevronUp className="text-white" />
          ) : (
            <ChevronDown className="text-white" />
          )}
        </button>
        <div
          ref={companyContentRef}
          style={{
            maxHeight: openSection === "company" ? `${companyContentRef.current?.scrollHeight}px` : '0',
            transition: 'max-height 0.3s ease-in-out',
            overflow: 'hidden'
          }}
        >
          <LoginForm userType="company" />
          {openSection === "company" && currentErrorMessage && (
            <p className="text-red-500 text-sm mt-2 px-6 pb-4">{currentErrorMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
}
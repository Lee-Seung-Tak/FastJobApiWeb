import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronDown, ChevronUp } from "lucide-react";
import axios from 'axios';

// useDebounce 훅
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// SignUp 컴포넌트 시작
export default function SignUp() {
  const [openSection, setOpenSection] = useState(null);
  const userFormRef = useRef(null);
  const companyFormRef = useRef(null);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const [formData, setFormData] = useState({
    user: { name: '', userId: '', password: '', phone: '', email: '' }, // userId로 변경
    company: { name: '', userId: '', password: '', business: '', address: '', phone: '', email: '' } // userId로 변경
  });

  const [formHints, setFormHints] = useState({
    user: {
      name: { message: '한글, 영문 대/소문자를 사용가능', color: 'text-gray-400' },
      userId: { message: "4~20자리 / 영문, 숫자, 특수문자 '_'사용가능", color: 'text-gray-400', isChecking: false }, // userId로 변경
      password: { message: '8-16자리 / 영문 대소문자, 숫자, 특수문자 중 2개이상 조합', color: 'text-gray-400' },
      phone: { message: '숫자만 사용가능', color: 'text-gray-400' },
      email: { message: '입력하신 이메일 주소로 인증 링크를 보내드립니다. ex) fast1234@fastjobapi.com ', color: 'text-gray-400', isChecking: false }
    },
    company: {
      name: { message: '한글, 영문 대/소문자를 사용가능', color: 'text-gray-400' },
      userId: { message: "'4~20자리 / 영문, 숫자, 특수문자 '_'사용가능", color: 'text-gray-400', isChecking: false }, // userId로 변경
      password: { message: '8-16자리 / 영문 대소문자, 숫자, 특수문자 중 2개이상 조합', color: 'text-gray-400' },
      business: { message: '숫자만 사용가능 (10자리)', color: 'text-gray-400' },
      address: { message: '한글, 영문, 숫자 사용가능', color: 'text-gray-400' },
      phone: { message: '숫자만 사용가능', color: 'text-gray-400' },
      email: { message: '입력하신 이메일 주소로 인증 링크를 보내드립니다. ex) fast1234@fastjobapi.com ', color: 'text-gray-400', isChecking: false }
    }
  });

  const [agreements, setAgreements] = useState({
    user: {
      termsOfService: false,
      privacyPolicy: false,
      ageConfirmation: false,
      marketingOptIn: false,
    },
    company: {
      termsOfService: false,
      privacyPolicy: false,
      ageConfirmation: false,
      marketingOptIn: false,
    },
  });

  const [submissionError, setSubmissionError] = useState(null);
  const [submissionSuccess, setSubmissionSuccess] = useState(null);

  const debouncedUserId = useDebounce(formData.user.userId, 500); // formData.user.userId 참조
  const debouncedCompanyUserId = useDebounce(formData.company.userId, 500); // formData.company.userId 참조

  const areRequiredAgreed = (userType) => {
    return (
      agreements[userType].termsOfService &&
      agreements[userType].privacyPolicy &&
      agreements[userType].ageConfirmation
    );
  };

  const handleAgreementChange = (userType, agreementName) => {
    setAgreements((prevAgreements) => ({
      ...prevAgreements,
      [userType]: {
        ...prevAgreements[userType],
        [agreementName]: !prevAgreements[userType][agreementName],
      },
    }));
  };

  const checkIdAvailability = useCallback(async (userType, idValue) => {
    if (!idValue) return;

    const idRegex = /^[a-zA-Z0-9_]{4,20}$/;
    if (!idRegex.test(idValue)) {
      setFormHints(prevHints => ({
        ...prevHints,
        [userType]: {
          ...prevHints[userType],
          userId: { message: '영문, 숫자, 특수문자(_) 4~20자로 입력해주세요.', color: 'text-orange-400', isChecking: false }
        }
      }));
      return;
    }

    setFormHints(prevHints => ({
      ...prevHints,
      [userType]: {
        ...prevHints[userType],
        userId: { ...prevHints[userType].userId, message: '중복 확인 중...', color: 'text-gray-500', isChecking: true }
      }
    }));

    try {
      const checkUrl = userType === "user"
        ? `http://localhost:4000/api/auth/signup/userId=${idValue}`
        : `http://localhost:4000/api/companys/signup/userId=${idValue}`;

      const response = await axios.post(checkUrl);

      if (response.data.available) {
        setFormHints(prevHints => ({
          ...prevHints,
          [userType]: {
            ...prevHints[userType],
            userId: { message: '사용 가능한 아이디입니다.', color: 'text-green-500', isChecking: false }
          }
        }));
      } else {
        setFormHints(prevHints => ({
          ...prevHints,
          [userType]: {
            ...prevHints[userType],
            userId: { message: '이미 사용 중인 아이디입니다.', color: 'text-red-500', isChecking: false }
          }
        }));
      }
    } catch (error) {
      console.error('ID 중복 확인 실패:', error.response?.data || error.message);
      setFormHints(prevHints => ({
        ...prevHints,
        [userType]: {
          ...prevHints[userType],
          userId: { message: '아이디 중복 확인 중 오류가 발생했습니다.', color: 'text-red-500', isChecking: false }
        }
      }));
    }
  }, []);

  useEffect(() => {
    if (openSection === "user" && debouncedUserId) {
      checkIdAvailability("user", debouncedUserId);
    }
  }, [debouncedUserId, openSection, checkIdAvailability]);

  useEffect(() => {
    if (openSection === "company" && debouncedCompanyUserId) {
      checkIdAvailability("company", debouncedCompanyUserId);
    }
  }, [debouncedCompanyUserId, openSection, checkIdAvailability]);

  const handleInputChange = (userType, name, value) => {
    setFormData(prevData => ({
      ...prevData,
      [userType]: {
        ...prevData[userType],
        [name]: value
      }
    }));

    if (name === 'userId') { // userId로 변경
      const idRegex = /^[a-zA-Z0-9_]{4,20}$/;
      if (value.length === 0) {
        setFormHints(prevHints => ({
          ...prevHints,
          [userType]: {
            ...prevHints[userType],
            userId: { message: '4~20자리 / 영문, 숫자, 특수문자 \'_\'사용가능', color: 'text-gray-400', isChecking: false } // userId로 변경
          }
        }));
      } else if (!idRegex.test(value)) {
        setFormHints(prevHints => ({
          ...prevHints,
          [userType]: {
            ...prevHints[userType],
            userId: { message: '영문, 숫자, 특수문자(_) 4~20자로 입력해주세요.', color: 'text-orange-400', isChecking: false } // userId로 변경
          }
        }));
      } else {
        setFormHints(prevHints => ({
          ...prevHints,
          [userType]: {
            ...prevHints[userType],
            userId: { message: '형식에 맞습니다. 중복 확인 중...', color: 'text-gray-400', isChecking: true } // userId로 변경
          }
        }));
      }
    }
  };

  // 입력 필드에서 포커스가 벗어났을 때 (onBlur) 유효성 검사 및 힌트 업데이트
  const handleInputBlur = (userType, e) => {
    const { name, value } = e.target;
    let message = '';
    let color = 'text-gray-400';
    let isChecking = false;

    switch (`${userType}-${name}`) {
      case 'user-name':
      case 'company-name':
        if (value.length === 0) {
          message = '이름을 입력해주세요.';
          color = 'text-orange-400';
        } else if (value.length < 2) {
          message = '최소 2자 이상 입력해주세요.';
          color = 'text-orange-400';
        } else {
          message = '올바른 형식입니다.';
          color = 'text-green-500';
        }
        break;
      case 'user-userId': // userId로 변경
      case 'company-userId': // userId로 변경
        const idRegex = /^[a-zA-Z0-9_]{4,20}$/;
        if (value.length === 0) {
          message = '4~20자리 / 영문, 숫자, 특수문자 \'_\'사용가능';
          color = 'text-gray-400';
        } else if (!idRegex.test(value)) {
          message = '영문, 숫자, 특수문자(_) 4~20자로 입력해주세요.';
          color = 'text-orange-400';
        } else {
          message = '형식에 맞습니다. 중복 확인 중...';
          color = 'text-gray-400';
          isChecking = true;
        }
        break;
      case 'user-password':
      case 'company-password':
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d|.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,16}$/;
        if (value.length === 0) {
          message = '비밀번호를 입력해주세요.';
          color = 'text-orange-400';
        } else if (!passwordRegex.test(value)) {
          message = '영문, 숫자, 특수문자 조합 8자 이상 (2가지 이상 조합) 16자 이하로 입력해주세요.';
          color = 'text-orange-400';
        } else {
          message = '안전한 비밀번호입니다.';
          color = 'text-green-500';
        }
        break;
      case 'user-email':
      case 'company-email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value.length === 0) {
          message = '이메일 주소를 입력해주세요.';
          color = 'text-orange-400';
        } else if (!emailRegex.test(value)) {
          message = '올바른 이메일 주소 형식이 아닙니다.';
          color = 'text-orange-400';
        } else {
          message = '올바른 형식입니다.';
          color = 'text-green-500';
        }
        break;
      case 'company-business':
        if (value.length === 0) {
          message = '사업자등록번호를 입력해주세요.';
          color = 'text-orange-400';
        } else if (!/^\d{10}$/.test(value)) {
          message = '사업자등록번호는 10자리 숫자여야 합니다.';
          color = 'text-orange-400';
        } else {
          message = '올바른 형식입니다.';
          color = 'text-green-500';
        }
        break;
      case 'company-address':
        if (value.length === 0) {
          message = '주소를 입력해주세요.';
          color = 'text-orange-400';
        } else if (value.length < 5) {
          message = '주소를 더 자세히 입력해주세요.';
          color = 'text-orange-400';
        } else {
          message = '올바른 형식입니다.';
          color = 'text-green-500';
        }
        break;
      case 'user-phone':
      case 'company-phone':
        if (value.length === 0) {
          message = '연락처를 입력해주세요.';
          color = 'text-orange-400';
        } else if (!/^\d+$/.test(value)) {
          message = '숫자만 입력해주세요.';
          color = 'text-orange-400';
        } else {
          message = '올바른 형식입니다.';
          color = 'text-green-500';
        }
        break;
      default:
        const defaultHint = formHints[userType][name]?.message || '';
        message = defaultHint;
        color = formHints[userType][name]?.color || 'text-gray-400';
        break;
    }

    setFormHints(prevHints => ({
      ...prevHints,
      [userType]: {
        ...prevHints[userType],
        [name]: { message, color, isChecking: name === 'userId' ? isChecking : false } // userId로 변경
      }
    }));
  };

  // FormInput 컴포넌트
  const FormInput = ({ name, label, placeholder, userType }) => {
    const [isComposing, setIsComposing] = useState(false);
    const [localValue, setLocalValue] = useState('');

    const hint = formHints[userType][name];
    const value = formData[userType][name];

    const displayLabel = name === 'business' ? '사업자등록번호' : label;
    const displayPlaceholder = name === 'business' ? '사업자등록번호' : placeholder;

    // 고유한 ID 생성
    const uniqueId = `${userType}-${name}`;

    const handleCompositionStart = () => {
      setIsComposing(true);
    };

    const handleCompositionEnd = (e) => {
      setIsComposing(false);
      handleInputChange(userType, name, e.currentTarget.value);
    };

    const handleChange = (e) => {
      const newValue = e.target.value;
      setLocalValue(newValue);

      if (!isComposing) {
        handleInputChange(userType, name, newValue);
      }
    };

    return (
      <div className="flex flex-col mb-4">
        <div className="flex items-center space-x-6">
          <label htmlFor={uniqueId} className="text-white font-mono w-24">
            <span className="text-red-500 mr-1">*</span>{displayLabel}
          </label>
          <input
            id={uniqueId}
            name={name} // 이 name 속성이 formData의 키와 일치해야 합니다 (userId, password 등)
            type={name.includes('password') ? 'password' : 'text'}
            placeholder={displayPlaceholder}
            value={isComposing ? localValue : value}
            onChange={handleChange}
            onBlur={(e) => handleInputBlur(userType, e)}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            className="bg-[#1f1f1f] text-white px-4 py-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {hint && hint.message && (
          <p className={`${hint.color} text-sm mt-1 ml-30`}>
            {hint.message}
            {name === 'userId' && hint.isChecking && ( // userId로 변경
              <span className="ml-2 text-gray-500"> (확인 중...)</span>
            )}
          </p>
        )}
      </div>
    );
  };

  const SignUpForm = ({ userType }) => {
    const validateForm = () => {
      const currentData = formData[userType];
      const allFieldsFilledAndValid = Object.keys(currentData).every(fieldName => {
        const value = currentData[fieldName];
        const hint = formHints[userType][fieldName];

        if (fieldName === 'userId') { // userId로 변경
          return value && hint && hint.color === 'text-green-500' && hint.message === '사용 가능한 아이디입니다.' && !hint.isChecking;
        }
        return value && hint && hint.color === 'text-green-500';
      });

      return allFieldsFilledAndValid;
    };

    const handleSubmit = async (e) => {
      e.preventDefault();

      setSubmissionError(null);
      setSubmissionSuccess(null);

      if (!areRequiredAgreed(userType)) {
        setSubmissionError('필수 약관에 모두 동의해야 합니다.');
        return;
      }

      const currentFormData = formData[userType];
      Object.keys(currentFormData).forEach(fieldName => {
        // FormInput 컴포넌트의 name prop과 일치하도록 name: fieldName으로 설정
        const syntheticEvent = { target: { name: fieldName, value: currentFormData[fieldName] } };
        handleInputBlur(userType, syntheticEvent);
      });

      if (!validateForm()) {
        setSubmissionError('입력된 정보를 확인해주세요 (빨간색/주황색 힌트 참고).');
        return;
      }

      let payload = {};
      if (userType === "user") {
        payload = {
          name: currentFormData.name,
          userId: currentFormData.userId, // userId로 변경
          password: currentFormData.password,
          phone: currentFormData.phone,
          email: currentFormData.email,
        };
      } else {
        payload = {
          companyName: currentFormData.name,
          userId: currentFormData.userId, // userId로 변경
          password: currentFormData.password,
          businessNumber: currentFormData.business,
          address: currentFormData.address,
          phone: currentFormData.phone,
          email: currentFormData.email,
        };
      }

      try {
        const apiUrl = userType === "user" ? "http://localhost:4000/api/user/signup" : "http://localhost:4000/api/company/signup";
        const response = await axios.post(apiUrl, payload);

        console.log('회원가입 성공:', response.data);
        setSubmissionSuccess('이메일 인증을 완료해주세요!! 입력하신 이메일 주소로 인증 링크를 보냈습니다. 메일함을 확인하고, 링크를 클릭하면 가입이 완료됩니다.');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);

      } catch (error) {
        console.error('회원가입 실패:', error.response ? error.response.data : error.message);
        setSubmissionError(error.response?.data?.message || '회원가입에 실패했습니다. 다시 시도해주세요.');
      }
    };

    return (
      <div className="bg-[#2d2d2d] p-6 rounded-b-md">
        <form className="space-y-4 text-sm text-black" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {userType === "company" ? (
              <>
                <FormInput name="name" label="name" placeholder="회사명" userType={userType} />
                <FormInput name="userId" label="아이디" placeholder="로그인용 회사 ID" userType={userType} /> {/* name을 userId로 변경, label도 '아이디'로 직관적으로 변경 */}
                <FormInput name="password" label="비밀번호" placeholder="비밀번호" userType={userType} />
                <FormInput name="business" label="사업자등록번호" placeholder="사업자등록번호" userType={userType} />
                <FormInput name="address" label="회사주소" placeholder="회사주소" userType={userType} />
                <FormInput name="phone" label="회사 연락처" placeholder="회사 연락처" userType={userType} />
                <FormInput name="email" label="이메일" placeholder="입력하신 이메일 주소로 인증 링크를 보내드립니다." userType={userType} />
              </>
            ) : (
              <>
                <FormInput name="name" label="이름" placeholder="이름" userType={userType} />
                <FormInput name="userId" label="아이디" placeholder="아이디" userType={userType} /> {/* name을 userId로 변경, label도 '아이디'로 직관적으로 변경 */}
                <FormInput name="password" label="비밀번호" placeholder="비밀번호" userType={userType} />
                <FormInput name="phone" label="연락처" placeholder="연락처" userType={userType} />
                <FormInput name="email" label="이메일" placeholder="이메일" userType={userType} />
              </>
            )}
          </div>

          {/* 약관 동의 부분 */}
          <div className="space-y-2 text-white">
            <h4 className="text-md font-bold mt-4">약관 동의</h4>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`${userType}-termsOfService`}
                checked={agreements[userType].termsOfService}
                onChange={() => handleAgreementChange(userType, 'termsOfService')}
                className="form-checkbox h-4 w-4 text-blue-600 rounded"
              />
              <label htmlFor={`${userType}-termsOfService`} className="text-sm">
                <span className="text-red-500 mr-1">*</span>서비스 이용약관 동의 (필수)
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`${userType}-privacyPolicy`}
                checked={agreements[userType].privacyPolicy}
                onChange={() => handleAgreementChange(userType, 'privacyPolicy')}
                className="form-checkbox h-4 w-4 text-blue-600 rounded"
              />
              <label htmlFor={`${userType}-privacyPolicy`} className="text-sm">
                <span className="text-red-500 mr-1">*</span>개인정보 수집 및 이용 동의 (필수)
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`${userType}-ageConfirmation`}
                checked={agreements[userType].ageConfirmation}
                onChange={() => handleAgreementChange(userType, 'ageConfirmation')}
                className="form-checkbox h-4 w-4 text-blue-600 rounded"
              />
              <label htmlFor={`${userType}-ageConfirmation`} className="text-sm">
                <span className="text-red-500 mr-1">*</span>만 14세 이상입니다 (필수)
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`${userType}-marketingOptIn`}
                checked={agreements[userType].marketingOptIn}
                onChange={() => handleAgreementChange(userType, 'marketingOptIn')}
                className="form-checkbox h-4 w-4 text-blue-600 rounded"
              />
              <label htmlFor={`${userType}-marketingOptIn`} className="text-sm">
                마케팅 정보 수신 동의 (선택)
              </label>
            </div>
          </div>

          {submissionError && (
            <p className="text-red-500 text-sm mt-2">{submissionError}</p>
          )}
          {submissionSuccess && (
            <p className="text-green-500 text-sm mt-2">{submissionSuccess}</p>
          )}
          <button
            type="submit"
            className={`w-full mt-4 py-2 text-white rounded ${userType === "user" ? "bg-[#0078D4]" : "bg-[#16BB79]"}
              ${!areRequiredAgreed(userType) || !validateForm() ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!areRequiredAgreed(userType) || !validateForm()}
          >
            회원가입
          </button>
        </form>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-4 h-auto min-h-0">
      <div className='pt-10 justify-start text-white text-2xl font-normal font-pretendard'>
        <h3>회원가입</h3>
      </div>
      {/* 개인회원 섹션 */}
      <div className="bg-[#333] rounded-md overflow-hidden">
        <button
          onClick={() => toggleSection("user")}
          className="flex items-center justify-between w-full p-4"
        >
          <div className="flex items-center space-x-4 text-white">
            <span className="bg-[#0078D4] text-white px-4 py-2 rounded">
              개인회원
            </span>
            <code className="text-sm text-gray-300">/auth/signup</code>
            <span className="text-white">개인회원 회원가입</span>
          </div>
          {openSection === "user" ? (
            <ChevronUp className="text-white" />
          ) : (
            <ChevronDown className="text-white" />
          )}
        </button>
        <div
          ref={userFormRef}
          style={{
            maxHeight: openSection === "user" ? `${userFormRef.current?.scrollHeight}px` : '0',
            transition: 'max-height 0.3s ease-in-out',
            overflow: 'hidden'
          }}
        >
          <SignUpForm userType="user" />
        </div>
      </div>

      {/* 기업회원 섹션 */}
      <div className="bg-[#333] rounded-md overflow-hidden">
        <button
          onClick={() => toggleSection("company")}
          className="flex items-center justify-between w-full p-4"
        >
          <div className="flex items-center space-x-4 text-white">
            <span className="bg-[#16BB79] text-white px-4 py-2 rounded">
              기업회원
            </span>
            <code className="text-sm text-gray-300">/companys/signup</code>
            <span className="text-white">기업회원 회원가입</span>
          </div>
          {openSection === "company" ? (
            <ChevronUp className="text-white" />
          ) : (
            <ChevronDown className="text-white" />
          )}
        </button>
        {/* 기업회원 폼을 감싸는 div와 ref 연결 및 스타일 적용 */}
        <div
          ref={companyFormRef}
          style={{
            maxHeight: openSection === "company" ? `${companyFormRef.current?.scrollHeight}px` : '0',
            transition: 'max-height 0.3s ease-in-out',
            overflow: 'hidden'
          }}
        >
          <SignUpForm userType="company" />
        </div>
      </div>
    </div>
  );
}
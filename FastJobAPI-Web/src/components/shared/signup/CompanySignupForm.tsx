import React from 'react';
import Button from '../../ui/Button';
import Input from '../../ui/Input';

interface Props {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  loading: boolean;
  error: string | null;
}

const CompanySignupForm: React.FC<Props> = ({ onSubmit, loading, error }) => (
  <form className="space-y-4" onSubmit={onSubmit}>
    {/* name */}
    <div>
      <label className="block text-xs">
        <span className="text-white">name</span><span className="text-red-500 ml-1">*required</span>
      </label>
      <Input name="name" placeholder="회사명" />
    </div>
    {/* companyId */}
    <div>
      <label className="block text-xs">
        <span className="text-white">companyId</span><span className="text-red-500 ml-1">*required</span>
      </label>
      <Input name="companyId" placeholder="4~20자 / 영문, 숫자, '-' 가능" />
    </div>
    {/* password */}
    <div>
      <label className="block text-xs">
        <span className="text-white">password</span><span className="text-red-500 ml-1">*required</span>
      </label>
      <Input name="password" type="password" placeholder="비밀번호" />
    </div>
    {/* 사업 분야 ID */}
    <div>
      <label htmlFor="business" className="block text-xs text-[#7a7a82] mb-1">
        business<span className="text-red-500 ml-1">*required</span>
      </label>
      <select
        id="business"
        name="business"
        className="w-full bg-[#1e1e1e] text-white border border-[#3a3a3d] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2077ff]"
        defaultValue=""
      >
        <option value="" disabled>
          사업 분야 선택
        </option>
        <option value="1">SI</option>
        <option value="2">임베디드</option>
        <option value="3">LLM</option>
      </select>
    </div>
    {/* address */}
    <div>
      <label className="block text-xs">
        <span className="text-white">address</span><span className="text-red-500 ml-1">*required</span>
      </label>
      <Input name="address" placeholder="회사 주소" />
    </div>
    {/* phone */}
    <div>
      <label className="block text-xs">
        <span className="text-white">phone</span><span className="text-red-500 ml-1">*required</span>
      </label>
      <Input name="phone" placeholder="숫자만 입력" />
    </div>
    {/* email */}
    <div>
      <label className="block text-xs">
        <span className="text-white">email</span><span className="text-red-500 ml-1">*required</span>
      </label>
      <Input name="email" placeholder="fast1234@fastjobapi.com" />
      <p className="mt-1 text-xs text-[#7a7a82]">입력한 이메일로 인증 링크 전송</p>
    </div>
    {error && <p className="text-red-500 text-sm">{error}</p>}
    <Button type="submit" variant="secondary" disabled={loading}>
      {loading ? '가입 중...' : '회원가입'}
    </Button>
  </form>
);

export default CompanySignupForm;
import React from 'react';
import Button from '../../ui/Button';
import Input from '../../ui/Input';

interface Props {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  loading: boolean;
  error: string | null;
}

const UserSignupForm: React.FC<Props> = ({ onSubmit, loading, error }) => (
  <form className="space-y-4" onSubmit={onSubmit}>
    <input type="hidden" name="skills" value="" />
    {/* name */}
    <div>
      <label className="block text-xs">
        <span className="text-white">name</span><span className="text-red-500 ml-1">*required</span>
      </label>
      <Input name="name" placeholder="한글, 영문 대/소문자 가능" />
    </div>
    {/* userId */}
    <div>
      <label className="block text-xs">
        <span className="text-white">userId</span><span className="text-red-500 ml-1">*required</span>
      </label>
      <Input name="userId" placeholder="4~20자 / 영문, 숫자, '-' 가능" />
    </div>
    {/* password */}
    <div>
      <label className="block text-xs">
        <span className="text-white">password</span><span className="text-red-500 ml-1">*required</span>
      </label>
      <Input name="password" type="password" placeholder="8~16자 / 영문·숫자·특수문자 중 2개 이상 조합" />
    </div>
    {/* Category */}
    <div>
      <label className="block text-xs">
        <span className="text-white">category</span>
        <span className="text-red-500 ml-1">*required</span>
      </label>
      <select
        name="category"
        required
        className="w-full mt-1 px-3 py-2 bg-[#1e1e20] text-white rounded"
        defaultValue=""
      >
        <option value="" disabled>-- 선택하세요 --</option>
        <option value="0">Back-end</option>
        <option value="1">Front-end</option>
        <option value="2">Fullstack</option>
      </select>
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
    <Button type="submit" variant="primary" disabled={loading}>
      {loading ? '가입 중...' : '회원가입'}
    </Button>
  </form>
);

export default UserSignupForm;
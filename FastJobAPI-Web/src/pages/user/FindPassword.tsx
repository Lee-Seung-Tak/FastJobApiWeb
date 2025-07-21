// src/pages/FindPassword.tsx
import { type FC, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const FindPassword: FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch('http://localhost:4000/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error(res.statusText);
      setMessage({ type: 'success', text: '해당 이메일로 비밀번호 재설정 안내를 보냈습니다.' });
    } catch {
      setMessage({ type: 'error', text: '비밀번호 찾기에 실패했습니다. 이메일을 확인해주세요.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h2 className="text-white text-2xl font-normal font-pretendard mb-4">비밀번호 찾기</h2>

      <div className="bg-[#2c2c31] rounded-md p-6 space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-xs text-[#7a7a82] mb-1">
              이메일
            </label>
            <Input
              id="email"
              type="email"
              placeholder="example@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {message && (
            <div
              className={`text-xs ${message.type === 'success' ? 'text-green-500' : 'text-red-500'
                }`}
            >
              {message.text}
            </div>
          )}

          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? '전송 중...' : '비밀번호 찾기'}
          </Button>
        </form>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-sm text-[#7a7a82] hover:underline"
          >
            로그인 화면으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default FindPassword;

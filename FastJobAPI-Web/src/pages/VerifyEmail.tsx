// src/pages/VerifyEmail.tsx
import { type FC, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';

interface LocationState {
  email: string;
}

const VerifyEmail: FC = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const email = (state as LocationState)?.email ?? '';
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const resend = async () => {
    setLoading(true);
    setMsg(null);
    try {
      // 필요하다면 실제 엔드포인트로 변경하세요
      const res = await fetch('http://localhost:4000/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', accept: 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error(res.statusText);
      setMsg({ type: 'success', text: '인증 메일을 다시 보냈습니다.' });
    } catch {
      setMsg({ type: 'error', text: '인증 메일 재전송에 실패했습니다.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 text-center">
      <h2 className="text-white text-2xl font-normal font-pretendard mb-4">이메일 인증</h2>
      <div className="bg-[#2c2c31] rounded-md p-6 space-y-4">
        <p className="text-sm text-[#7a7a82]">
          {email} 로 전송된 인증 메일을 확인해주세요.
        </p>

        {msg && (
          <div className={`text-xs ${msg.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
            {msg.text}
          </div>
        )}

        <div className="flex justify-center gap-4 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={resend}
            disabled={loading}
          >
            {loading ? '전송 중…' : '이메일 다시 보내기'}
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={() => navigate('/login')}
          >
            로그인
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
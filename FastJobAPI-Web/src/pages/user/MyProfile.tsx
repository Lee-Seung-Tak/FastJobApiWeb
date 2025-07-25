// src/pages/user/resume/MyProfile.tsx
import { type FC, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
// import Button from '../../components/ui/Button';


const MyProfile: FC = () => {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen(o => !o);

  return (
    <div className="bg-[#2c2c31] rounded-md overflow-hidden border border-[#3a3a3f]">
      {/* 섹션 헤더 */}
      <button
        className="w-full flex items-center px-6 py-4"
        onClick={toggle}
      >
        <span className="px-3 py-1 bg-[#2077ff] text-white rounded-md text-sm">
          마이 프로필
        </span>
        <span className="ml-4 text-xs font-mono text-[#7a7a82]">
          /auth/myProfile
        </span>
        <span className="ml-4 text-xs text-white">
          개인 정보 수정 / 알림 설정
        </span>
        <span className="ml-auto">
          {open
            ? <ChevronUp className="text-[#7a7a82]" />
            : <ChevronDown className="text-[#7a7a82]" />
          }
        </span>
      </button>

      {/* 리스트 영역 */}
      {open && (
        <div className="border-t border-[#3a3a3f] divide-y divide-[#3a3a3f]">
          MyProfile
        </div>
      )}
    </div>
  );
};

export default MyProfile;
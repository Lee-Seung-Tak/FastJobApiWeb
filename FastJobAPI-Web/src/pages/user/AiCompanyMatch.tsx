// src/pages/user/resume/AiCompanyMatch.tsx
import { type FC, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Button from '../../components/ui/Button';

interface Company {
  id: number;
  name: string;
  title: string;
  match: number;
  workType: string;
  permit: string;
  field: string;
  tech: string;
  deadline: string;
}

const mockCompanies: Company[] = [
  {
    id: 1,
    name: 'Company A',
    title: 'Back-End 개발자 채용',
    match: 92,
    workType: '재택근무',
    permit: '유연근무제',
    field: 'Backend',
    tech: 'JAVA',
    deadline: '~ 06/30(월)',
  },
  {
    id: 2,
    name: 'Company B',
    title: 'Front-End 개발자 채용',
    match: 88,
    workType: '출근',
    permit: '자유복장',
    field: 'Frontend',
    tech: 'React',
    deadline: '~ 07/05(금)',
  },
  // … 더미 데이터 추가 …
];

const AiCompanyMatch: FC = () => {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen(o => !o);


  // 예시 기준; 실제 API 데이터로 대체하세요
  const criteria = {
    salary: '3000-4000',
    workType: '재택근무',
    permit: '유연근무제',
    field: 'Backend',
    tech: 'JAVA',
  };

  return (
    <div className="bg-[#2c2c31] rounded-md overflow-hidden border border-[#3a3a3f]">
      {/* 섹션 헤더 */}
      <button
        className="w-full flex items-center px-6 py-4"
        onClick={toggle}
      >
        <span className="px-3 py-1 bg-[#2077ff] text-white rounded-md text-sm">
          AI 회사 추천
        </span>
        <span className="ml-4 text-xs font-mono text-[#7a7a82]">
          /auth/recommendCompany
        </span>
        <span className="ml-4 text-xs text-white">
          회사 추천 받기
        </span>
        <span className="ml-auto">
          {open
            ? <ChevronUp className="text-[#7a7a82]" />
            : <ChevronDown className="text-[#7a7a82]" />
          }
        </span>
      </button>

      {open && (
        <div>
          <div className="px-6 pb-6 space-y-4">
            {/* 회사 희망 조건 */}
            <div className="flex items-center justify-between border border-[#3a3a3f] rounded-md px-4 py-2">
              <span className="text-xs font-semibold text-white">
                회사 희망 조건
              </span>
              <div className="flex-1 mx-4 text-xs text-[#7a7a82] flex flex-wrap gap-2">
                <span>{criteria.salary}</span>
                <span>{criteria.workType}</span>
                <span>{criteria.permit}</span>
                <span>{criteria.field}</span>
                <span>{criteria.tech}</span>
              </div>
              <Button variant="secondary" >
                수정
              </Button>
            </div>

            {/* 추천 회사 리스트 */}
            <div className="text-xs text-[#7a7a82]">
              총 {mockCompanies.length}건
            </div>
            <div className="border border-[#3a3a3f] rounded-md overflow-hidden divide-y divide-[#3a3a3f]">
              {mockCompanies.map(c => (
                <div
                  key={c.id}
                  className="flex items-center justify-between px-6 py-4 hover:bg-[#1e1e22] transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-[#7a7a82]">{c.name}</div>
                    <div className="text-white font-medium">{c.title}</div>
                    <span className="text-xs bg-[#f4e1e1] text-[#c00] px-2 py-1 rounded-md">
                      AI매칭률 {c.match}%
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-xs text-[#7a7a82] whitespace-nowrap">
                      {c.workType} · {c.permit}
                    </div>
                    <Button>
                      지원하기
                    </Button>
                    <div className="text-xs text-[#7a7a82] whitespace-nowrap">
                      {c.deadline}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiCompanyMatch;

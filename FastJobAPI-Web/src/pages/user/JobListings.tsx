// src/pages/user/resume/JobListings.tsx
import { type FC, useEffect, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Button from '../../components/ui/Button';
import api from '../../lib/axios';

interface JobPosting {
  id: number;
  company_id: number;
  title: string;
  description: string;
  category: number;
  created_at: string;
  deadline: string;
  is_active: boolean;
}

const JobListings: FC = () => {
  const [open, setOpen] = useState(false);
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const toggle = () => setOpen((o) => !o);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const res = await api.get<{ postings: JobPosting[] }>('/users/job-postings');
        setJobs(res.data.postings || []);  // 빈배열 fallback 추가
      } catch (err: any) {
        console.error('채용공고 불러오기 실패:', err);
        setError(err.response?.data?.message || err.message || '서버와 통신 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="bg-[#2c2c31] rounded-md overflow-hidden border border-[#3a3a3f]">
      <button className="w-full flex items-center px-6 py-4" onClick={toggle}>
        <span className="px-3 py-1 bg-[#2077ff] text-white rounded-md text-sm">
          채용 공고
        </span>
        <span className="ml-4 text-xs font-mono text-[#7a7a82]">/users/job-postings</span>
        <span className="ml-4 text-xs text-white">채용 공고 보기</span>
        <span className="ml-auto">
          {open ? (
            <ChevronUp className="text-[#7a7a82]" />
          ) : (
            <ChevronDown className="text-[#7a7a82]" />
          )}
        </span>
      </button>

      {open && (
        <div className="border-t border-[#3a3a3f] divide-y divide-[#3a3a3f]">
          {loading && (
            <div className="p-6 text-white text-sm">로딩 중...</div>
          )}
          {error && (
            <div className="p-6 text-red-500 text-sm">{error}</div>
          )}
          {!loading && !error && jobs.length === 0 && (
            <div className="p-6 text-white text-sm">현재 등록된 공고가 없습니다.</div>
          )}
          {!loading && !error && jobs.map((job) => (
            <div
              key={job.id}
              className="flex items-center justify-between px-6 py-4 hover:bg-[#1e1e22] transition-colors"
            >
              <div className="flex flex-col gap-1">
                <div className="text-white font-medium">{job.title}</div>
                <div className="text-xs text-[#7a7a82]">
                  공고ID: {job.id} · {job.description}
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Button>지원하기</Button>
                <div className="text-xs text-[#7a7a82] whitespace-nowrap">
                  마감일:{' '}
                  {new Date(job.deadline).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobListings;

// src/pages/company/resume/JobPostings.tsx
import { type FC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Button from '../../components/ui/Button';
import api from '../../lib/axios';

interface Posting {
  id: number;
  company_id: number;
  title: string;
  description: string;
  category: number;
  created_at: string;
  deadline: string;
  is_active: boolean;
}

// 숫자 카테고리를 문자열로 매핑
const categoryMap: Record<number, string> = {
  1: 'Frontend',
  2: 'Backend',
};

const JobPostings: FC = () => {
  const [open, setOpen] = useState(false);
  const [postings, setPostings] = useState<Posting[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const toggle = () => setOpen(prev => !prev);

  useEffect(() => {
    if (!open) return;

    const fetchPostings = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get<{ postings: Posting[] }>('/companys/job-postings');
        setPostings(res.data.postings ?? []);
      } catch (err: any) {
        console.error('Fetch job-postings error:', err);
        setError('게시판을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPostings();
  }, [open]);

  return (
    <div className="bg-[#2c2c31] rounded-md overflow-hidden border border-[#3a3a3f]">
      <button className="w-full flex items-center px-6 py-4" onClick={toggle}>
        <span className="px-3 py-1 bg-[#00b14f] text-white rounded-md text-sm">
          채용공고 관리
        </span>
        <span className="ml-4 text-xs font-mono text-[#7a7a82]">
          /companys/job-postings
        </span>
        <span className="ml-4 text-xs text-white">
          채용 공고 업로드 / 확인 / 수정
        </span>
        <span className="ml-auto">
          {open
            ? <ChevronUp className="text-[#7a7a82]" />
            : <ChevronDown className="text-[#7a7a82]" />
          }
        </span>
      </button>

      {open && (
        <div className="px-6 pb-6 space-y-4">
          <div className="flex justify-end">
            <Button variant="primary" size="sm" onClick={() => navigate('/company/job-postings/new')}>
              채용공고 등록
            </Button>
          </div>

          {loading && <div className="text-xs text-[#7a7a82]">로딩 중...</div>}
          {error && <div className="text-xs text-red-500">{error}</div>}

          {!loading && !error && (
            <>
              <div className="text-xs text-[#7a7a82] mb-2">
                총 {postings.length}건
              </div>
              <div className="border border-[#3a3a3f] rounded-md overflow-hidden divide-y divide-[#3a3a3f]">
                {postings.map(post => (
                  <div
                    key={post.id}
                    className="flex items-center justify-between px-6 py-4 hover:bg-[#1e1e22] transition-colors"
                  >
                    <div className="flex flex-col space-y-1">
                      <span className="text-white font-medium text-base">
                        {post.title}
                      </span>
                      <span className="text-xs text-[#a0a0a5]">
                        {post.description}
                      </span>
                      <div className="text-xs text-[#7a7a82]">
                        카테고리: {categoryMap[post.category] ?? '알 수 없음'} |{' '}
                        등록일: {new Date(post.created_at).toLocaleDateString('ko-KR')} |{' '}
                        마감일: {new Date(post.deadline).toLocaleDateString('ko-KR')}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-1 text-xs rounded-md ${post.is_active
                            ? 'bg-[#07c9a4] text-white'
                            : 'bg-[#7a7a82] text-white'
                          }`}
                      >
                        {post.is_active ? '공개' : '비공개'}
                      </span>
                      <Button variant="outline" size="sm">수정</Button>
                      <Button variant="secondary" size="sm">삭제</Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default JobPostings;

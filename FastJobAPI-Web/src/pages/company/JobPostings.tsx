// src/pages/company/resume/JobPostings.tsx
import { type FC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Button from '../../components/ui/Button';
import api from '../../lib/axios';
import JobPostingDetail, { type Posting } from '../company/resume/JobPostingDetail';

const categoryMap: Record<number, string> = { 1: 'Frontend', 2: 'Backend' };

const JobPostings: FC = () => {
  const [open, setOpen] = useState(false);
  const [postings, setPostings] = useState<Posting[]>([]);
  const [selected, setSelected] = useState<Posting | null>(null);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const toggle = () => setOpen(prev => !prev);

  useEffect(() => {
    if (!open) return;

    const fetchPostings = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get<{ postings?: Posting[]; data?: Posting[]; message?: string }>(
          '/companys/job-postings',
          { headers: { Accept: 'application/json' } }
        );
        const body = res.data;
        const list = Array.isArray(body.postings) ? body.postings : Array.isArray(body.data) ? body.data : [];
        setPostings(list);

        // 상세 뷰 동기화
        if (selected) {
          const updated = list.find(p => p.id === selected.id);
          setSelected(updated ?? null);
        }
      } catch (err: any) {
        console.error('Fetch job-postings error:', err);
        setError('게시판을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPostings();
  }, [open]); // open될 때 조회

  const handleDelete = async (id: number) => {
    const ok = window.confirm('정말 삭제하시겠습니까?');
    if (!ok) return;
    setDeletingId(id);
    setError(null);
    try {
      await api.delete(`/companys/recruit-jobs/${id}`, { headers: { Accept: '*/*' } });
      setPostings(prev => prev.filter(p => p.id !== id));
      if (selected?.id === id) setSelected(null);
      window.alert('삭제가 완료되었습니다.');
    } catch (err: any) {
      console.error('Delete job error:', err);
      setError(err?.response?.data?.message || '삭제 중 오류가 발생했습니다.');
      window.alert('삭제에 실패했습니다.');
    } finally {
      setDeletingId(null);
    }
  };

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' });

  return (
    <div className="bg-[#2c2c31] rounded-md overflow-hidden border border-[#3a3a3f]">
      <button className="w-full flex items-center px-6 py-4" onClick={toggle}>
        <span className="px-3 py-1 bg-[#00b14f] text-white rounded-md text-sm">채용공고 관리</span>
        <span className="ml-4 text-xs font-mono text-[#7a7a82]">/companys/job-postings</span>
        <span className="ml-4 text-xs text-white">채용 공고 업로드 / 확인 / 수정</span>
        <span className="ml-auto">
          {open ? <ChevronUp className="text-[#7a7a82]" /> : <ChevronDown className="text-[#7a7a82]" />}
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
              {/* 상세 뷰 */}
              {selected ? (
                <JobPostingDetail
                  posting={selected}
                  onBack={() => setSelected(null)}
                  onEdit={() => navigate(`/company/job-postings/${selected.id}/edit`, { state: selected })}
                  onDelete={() => handleDelete(selected.id)}
                  deleting={deletingId === selected.id}
                />
              ) : (
                // 목록 뷰
                <>
                  <div className="text-xs text-[#7a7a82] mb-2">총 {postings.length}건</div>
                  <div className="border border-[#3a3a3f] rounded-md overflow-hidden divide-y divide-[#3a3a3f]">
                    {postings.map(post => (
                      <div
                        key={post.id}
                        role="button"
                        onClick={() => setSelected(post)}
                        className="flex items-center justify-between px-6 py-4 hover:bg-[#1e1e22] transition-colors cursor-pointer"
                        title="상세 보기"
                      >
                        <div className="flex flex-col space-y-1">
                          <span className="text-white font-medium text-base">{post.title}</span>
                          <span className="text-xs text-[#a0a0a5] line-clamp-1">{post.description}</span>
                          <div className="text-xs text-[#7a7a82]">
                            카테고리: {categoryMap[post.category] ?? '알 수 없음'} | 등록일: {fmtDate(post.created_at)} | 마감일: {fmtDate(post.deadline)}
                          </div>
                        </div>

                        <span
                          className={`inline-flex items-center gap-2 text-xs px-2 py-1 rounded-full border ${post.is_active
                            ? 'border-[#07c9a4] text-[#07c9a4] bg-[#07c9a4]/10'
                            : 'border-[#7a7a82] text-[#7a7a82] bg-[#7a7a82]/10'
                            }`}
                          title={post.is_active ? '공개 상태' : '비공개 상태'}
                        >
                          <span className={`h-2 w-2 rounded-full ${post.is_active ? 'bg-[#07c9a4]' : 'bg-[#7a7a82]'}`} />
                          {post.is_active ? '공개' : '비공개'}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default JobPostings;

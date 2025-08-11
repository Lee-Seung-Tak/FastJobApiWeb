// src/pages/company/resume/EditJobPosting.tsx
import React, { type FC, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import api from '../../../lib/axios';

interface Posting {
  id: number;
  company_id: number;
  title: string;
  description: string;
  category: number;
  created_at: string;
  deadline: string; // ISO 가능
  is_active: boolean;
}

type LocationState = Posting | undefined;

// ISO → YYYY-MM-DD (input[type=date]용)
const isoToDateInput = (iso?: string) => {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const EditJobPosting: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state } = useLocation() as { state: LocationState };

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '1',   // 문자열 유지
    deadline: '',    // YYYY-MM-DD
    is_active: true, // 공개/비공개
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 초기값 세팅
  useEffect(() => {
    const bootstrap = async () => {
      setError(null);
      try {
        if (state) {
          setForm({
            title: state.title,
            description: state.description,
            category: String(state.category),
            deadline: isoToDateInput(state.deadline),
            is_active: !!state.is_active,
          });
        } else {
          const res = await api.get<{ postings?: Posting[]; data?: Posting[]; message?: string }>(
            '/companys/job-postings',
            { headers: { Accept: 'application/json' } }
          );
          const body = res.data;
          const list: Posting[] = Array.isArray(body.postings)
            ? body.postings
            : Array.isArray(body.data)
              ? body.data
              : [];
          const target = list.find(p => String(p.id) === String(id));
          if (!target) throw new Error('해당 공고를 찾을 수 없습니다.');
          setForm({
            title: target.title,
            description: target.description,
            category: String(target.category),
            deadline: isoToDateInput(target.deadline),
            is_active: !!target.is_active,
          });
        }
      } catch (e: any) {
        setError(e?.message || '초기 데이터를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };
    void bootstrap();
  }, [id, state]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };
  const onToggleActive = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, is_active: e.target.checked }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setSaving(true);
    setError(null);

    try {
      const payload = {
        title: form.title,
        description: form.description,
        category: form.category, // 문자열
        deadline: form.deadline, // YYYY-MM-DD
        is_active: form.is_active,
      };

      await api.patch(`/companys/recruit-jobs/${id}`, payload, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      // ✅ 성공: 얼럿 → 채용공고 목록으로 이동
      window.alert('수정이 완료되었습니다.');
      navigate('/company/home', { replace: true }); // 목록 경로 사용(프로젝트에 맞게 필요 시 조정)
    } catch (err: any) {
      console.error('Update job error:', err);
      const msg = err?.response?.data?.message || '수정 중 오류가 발생했습니다.';
      setError(msg);
      // ✅ 실패: 얼럿 → 편집 페이지 유지
      window.alert(`수정에 실패했습니다.\n${msg}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-sm text-[#7a7a82]">로딩 중…</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-[#2c2c31] rounded-md border border-[#3a3a3f]">
      <h2 className="text-2xl text-white mb-4">채용공고 수정</h2>
      {error && <div className="mb-4 text-xs text-red-500">{error}</div>}

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs text-[#7a7a82] mb-1">제목</label>
          <input
            name="title"
            value={form.title}
            onChange={onChange}
            className="w-full bg-[#1e1e1e] text-white border border-[#3a3a3f] rounded-md px-3 py-2"
            placeholder="예: Recruit Senior Software Engineer"
            required
          />
        </div>

        <div>
          <label className="block text-xs text-[#7a7a82] mb-1">설명</label>
          <textarea
            name="description"
            value={form.description}
            onChange={onChange}
            className="w-full bg-[#1e1e1e] text-white border border-[#3a3a3f] rounded-md px-3 py-2 min-h-[120px]"
            placeholder="Updated job description..."
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-[#7a7a82] mb-1">카테고리</label>
            <select
              name="category"
              value={form.category}
              onChange={onChange}
              className="w-full bg-[#1e1e1e] text-white border border-[#3a3a3f] rounded-md px-3 py-2"
            >
              <option value="1">Back-End</option>
              <option value="2">Front-End</option>
              <option value="3">Full-Stack</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-[#7a7a82] mb-1">마감일</label>
            <input
              type="date"
              name="deadline"
              value={form.deadline}
              onChange={onChange}
              className="w-full bg-[#1e1e1e] text-white border border-[#3a3a3f] rounded-md px-3 py-2"
              required
            />
          </div>
        </div>

        {/* 🔁 등록 페이지와 동일: 스위치(checkbox 기반) */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#7a7a82]">공개 여부</span>

          <label
            className={`relative inline-flex items-center ${saving ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
            title={form.is_active ? '현재 공개 • 클릭 시 비공개로 전환' : '현재 비공개 • 클릭 시 공개로 전환'}
          >
            <input
              type="checkbox"
              className="sr-only peer"
              checked={form.is_active}
              onChange={onToggleActive}
              disabled={saving}
              aria-label="공개 여부 전환"
            />
            <div className="w-10 h-5 rounded-full bg-[#3a3a3f] peer-checked:bg-[#07c9a4] transition-colors"></div>
            <div className="pointer-events-none absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform peer-checked:translate-x-5"></div>
          </label>

          <span className="text-xs text-[#a0a0a5]">{form.is_active ? '공개' : '비공개'}</span>
        </div>

        <div className="flex gap-2 pt-2">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            취소
          </Button>
          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? '저장 중…' : '저장'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditJobPosting;

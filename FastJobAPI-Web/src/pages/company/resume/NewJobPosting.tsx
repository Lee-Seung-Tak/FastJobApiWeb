// src/pages/company/resume/NewJobPosting.tsx
import React, { type FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import api from '../../../lib/axios';

const NewJobPosting: FC = () => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<string>('1');
  const [deadline, setDeadline] = useState<string>('');
  const [isActive, setIsActive] = useState<boolean>(true); // ✅ 스위치 상태
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !deadline) {
      window.alert('필수 항목을 입력해 주세요.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('deadline', deadline); // YYYY-MM-DD
      formData.append('is_active', isActive ? 'true' : 'false'); // ✅ 스위치 값 반영
      if (imageFile) formData.append('image', imageFile);

      await api.post('/companys/recruit-jobs', formData, {
        headers: { Accept: 'application/json' },
      });

      window.alert('등록이 완료되었습니다.');
      navigate('/company/home');
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || '업로드 중 오류가 발생했습니다.';
      console.error('Upload error:', err);
      setError(msg);
      window.alert(`등록에 실패했습니다.\n${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-[#2c2c31] rounded-md border border-[#3a3a3f]">
      <h2 className="text-2xl text-white mb-4">새 채용공고 등록</h2>
      {error && <div className="mb-4 text-xs text-red-500">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-xs text-[#7a7a82] mb-1">제목</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full bg-[#1e1e1e] text-white border border-[#3a3a3f] rounded-md px-3 py-2"
            placeholder="채용공고 제목"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-xs text-[#7a7a82] mb-1">설명</label>
          <textarea
            id="description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full bg-[#1e1e1e] text-white border border-[#3a3a3f] rounded-md px-3 py-2"
            rows={4}
            placeholder="상세 설명"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block text-xs text-[#7a7a82] mb-1">카테고리</label>
            <select
              id="category"
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full bg-[#1e1e1e] text-white border border-[#3a3a3f] rounded-md px-3 py-2"
            >
              <option value="1">Back-End</option>
              <option value="2">Front-End</option>
              <option value="3">Full-Stack</option>
            </select>
          </div>

          <div>
            <label htmlFor="deadline" className="block text-xs text-[#7a7a82] mb-1">마감일</label>
            <input
              id="deadline"
              type="date"
              value={deadline}
              onChange={e => setDeadline(e.target.value)}
              className="w-full bg-[#1e1e1e] text-white border border-[#3a3a3f] rounded-md px-3 py-2"
              required
            />
          </div>
        </div>

        {/* ✅ 공개/비공개 스위치 */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#7a7a82]">공개 여부</span>

          <label
            className={`relative inline-flex items-center ${loading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
            title={isActive ? '현재 공개 • 클릭 시 비공개로 전환' : '현재 비공개 • 클릭 시 공개로 전환'}
          >
            {/* 실제 체크박스 (접근성/상태) */}
            <input
              type="checkbox"
              className="sr-only peer"
              checked={isActive}
              onChange={e => setIsActive(e.target.checked)}
              disabled={loading}
              aria-label="공개 여부 전환"
            />
            {/* 트랙 */}
            <div className="w-10 h-5 rounded-full bg-[#3a3a3f] peer-checked:bg-[#07c9a4] transition-colors"></div>
            {/* 핸들 */}
            <div className="pointer-events-none absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform peer-checked:translate-x-5"></div>
          </label>

          <span className="text-xs text-[#a0a0a5]">{isActive ? '공개' : '비공개'}</span>
        </div>

        <div>
          <label htmlFor="image" className="block text-xs text-[#7a7a82] mb-1">이미지</label>
          <input
            id="image"
            type="file"
            onChange={e => e.target.files && setImageFile(e.target.files[0])}
            className="w-full text-sm text-white"
          />
        </div>

        <Button variant="primary" size="md" type="submit" disabled={loading}>
          {loading ? '등록 중...' : '등록'}
        </Button>
      </form>
    </div>
  );
};

export default NewJobPosting;

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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('deadline', deadline);
      if (imageFile) formData.append('image', imageFile);

      // axios 인스턴스로 POST 요청
      await api.post('/companys/recruit-jobs', formData, {
        headers: { Accept: 'application/json' },
      });

      // 목록 페이지로 이동
      navigate('/company/job-postings');
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.response?.data?.message || err.message || '업로드 중 오류가 발생했습니다.');
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
            className="w-full bg-[#1e1e1e] text-white border rounded-md px-3 py-2"
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
            className="w-full bg-[#1e1e1e] text-white border rounded-md px-3 py-2"
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
              className="w-full bg-[#1e1e1e] text-white border rounded-md px-3 py-2"
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
              className="w-full bg-[#1e1e1e] text-white border rounded-md px-3 py-2"
              required
            />
          </div>
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

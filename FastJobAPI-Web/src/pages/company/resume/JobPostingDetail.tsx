// src/pages/company/resume/JobPostingDetail.tsx
import { type FC } from 'react';
import Button from '../../../components/ui/Button';

export interface Posting {
  id: number;
  company_id: number;
  title: string;
  description: string;
  category: number;
  created_at: string;
  deadline: string;
  is_active: boolean;
}

interface Props {
  posting: Posting;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  deleting?: boolean;
}

const categoryMap: Record<number, string> = { 1: 'Frontend', 2: 'Backend' };

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' });

const JobPostingDetail: FC<Props> = ({ posting, onBack, onEdit, onDelete, deleting }) => {
  return (
    <div className="space-y-4">
      {/* 액션 바 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={onBack}>
            목록 보기
          </Button>
          <span
            className={`inline-flex items-center gap-2 text-xs px-2 py-1 rounded-full border ${posting.is_active
              ? 'border-[#07c9a4] text-[#07c9a4] bg-[#07c9a4]/10'
              : 'border-[#7a7a82] text-[#7a7a82] bg-[#7a7a82]/10'
              }`}
            title={posting.is_active ? '공개 상태' : '비공개 상태'}
          >
            <span className={`h-2 w-2 rounded-full ${posting.is_active ? 'bg-[#07c9a4]' : 'bg-[#7a7a82]'}`} />
            {posting.is_active ? '공개' : '비공개'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onEdit}>
            수정
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={onDelete}
            disabled={!!deleting}
            className={deleting ? 'opacity-60 cursor-not-allowed' : ''}
          >
            {deleting ? '삭제 중…' : '삭제'}
          </Button>
        </div>
      </div>

      {/* 상세 카드 */}
      <div className="border border-[#3a3a3f] rounded-md p-5 bg-[#1e1e22]">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-white text-lg font-semibold">{posting.title}</h3>
          <div className="text-xs text-[#7a7a82] whitespace-nowrap">
            등록일: {fmtDate(posting.created_at)} · 마감일: {fmtDate(posting.deadline)}
          </div>
        </div>

        <div className="mt-2 text-xs text-[#a0a0a5]">
          카테고리: {categoryMap[posting.category] ?? '알 수 없음'} · 공고 ID: {posting.id}
        </div>

        <div className="mt-4 text-sm leading-6 text-white whitespace-pre-wrap">
          {posting.description}
        </div>
      </div>
    </div>
  );
};

export default JobPostingDetail;

// src/pages/user/resume/ResumeManagement.tsx
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import ResumeUpload from './ResumeUpload';
import ResumeViewEdit from './ResumeViewEdit';

const ResumeManagement: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState<'upload' | 'manage'>('upload');

  // ▼ 래퍼(접히는 요소)와 내부 콘텐츠를 분리
  const wrapperRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  const [maxHeight, setMaxHeight] = useState<number>(0);

  const toggleOpen = () => setOpen(prev => !prev);

  // 현재 콘텐츠 실제 높이 측정
  const measure = () => {
    if (!innerRef.current) return;
    setMaxHeight(innerRef.current.scrollHeight);
  };

  // 열릴 때 / 탭 변경될 때 높이 재계산
  useLayoutEffect(() => {
    if (open) {
      // 다음 페인트 전에 측정
      measure();
    }
  }, [open, currentTab]);

  // 콘텐츠 크기 변화(접힌 상태에서 바뀌어도, 열리면 다시 측정됨)
  useEffect(() => {
    if (!innerRef.current) return;
    const ro = new ResizeObserver(() => {
      if (open) measure();
    });
    ro.observe(innerRef.current);

    const onResize = () => open && measure();
    window.addEventListener('resize', onResize);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', onResize);
    };
  }, [open]);

  return (
    <div className="bg-[#2c2c31] rounded-md overflow-hidden">
      {/* Section Header */}
      <button className="w-full flex items-center px-6 py-4" onClick={toggleOpen}>
        <span className="px-3 py-1 bg-[#2077ff] text-white rounded-md text-sm">이력서 관리</span>
        <span className="ml-4 text-xs font-mono text-[#7a7a82]">/auth/resumeManagement</span>
        <span className="ml-4 text-xs text-white">이력서 업로드 / 이력서 확인 수정</span>
        <span className="ml-auto">{open ? <ChevronUp className="text-[#7a7a82]" /> : <ChevronDown className="text-[#7a7a82]" />}</span>
      </button>

      {/* Collapsible Wrapper */}
      <div
        ref={wrapperRef}
        className="bg-[#2d2d2d] overflow-hidden transition-[max-height] duration-300"
        style={{ maxHeight: open ? `${maxHeight}px` : '0px' }}
      >
        {/* 실제 콘텐츠(관찰 대상) */}
        <div ref={innerRef}>
          {/* Tabs */}
          <div className="flex border-b border-[#3a3a3f] px-6 pt-4">
            <button
              onClick={() => setCurrentTab('upload')}
              className={`py-2 px-4 text-sm font-medium ${currentTab === 'upload'
                ? 'text-white border-b-2 border-[#2077ff]'
                : 'text-[#7a7a82] hover:text-white'}`}
            >
              이력서 업로드
            </button>
            <button
              onClick={() => setCurrentTab('manage')}
              className={`py-2 px-4 text-sm font-medium ${currentTab === 'manage'
                ? 'text-white border-b-2 border-[#2077ff]'
                : 'text-[#7a7a82] hover:text-white'}`}
            >
              이력서 확인/수정
            </button>
          </div>

          {/* Tab Content */}
          <div className="px-6 pb-6 pt-4">
            {currentTab === 'upload' ? <ResumeUpload /> : <ResumeViewEdit />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeManagement;

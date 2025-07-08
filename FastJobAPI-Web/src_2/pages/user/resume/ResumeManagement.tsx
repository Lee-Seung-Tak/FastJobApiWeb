// src/pages/user/resume/ResumeManagement.tsx
import React, { useState, useRef } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import ResumeUpload from './resumeUpload';
import ResumeViewEdit from './resumeViewEdit';

const ResumeManagement: React.FC = () => {
  const [open, setOpen] = useState(true);
  const [currentTab, setCurrentTab] = useState<'upload' | 'manage'>('upload');
  const contentRef = useRef<HTMLDivElement>(null);

  const toggleOpen = () => setOpen(prev => !prev);

  return (
    <div className="bg-[#2c2c31] rounded-md overflow-hidden">
      {/* Section Header */}
      <button
        className="w-full flex items-center px-6 py-4"
        onClick={toggleOpen}
      >
        <span className="px-3 py-1 bg-[#2077ff] text-white rounded-md text-sm">이력서 관리</span>
        <span className="ml-4 text-xs font-mono text-[#7a7a82]">/auth/resumeManagement</span>
        <span className="ml-4 text-xs text-white">이력서 업로드 / 이력서 확인 수정</span>
        <span className="ml-auto">
          {open ? (
            <ChevronUp className="text-[#7a7a82]" />
          ) : (
            <ChevronDown className="text-[#7a7a82]" />
          )}
        </span>
      </button>

      {/* Collapsible Content */}
      <div
        ref={contentRef}
        className="bg-[#2d2d2d] overflow-hidden transition-all duration-300"
        style={{
          maxHeight: open ? `${contentRef.current?.scrollHeight}px` : '0px'
        }}
      >
        {/* Tabs */}
        <div className="flex border-b border-[#3a3a3f] px-6 pt-4">
          <button
            onClick={() => setCurrentTab('upload')}
            className={`py-2 px-4 text-sm font-medium ${currentTab === 'upload'
                ? 'text-white border-b-2 border-[#2077ff]'
                : 'text-[#7a7a82] hover:text-white'
              }`}
          >
            이력서 업로드
          </button>
          <button
            onClick={() => setCurrentTab('manage')}
            className={`py-2 px-4 text-sm font-medium ${currentTab === 'manage'
                ? 'text-white border-b-2 border-[#2077ff]'
                : 'text-[#7a7a82] hover:text-white'
              }`}
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
  );
};

export default ResumeManagement;

// 개인회원 - 이력서 관리

import React, { useState, useRef } from 'react';
import { ChevronDown, ChevronUp } from "lucide-react";

// Resume Upload 탭과 Resume Manage 탭의 내용을 담당할 컴포넌트 임포트
import ResumeUpload from './resumeUpload';
import ResumeViewEdit from './resumeViewEdit';

// ResumeManagement 컴포넌트의 props (현재 사용되는 props 없음)
interface ResumeManageProps { }

// ResumeManagement 컴포넌트 시작
export default function ResumeManagement({ }: ResumeManageProps) {
  // 섹션 열림/닫힘 상태 관리
  const [openSection, setOpenSection] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // 섹션 토글 함수
  const toggle = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  // Resume 컴포넌트: 이력서 관리 섹션의 실제 내용을 담당
  const Resume = ({ userType }: { userType: string }) => {
    // 탭 상태 관리: 'upload' (이력서 업로드) 또는 'manage' (이력서 확인/수정)
    const [currentTab, setCurrentTab] = useState<'upload' | 'manage'>('upload');

    // 탭 변경 핸들러
    const handleTabChange = (tab: 'upload' | 'manage') => {
      setCurrentTab(tab);
    };

    return (
      <div className="bg-[#2d2d2d] p-6 rounded-b-md">
        {/* 탭 네비게이션 */}
        <div className="flex border-b border-gray-600 mb-4">
          <button
            onClick={() => handleTabChange('upload')}
            className={`py-2 px-4 text-sm font-medium ${currentTab === 'upload' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400 hover:text-white'
              }`}
          >
            이력서 업로드
          </button>
          <button
            onClick={() => handleTabChange('manage')}
            className={`py-2 px-4 text-sm font-medium ${currentTab === 'manage' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400 hover:text-white'
              }`}
          >
            이력서 확인/수정
          </button>
        </div>

        {/* 탭 콘텐츠 렌더링 영역 */}
        <div>
          {currentTab === 'upload' && <ResumeUpload />}
          {currentTab === 'manage' && <ResumeViewEdit />}
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* 이력서관리 섹션 (버튼을 클릭하면 하위 Resume 컴포넌트가 토글) */}
      <div className="bg-[#333] rounded-md">
        <button
          onClick={() => toggle("userResume")}
          className="flex items-center justify-between w-full p-4"
        >
          <div className="flex items-center space-x-4 text-white">
            <span className="bg-[#0078D4] text-white px-4 py-2 rounded">
              이력서 관리
            </span>
            <code className="text-sm text-gray-300">/auth/resumeManagement</code>
            <span className="text-white">이력서 업로드 / 이력서 확인 수정</span>
          </div>
          {openSection === "userResume" ? (
            <ChevronUp className="text-white" />
          ) : (
            <ChevronDown className="text-white" />
          )}
        </button>
        {/* 토글 애니메이션 */}
        <div
          ref={contentRef}
          style={{
            maxHeight: openSection === "userResume" ? `${contentRef.current?.scrollHeight}px` : '0',
            transition: 'max-height 0.3s ease-in-out',
            overflow: 'hidden'
          }}
          className="bg-[#2d2d2d]"
        >
          <Resume />
        </div>
      </div>
    </div>
  );
}
// 개인회원 - 스크랩/관심기업
import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp } from "lucide-react";


interface SavedCompaniesProps {
  initialSection?: string;
  onClose?: () => void;
}


export default function SavedCompanies({ initialSection, onClose }: SavedCompaniesProps) {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null); // 콘텐츠를 위한 ref 생성

  useEffect(() => {
    if (initialSection) { setOpenSection(initialSection); }
  }, [initialSection]);

  const toggle = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };


  const SavedCompanieslist = () => {
    return (
      <div className="p-6">
        SavedCompanies
      </div>
    );
  };

  return (
    <div>
      <div className="bg-[#333] rounded-md overflow-hidden">
        <button
          onClick={() => toggle("user")}
          className="flex items-center justify-between w-full p-4"
        >
          <div className="flex items-center space-x-4 text-white">
            <span className="bg-[#0078D4] text-white px-4 py-2 rounded">
              스크랩/관심기업
            </span>
            <code className="text-sm text-gray-300">/auth/savedCompanies</code>
            <span className="text-white">스크랩 한 공고와 관심 기업 보기</span>
          </div>
          {openSection === "user" ? (
            <ChevronUp className="text-white" />
          ) : (
            <ChevronDown className="text-white" />
          )}
        </button>

        {/* 토글 애니메이션 */}
        <div
          ref={contentRef}
          style={{
            maxHeight: openSection === "user" ? `${contentRef.current?.scrollHeight}px` : '0',
            transition: 'max-height 0.3s ease-in-out',
            overflow: 'hidden'
          }}
          className="bg-[#2d2d2d]"
        >
          <SavedCompanieslist />
        </div>
      </div>
    </div>
  );
}
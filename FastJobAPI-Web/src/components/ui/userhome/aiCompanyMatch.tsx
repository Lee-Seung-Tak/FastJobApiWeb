import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp } from "lucide-react";


interface AiCompanyMatchProps {
  initialSection?: string; // initialSection은 선택 사항
  onClose?: () => void; // onClose도 선택 사항
}


export default function AiCompanyMatch({ initialSection, onClose }: AiCompanyMatchProps) {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null); // 콘텐츠를 위한 ref 생성

  useEffect(() => {
    if (initialSection) { setOpenSection(initialSection); }
  }, [initialSection]);

  const toggle = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };


  const AiCompanyMatchlist = () => {
    return (
      <div className="p-6">
        AiCompanyMatch
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
              AI 회사 추천
            </span>
            <code className="text-sm text-gray-300">/auth/aiCompanyMatch</code>
            <span className="text-white">회사 추천 받기</span>
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
            transition: 'max-height 0.3s ease-in-out', // 지속 시간과 이징을 필요에 따라 조절
            overflow: 'hidden' // 접혔을 때 콘텐츠가 숨겨지도록 보장
          }}
          className="bg-[#2d2d2d]"
        >
          <AiCompanyMatchlist />
        </div>
      </div>
    </div>
  );
}
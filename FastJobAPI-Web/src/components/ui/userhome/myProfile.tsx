// 개인회원 - 스크랩/관심기업
import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp } from "lucide-react";


interface MyProfileProps {
  initialSection?: string;
  onClose?: () => void;
}


export default function MyProfile({ initialSection, onClose }: MyProfileProps) {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null); // 콘텐츠를 위한 ref 생성

  useEffect(() => {
    if (initialSection) { setOpenSection(initialSection); }
  }, [initialSection]);

  const toggle = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };


  const MyProfilelist = () => {
    return (
      <div className="p-6">
        MyProfilelist
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
              마이 프로필
            </span>
            <code className="text-sm text-gray-300">/auth/myProfile</code>
            <span className="text-white">개인 정보 수정 / 알림 설정</span>
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
          <MyProfilelist />
        </div>
      </div>
    </div>
  );
}
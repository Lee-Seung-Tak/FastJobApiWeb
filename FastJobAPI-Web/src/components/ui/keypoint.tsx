import React, { useState, useRef } from 'react';
import { ChevronDown, ChevronUp, DiscAlbum } from "lucide-react";

export default function KeyPoint() {
  const [openSection, setOpenSection] = useState("key");
  const contentRef = useRef<HTMLDivElement>(null);

  const toggle = (section: any) => {
    setOpenSection(openSection === section ? null : section);
  };

  const KeyPointsection = () => (
    <div className="bg-[#2d2d2d] p-6 rounded-b-md">

      <div className="mx-auto bg-[#2a2a2a] p-8 rounded-md border border-[#3a3a3a] space-y-6">
        {/* 핵심가치 1 */}
        <div>
          <p className="text-[#16BB79] text-base font-normal font-['Pretendard'] pb-3">핵심가치 1</p>
          <div className="bg-[#121212] text-sm text-[#d4d4d4] p-4 rounded">
            <pre>
              <span className='text-[#FFD70A]'>&#123;</span><br />
              <span className='text-[#0078D4]'>   이력서 자동생성</span>: <span className='text-[#E37836]'>"GitHub 링크 또는 첨부파일 기반 이력서 자동 구성"</span><br />
              <span className='text-[#FFD70A]'>&#123;</span>
            </pre>
          </div>
        </div>

        {/* 핵심가치 2 */}
        <div>
          <p className="text-[#16BB79] text-base font-normal font-['Pretendard'] pb-3">핵심가치 2</p>
          <div className="bg-[#121212] text-sm text-[#d4d4d4] p-4 rounded">
            <pre>
              <span className='text-[#FFD70A]'>&#123;</span><br />
              <span className='text-[#0078D4]'>   AI 매칭 시스템</span>: <span className='text-[#E37836]'>“희망 조건 & 기술 조건을 모두 반영한 추천”</span><br />
              <span className='text-[#FFD70A]'>&#123;</span>
            </pre>
          </div>
        </div>

        {/* 핵심가치 3 */}
        <div>
          <p className="text-[#16BB79] text-base font-normal font-['Pretendard'] pb-3">핵심가치 3</p>
          <div className="bg-[#121212] text-sm text-[#d4d4d4] p-4 rounded">
            <pre>
              <span className='text-[#FFD70A]'>&#123;</span><br />
              <span className='text-[#0078D4]'>   개발자 중심 구조</span>: <span className='text-[#E37836]'>“직관적인 UX, 핵심 기능 위주 설계”</span><br />
              <span className='text-[#FFD70A]'>&#123;</span>
            </pre>
          </div>
        </div>

        {/* 핵심가치 4 */}
        <div>
          <p className="text-[#16BB79] text-base font-normal font-['Pretendard'] pb-3">핵심가치 4</p>
          <div className="bg-[#121212] text-sm text-[#d4d4d4] p-4 rounded">
            <pre>
              <span className='text-[#FFD70A]'>&#123;</span><br />
              <span className='text-[#0078D4]'>   기업-개발자 연결 최적화</span>: <span className='text-[#E37836]'>“쌍방 매칭 가능성과 컨택 편의성 제공”</span><br />
              <span className='text-[#FFD70A]'>&#123;</span>
            </pre>
          </div>
        </div>

      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
      <div className='pt-10  justify-start text-white text-2xl font-normal font-pretendard'>
        <h3><span className='font-mono'>&#123; FastJobAPI &#125;</span>가 제공하는 핵심 가치</h3>
      </div>
      {/* 핵심가치 */}
      <div className="bg-[#333] rounded-md overflow-hidden">
        <button
          onClick={() => toggle("key")}
          className="flex items-center justify-between w-full p-4"
        >
          <div className="flex items-center space-x-4 text-white">
            <span className="bg-[#E37836] text-white px-4 py-2 rounded">
              핵심가치
            </span>
          </div>
          {openSection === "key" ? (
            <ChevronUp className="text-white" />
          ) : (
            <ChevronDown className="text-white" />
          )}
        </button>
        {/* 토글 애니메이션 */}
        <div
          ref={contentRef}
          style={{
            maxHeight: openSection === "key" ? `${contentRef.current?.scrollHeight}px` : '0',
            transition: 'max-height 0.3s ease-in-out',
            overflow: 'hidden'
          }}
          className="bg-[#2d2d2d]"
        >
          <KeyPointsection />
        </div>
      </div>
    </div>
  );
}
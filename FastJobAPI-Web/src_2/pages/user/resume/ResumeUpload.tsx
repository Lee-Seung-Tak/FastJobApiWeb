// src/components/ui/userhome/ResumeUploadContent.tsx
// 개인회원 - 이력서 관리 - 이력서 업로드

import React, { useState } from 'react';

// Input, Button, RadioGroup, RadioGroupItem 컴포넌트 임포트 및 정의 제거

// ResumeUploadContent 컴포넌트: 이력서 업로드 탭의 실제 내용
const ResumeUpload = () => {
  // 기술 스택을 위한 상태 관리
  const [techStackInput, setTechStackInput] = useState<string>('');
  const [techStacks, setTechStacks] = useState<string[]>(["Front-end", "Python", "HTML", "CSS", "React", "JavaScript"]); // 기본값

  const handleAddTechStack = () => {
    if (techStackInput.trim() && !techStacks.includes(techStackInput.trim())) {
      setTechStacks([...techStacks, techStackInput.trim()]);
      setTechStackInput('');
    }
  };

  const handleRemoveTechStack = (stackToRemove: string) => {
    setTechStacks(techStacks.filter(stack => stack !== stackToRemove));
  };

  return (
    <div className="space-y-8 text-white"> {/* 전체 폼의 텍스트 색상을 흰색으로 설정 */}
      {[
        { label: "이력서", required: true },
        { label: "경력기술서", required: true },
        { label: "자기소개서", required: true },
        { label: "포트폴리오", required: false },
      ].map((item, idx) => (
        <div key={idx} className="space-y-2">
          <label className="text-sm font-medium">
            {item.label} {item.required && <span className="text-red-500">*required</span>}
          </label>
          <div className="flex items-center space-x-2">
            {/* HTML 기본 input 태그 사용 */}
            <input
              type="file"
              className="flex-grow h-10 w-full rounded-md border border-gray-600 bg-[#1f1f1f] px-3 py-2 text-sm text-gray-300
                         focus:outline-none focus:ring-2 focus:ring-blue-500 file:border-0 file:bg-transparent
                         file:text-sm file:font-medium file:text-gray-300"
            />
          </div>
          {/* HTML 기본 input type="radio"와 label 태그 조합 */}
          <div className="flex space-x-4 pt-2">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id={`${item.label}-upload`}
                name={`${item.label}-option`}
                value="upload"
                defaultChecked={true} // 기본값 설정
                className="appearance-none h-4 w-4 rounded-full border border-gray-400 checked:bg-blue-500 checked:border-blue-500
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor={`${item.label}-upload`} className="text-sm">파일 업로드</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id={`${item.label}-github`}
                name={`${item.label}-option`}
                value="github"
                className="appearance-none h-4 w-4 rounded-full border border-gray-400 checked:bg-blue-500 checked:border-blue-500
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor={`${item.label}-github`} className="text-sm">GitHub URL</label>
            </div>
          </div>
        </div>
      ))}

      {/* 기술스택 입력 섹션 */}
      <div>
        <label className="text-sm font-medium">
          기술스택 <span className="text-red-500">*required</span>
        </label>
        <div className="flex space-x-2 mt-2">
          {/* HTML 기본 input 태그 사용 */}
          <input
            placeholder="입력"
            className="w-[200px] h-10 rounded-md border border-gray-600 bg-[#1f1f1f] px-3 py-2 text-sm text-gray-300
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={techStackInput}
            onChange={(e) => setTechStackInput(e.target.value)}
            onKeyDown={(e) => { // Enter 키로 추가 기능
              if (e.key === 'Enter') {
                e.preventDefault(); // 기본 Enter 동작 방지 (폼 제출 등)
                handleAddTechStack();
              }
            }}
          />
          {/* HTML 기본 button 태그 사용 */}
          <button
            onClick={handleAddTechStack}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-sm font-medium
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            추가
          </button>
        </div>
        <div className="flex flex-wrap gap-2 pt-2 text-sm">
          {techStacks.map((stack) => (
            <div
              key={stack}
              className="px-3 py-1 bg-gray-700 text-white rounded-full flex items-center space-x-1"
            >
              <span>{stack}</span>
              <button
                onClick={() => handleRemoveTechStack(stack)}
                className="text-xs text-gray-400 hover:text-red-500 focus:outline-none"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 이력서 미리 보기 버튼 */}
      {/* HTML 기본 button 태그 사용 */}
      <button
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-base font-medium
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        이력서 미리 보기
      </button>
    </div>
  );
};

export default ResumeUpload;
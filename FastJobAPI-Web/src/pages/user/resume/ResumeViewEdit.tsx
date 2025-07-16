// src/components/ui/userhome/ResumeViewEdit.tsx
// 개인회원 - 이력서 관리 - 이력서 확인 수정

import { useState } from 'react';

// ResumeViewEdit 컴포넌트: 저장된 이력서를 확인하고 수정하는 탭의 실제 내용
const ResumeViewEdit = () => {
  // 학력 정보를 위한 상태 (예시)
  const [education] = useState([
    { id: 1, period: '2015 ~ 2019', university: '한밭대학교', major: '컴퓨터공학과', degree: '대학교 4년' }
  ]);
  const [careerExperiences] = useState([
    { id: 1, period: '2022.01 ~ 현재', company: 'XYZ43', role: '백엔드 개발자', description: '신규 서비스 개발, 웹/앱 REST API 설계 및 개발' }
  ]);
  const [techStacks] = useState(["Frontend", "Python", "HTML", "CSS", "React", "JavaScript"]);
  const [projectExperiences] = useState([
    { id: 1, name: '▲ 스펙베드 웹브 개발부', period: '(2023.03 ~ 2023.08)', content: 'Spring Boot와 Kotlin을 활용하여 RESTful API를 구현하고, 시스템 간의 효율적인 통신을 구축했습니다. Kafka, Redis, WebSocket을 적용하여 실시간 데이터 처리 및 알림 기능을 구현했습니다. 기여도 100%' },
    { id: 2, name: '▲ 스펙베드 웹브 개발부', period: '(2023.03 ~ 2023.08)', content: 'Spring Boot와 Kotlin을 활용하여 RESTful API를 구현하고, 시스템 간의 효율적인 통신을 구축했습니다. Jenkins 기반 CI/CD 파이프라인을 구축하여 자동화된 배포 시스템을 구현했습니다. 기여도 100%' }
  ]);
  const [introSections] = useState([
    { id: 1, title: '1. 성장 과정 및 지원 동기', content: '어릴 때부터 컴퓨터 과학에 대한 깊은 관심을 가지고 있었고...' },
    { id: 2, title: '2. 성격의 장단점 및 역량', content: '저는 문제 해결 능력이 뛰어나며, 복잡한 문제를 분석하고 효과적인 해결책을 찾는 데 강한 자신감을 가지고 있습니다.' },
    { id: 3, title: '3. 지원 경험 및 노력', content: '저는 지난 5년간 백엔드 및 프론트엔드 개발 경험을 쌓았으며, Spring Boot, Kotlin, React, Typescript 등 다양한 기술 스택을 활용하여 프로젝트를 수행했습니다.' }
  ]);
  const [certifications] = useState([
    { id: 1, year: '2023.05', topic: '정보처리기사', score: '860점' },
    { id: 2, year: '2021.03', topic: 'TOEIC', score: '860점', additional: '한국산업인력공단' }
  ]);
  const [portfolios] = useState([
    { id: 1, type: 'GitHub', url: 'https://github.com/hongildong', description: 'React + TailwindCSS 기반 포트폴리오' },
    { id: 2, type: '블로그', url: 'https://hongildong.blog', description: '' }
  ]);


  return (
    <div className="space-y-6 p-6 text-white bg-[#2d2d2d] rounded-b-md">
      <div className="flex items-center justify-between border-b border-gray-600 pb-4 mb-4">
        <h3 className="text-xl font-bold">이력서 확인 / 이력서 수정</h3>
        {/* '이력서 미리 보기' 버튼은 ResumeUploadContent에 이미 있으므로, 여기서는 '이력서 저장'과 '이력서 삭제'만 남깁니다. */}
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium">
            이력서 저장
          </button>
          <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium">
            이력서 삭제
          </button>
        </div>
      </div>

      {/* 기본 정보 (Header에서 받은 값) */}
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <label className="w-24 text-gray-400">이름</label>
          <input type="text" value="홍길동" readOnly
            className="flex-grow h-10 rounded-md border border-gray-600 bg-[#1f1f1f] px-3 py-2 text-sm text-gray-300 read-only:bg-gray-700 read-only:cursor-not-allowed" />
        </div>
        <div className="flex items-center space-x-4">
          <label className="w-24 text-gray-400">이메일</label>
          <input type="email" value="hong@example.com" readOnly
            className="flex-grow h-10 rounded-md border border-gray-600 bg-[#1f1f1f] px-3 py-2 text-sm text-gray-300 read-only:bg-gray-700 read-only:cursor-not-allowed" />
        </div>
      </div>

      {/* 학력 */}
      <div className="space-y-4 pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-bold">학력</h4>
          <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm">
            + 학력 추가
          </button>
        </div>
        {education.map(edu => (
          <div key={edu.id} className="space-y-2 border border-gray-700 p-4 rounded-md bg-[#1f1f1f]">
            <div className="flex items-center space-x-2">
              <input type="text" value={edu.period}
                className="flex-grow h-9 rounded-md border border-gray-600 bg-[#2d2d2d] px-3 py-2 text-sm text-gray-300" />
              <input type="text" value={edu.university} placeholder="학교명"
                className="flex-grow h-9 rounded-md border border-gray-600 bg-[#2d2d2d] px-3 py-2 text-sm text-gray-300" />
              <input type="text" value={edu.major} placeholder="전공"
                className="flex-grow h-9 rounded-md border border-gray-600 bg-[#2d2d2d] px-3 py-2 text-sm text-gray-300" />
              <select value={edu.degree}
                className="h-9 rounded-md border border-gray-600 bg-[#2d2d2d] px-3 py-2 text-sm text-gray-300 appearance-none pr-8">
                <option value="고등학교">고등학교</option>
                <option value="대학교 2/3년">대학교 2/3년</option>
                <option value="대학교 4년">대학교 4년</option>
                <option value="석사">석사</option>
                <option value="박사">박사</option>
              </select>
              <button className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-sm">
                저장
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 기술 스택 */}
      <div className="space-y-4 pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-bold">기술 스택</h4>
          <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm">
            + 기술 스택 추가
          </button>
        </div>
        <div className="space-y-2 border border-gray-700 p-4 rounded-md bg-[#1f1f1f]">
          <div className="flex flex-wrap gap-2 text-sm">
            {techStacks.map((stack, index) => (
              <div key={index} className="px-3 py-1 bg-gray-700 text-white rounded-full flex items-center space-x-1">
                <span>{stack}</span>
                <button className="text-xs text-gray-400 hover:text-red-500">×</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 경력 사항 */}
      <div className="space-y-4 pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-bold">경력 사항 <span className="text-gray-500 text-sm">(총 2년 7개월)</span></h4>
          <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm">
            + 경력 추가
          </button>
        </div>
        {careerExperiences.map(exp => (
          <div key={exp.id} className="space-y-2 border border-gray-700 p-4 rounded-md bg-[#1f1f1f]">
            <div className="flex items-center space-x-2">
              <input type="text" value={exp.period}
                className="flex-grow h-9 rounded-md border border-gray-600 bg-[#2d2d2d] px-3 py-2 text-sm text-gray-300" />
              <input type="text" value={exp.company} placeholder="회사명"
                className="flex-grow h-9 rounded-md border border-gray-600 bg-[#2d2d2d] px-3 py-2 text-sm text-gray-300" />
              <input type="text" value={exp.role} placeholder="직무"
                className="flex-grow h-9 rounded-md border border-gray-600 bg-[#2d2d2d] px-3 py-2 text-sm text-gray-300" />
              <button className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-sm">
                저장
              </button>
            </div>
            <textarea value={exp.description} placeholder="상세 내용" rows={3}
              className="w-full rounded-md border border-gray-600 bg-[#2d2d2d] px-3 py-2 text-sm text-gray-300 resize-y"></textarea>
          </div>
        ))}
        {/* 추가 경력 입력 필드 (예시) */}
        <div className="space-y-2 border border-gray-700 p-4 rounded-md bg-[#1f1f1f]">
          <div className="flex items-center space-x-2">
            <input type="text" placeholder="YYYY.MM ~ 현재/YYYY.MM"
              className="flex-grow h-9 rounded-md border border-gray-600 bg-[#2d2d2d] px-3 py-2 text-sm text-gray-300" />
            <input type="text" placeholder="회사명"
              className="flex-grow h-9 rounded-md border border-gray-600 bg-[#2d2d2d] px-3 py-2 text-sm text-gray-300" />
            <input type="text" placeholder="직무"
              className="flex-grow h-9 rounded-md border border-gray-600 bg-[#2d2d2d] px-3 py-2 text-sm text-gray-300" />
            <button className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-sm">
              저장
            </button>
          </div>
          <textarea placeholder="상세 내용" rows={3}
            className="w-full rounded-md border border-gray-600 bg-[#2d2d2d] px-3 py-2 text-sm text-gray-300 resize-y"></textarea>
        </div>
      </div>

      {/* 경력 기술서 */}
      <div className="space-y-4 pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-bold">경력 기술서</h4>
          <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm">
            + 경력 기술서 추가
          </button>
        </div>
        {projectExperiences.map(project => (
          <div key={project.id} className="space-y-2 border border-gray-700 p-4 rounded-md bg-[#1f1f1f]">
            <div className="flex justify-between items-center">
              <input type="text" value={project.name} placeholder="프로젝트명"
                className="flex-grow h-9 rounded-md border border-gray-600 bg-[#2d2d2d] px-3 py-2 text-sm text-gray-300 mr-2" />
              <input type="text" value={project.period} placeholder="기간"
                className="w-40 h-9 rounded-md border border-gray-600 bg-[#2d2d2d] px-3 py-2 text-sm text-gray-300" />
              <button className="ml-2 px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-sm">
                저장
              </button>
            </div>
            <textarea value={project.content} placeholder="상세 내용" rows={5}
              className="w-full rounded-md border border-gray-600 bg-[#2d2d2d] px-3 py-2 text-sm text-gray-300 resize-y"></textarea>
          </div>
        ))}
      </div>

      {/* 자기소개서 */}
      <div className="space-y-4 pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-bold">자기소개서</h4>
          <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm">
            + 자기소개서 추가
          </button>
        </div>
        {introSections.map(section => (
          <div key={section.id} className="space-y-2 border border-gray-700 p-4 rounded-md bg-[#1f1f1f]">
            <input type="text" value={section.title} placeholder="제목"
              className="w-full h-9 rounded-md border border-gray-600 bg-[#2d2d2d] px-3 py-2 text-sm text-gray-300 mb-2" />
            <textarea value={section.content} placeholder="상세 내용" rows={5}
              className="w-full rounded-md border border-gray-600 bg-[#2d2d2d] px-3 py-2 text-sm text-gray-300 resize-y"></textarea>
            <div className="flex justify-end">
              <button className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-sm">
                저장
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 자격증 / 어학 */}
      <div className="space-y-4 pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-bold">자격증 / 어학</h4>
          <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm">
            + 자격증 / 어학 추가
          </button>
        </div>
        {certifications.map(cert => (
          <div key={cert.id} className="space-y-2 border border-gray-700 p-4 rounded-md bg-[#1f1f1f]">
            <div className="flex items-center space-x-2">
              <input type="text" value={cert.year} placeholder="취득년월"
                className="w-24 h-9 rounded-md border border-gray-600 bg-[#2d2d2d] px-3 py-2 text-sm text-gray-300" />
              <input type="text" value={cert.topic} placeholder="과목명"
                className="flex-grow h-9 rounded-md border border-gray-600 bg-[#2d2d2d] px-3 py-2 text-sm text-gray-300" />
              <input type="text" value={cert.score} placeholder="점수/등급"
                className="w-24 h-9 rounded-md border border-gray-600 bg-[#2d2d2d] px-3 py-2 text-sm text-gray-300" />
              {cert.additional && (
                <input type="text" value={cert.additional} placeholder="발행기관 (선택)"
                  className="flex-grow h-9 rounded-md border border-gray-600 bg-[#2d2d2d] px-3 py-2 text-sm text-gray-300" />
              )}
              <button className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-sm">
                저장
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 포트폴리오 */}
      <div className="space-y-4 pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-bold">포트폴리오</h4>
          <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm">
            + 포트폴리오 추가
          </button>
        </div>
        {portfolios.map(portfolio => (
          <div key={portfolio.id} className="space-y-2 border border-gray-700 p-4 rounded-md bg-[#1f1f1f]">
            <div className="flex items-center space-x-2">
              <input type="text" value={portfolio.type} placeholder="유형 (GitHub, Blog 등)"
                className="w-24 h-9 rounded-md border border-gray-600 bg-[#2d2d2d] px-3 py-2 text-sm text-gray-300" />
              <input type="url" value={portfolio.url} placeholder="URL"
                className="flex-grow h-9 rounded-md border border-gray-600 bg-[#2d2d2d] px-3 py-2 text-sm text-gray-300" />
              <input type="text" value={portfolio.description} placeholder="설명 (선택)"
                className="flex-grow h-9 rounded-md border border-gray-600 bg-[#2d2d2d] px-3 py-2 text-sm text-gray-300" />
              <button className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-sm">
                저장
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 최종 미리 보기 버튼 */}
      <div className="pt-4">
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-base font-medium">
          이력서 미리 보기
        </button>
      </div>
    </div>
  );
};

export default ResumeViewEdit;
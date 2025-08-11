// src/components/ui/userhome/ResumeClassicView.tsx
import React from "react";

type Education = { period?: string; school?: string; major?: string; degree?: string };
type Career = { period: string; company: string; role: string; summary?: string };
type Project = {
  title: string;
  period?: string;
  overview?: string;
  responsibilities?: string[];
  stack?: string[];
  result?: string | null;
  problem_solution?: string | null;
};
type Essay = { title: string; content: string };
type Cert = { date: string; name: string; score_or_grade?: string | null; issuer?: string | null };
type LinkItem = { label: string; url: string; note?: string | null };

type ClassicData = {
  category?: number;
  name?: string | null;
  phone?: string | null;
  email?: string | null;
  education?: Education[];
  skills?: {
    frontend?: string[];
    backend?: string[];
    database?: string[];
    devops?: string[];
    etc?: string[];
  };
  careers?: Career[];
  projects?: Project[];
  essays?: Essay[];
  certs?: Cert[];
  links?: LinkItem[];
};

type Props = {
  data: ClassicData;
  /** 부모에서 편집 토글을 연결하고 싶으면 전달 */
  onEdit?: () => void;
  /** 상단 액션(인쇄/편집 버튼) 표시 여부. 기본 false(부모에 버튼이 있으므로) */
  showActions?: boolean;
};

export default function ResumeClassicView({ data, onEdit, showActions = false }: Props) {
  const printPage = () => window.print();

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <div className="px-4 py-3 text-base font-bold text-slate-100">{children}</div>
  );

  const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="grid grid-cols-12 border-b border-slate-700/60 last:border-b-0">
      <div className="col-span-12 md:col-span-2 bg-slate-800/60 px-4 py-3 text-sm font-semibold text-slate-200">
        {label}
      </div>
      <div className="col-span-12 md:col-span-10 px-4 py-3 text-sm text-slate-100">{children}</div>
    </div>
  );

  const BulletList = ({ items }: { items?: string[] }) =>
    !items || items.length === 0 ? null : (
      <ul className="list-disc pl-5 space-y-1">
        {items.map((it, i) => (
          <li key={`${it}-${i}`} className="leading-6 text-slate-100">
            {it}
          </li>
        ))}
      </ul>
    );

  const Chip = ({ children }: { children: React.ReactNode }) => (
    <span className="rounded-full ring-1 ring-slate-700 bg-slate-800 px-2.5 py-0.5 text-xs text-slate-100">
      {children}
    </span>
  );

  const Empty = ({ text = "-" }: { text?: string }) => (
    <span className="text-slate-400">{text}</span>
  );

  return (
    <div className="w-full">
      {/* 카드 + 인쇄 최적화: 화면은 다크, 인쇄는 화이트 */}
      <div
        id="print-area"
        className="
          mx-auto w-full max-w-[980px] rounded-xl
          bg-[#1e1e1e] text-slate-100 shadow
          ring-1 ring-slate-700
          print:bg-white print:text-black print:shadow-none print:ring-0
        "
      >
        {/* 헤더바 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/60 print:hidden">
          <div className="text-lg font-semibold text-slate-100">이력서 확인/수정</div>
          {showActions && (
            <div className="flex gap-2">
              <button
                className="rounded-lg bg-slate-800 px-3 py-1.5 text-sm text-slate-100 hover:bg-slate-700"
                onClick={printPage}
                type="button"
              >
                이력서 파일 다운로드
              </button>
              <button
                onClick={onEdit}
                type="button"
                className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                이력서 수정
              </button>
            </div>
          )}
        </div>

        {/* 본문 */}
        <div className="divide-y divide-slate-700/60">
          {/* 기본 정보 */}
          <section>
            <Row label="이름">{data.name || <Empty />}</Row>
            <Row label="연락처">{data.phone || <Empty />}</Row>
            <Row label="이메일">{data.email || <Empty />}</Row>
            <Row label="학력">
              {!data.education || data.education.length === 0 ? (
                <Empty />
              ) : (
                <div className="space-y-2">
                  {data.education.map((e, i) => (
                    <div key={i} className="flex flex-wrap gap-x-3 text-sm">
                      {e.period && <span className="text-slate-300">{e.period}</span>}
                      {e.school && <span className="text-slate-100">{e.school}</span>}
                      {e.major && <span className="text-slate-400">/ {e.major}</span>}
                      {e.degree && <span className="text-slate-400">/ {e.degree}</span>}
                    </div>
                  ))}
                </div>
              )}
            </Row>
            <Row label="기술스택">
              <div className="space-y-2">
                {[
                  ["Frontend", data.skills?.frontend],
                  ["Backend", data.skills?.backend],
                  ["Database", data.skills?.database],
                  ["DevOps", data.skills?.devops],
                  ["기타", data.skills?.etc],
                ].map(([k, v]) =>
                  v && (v as string[]).length ? (
                    <div key={k as string} className="flex gap-3">
                      <span className="w-24 shrink-0 text-slate-400">{k}</span>
                      <div className="flex flex-wrap gap-2">
                        {(v as string[]).map((s, idx) => (
                          <Chip key={`${s}-${idx}`}>{s}</Chip>
                        ))}
                      </div>
                    </div>
                  ) : null
                )}
                {!data.skills && <Empty />}
              </div>
            </Row>
          </section>

          {/* 경력사항 */}
          <section>
            <SectionTitle>경력사항</SectionTitle>
            <div className="px-4 pb-4">
              {!data.careers || data.careers.length === 0 ? (
                <div className="text-sm text-slate-400 px-2 pb-4">경력이 없습니다.</div>
              ) : (
                <div className="space-y-4">
                  {data.careers.map((c, i) => (
                    <div
                      key={i}
                      className="rounded-lg border border-slate-700 bg-slate-900/40 p-4"
                    >
                      <div className="flex flex-wrap items-center gap-x-3">
                        {c.period && <span className="text-slate-300">{c.period}</span>}
                        <span className="font-semibold text-slate-100">{c.company}</span>
                        {c.role && <span className="text-slate-400">· {c.role}</span>}
                      </div>
                      {c.summary && (
                        <p className="mt-2 text-sm text-slate-200 leading-6">{c.summary}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* 경력기술서(프로젝트) */}
          <section>
            <SectionTitle>경력기술서</SectionTitle>
            <div className="px-4 pb-4 space-y-4">
              {!data.projects || data.projects.length === 0 ? (
                <div className="text-sm text-slate-400 px-2">등록된 프로젝트가 없습니다.</div>
              ) : (
                data.projects.map((p, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-slate-700 bg-slate-900/40 p-4 space-y-2"
                  >
                    <div className="flex flex-wrap items-center gap-x-3">
                      <h4 className="font-semibold text-slate-100">{p.title}</h4>
                      {p.period && <span className="text-slate-400">({p.period})</span>}
                    </div>
                    {p.overview && (
                      <div>
                        <div className="text-[13px] text-slate-400">프로젝트 개요</div>
                        <p className="text-sm leading-6 text-slate-200">{p.overview}</p>
                      </div>
                    )}
                    {p.responsibilities && p.responsibilities.length > 0 && (
                      <div>
                        <div className="text-[13px] text-slate-400">담당 역할/기여</div>
                        <BulletList items={p.responsibilities} />
                      </div>
                    )}
                    {p.stack && p.stack.length > 0 && (
                      <div>
                        <div className="text-[13px] text-slate-400">기술 스택</div>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {p.stack.map((s, idx) => (
                            <Chip key={`${s}-${idx}`}>{s}</Chip>
                          ))}
                        </div>
                      </div>
                    )}
                    {(p.result || p.problem_solution) && (
                      <div className="grid gap-2 md:grid-cols-2">
                        {p.result && (
                          <div>
                            <div className="text-[13px] text-slate-400">주요 성과</div>
                            <p className="text-sm leading-6 text-slate-200">{p.result}</p>
                          </div>
                        )}
                        {p.problem_solution && (
                          <div>
                            <div className="text-[13px] text-slate-400">문제 해결</div>
                            <p className="text-sm leading-6 text-slate-200">{p.problem_solution}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </section>

          {/* 자기소개서 */}
          <section>
            <SectionTitle>자기소개서</SectionTitle>
            <div className="px-4 pb-4 space-y-4">
              {!data.essays || data.essays.length === 0 ? (
                <div className="text-sm text-slate-400 px-2">등록된 자기소개가 없습니다.</div>
              ) : (
                data.essays.map((e, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-slate-700 bg-slate-900/40 p-4"
                  >
                    {e.title && (
                      <div className="font-semibold text-slate-100 mb-1">{e.title}</div>
                    )}
                    <p className="text-sm leading-6 whitespace-pre-wrap text-slate-200">
                      {e.content}
                    </p>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* 자격증/어학 + 포트폴리오 */}
          <section>
            <SectionTitle>자격증 / 어학</SectionTitle>
            <div className="px-4 pb-4">
              {!data.certs || data.certs.length === 0 ? (
                <div className="text-sm text-slate-400 px-2">등록된 항목이 없습니다.</div>
              ) : (
                <div className="space-y-2">
                  {data.certs.map((c, i) => (
                    <div key={i} className="flex flex-wrap gap-x-3 text-sm">
                      <span className="w-24 text-slate-300">{c.date}</span>
                      <span className="text-slate-100">{c.name}</span>
                      {c.score_or_grade && <span className="text-slate-400">· {c.score_or_grade}</span>}
                      {c.issuer && <span className="text-slate-400">· {c.issuer}</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <SectionTitle>포트폴리오/기타</SectionTitle>
            <div className="px-4 pb-6">
              {!data.links || data.links.length === 0 ? (
                <div className="text-sm text-slate-400 px-2">등록된 링크가 없습니다.</div>
              ) : (
                <div className="space-y-2">
                  {data.links.map((l, i) => (
                    <div key={i} className="flex flex-wrap gap-3 text-sm">
                      <span className="w-24 text-slate-300">{l.label}</span>
                      <a
                        className="text-indigo-400 underline break-all hover:text-indigo-300"
                        href={l.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {l.url}
                      </a>
                      {l.note && <span className="text-slate-400">· {l.note}</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* 인쇄 가이드 */}
      <div className="mt-3 text-center text-xs text-slate-500 print:hidden">
        * 브라우저 인쇄에서 “PDF로 저장”을 선택하세요.
      </div>
    </div>
  );
}

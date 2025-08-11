// src/components/ui/userhome/ResumeUpload.tsx
// 개인회원 - 이력서 관리 - 이력서 업로드
import { useState } from "react";

type DocKey = "resume" | "career" | "selfIntro" | "portfolio";
type Mode = "upload" | "github";
type UploadState = "idle" | "loading" | "success" | "error";

const API_URL = "http://localhost:4000/users/user/application-docs";

const ResumeUpload = () => {
  // ── 기존 기술스택 로직 유지 ───────────────────────────────
  const [techStackInput, setTechStackInput] = useState<string>("");
  const [techStacks, setTechStacks] = useState<string[]>([
    "Front-end",
    "Python",
    "HTML",
    "CSS",
    "React",
    "JavaScript",
  ]);

  const handleAddTechStack = () => {
    if (techStackInput.trim() && !techStacks.includes(techStackInput.trim())) {
      setTechStacks((s) => [...s, techStackInput.trim()]);
      setTechStackInput("");
    }
  };
  const handleRemoveTechStack = (t: string) =>
    setTechStacks((s) => s.filter((x) => x !== t));

  // ── 업로드/URL 모드 & 파일/URL 상태 ──────────────────────
  const [mode, setMode] = useState<Record<DocKey, Mode>>({
    resume: "upload",
    career: "upload",
    selfIntro: "upload",
    portfolio: "upload",
  });
  const [files, setFiles] = useState<Record<DocKey, File | null>>({
    resume: null,
    career: null,
    selfIntro: null,
    portfolio: null,
  });
  const [urls, setUrls] = useState<Record<DocKey, string>>({
    resume: "",
    career: "",
    selfIntro: "",
    portfolio: "",
  });

  // ── 엔드포인트 스펙용 텍스트 필드 ─────────────────────────
  const [resumeText, setResumeText] = useState("");
  const [selfIntroText, setSelfIntroText] = useState("");
  const [careerDescText, setCareerDescText] = useState("");

  // ── 상태/토큰 ─────────────────────────────────────────────
  const [status, setStatus] = useState<UploadState>("idle");
  const [msg, setMsg] = useState("");
  const token = (typeof window !== "undefined" && localStorage.getItem("access_token")) || "";

  // ── 제출(엔드포인트 호출) ─────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMsg("");

    try {
      if (!token) throw new Error("로그인이 필요합니다. access_token 이 없습니다.");

      // 이력서 파일은 업로드 필수(프로덕트 정책 기준)
      if (mode.resume === "upload" && !files.resume) {
        throw new Error("이력서 PDF를 선택해 주세요.");
      }

      const form = new FormData();
      // 텍스트 필드(비워도 서버가 허용한다면 그대로 전송)
      form.append("resumeText", resumeText);
      form.append("selfIntroText", selfIntroText);
      form.append("careerDescText", careerDescText);

      // 파일 필드: 선택된 경우만 첨부
      if (mode.resume === "upload" && files.resume)
        form.append("resumeFile", files.resume, files.resume.name);
      if (mode.selfIntro === "upload" && files.selfIntro)
        form.append("selfIntroFile", files.selfIntro, files.selfIntro.name);
      if (mode.career === "upload" && files.career)
        form.append("careerDescFile", files.career, files.career.name);

      // 포트폴리오/URL/스택은 현재 엔드포인트 스펙에 없음 → 전송 제외
      // TODO: 별도 API 확정되면 여기서 함께 FormData/JSON 구성

      const res = await fetch(API_URL, {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          // ⚠️ Content-Type 수동 지정 금지 (FormData boundary 자동)
        },
        body: form,
      });

      const isJSON = res.headers.get("content-type")?.includes("application/json");
      const data = isJSON ? await res.json() : await res.text();

      if (!res.ok) {
        throw new Error(
          typeof data === "string" ? data : data?.message || `업로드 실패 (${res.status})`
        );
      }

      setStatus("success");
      setMsg(typeof data === "string" ? data : data?.message || "업로드 성공!");
    } catch (err: any) {
      setStatus("error");
      setMsg(err?.message || "업로드 중 오류가 발생했습니다.");
    }
  };

  // ── 이력서 PDF 미리보기 ───────────────────────────────────
  const handlePreviewResume = () => {
    const f = files.resume;
    if (!f) {
      setStatus("error");
      setMsg("미리보기할 이력서 PDF가 없습니다.");
      return;
    }
    const url = URL.createObjectURL(f);
    window.open(url, "_blank", "noopener,noreferrer");
    // 메모리 해제는 창이 닫히면 브라우저가 정리함. 필요 시 setTimeout으로 revoke 가능.
  };

  const DOCS: { key: DocKey; label: string; required: boolean }[] = [
    { key: "resume", label: "이력서", required: true },
    { key: "career", label: "경력기술서", required: true },
    { key: "selfIntro", label: "자기소개서", required: true },
    { key: "portfolio", label: "포트폴리오", required: false },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-8 text-white">
      {/* 업로드 섹션 */}
      {DOCS.map((doc) => (
        <div key={doc.key} className="space-y-2">
          <label className="text-sm font-medium">
            {doc.label}{" "}
            {doc.required && <span className="text-red-500">*required</span>}
          </label>

          {/* 파일/URL 스위치 */}
          <div className="flex space-x-4 pt-2">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id={`${doc.key}-upload`}
                name={`${doc.key}-option`}
                value="upload"
                checked={mode[doc.key] === "upload"}
                onChange={() => setMode((m) => ({ ...m, [doc.key]: "upload" }))}
                className="appearance-none h-4 w-4 rounded-full border border-gray-400 checked:bg-blue-500 checked:border-blue-500
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor={`${doc.key}-upload`} className="text-sm">
                파일 업로드
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id={`${doc.key}-github`}
                name={`${doc.key}-option`}
                value="github"
                checked={mode[doc.key] === "github"}
                onChange={() => setMode((m) => ({ ...m, [doc.key]: "github" }))}
                // 현재 API는 파일만 처리 → 포트폴리오만 URL 허용, 나머지는 비활성화
                disabled={doc.key !== "portfolio"}
                className="appearance-none h-4 w-4 rounded-full border border-gray-400 checked:bg-blue-500 checked:border-blue-500
                           focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-40"
              />
              <label htmlFor={`${doc.key}-github`} className="text-sm">
                GitHub URL
                {doc.key !== "portfolio" && (
                  <span className="ml-1 text-xs text-gray-400">
                    (현재 이 항목은 미지원)
                  </span>
                )}
              </label>
            </div>
          </div>

          {/* 값 입력 영역 */}
          {mode[doc.key] === "upload" ? (
            <div className="flex items-center space-x-2">
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) =>
                  setFiles((f) => ({ ...f, [doc.key]: e.target.files?.[0] ?? null }))
                }
                className="flex-grow h-10 w-full rounded-md border border-gray-600 bg-[#1f1f1f] px-3 py-2 text-sm text-gray-300
                           focus:outline-none focus:ring-2 focus:ring-blue-500 file:border-0 file:bg-transparent
                           file:text-sm file:font-medium file:text-gray-300"
                required={doc.key === "resume"} // 이력서만 강제
              />
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <input
                placeholder="https://github.com/yourname/portfolio"
                value={urls[doc.key]}
                onChange={(e) =>
                  setUrls((u) => ({ ...u, [doc.key]: e.target.value }))
                }
                className="flex-grow h-10 w-full rounded-md border border-gray-600 bg-[#1f1f1f] px-3 py-2 text-sm text-gray-300
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>
      ))}

      {/* 텍스트 입력(선택) - 엔드포인트 전송 필드 */}
      <div className="space-y-2">
        <label className="text-sm font-medium">텍스트 입력(선택)</label>
        <div className="grid gap-3 md:grid-cols-3">
          <textarea
            placeholder="이력서 요약 (resumeText)"
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            className="h-28 w-full rounded-md border border-gray-600 bg-[#1f1f1f] p-3 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            placeholder="자기소개 (selfIntroText)"
            value={selfIntroText}
            onChange={(e) => setSelfIntroText(e.target.value)}
            className="h-28 w-full rounded-md border border-gray-600 bg-[#1f1f1f] p-3 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            placeholder="경력 기술 (careerDescText)"
            value={careerDescText}
            onChange={(e) => setCareerDescText(e.target.value)}
            className="h-28 w-full rounded-md border border-gray-600 bg-[#1f1f1f] p-3 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <p className="text-xs text-gray-400">
          ※ 현재 API는 <b>이력서/자기소개/경력기술</b>의 PDF 파일 + 위 텍스트만 처리합니다. 포트폴리오/URL/스택은 별도 저장 대상입니다.
        </p>
      </div>

      {/* 기술스택 입력 섹션 (기존 로직 유지) */}
      <div>
        <label className="text-sm font-medium">
          기술스택 <span className="text-red-500">*required</span>
        </label>
        <div className="flex space-x-2 mt-2">
          <input
            placeholder="입력"
            className="w-[200px] h-10 rounded-md border border-gray-600 bg-[#1f1f1f] px-3 py-2 text-sm text-gray-300
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={techStackInput}
            onChange={(e) => setTechStackInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddTechStack();
              }
            }}
          />
          <button
            type="button"
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
                type="button"
                onClick={() => handleRemoveTechStack(stack)}
                className="text-xs text-gray-400 hover:text-red-500 focus:outline-none"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 액션 버튼 */}
      <div className="grid gap-3 md:grid-cols-2">
        <button
          type="button"
          onClick={handlePreviewResume}
          className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md text-base font-medium
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          이력서 미리 보기
        </button>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-base font-medium
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          업로드 실행
        </button>
      </div>

      {/* 응답 메시지 */}
      {status !== "idle" && (
        <div
          className={[
            "rounded-md border p-3 text-sm",
            status === "success"
              ? "border-emerald-300 bg-emerald-900/20 text-emerald-200"
              : status === "error"
                ? "border-rose-300 bg-rose-900/20 text-rose-200"
                : "border-gray-600 bg-[#1b1b1b] text-gray-300",
          ].join(" ")}
        >
          {msg || (status === "loading" ? "전송 중..." : "")}
        </div>
      )}
    </form>
  );
};

export default ResumeUpload;

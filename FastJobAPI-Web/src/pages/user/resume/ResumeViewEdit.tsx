// src/components/ui/userhome/ResumeViewEdit.tsx
// 개인회원 - 이력서 관리 - 이력서 확인/수정
import React, { useEffect, useMemo, useState } from "react";
import api from "../../../lib/axios"; // 경로는 프로젝트 구조에 맞게 조정

type LoadState = "idle" | "loading" | "success" | "error";
type SaveState = "idle" | "saving" | "success" | "error";

type DocsResponse = {
  resumeText?: string | null;
  selfIntroText?: string | null;
  careerDescText?: string | null;
  resumeFileUrl?: string | null;
  selfIntroFileUrl?: string | null;
  careerDescFileUrl?: string | null;
  updatedAt?: string | null;
  // 필요 시 추가 필드
};

export default function ResumeViewEdit() {
  // ─────────────────────────────────────────────────────────
  // 상태: 로드/저장
  const [loadState, setLoadState] = useState<LoadState>("idle");
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [msg, setMsg] = useState<string>("");

  // ─────────────────────────────────────────────────────────
  // 텍스트 상태
  const [resumeText, setResumeText] = useState("");
  const [selfIntroText, setSelfIntroText] = useState("");
  const [careerDescText, setCareerDescText] = useState("");

  // 서버에 저장된 파일 URL (읽기용)
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [selfIntroUrl, setSelfIntroUrl] = useState<string | null>(null);
  const [careerDescUrl, setCareerDescUrl] = useState<string | null>(null);

  // 교체용 신규 파일(선택 시에만 PATCH 전송)
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [selfIntroFile, setSelfIntroFile] = useState<File | null>(null);
  const [careerDescFile, setCareerDescFile] = useState<File | null>(null);

  // 마지막 업데이트 시각 표시용
  const updatedLabel = useMemo(() => {
    if (!resumeUrl && !selfIntroUrl && !careerDescUrl) return "";
    return "첨부 파일이 존재합니다.";
  }, [resumeUrl, selfIntroUrl, careerDescUrl]);

  // ─────────────────────────────────────────────────────────
  // 초기 로드
  useEffect(() => {
    let isMounted = true;
    const run = async () => {
      setLoadState("loading");
      setMsg("");
      try {
        const res = await api.get<DocsResponse>("/users/user/application-docs", {
          // 캐시 방지(선택)
          headers: { "Cache-Control": "no-cache" },
        });

        const data = mapLoadedData(res.data);
        if (!isMounted) return;

        setResumeText(data.resumeText ?? "");
        setSelfIntroText(data.selfIntroText ?? "");
        setCareerDescText(data.careerDescText ?? "");

        setResumeUrl(data.resumeFileUrl ?? null);
        setSelfIntroUrl(data.selfIntroFileUrl ?? null);
        setCareerDescUrl(data.careerDescFileUrl ?? null);

        setLoadState("success");
      } catch (err: any) {
        if (!isMounted) return;
        // 404 등은 빈 상태로 이어감
        setLoadState("error");
        setMsg(err?.response?.data?.message || "문서를 불러오지 못했습니다. 새로 작성해 저장할 수 있어요.");
      }
    };
    run();
    return () => {
      isMounted = false;
    };
  }, []);

  // 서버 응답 키가 다를 수 있으니 여기서 매핑
  function mapLoadedData(d: DocsResponse): DocsResponse {
    // 필요 시 변환 로직 추가
    return {
      resumeText: d.resumeText ?? "",
      selfIntroText: d.selfIntroText ?? "",
      careerDescText: d.careerDescText ?? "",
      resumeFileUrl: d.resumeFileUrl ?? null,
      selfIntroFileUrl: d.selfIntroFileUrl ?? null,
      careerDescFileUrl: d.careerDescFileUrl ?? null,
      updatedAt: d.updatedAt ?? null,
    };
  }

  // ─────────────────────────────────────────────────────────
  // 저장(PATCH)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveState("saving");
    setMsg("");
    try {
      const form = new FormData();
      form.append("resumeText", resumeText);
      form.append("selfIntroText", selfIntroText);
      form.append("careerDescText", careerDescText);

      // 파일은 "선택했을 때만" 보냄 → 안 보내면 기존 파일 유지
      if (resumeFile) form.append("resumeFile", resumeFile, resumeFile.name);
      if (selfIntroFile) form.append("selfIntroFile", selfIntroFile, selfIntroFile.name);
      if (careerDescFile) form.append("careerDescFile", careerDescFile, careerDescFile.name);

      const res = await api.patch("/users/user/application-docs", form, {
        // 절대 Content-Type 지정하지 말 것(FormData boundary 자동)
      });

      // 성공 시 파일 URL을 갱신하려면 서버에서 최신 URL을 주는 게 베스트
      // 여기서는 성공 메시지 후 다시 GET으로 동기화
      await reloadAfterSave();

      setSaveState("success");
      setMsg(res.data?.message || "저장되었습니다.");
    } catch (err: any) {
      setSaveState("error");
      setMsg(err?.response?.data?.message || "저장 중 오류가 발생했습니다.");
    }
  };

  const reloadAfterSave = async () => {
    try {
      const res = await api.get<DocsResponse>("/users/user/application-docs", {
        headers: { "Cache-Control": "no-cache" },
      });
      const data = mapLoadedData(res.data);
      setResumeUrl(data.resumeFileUrl ?? null);
      setSelfIntroUrl(data.selfIntroFileUrl ?? null);
      setCareerDescUrl(data.careerDescFileUrl ?? null);

      // 새 파일 선택값 초기화
      setResumeFile(null);
      setSelfIntroFile(null);
      setCareerDescFile(null);
    } catch {
      // 무시 (네트워크 이슈 시 기존 표시 유지)
    }
  };

  // ─────────────────────────────────────────────────────────
  // 미리보기(새 파일이면 Blob URL, 아니면 서버 URL)
  const openPreview = (kind: "resume" | "selfIntro" | "career") => {
    const file = kind === "resume" ? resumeFile : kind === "selfIntro" ? selfIntroFile : careerDescFile;
    const url = kind === "resume" ? resumeUrl : kind === "selfIntro" ? selfIntroUrl : careerDescUrl;

    if (file) {
      const obj = URL.createObjectURL(file);
      window.open(obj, "_blank", "noopener,noreferrer");
      // 필요시 setTimeout(() => URL.revokeObjectURL(obj), 5000);
      return;
    }
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
      return;
    }
    setSaveState("error");
    setMsg("미리보기할 파일이 없습니다.");
  };

  // ─────────────────────────────────────────────────────────
  // UI
  return (
    <div className="space-y-6 p-6 text-white bg-[#2d2d2d] rounded-b-md">
      {/* 헤더 */}
      <div className="flex items-center justify-between border-b border-gray-600 pb-4 mb-4">
        <h3 className="text-xl font-bold">이력서 확인 / 수정</h3>
        <div className="flex items-center gap-2 text-xs text-gray-300">
          {updatedLabel && <span className="rounded bg-gray-700 px-2 py-1">{updatedLabel}</span>}
        </div>
      </div>

      {/* 로드 상태 메시지 */}
      {loadState === "loading" && (
        <div className="rounded-md border border-gray-600 bg-[#1b1b1b] p-3 text-sm text-gray-300">불러오는 중...</div>
      )}
      {loadState === "error" && (
        <div className="rounded-md border border-amber-400 bg-amber-900/30 p-3 text-sm text-amber-200">{msg}</div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* 텍스트(요약/자기소개/경력기술) */}
        <section className="space-y-3">
          <h4 className="text-lg font-bold">문서 텍스트</h4>
          <div className="grid gap-3 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm text-gray-300">이력서 요약 (resumeText)</label>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                rows={8}
                className="w-full rounded-md border border-gray-600 bg-[#1f1f1f] p-3 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-300">자기소개 (selfIntroText)</label>
              <textarea
                value={selfIntroText}
                onChange={(e) => setSelfIntroText(e.target.value)}
                rows={8}
                className="w-full rounded-md border border-gray-600 bg-[#1f1f1f] p-3 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-gray-300">경력기술 (careerDescText)</label>
              <textarea
                value={careerDescText}
                onChange={(e) => setCareerDescText(e.target.value)}
                rows={8}
                className="w-full rounded-md border border-gray-600 bg-[#1f1f1f] p-3 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </section>

        {/* 첨부 파일 섹션 */}
        <section className="space-y-3 border-t border-gray-700 pt-4">
          <h4 className="text-lg font-bold">첨부 파일</h4>

          {/* 이력서 */}
          <FileRow
            title="이력서 PDF"
            currentUrl={resumeUrl}
            onPreview={() => openPreview("resume")}
          >
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setResumeFile(e.target.files?.[0] ?? null)}
              className="block w-full cursor-pointer rounded-md border border-gray-600 bg-[#1f1f1f] p-2 text-sm text-gray-300 file:mr-3 file:rounded file:border-0 file:bg-blue-600 file:px-3 file:py-1.5 file:text-white hover:file:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </FileRow>

          {/* 자기소개서 */}
          <FileRow
            title="자기소개서 PDF"
            currentUrl={selfIntroUrl}
            onPreview={() => openPreview("selfIntro")}
          >
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setSelfIntroFile(e.target.files?.[0] ?? null)}
              className="block w-full cursor-pointer rounded-md border border-gray-600 bg-[#1f1f1f] p-2 text-sm text-gray-300 file:mr-3 file:rounded file:border-0 file:bg-blue-600 file:px-3 file:py-1.5 file:text-white hover:file:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </FileRow>

          {/* 경력기술서 */}
          <FileRow
            title="경력기술서 PDF"
            currentUrl={careerDescUrl}
            onPreview={() => openPreview("career")}
          >
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setCareerDescFile(e.target.files?.[0] ?? null)}
              className="block w-full cursor-pointer rounded-md border border-gray-600 bg-[#1f1f1f] p-2 text-sm text-gray-300 file:mr-3 file:rounded file:border-0 file:bg-blue-600 file:px-3 file:py-1.5 file:text-white hover:file:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </FileRow>

          <p className="text-xs text-gray-400">
            * 새 파일을 선택하지 않으면 기존 파일이 유지됩니다. 파일 삭제 기능이 필요하면 백엔드 스펙에 맞춰
            <code className="mx-1 rounded bg-gray-800 px-1 py-0.5">clearXXX=true</code> 같은 플래그를 추가해 드릴게요.
          </p>
        </section>

        {/* 액션 버튼 + 저장 결과 */}
        <section className="space-y-3 border-t border-gray-700 pt-4">
          <div className="flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center">
            <button
              type="submit"
              disabled={saveState === "saving"}
              className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saveState === "saving" ? "저장 중..." : "저장하기"}
            </button>

            <div className="grow" />

            <button
              type="button"
              onClick={() => openPreview("resume")}
              className="inline-flex items-center justify-center rounded-md bg-gray-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-600"
            >
              이력서 미리보기
            </button>
          </div>

          {(saveState === "success" || saveState === "error") && (
            <div
              className={[
                "rounded-md border p-3 text-sm",
                saveState === "success"
                  ? "border-emerald-300 bg-emerald-900/20 text-emerald-200"
                  : "border-rose-300 bg-rose-900/20 text-rose-200",
              ].join(" ")}
            >
              {msg}
            </div>
          )}
        </section>
      </form>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// 하위 컴포넌트: 파일 행
function FileRow({
  title,
  currentUrl,
  onPreview,
  children,
}: {
  title: string;
  currentUrl: string | null;
  onPreview: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2 rounded-md border border-gray-700 bg-[#1f1f1f] p-4">
      <div className="flex items-center justify-between">
        <h5 className="text-sm font-semibold">{title}</h5>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPreview}
            className="rounded-md bg-gray-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-gray-600"
          >
            미리보기
          </button>
          {currentUrl && (
            <a
              href={currentUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-md bg-gray-800 px-3 py-1.5 text-xs font-semibold text-blue-200 underline hover:bg-gray-700"
            >
              원본 열기
            </a>
          )}
        </div>
      </div>
      <div>{children}</div>
      {currentUrl ? (
        <p className="text-xs text-gray-400">현재 파일이 저장되어 있습니다.</p>
      ) : (
        <p className="text-xs text-gray-500">저장된 파일이 없습니다. 새 파일을 선택해 업로드하세요.</p>
      )}
    </div>
  );
}

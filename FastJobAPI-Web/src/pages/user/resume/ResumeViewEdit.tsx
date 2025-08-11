// src/pages/user/resume/ResumeViewEdit.tsx
// 개인회원 - 이력서 관리 - 이력서 확인/수정
import React, { useEffect, useMemo, useState } from "react";
import api from "../../../lib/axios";
import ResumeClassicView from "./ResumeClassicView"; // 정형 이력서 뷰

/** ===== API 엔드포인트 =====
 *  백엔드 스펙에 맞게 필요시 수정하세요.
 */
const PROFILE_PATCH_URL = "/users/me"; // 예) /users/user/profile 로 쓰시면 여기만 바꾸세요.
const DOCS_PATCH_URL = "/users/user/application-docs";

/** ===== 타입 ===== */
type LoadState = "idle" | "loading" | "success" | "error";
type SaveState = "idle" | "saving" | "success" | "error";

/** 서버의 GET /users/me 응답 형태(예시) */
type UserMeResponse = {
  data?: {
    category?: number;
    resume?: string | null; // 문장 or JSON 문자열
    self_intro?: string | null; // 문장 or JSON 문자열
    career_desc?: string | null; // 문장 or JSON 문자열
    name?: string | null;
    email?: string | null;
    phone?: string | null;
    resumeFileUrl?: string | null;
    selfIntroFileUrl?: string | null;
    careerDescFileUrl?: string | null;
    ai?: {
      status?: "idle" | "processing" | "done" | "error";
      resumeSummary?: string | null;
      selfIntro?: string | null;
      careerHighlights?: string | null;
    } | null;
  };
  skills?: string[];
};

/** 레거시 호환 */
type LegacyDocsResponse = {
  resumeText?: string | null;
  selfIntroText?: string | null;
  careerDescText?: string | null;
  resumeFileUrl?: string | null;
  selfIntroFileUrl?: string | null;
  careerDescFileUrl?: string | null;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  ai?: {
    status?: "idle" | "processing" | "done" | "error";
    resumeSummary?: string | null;
    selfIntro?: string | null;
    careerHighlights?: string | null;
  } | null;
};

/** 정형 이력서 스키마(ResumeClassicView에 맞춤) */
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

/** ===== 유틸 ===== */
// JSON 문자열 형태인지 대략 감지 (객체/배열 시작)
const looksLikeJson = (t?: string | null) => !!t && /^\s*[\[{]/.test(t.trim());

// 코드펜스/이스케이프 제거
const stripCodeFences = (src: string) =>
  src.trim().replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();

// 서버가 문장형에 섞어 보낸 비-자기소개 헤더 블록 제거(자격증/링크/어학 등)
const stripNonIntroBlocks = (text?: string | null) => {
  if (!text) return "";
  const t = text.replace(/\\n/g, "\n");
  const lines = t.split(/\r?\n/);
  const isNonIntroHead = (ln: string) =>
    /^(자격증|어학|Certificates?|Certifications?|포트폴리오|링크|Links?)\b/i.test(ln.trim());
  const out: string[] = [];
  let skipping = false;
  for (const raw of lines) {
    const ln = raw.trim();
    if (isNonIntroHead(ln)) {
      skipping = true;
      continue;
    }
    if (skipping && ln === "") {
      skipping = false;
      continue;
    }
    if (!skipping) out.push(raw);
  }
  return out.join("\n").trim();
};

// 문자열이 JSON처럼 보이면 안전 파싱 (코드펜스/이스케이프/이중인코딩 처리 + {data:{}} 펼치기)
const tryParseJSON = (src?: string | null): any | null => {
  if (!src || typeof src !== "string") return null;
  let s = stripCodeFences(src).replace(/\\n/g, "\n");

  // 이중 인코딩 케이스: "{ ... }"
  const maybeDoubleEncoded = s.startsWith('"{') && s.endsWith('}"');
  if (maybeDoubleEncoded) s = s.slice(1, -1).replace(/\\"/g, '"');

  const parse = (text: string) => {
    const obj = JSON.parse(text);
    return obj && typeof obj === "object" && "data" in obj ? (obj as any).data : obj;
  };

  try {
    return parse(s);
  } catch {
    // 한 번 더 감싼 문자열
    if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
      const inner = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\'/g, "'");
      try {
        return parse(inner);
      } catch {
        return null;
      }
    }
    return null;
  }
};

export default function ResumeViewEdit() {
  // 상태
  const [loadState, setLoadState] = useState<LoadState>("idle");
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [msg, setMsg] = useState("");

  // 프로필 편집 상태
  const [profileSaveState, setProfileSaveState] = useState<SaveState>("idle");
  const [nameEdit, setNameEdit] = useState("");
  const [emailEdit, setEmailEdit] = useState("");
  const [phoneEdit, setPhoneEdit] = useState("");

  // 보기/편집 토글
  const [editing, setEditing] = useState(false);

  // 표시/편집용 텍스트 상태
  const [resumeText, setResumeText] = useState("");
  const [selfIntroText, setSelfIntroText] = useState("");
  const [careerDescText, setCareerDescText] = useState("");

  // 메타
  const [name, setName] = useState<string | undefined>();
  const [email, setEmail] = useState<string | undefined>();
  const [phone, setPhone] = useState<string | undefined>();

  // 파일 URL/교체 파일
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [selfIntroUrl, setSelfIntroUrl] = useState<string | null>(null);
  const [careerDescUrl, setCareerDescUrl] = useState<string | null>(null);

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [selfIntroFile, setSelfIntroFile] = useState<File | null>(null);
  const [careerDescFile, setCareerDescFile] = useState<File | null>(null);

  const updatedLabel = useMemo(() => {
    if (!resumeUrl && !selfIntroUrl && !careerDescUrl) return "";
    return "첨부 파일이 존재합니다.";
  }, [resumeUrl, selfIntroUrl, careerDescUrl]);

  /** 다양한 서버 응답을 하나로 정규화 */
  const normalize = (raw: any) => {
    const root = raw?.data ?? raw?.user ?? raw?.profile ?? raw ?? {};
    const ai = root.ai ?? raw?.ai ?? null;

    // 문장형을 선호(있으면 그걸로), 없으면 가장 긴 값 선택
    const pickPreferPlain = (...vals: (string | null | undefined)[]) => {
      const cleaned = vals.map((v) => (v ?? "").trim()).filter(Boolean);
      const plains = cleaned.filter((v) => !looksLikeJson(v));
      const pool = plains.length ? plains : cleaned;
      return pool.sort((a, b) => b.length - a.length)[0] || "";
    };

    return {
      name: root.name ?? raw?.name ?? null,
      email: root.email ?? raw?.email ?? null,
      phone: root.phone ?? raw?.phone ?? null,
      resumeText: String(
        pickPreferPlain(root.resume, raw?.resume, raw?.resumeText, root.resumeText, ai?.resumeSummary)
      ),
      selfIntroText: String(
        pickPreferPlain(root.self_intro, raw?.self_intro, raw?.selfIntroText, root.selfIntroText, ai?.selfIntro)
      ),
      careerDescText: String(
        pickPreferPlain(
          root.career_desc,
          raw?.career_desc,
          raw?.careerDescText,
          root.careerDescText,
          ai?.careerHighlights
        )
      ),
      resumeFileUrl: root.resumeFileUrl ?? raw?.resumeFileUrl ?? null,
      selfIntroFileUrl: root.selfIntroFileUrl ?? raw?.selfIntroFileUrl ?? null,
      careerDescFileUrl: root.careerDescFileUrl ?? raw?.careerDescFileUrl ?? null,
    };
  };

  // 초기 로드: GET /users/me
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoadState("loading");
      setMsg("");
      try {
        const res = await api.get<UserMeResponse | LegacyDocsResponse>("/users/me", {
          headers: { "Cache-Control": "no-cache" },
        });
        const raw: any = res.data;
        if (!mounted) return;
        const n = normalize(raw);

        // 상태 반영
        setResumeText(n.resumeText);
        setSelfIntroText(n.selfIntroText);
        setCareerDescText(n.careerDescText);

        setName(n.name ?? undefined);
        setEmail(n.email ?? undefined);
        setPhone(n.phone ?? undefined);

        setNameEdit(n.name ?? "");
        setEmailEdit(n.email ?? "");
        setPhoneEdit(n.phone ?? "");

        setResumeUrl(n.resumeFileUrl);
        setSelfIntroUrl(n.selfIntroFileUrl);
        setCareerDescUrl(n.careerDescFileUrl);

        setLoadState("success");
      } catch (e: any) {
        if (!mounted) return;
        setLoadState("error");
        setMsg(e?.response?.data?.message || "프로필을 불러오지 못했습니다.");
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // 문서 저장(PATCH 그대로 유지)
  const handleSave = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setSaveState("saving");
    setMsg("");
    try {
      const form = new FormData();
      form.append("resumeText", resumeText);
      form.append("selfIntroText", selfIntroText);
      form.append("careerDescText", careerDescText);
      if (resumeFile) form.append("resumeFile", resumeFile, resumeFile.name);
      if (selfIntroFile) form.append("selfIntroFile", selfIntroFile, selfIntroFile.name);
      if (careerDescFile) form.append("careerDescFile", careerDescFile, careerDescFile.name);

      const res = await api.patch(DOCS_PATCH_URL, form);
      await reloadAfterSave();
      setSaveState("success");
      setMsg(res.data?.message || "저장되었습니다.");
      setEditing(false);
    } catch (err: any) {
      setSaveState("error");
      setMsg(err?.response?.data?.message || "저장 중 오류가 발생했습니다.");
    }
  };

  // 프로필 저장(이름/이메일/연락처)
  const handleSaveProfile = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setProfileSaveState("saving");
    setMsg("");
    try {
      await api.patch(PROFILE_PATCH_URL, {
        name: nameEdit || null,
        email: emailEdit || null,
        phone: phoneEdit || null,
      });

      // 화면 상태 동기화
      setName(nameEdit || undefined);
      setEmail(emailEdit || undefined);
      setPhone(phoneEdit || undefined);

      setProfileSaveState("success");
      setMsg("프로필이 저장되었습니다.");
    } catch (err: any) {
      setProfileSaveState("error");
      setMsg(err?.response?.data?.message || "프로필 저장 중 오류가 발생했습니다.");
    }
  };

  const reloadAfterSave = async () => {
    try {
      const res = await api.get<UserMeResponse>("/users/me", {
        headers: { "Cache-Control": "no-cache" },
      });
      const n = normalize(res.data);
      setResumeUrl(n.resumeFileUrl);
      setSelfIntroUrl(n.selfIntroFileUrl);
      setCareerDescUrl(n.careerDescFileUrl);
      setResumeFile(null);
      setSelfIntroFile(null);
      setCareerDescFile(null);
    } catch {
      /* ignore */
    }
  };

  // JSON/문장 → 정형 스키마로 통합
  const classicData: ClassicData = useMemo(() => {
    const r = tryParseJSON(resumeText);
    const s = tryParseJSON(selfIntroText);
    const c = tryParseJSON(careerDescText);

    const pickString = (...cands: (string | null | undefined)[]) => {
      for (const v of cands) {
        const t = (v ?? "").toString().trim();
        if (!t) continue;
        if (t.toLowerCase() === "null" || t.toLowerCase() === "undefined") continue;
        return t;
      }
      return null;
    };
    const normalizePhone = (v?: string | null) => {
      if (!v) return null;
      const t = v.replace(/[^\d+\-()\s]/g, "").trim();
      return t || null;
    };
    const pickPhone = (...cands: (string | null | undefined)[]) =>
      normalizePhone(pickString(...cands));

    // 프로필(name/email/phone) 우선 → 문서(r/s/c) 폴백
    const nameFinal = pickString(name, r?.name, s?.name, c?.name);
    const emailFinal = pickString(email, r?.email, s?.email, c?.email);
    const phoneFinal = pickPhone(phone, r?.phone, s?.phone, c?.phone);

    // careers/experiences 둘 다 지원
    type Exp = { company?: string; role?: string; period?: string; highlights?: string[]; summary?: string };
    const collectExp = (x: any): Exp[] =>
      Array.isArray(x?.careers) ? x.careers : Array.isArray(x?.experiences) ? x.experiences : [];

    const rawExps: Exp[] = [...collectExp(r), ...collectExp(s), ...collectExp(c)];

    const careers: Career[] = rawExps
      .map((e) => ({
        period: e?.period || "",
        company: e?.company || "",
        role: e?.role || "",
        summary: e?.summary ?? (e?.highlights?.length ? e.highlights.join(" · ") : undefined),
      }))
      .filter((e) => e.company || e.role || e.period);

    // skills: 객체/배열 모두 지원
    const asSkillsObject = (sk: any): ClassicData["skills"] | undefined => {
      if (!sk) return undefined;
      if (Array.isArray(sk)) return { etc: sk };
      if (typeof sk === "object") {
        const arr = (a: any) => (Array.isArray(a) ? a : undefined);
        return {
          frontend: arr(sk.frontend),
          backend: arr(sk.backend),
          database: arr(sk.database),
          devops: arr(sk.devops),
          etc: arr(sk.etc),
        };
      }
      return undefined;
    };

    const skillsObj =
      asSkillsObject(r?.skills) ?? asSkillsObject(s?.skills) ?? asSkillsObject(c?.skills);

    // 배열 합류 유틸
    const firstArr = <T,>(...cands: any[]): T[] => (cands.find((x) => Array.isArray(x)) as T[]) || [];

    // ===== 에세이(자기소개) 구성 =====
    // 1) JSON이 있으면 s.essays → r.essays → c.essays 순서로 사용
    const essaysFromJsonRaw = (() => {
      const arr = firstArr<Essay>(s?.essays, r?.essays, c?.essays);
      return Array.isArray(arr) ? arr : [];
    })();

    const essaysFromJson = essaysFromJsonRaw
      .map((e: any) => {
        const title = (e?.title ?? "").toString().trim();
        const content = (e?.content ?? "").toString();
        if (title || content.trim()) return { title: title || "자기소개", content };
        return null;
      })
      .filter(Boolean) as Essay[];

    // 2) JSON이 비어있다면 s(파싱)에서 소개성 텍스트 후보 추출
    const pickFirstString = (...vals: any[]) => {
      for (const v of vals) if (typeof v === "string" && v.trim()) return v.trim();
      return "";
    };
    const selfIntroCandidateFromJson = pickFirstString(
      s?.intro,
      s?.summary,
      s?.overview,
      s?.description,
      s?.selfIntro,
      s?.about
    );

    // 3) 문장형 폴백 (자격증/링크 같은 섹션은 제거)
    const essaysFromPlain: Essay[] = [];
    if (essaysFromJson.length === 0 && selfIntroCandidateFromJson) {
      essaysFromPlain.push({ title: "자기소개", content: selfIntroCandidateFromJson });
    }
    if (essaysFromJson.length === 0 && selfIntroText.trim() && !looksLikeJson(selfIntroText)) {
      const cleaned = stripNonIntroBlocks(selfIntroText);
      if (cleaned) essaysFromPlain.push({ title: "자기소개", content: cleaned });
    }
    if (!r && resumeText.trim()) {
      const cleaned = stripNonIntroBlocks(resumeText);
      if (cleaned) essaysFromPlain.push({ title: "프로필 요약", content: cleaned });
    }
    if (!c && careerDescText.trim()) {
      const cleaned = stripNonIntroBlocks(careerDescText);
      if (cleaned) essaysFromPlain.push({ title: "경력 요약", content: cleaned });
    }

    const essaysFinal = essaysFromJson.length ? essaysFromJson : essaysFromPlain;

    return {
      category: 1,
      name: nameFinal,
      email: emailFinal,
      phone: phoneFinal,
      education: firstArr<Education>(r?.education, s?.education, c?.education),
      careers,
      projects: firstArr<Project>(r?.projects, s?.projects, c?.projects),
      essays: essaysFinal,
      certs: firstArr<Cert>(r?.certs, s?.certs, c?.certs),
      links: firstArr<LinkItem>(r?.links, s?.links, c?.links),
      skills: skillsObj,
    };
  }, [resumeText, selfIntroText, careerDescText, name, email, phone]);

  // 파일/서버 URL 미리보기
  const openPreview = (kind: "resume" | "selfIntro" | "career") => {
    const file = kind === "resume" ? resumeFile : kind === "selfIntro" ? selfIntroFile : careerDescFile;
    const url = kind === "resume" ? resumeUrl : kind === "selfIntro" ? selfIntroUrl : careerDescUrl;

    const safeOpen = (href: string) => {
      try {
        const a = document.createElement("a");
        a.href = href;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        document.body.appendChild(a);
        a.click();
        a.remove();
      } catch {
        window.open(href, "_blank", "noopener,noreferrer");
      }
    };

    if (file) {
      const obj = URL.createObjectURL(file);
      safeOpen(obj);
      setTimeout(() => URL.revokeObjectURL(obj), 60_000);
      return;
    }
    if (url) {
      safeOpen(url);
      return;
    }
    setSaveState("error");
    setMsg("미리보기할 파일이 없습니다.");
  };

  const printPage = () => window.print();

  // 빈 상태 감지
  const isEmptyAll =
    loadState === "success" &&
    !resumeText.trim() &&
    !selfIntroText.trim() &&
    !careerDescText.trim() &&
    !resumeUrl &&
    !selfIntroUrl &&
    !careerDescUrl;

  return (
    <div className="space-y-6 p-6 text-white bg-[#2d2d2d] rounded-b-md">
      {/* 헤더 */}
      <div className="flex items-center justify-between border-b border-gray-600 pb-4 mb-4">
        <h3 className="text-xl font-bold">이력서 확인 / 수정</h3>
        <div className="flex items-center gap-2">
          {updatedLabel && (
            <span className="rounded bg-gray-700 px-2 py-1 text-xs text-gray-200">{updatedLabel}</span>
          )}
          <button
            type="button"
            onClick={() => setEditing((v) => !v)}
            className="rounded-md bg-gray-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-gray-600"
          >
            {editing ? "편집 종료" : "이력서 수정"}
          </button>
          <button
            type="button"
            onClick={printPage}
            className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 print:hidden"
          >
            이력서 파일 다운로드
          </button>
        </div>
      </div>

      {/* 로딩/에러 */}
      {loadState === "loading" && (
        <div className="rounded-md border border-gray-600 bg-[#1b1b1b] p-3 text-sm text-gray-300">불러오는 중...</div>
      )}
      {loadState === "error" && (
        <div className="rounded-md border border-amber-400 bg-amber-900/30 p-3 text-sm text-amber-200">{msg}</div>
      )}

      {/* 성공 */}
      {loadState === "success" && (
        <>
          {!editing && !isEmptyAll && <ResumeClassicView data={classicData} />}

          {!editing && isEmptyAll && (
            <div className="mx-auto max-w-[900px] rounded-xl border border-dashed border-gray-600 bg-[#1b1b1b] p-8 text-center">
              <p className="text-sm text-gray-300">
                아직 불러올 이력서 데이터가 없습니다. 상단의 <b>이력서 수정</b>을 눌러 텍스트를 입력하거나 PDF를 업로드해
                보세요.
              </p>
            </div>
          )}

          {editing && (
            <div className="mx-auto w-full max-w-[900px] rounded-2xl bg-white p-8 text-black shadow-xl">
              <form onSubmit={handleSave} className="space-y-6">
                {/* 프로필 정보 수동 수정 */}
                <section className="space-y-3">
                  <h4 className="text-lg font-bold text-gray-900">프로필 정보</h4>
                  <div className="grid gap-3 md:grid-cols-3">
                    <div>
                      <label className="mb-1 block text-sm text-gray-700">이름</label>
                      <input
                        type="text"
                        value={nameEdit}
                        onChange={(e) => setNameEdit(e.target.value)}
                        className="w-full rounded-md border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:outline-none"
                        placeholder="예: 홍길동"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm text-gray-700">연락처</label>
                      <input
                        type="tel"
                        value={phoneEdit}
                        onChange={(e) => setPhoneEdit(e.target.value)}
                        className="w-full rounded-md border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:outline-none"
                        placeholder="예: 010-1234-5678"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm text-gray-700">이메일</label>
                      <input
                        type="email"
                        value={emailEdit}
                        onChange={(e) => setEmailEdit(e.target.value)}
                        className="w-full rounded-md border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:outline-none"
                        placeholder="예: user@example.com"
                      />
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSaveProfile}
                      disabled={profileSaveState === "saving"}
                      className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                    >
                      {profileSaveState === "saving" ? "프로필 저장 중..." : "프로필 저장"}
                    </button>
                    {(profileSaveState === "success" || profileSaveState === "error") && (
                      <span
                        className={[
                          "rounded-md border px-3 py-1.5 text-xs",
                          profileSaveState === "success"
                            ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                            : "border-rose-300 bg-rose-50 text-rose-700",
                        ].join(" ")}
                      >
                        {msg}
                      </span>
                    )}
                  </div>
                </section>

                {/* 문서 텍스트 */}
                <section className="space-y-3">
                  <h4 className="text-lg font-bold text-gray-900">문서 텍스트</h4>
                  <div className="grid gap-3 md:grid-cols-3">
                    <div>
                      <label className="mb-1 block text-sm text-gray-700">이력서 요약 (resumeText)</label>
                      <textarea
                        value={resumeText}
                        onChange={(e) => setResumeText(e.target.value)}
                        rows={8}
                        className="w-full rounded-md border border-gray-300 bg-white p-3 text-sm text-gray-900 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm text-gray-700">자기소개 (selfIntroText)</label>
                      <textarea
                        value={selfIntroText}
                        onChange={(e) => setSelfIntroText(e.target.value)}
                        rows={8}
                        className="w-full rounded-md border border-gray-300 bg-white p-3 text-sm text-gray-900 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm text-gray-700">경력기술 (careerDescText)</label>
                      <textarea
                        value={careerDescText}
                        onChange={(e) => setCareerDescText(e.target.value)}
                        rows={8}
                        className="w-full rounded-md border border-gray-300 bg-white p-3 text-sm text-gray-900 focus:outline-none"
                      />
                    </div>
                  </div>
                </section>

                {/* 첨부 파일 */}
                <section className="space-y-3 border-t border-gray-200 pt-4">
                  <h4 className="text-lg font-bold text-gray-900">첨부 파일</h4>

                  <FileRow title="이력서 PDF" currentUrl={resumeUrl} onPreview={() => openPreview("resume")}>
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => setResumeFile(e.target.files?.[0] ?? null)}
                      className="block w-full cursor-pointer rounded-md border border-gray-300 bg-white p-2 text-sm text-gray-800 file:mr-3 file:rounded file:border-0 file:bg-blue-600 file:px-3 file:py-1.5 file:text-white hover:file:bg-blue-700 focus:outline-none"
                    />
                  </FileRow>

                  <FileRow title="자기소개서 PDF" currentUrl={selfIntroUrl} onPreview={() => openPreview("selfIntro")}>
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => setSelfIntroFile(e.target.files?.[0] ?? null)}
                      className="block w-full cursor-pointer rounded-md border border-gray-300 bg-white p-2 text-sm text-gray-800 file:mr-3 file:rounded file:border-0 file:bg-blue-600 file:px-3 file:py-1.5 file:text-white hover:file:bg-blue-700"
                    />
                  </FileRow>

                  <FileRow title="경력기술서 PDF" currentUrl={careerDescUrl} onPreview={() => openPreview("career")}>
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => setCareerDescFile(e.target.files?.[0] ?? null)}
                      className="block w-full cursor-pointer rounded-md border border-gray-300 bg-white p-2 text-sm text-gray-800 file:mr-3 file:rounded file:border-0 file:bg-blue-600 file:px-3 file:py-1.5 file:text-white hover:file:bg-blue-700"
                    />
                  </FileRow>

                  <div className="mt-4 flex items-center gap-2">
                    <button
                      type="submit"
                      disabled={saveState === "saving"}
                      className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                    >
                      {saveState === "saving" ? "저장 중..." : "저장하기"}
                    </button>
                    {(saveState === "success" || saveState === "error") && (
                      <span
                        className={[
                          "rounded-md border px-3 py-1.5 text-xs",
                          saveState === "success"
                            ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                            : "border-rose-300 bg-rose-50 text-rose-700",
                        ].join(" ")}
                      >
                        {msg}
                      </span>
                    )}
                  </div>
                </section>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
}

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
    <div className="mt-4 space-y-2 rounded-md border border-gray-200 bg-gray-50 p-4">
      <div className="flex items-center justify-between">
        <h5 className="text-sm font-semibold text-gray-900">{title}</h5>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPreview}
            className="rounded-md bg-gray-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-gray-700"
          >
            미리보기
          </button>
          {currentUrl && (
            <a
              href={currentUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-blue-600 underline hover:bg-gray-100"
            >
              원본 열기
            </a>
          )}
        </div>
      </div>
      <div>{children}</div>
      {currentUrl ? (
        <p className="text-xs text-gray-500">현재 파일이 저장되어 있습니다.</p>
      ) : (
        <p className="text-xs text-gray-400">저장된 파일이 없습니다. 새 파일을 선택해 업로드하세요.</p>
      )}
    </div>
  );
}

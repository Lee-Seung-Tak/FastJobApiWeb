import { useState } from "react";

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
      <div className="bg-red-600 text-white px-6 py-4 rounded shadow-lg flex items-center space-x-4 max-w-xs animate-fade-in pointer-events-auto">
        <span>{message}</span>
        <button
          onClick={onClose}
          className="font-bold text-white hover:text-gray-300"
          aria-label="Close notification"
        >
          ×
        </button>
      </div>
    </div>
  );
}

interface SignUpFormProps {
  onSignUpSuccess: () => void;
}

export default function SignUpForm({ onSignUpSuccess }: SignUpFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [category, setCategory] = useState("1");
  const [resume, setResume] = useState<File | null>(null);
  const [selfIntro, setSelfIntro] = useState<File | null>(null);
  const [carrerDesc, setCarrerDesc] = useState<File | null>(null);
  const [portpoprilUrl, setPortpoprilUrl] = useState("");
  const [toastMsg, setToastMsg] = useState("");

  const server = "http://localhost:4000";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("userId", userId);
    formData.append("password", password);
    formData.append("category", category);
    if (resume) formData.append("resume", resume);
    if (selfIntro) formData.append("selfIntro", selfIntro);
    if (carrerDesc) formData.append("carrerDesc", carrerDesc);
    formData.append("portpoprilUrl", portpoprilUrl);

    try {
      const response = await fetch(server + "/auth/signup", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        localStorage.setItem("access_token", result);
        onSignUpSuccess();
        setToastMsg("");
      } else {
        setToastMsg("회원 가입 실패");
      }
    } catch (err) {
      console.error("Error : ", err);
      setToastMsg("서버에 연결할 수 없습니다.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col space-y-4 bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
        encType="multipart/form-data"
      >
        <input placeholder="이름" value={name} onChange={(e) => setName(e.target.value)} className="border p-2 rounded" />
        <input placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)} className="border p-2 rounded" />
        <input placeholder="전화번호" value={phone} onChange={(e) => setPhone(e.target.value)} className="border p-2 rounded" />
        <input placeholder="아이디" value={userId} onChange={(e) => setUserId(e.target.value)} className="border p-2 rounded" />
        <input type="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} className="border p-2 rounded" />
        <input placeholder="카테고리 ID" value={category} onChange={(e) => setCategory(e.target.value)} className="border p-2 rounded" />

        <label>이력서 파일</label>
        <input type="file" onChange={(e) => setResume(e.target.files?.[0] || null)} className="border p-2 rounded" />

        <label>자기소개서 파일</label>
        <input type="file" onChange={(e) => setSelfIntro(e.target.files?.[0] || null)} className="border p-2 rounded" />

        <label>경력기술서 파일</label>
        <input type="file" onChange={(e) => setCarrerDesc(e.target.files?.[0] || null)} className="border p-2 rounded" />

        <input placeholder="포트폴리오 URL" value={portpoprilUrl} onChange={(e) => setPortpoprilUrl(e.target.value)} className="border p-2 rounded" />

        <button type="submit" className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          회원가입
        </button>
      </form>

      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg("")} />}
    </div>
  );
}

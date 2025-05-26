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
  const [userId, setId] = useState("");
  const [password, setPassword] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const [toastMsg, setToastMsg] = useState("");
  const server = "http://localhost:4000";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("password", password);
    if (resume) {
      formData.append("resume", resume);
    }

    try {
      const response = await fetch(server + "/auth/signup", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        localStorage.setItem("access_token", result.access_token);
        onSignUpSuccess();
        setToastMsg("");
      } else {
        setToastMsg("회원 가입 실패");
        setId("");
        setPassword("");
        setResume(null);
      }
    } catch (err) {
      console.error("Error : ", err);
      setToastMsg("서버에 연결할 수 없습니다.");
      setId("");
      setPassword("");
      setResume(null);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col space-y-6 bg-white p-8 rounded-2xl shadow-lg w-96"
        encType="multipart/form-data"
      >
        <input
          type="text"
          placeholder="name"
          className="border p-4 text-lg rounded"
          value={userId}
          onChange={(e) => setId(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          className="border p-4 text-lg rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="file"
          className="border p-2 text-md rounded"
          onChange={(e) => setResume(e.target.files?.[0] || null)}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-3 rounded text-lg hover:bg-blue-600 transition"
        >
          회원가입
        </button>
      </form>

      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg("")} />}
    </div>
  );
}

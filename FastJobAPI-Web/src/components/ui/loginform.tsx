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

interface LoginFormProps {
  onLoginSuccess: () => void;
}

export default function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [userId, setId] = useState("");
  const [password, setPassword] = useState("");
  const [toastMsg, setToastMsg] = useState("");
  const server = "http://localhost:4000";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(server + "/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId, password }),
      });

      if (response.ok) {
        const result = await response.json();
        localStorage.setItem("access_token", result);
        onLoginSuccess();
        console.log(result);
        setToastMsg("");
      } else {
        setToastMsg("로그인 실패: 아이디 또는 비밀번호가 일치하지 않습니다.");
        setId("");
        setPassword("");
      }
    } catch (err) {
      console.error("Error : ", err);
      setToastMsg("서버에 연결할 수 없습니다.");
      setId("");
      setPassword("");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col space-y-6 bg-white p-8 rounded-2xl shadow-lg w-96"
      >
        <input
          type="text"
          placeholder="ID"
          className="border p-4 text-lg rounded"
          value={userId}
          onChange={(e) => setId(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-4 text-lg rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-3 rounded text-lg hover:bg-blue-600 transition"
        >
          로그인
        </button>
      </form>

      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg("")} />}
    </div>
  );
}
// LoginPage.tsx
import { useNavigate } from "react-router-dom";
import Header from "../components/ui/header";
import LoginForm from "../components/ui/loginform";

interface LoginPageProps {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function LoginPage({ setIsLoggedIn }: LoginPageProps) {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    navigate("/");
  };

  return (
    <div>
      <Header
        isLoggedIn={false} // 로그인 페이지는 항상 비로그인 상태로 간주해도 됨
        onLogout={() => {
          localStorage.removeItem("access_token");
          setIsLoggedIn(false);
        }}
      />
      <LoginForm onLoginSuccess={handleLoginSuccess} />
    </div>
  );
}
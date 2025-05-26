// MainPage.tsx
import Header from "../components/ui/header";

interface MainPageProps {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function MainPage({ isLoggedIn, setIsLoggedIn }: MainPageProps) {
  return (
    <div>
      <Header
        isLoggedIn={isLoggedIn}
        onLogout={() => {
          localStorage.removeItem("access_token");
          setIsLoggedIn(false);
        }}
      />
      <h1>메인 페이지입니다</h1>
    </div>
  );
}
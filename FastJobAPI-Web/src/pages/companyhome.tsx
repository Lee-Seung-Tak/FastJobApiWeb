// MainPage.tsx
import Header from "../components/ui/header";
import Footer from "../components/ui/footer";



interface CompanyHomeProps {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CompanyHome({ isLoggedIn, setIsLoggedIn }: CompanyHomeProps) {
  return (
    <div>
      <Header
        isLoggedIn={isLoggedIn}
        onLogout={() => {
          localStorage.removeItem("access_token");
          setIsLoggedIn(false);
        }}
      />
      <Footer />
    </div>
  );
}
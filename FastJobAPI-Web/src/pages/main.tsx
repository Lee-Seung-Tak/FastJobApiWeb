// MainPage.tsx
import Header from "../components/ui/header";
import Top from "../components/ui/top";
import Login from "../components/ui/loginform"
import SignUp from "../components/ui/signupform";
import KeyPoint from "../components/ui/keypoint";
import Footer from "../components/ui/footer";





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
      <Top />
      <Login />
      <SignUp />
      <KeyPoint />
      <Footer />
    </div>
  );
}
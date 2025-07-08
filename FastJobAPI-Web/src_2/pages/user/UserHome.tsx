
import React from "react";
import Header from "../../components/layout/Header";
import ResumeManagement from "../user/resume/ResumeManagement";





interface UserHomeProps {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function UserHome({ isLoggedIn, setIsLoggedIn }: UserHomeProps) {
  return (
    <div>
      <Header
        isLoggedIn={isLoggedIn}
        onLogout={() => {
          localStorage.removeItem("access_token");
          setIsLoggedIn(false);
        }}
      />
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
        <div className="">
          <div className='pt-10 justify-start text-white text-2xl font-normal font-pretendard'>
            <h3>개인회원</h3>
          </div>
        </div>
        <ResumeManagement />

      </div>

    </div>
  );
}
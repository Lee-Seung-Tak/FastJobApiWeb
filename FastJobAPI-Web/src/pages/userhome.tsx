// MainPage.tsx
import React from "react";
import Header from "../components/ui/header";
import Footer from "../components/ui/footer";
import ResumeManagement from "../components/ui/userhome/resumeManagement";
import AiCompanyMatch from "../components/ui/userhome/aiCompanyMatch";
import JobListings from "../components/ui/userhome/jobListings";
import ApplicationHistory from "../components/ui/userhome/applicationHistory";
import OffersReceived from "../components/ui/userhome/offersReceived";
import SavedCompanies from "../components/ui/userhome/savedCompanies";
import MyProfile from "../components/ui/userhome/myProfile";




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
        <AiCompanyMatch />
        <JobListings />
        <ApplicationHistory />
        <OffersReceived />
        <SavedCompanies />
        <MyProfile />
      </div>
      <Footer />
    </div>
  );
}
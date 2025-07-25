// src/pages/UserHome.tsx
import React, { type FC } from 'react';
import ResumeManagement from './resume/ResumeManagement';
import AiCompanyMatch from './AiCompanyMatch';
import JobListings from './JobListings';
import ApplicationHistory from './ApplicationHistory';
import OffersReceived from './OffersReceived';
import SavedCompanies from './SavedCompanies';
import MyProfile from './MyProfile';


export interface UserHomeProps {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;

}

const UserHome: FC<UserHomeProps> = () => {

  return (
    <>
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-4">
        <section>
          <h3 className="pt-10 text-white text-2xl font-normal font-pretendard">
            개인회원
          </h3>
        </section>
        <ResumeManagement />
        <AiCompanyMatch />
        <JobListings />
        <ApplicationHistory />
        <OffersReceived />
        <SavedCompanies />
        <MyProfile />
      </main>
    </>
  );
};

export default UserHome;

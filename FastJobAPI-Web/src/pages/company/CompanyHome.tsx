// src/pages/UserHome.tsx
import React, { type FC } from 'react';

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
            기업회원
          </h3>
        </section>
      </main>
    </>
  );
};

export default UserHome;

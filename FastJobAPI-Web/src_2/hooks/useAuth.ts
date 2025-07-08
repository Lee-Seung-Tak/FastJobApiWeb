// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  // 필요에 따라 추가 필드
}

interface AuthHook {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

const useAuth = (): AuthHook => {
  const [user, setUser] = useState<User | null>(null);

  // 앱 초기 로드 시 로컬스토리지에서 사용자 정보 불러오기
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  // 로그인 처리: 로컬 상태와 로컬스토리지에 저장
  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // 로그아웃 처리: 로컬 상태 초기화 및 스토리지 삭제
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return { user, login, logout };
};

export default useAuth;
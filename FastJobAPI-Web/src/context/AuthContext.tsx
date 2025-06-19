// context/AuthContext.tsx
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // user = { id, name, role: 'user' | 'company' }

  const login = (userData) => setUser(userData); // 예: userData = { id: 1, name: "홍길동", role: "user" }
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

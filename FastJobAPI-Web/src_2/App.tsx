// App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './styles/global.css';
import Main from './pages/Main';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UserHome from './pages/user/UserHome';



export default function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/userhome" element={<UserHome />} />
      </Routes>
    </BrowserRouter>
  );
}

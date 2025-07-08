import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css';
import App from './App.tsx'
// i mport CompanySignupForm from './components/shared/signup/CompanySignupForm.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    {/* <CompanySignupForm /> */}
  </StrictMode>,
)

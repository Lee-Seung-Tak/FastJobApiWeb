import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './styles/global.css'
// i mport CompanySignupForm from './components/shared/signup/CompanySignupForm.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    {/* <CompanySignupForm /> */}
  </StrictMode>,
)

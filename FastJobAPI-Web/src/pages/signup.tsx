import { useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/ui/header";
import SignUpForm from "../components/ui/signupform";
import Footer from "../components/ui/footer";

export default function SignupPage() {
  const { section } = useParams();

  return (
    <div>
      <Header isLoggedIn={false} onLogout={() => { }} />
      <SignUpForm initialSection={section} />
      <Footer />
    </div>
  );
}

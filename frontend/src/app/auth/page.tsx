"use client";

import { SignInForm } from "@/components/SignInForm";
import { SignUpForm } from "@/components/SignUpForm";
import { form_types } from "@/types/FormTypeEnum";
import { useState } from "react";

export default function AuthPage() {
  const [formType, setFormType] = useState<form_types>(form_types.sign_up);

  return (
    <main className="auth-page">
      <section className="auth-intro"><div className="auth-mark" aria-hidden="true">L</div><p className="eyebrow">YOUR AUCTION DESK</p><h1>{formType === form_types.sign_up ? "Make room for your next sale." : "Welcome back to the floor."}</h1><p>Manage your collection, bring an item live, and meet every bid in real time.</p></section>
      <section className="auth-panel">
        <h2>{formType === form_types.sign_up ? "Create your account" : "Sign in to Lotline"}</h2>
        {formType === form_types.sign_up ? <SignUpForm /> : <SignInForm />}
        <button className="auth-toggle" type="button" onClick={() => setFormType((current) => current === form_types.sign_in ? form_types.sign_up : form_types.sign_in)}>
          {formType === form_types.sign_in ? "New here? Create an account" : "Already have an account? Sign in"}
        </button>
      </section>
    </main>
  );
}
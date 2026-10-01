"use client";

import { useAuthStore } from "@/store/authStore";
import { axiosRequestHandler } from "@/utils/axiosRequestHandler";
import { errorNotification } from "@/utils/toastFunctionsDarkMode";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const SignInForm = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();
  const { setUser, logout } = useAuthStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const id = e.target.id;
    const value = e.target.value;
    switch (id) {
      case "identifierInput":
        setIdentifier(value);
        break;
      case "passwordInput":
        setPassword(value);
        break;
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userData = {
      email: identifier,
      password: String(password)
    }
    setIsLoading(true);

    try {
      const resp = await axiosRequestHandler(
        "/api/auth/signin",
        "POST",
        userData,
        logout
      );
      const user_data = resp!.data.data;
      setUser(user_data);
      router.push("/app/main");
    }
    catch (e: unknown) {
      const error = e as { response?: { status?: number; data?: { message?: string } } };
      const code = error.response?.status;
      if (code === 499) {
        errorNotification(error.response?.data?.message || "Sign in failed.");
      }
      else {
        errorNotification(error.response?.data?.message || "Something went wrong. Please try again.");
      }
    }
    setIsLoading(false);
  }
  return (
    <form
      className="auth-form"
      onSubmit={handleSubmit}
    >
      <label htmlFor="identifierInput" className="auth-label">
        Email
      </label>
      <input
        type="email"
        id="identifierInput"
        className="auth-input"
        placeholder="..."
        value={identifier}
        onChange={handleChange}
        minLength={3}
        required
      />

      <label htmlFor="passwordInput" className="auth-label">
        Password
      </label>
      <input
        type="password"
        id="passwordInput"
        className="auth-input"
        placeholder="******"
        value={password}
        onChange={handleChange}
        minLength={6}
        maxLength={15}
        required
      />

      <button
        className="button button-primary auth-submit"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? ("Processing...") : ("Sign In")}
      </button>
    </form>
  );
}
"use client";

import { useAuthStore } from "@/store/authStore";
import { axiosRequestHandler } from "@/utils/axiosRequestHandler";
import { errorNotification, successNotification } from "@/utils/toastFunctionsDarkMode";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const SignUpForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();
  const { logout, setUser } = useAuthStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const id = e.target.id;
    const value = e.target.value;
    switch (id) {
      case "usernameInput":
        setUsername(value);
        break;
      case "emailInput":
        setEmail(value);
        break;
      case "passwordInput":
        setPassword(value);
        break;
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userData = {
      username,
      email,
      password
    };
    setIsLoading(true);

    try {
      await axiosRequestHandler(
        "/api/auth/signup",
        "POST",
        userData,
        logout
      );

      successNotification("account created!");
      successNotification("logging in...");

      const resp_sign_in = await axiosRequestHandler(
        "/api/auth/signin",
        "POST",
        userData,
        logout
      );
      setUser(resp_sign_in?.data.data);
      router.push("/app/main");
    }
    catch (e: unknown) {
      const error = e as { response?: { status?: number; data?: { message?: string } } };
      const code = error.response?.status;
      if (code === 499) {
        errorNotification(error.response?.data?.message || "Account creation failed.");
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
      <label htmlFor="usernameInput" className="auth-label">
        Username
      </label>
      <input
        type="text"
        id="usernameInput"
        className="auth-input"
        placeholder="..."
        value={username}
        onChange={handleChange}
        minLength={3}
        maxLength={15}
        required
      />

      <label htmlFor="emailInput" className="auth-label">
        Email
      </label>
      <input
        type="email"
        id="emailInput"
        className="auth-input"
        placeholder="......"
        value={email}
        onChange={handleChange}
        maxLength={60}
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
        minLength={8}
        maxLength={15}
        required
      />

      <button
        className="button button-primary auth-submit"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? ("Processing...") : ("Sign Up")}
      </button>
    </form>
  );
}
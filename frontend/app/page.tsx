"use client";

import { useState, useEffect } from "react";
import { LoginForm } from "@/components/login-form";
import { useRouter } from "next/navigation"; // Changed from next/router to next/navigation

export default function Page() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedAuth = localStorage.getItem("isAuthenticated");
    if (storedAuth === "true") {
      setIsAuthenticated(true);
      router.push("/dashboard");
    }
  }, [router]);

  const handleSuccessfulLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem("isAuthenticated", "true");
    router.push("/dashboard");
  };

  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      {isAuthenticated ? null : <LoginForm onSuccess={handleSuccessfulLogin} />}
    </div>
  );
}
// frontend/components/login-form.tsx
"use client"; // Ensure this is a client component

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import config from '@/app/config';
import Image from 'next/image'; // Import the Image component
import DexterousGroupLogo from '@/components/resources/Dexterous-Group-Logo.png';
import HomeBannerSmall from '@/components/resources/home-banner-small.png';

type LoginFormProps = {
  onSuccess: () => void;
};
const { apiBaseUrl } = config;

export function LoginForm({ onSuccess }: LoginFormProps) {
  const handleSignInWithXero = () => {
    window.location.href = `${apiBaseUrl}/login`;
  };

  // Simulate a successful login for demonstration purposes
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get("success");
    if (success === "true") {
      onSuccess();
    }
  }, [onSuccess]);

  return (
    <Card className="mx-auto max-w-sm">
      <Image src={HomeBannerSmall} alt="Home Banner" className="w-full" />
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className="text-2xl">Login</CardTitle>
        </div>
        <CardDescription>
          Click the button below to login with your Xero account
        </CardDescription>
        <div className="absolute top-4 left-4">
          <Image src={DexterousGroupLogo} alt="Dexterous Group Logo" className="w-40 h-20" />
        </div>
      </CardHeader>
      <CardContent>
        <Button
          type="button"
          className="w-full bg-customBlue"
          onClick={handleSignInWithXero}
        >
          Sign in with Xero
        </Button>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="#" className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
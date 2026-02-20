"use client";

import {
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
  SignUpButton,
} from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarLoader } from "react-spinners";
import { useStoreUser } from "@/hooks/use-store-user";
import { LayoutDashboard } from "lucide-react";
import { Button } from "./ui/button";

const AuthenticatedHeader = () => {
  const { isLoading } = useStoreUser();
  return (
    <>
      {isLoading && <BarLoader width="100%" height={3} color="#36d7b7" />}
    </>
  );
};

const Header = () => {
  const path = usePathname();

  return (
    <header className="fixed top-0 w-full border-b bg-white/95 backdrop-blur z-50 supports-[backdrop-filter]:bg-white/60">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logos/logo.png"
            alt="Splitr Logo"
            width={200}
            height={60}
            className="h-11 w-auto object-contain"
            loading="eager"
          />
        </Link>

        {path === "/" && (
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="#features"
              className="text-sm font-medium hover:text-green-600 transition"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium hover:text-green-600 transition"
            >
              How It Works
            </Link>
          </div>
        )}

        <div className="flex items-center gap-4">
          <SignedIn>
            <Link href="/dashboard">
              <Button
                variant="outline"
                className="hidden md:inline-flex items-center gap-2 hover:text-green-600 hover:border-green-600 transition"
              >
                <LayoutDashboard className="h-4 w-4"/>
                Dashboard
              </Button>

              <Button variant="ghost" className="md:hidden w-10 p-0">
                <LayoutDashboard className="h-4 w-4"/>
              </Button>
            </Link>
            <UserButton/>
          </SignedIn>

          <SignedOut>
            <SignInButton>
              <Button variant={"ghost"}>Sign In</Button>
            </SignInButton>

            <SignUpButton>
              <Button className="bg-green-700 border-none">
                Get Started
              </Button>
            </SignUpButton>
          </SignedOut>
        </div>
      </nav>

      <SignedIn>
        <AuthenticatedHeader />
      </SignedIn>
    </header>
  );
};

export default Header;

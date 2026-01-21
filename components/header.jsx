"use client";

import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

export default function Header() {
  return (
    <div className="flex items-center gap-4 p-4 border-b">
      <SignedOut>
        <SignInButton />
        <SignUpButton />
      </SignedOut>

      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  );
}

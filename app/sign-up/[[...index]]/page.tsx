"use client";
import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="pt-24 container mx-auto flex justify-center">
      <SignUp />
    </div>
  );
}
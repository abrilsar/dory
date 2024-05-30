'use client';
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ConfigProjectPageUrl, DashBoardPageUrl } from "@/constants/urls";
import { useEffect, useState } from 'react';

export default function GitAccount() {
  const router = useRouter();
  const { data: session, status } = useSession()
  useEffect(() => {
    if (session) {
      router.push(DashBoardPageUrl);
    }
  }, [session]);

  const handleGithubLogin = async () => {
    signIn("github", { callbackUrl: DashBoardPageUrl });
  }
  return (
    <div className="sm:ml-3">
      <button
        onClick={handleGithubLogin}
        type="button"
        className="inline-flex items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-black hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-customColor border-gray-400 border-y border-x  w-full sm:w-40 md:w-52 lg:w-64 xl:w-64"
      >
        <img className="-ml-0.5 mr-1.5 h-5 w-5 rounded-full " src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/GitHub_Invertocat_Logo.svg/800px-GitHub_Invertocat_Logo.svg.png" alt="Imagen" />
        Github
      </button>
    </div>
  );
}
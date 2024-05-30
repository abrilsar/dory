'use client';
import GitAccount from "@/components/git-account/GitAccount";

export default function SignIn() {
  return (
    <div className="flex flex-col justify-center items-center mt-3">
      <p className="text-xl font-semibold w-full pt-5 sm:w-3/4 md:w-2/3 lg:w-2/4 xl:w-2/4 text-center justify-start items-start pb-2">Welcome to deploy tap</p>
      <div className="items-center flex flex-col w-full sm:w-1/2 md:w-1/3 lg:w-5/12 xl:w-5/12 py-4 border-gray-300 rounded-md border-2 h-80 mt-5">
        <p className="text-sm font-light w-4/5 text-center justify-start items-start pb-4 pt-2"> Log in with your github account to connect the repositories</p>
        <GitAccount />
      </div>
    </div>
  );
}
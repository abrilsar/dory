'use client';
import Link from "next/link";
export default function GitAppInstall() {
  return (
    <div className="sm:ml-3 h-full">
      <Link
        href={'https://github.com/apps/Deploy-Tap-Site/installations/new'}
        type="button"
        className="inline-flex items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-black hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-customColor border-gray-400 border-y border-x  w-full sm:w-40 md:w-52 lg:w-64 xl:w-64"
      >
        <img className="-ml-0.5 mr-1.5 h-5 w-5 rounded-full " src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/GitHub_Invertocat_Logo.svg/800px-GitHub_Invertocat_Logo.svg.png" alt="Imagen" />
        Install Github App
      </Link>
    </div >
  );
}
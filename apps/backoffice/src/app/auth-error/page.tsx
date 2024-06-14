'use client'
import GitAccount from '@/components/git-account/GitAccount';
import { NextPage } from 'next';
import { signOut } from 'next-auth/react';
import { WrenchScrewdriverIcon } from '@heroicons/react/24/outline'
// const ErrorPage: NextPage = () => {
//     return (
//         <div>
//             <h1>Error de autenticación</h1>
//             <p>Ocurrió un error durante el proceso de autenticación. Por favor, inténtalo de nuevo más tarde.</p>
//         </div>
//     );
// };

// export default ErrorPage;
export default function AuthError() {
    return (
        <div className="flex flex-col justify-center items-center mt-3">
            <p className="text-xl font-semibold w-full pt-5 sm:w-3/4 md:w-2/3 lg:w-2/4 xl:w-2/4 text-center justify-start items-start pb-2">Something went wrong...</p>
            <div className="items-center flex flex-col w-full sm:w-1/2 md:w-1/3 lg:w-5/12 xl:w-5/12 py-4 border-gray-300 rounded-md border-2 h-80 mt-5">
                <p className="text-sm font-light w-4/5 text-center justify-start items-start pb-4 pt-2">We are sorry for the unexpected events. Please wait a few seconds and try again.</p>
                <div className="sm:ml-3">
                    <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        type="button"
                        className="inline-flex items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-black hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-customColor border-gray-400 border-y border-x  w-full sm:w-40 md:w-52 lg:w-64 xl:w-64"
                    >
                        <WrenchScrewdriverIcon className="ml-0.5 mr-3 h-4 w-4 rounded-full " />
                        Try again
                    </button>
                </div>
            </div>
        </div>
    );
}

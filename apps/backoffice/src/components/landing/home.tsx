"use client";
import Features from "./features";
import { DashBoardPageUrl, SignInPageUrl } from "@/constants/urls";
import { useSession } from "next-auth/react";
import About from "@/components/about/About";
import Companies from "@/components/about/Companies";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="bg-bgColor">
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div
          className="absolute -top-60 -left-10 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>
        <div className="mx-auto w-full py-18">
          <div className="flex md:grid md:grid-cols-5 justify-between items-center">
            <div className="text-center md:mx-10 md:col-span-2">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Deploy your services!
              </h1>
              <p className="mt-6 text-base leading-8 text-gray-600">
                Simplify and speed up the deployment <br />
                of your services with GitOps
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <a
                  href={session ? DashBoardPageUrl : SignInPageUrl}
                  className="rounded-md bg-customColor px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-customColor focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-customColor"
                >
                  Get started
                </a>
              </div>
            </div>
            <div className="hidden pt-10 md:flex justify-center md:col-span-3">
              <img src="deploy.png" className="w-3/5 self-center" />
            </div>
          </div>
          <div className="pt-10 md:hidden">
            <img src="deploy.png" className="w-96" />
          </div>
        </div>
        <Features />
        <div
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>
        <div className="relative isolate px-6 lg:px-8">
          <div
            className="absolute -top-60 -left-10 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
            aria-hidden="true"
          >
            <div
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </div>
          <About />

          <div className="relative isolate px-6 pt-14 lg:px-8">
            <div
              className="absolute -top-60 -left-10 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
              aria-hidden="true"
            >
              <div
                className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                style={{
                  clipPath:
                    "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                }}
              />
            </div>
          </div>
          {/* Parrafito de dockerfile
          <div className="mb-16 mx-auto max-w-4xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">
              Deploy-tap
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything starts with your Docker configuration.
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              To carry out a successful application deployment, it is vitally
              important to have a proper Docker configuration, which includes
              the correct preparation of your Dockerfile and docker-compose. Be
              sure to consult the Docker documentation relevant to your specific
              framework to ensure optimal performance.
            </p>
          </div> */}
          <Companies />
          <div
            className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
            aria-hidden="true"
          >
            <div
              className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

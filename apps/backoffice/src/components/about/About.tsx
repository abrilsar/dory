import {
  UserIcon,
  ArrowDownTrayIcon,
  FolderIcon,
  Cog6ToothIcon,
  PlusCircleIcon,
  AdjustmentsVerticalIcon,
} from "@heroicons/react/20/solid";

const features = [
  {
    name: "Sign up with GitHub.",
    description:
      "You just need to log in with your GitHub account, and you can start deploying and managing your projects.",
    icon: UserIcon,
  },
  {
    name: "Install our App.",
    description:
      "If you haven't done so, you must accept the installation of Deploy-tap in your github account. This allows us to access your repositories.",
    icon: ArrowDownTrayIcon,
  },
  {
    name: "Select repository.",
    description:
      "You can select the repos that have our app installed or you can do it from a third party, but remember that it must be public!",
    icon: FolderIcon,
  },
];

const features2 = [
  {
    name: "Basic config.",
    description:
      "Add a name to your project, this will be your main domain. You must also select the branch of the GitHub repository you want to deploy.",
    icon: Cog6ToothIcon,
  },
  {
    name: "Add your apps.",
    description:
      "Add the information for each service you want to deploy. The name you choose will be your subdomain, so check what your domain would look like.",
    icon: PlusCircleIcon,
  },
  {
    name: "Environment Variables.",
    description:
      "These variables are injected into your project. Ensure that your docker-compose.yml file configures the corresponding variables for each service.",
    icon: AdjustmentsVerticalIcon,
  },
];

export default function About() {
  return (
    <>
      {/* Parrafito de vps */}
      <div className="my-16 mx-auto max-w-4xl lg:text-center">
        <h2 className="text-base font-semibold leading-7 text-indigo-600">
          Deploy-tap
        </h2>
        <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Reliable and optimized deployment on your own VPS
        </p>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          Deploy-tap provides you with your own virtual private server (VPS) to
          deploy your project. The declared infrastructure is deployed from your
          GitHub repository and you can update any changes with just one click.
          Deploy your application on an optimized VPS server and enjoy a
          reliable and scalable deploying experience with Deploy-tap.
        </p>
      </div>
      {/* Primera parte*/}
      <div className="py-24 pt-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            <div className="lg:pr-8 lg:pt-4">
              <div className="lg:max-w-lg">
                <h2 className="text-base font-semibold leading-7 text-indigo-600">
                  Deploy-tap
                </h2>
                <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  How does Deploy-tap work?
                </p>
                {/* Adorno */}
                <div className="relative isolate">
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
                <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none">
                  {features.map((feature) => (
                    <div key={feature.name} className="relative pl-9">
                      <dt className="inline font-semibold text-gray-900">
                        <feature.icon
                          className="absolute left-1 top-1 h-5 w-5 text-indigo-600"
                          aria-hidden="true"
                        />
                        {feature.name}
                      </dt>{" "}
                      <dd className="inline">{feature.description}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
            <img
              src="importRepo.png"
              alt="Import Repo"
              className="w-[48rem] max-w-none rounded-xl shadow-2xl ring-1 ring-gray-400/10 sm:w-[40rem] lg:mt-20 md:-ml-4 lg:-ml-12"
              width={2432}
              height={1442}
            />
            {/* Adorno */}
            <div className="relative isolate">
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
      </div>
      {/* Adorno */}
      <div className="relative isolate">
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
      {/* Parrafito de dockerfile */}
      <div className="mb-16 mx-auto max-w-4xl lg:text-center">
        <h2 className="text-base font-semibold leading-7 text-indigo-600">
          Deploy-tap
        </h2>
        <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Everything starts with your Docker configuration.
        </p>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          To carry out a successful application deployment, it is vitally
          important to have a proper Docker configuration, which includes the
          correct preparation of your Dockerfile and docker-compose. Be sure to
          consult the Docker documentation relevant to your specific framework
          to ensure optimal performance.
        </p>
      </div>
      {/* Segunda parte mejorada*/}
      <div className="py-24 pt-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            <div className="lg:pr-8 lg:pt-4">
              <div className="lg:max-w-lg">
                <h2 className="text-base font-semibold leading-7 text-indigo-600">
                  Deploy-tap
                </h2>
                <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  How do I set up my project?
                </p>
                {/* Adorno */}
                <div className="relative isolate">
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
                <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none">
                  {features2.map((feature) => (
                    <div key={feature.name} className="relative pl-9">
                      <dt className="inline font-semibold text-gray-900">
                        <feature.icon
                          className="absolute left-1 top-1 h-5 w-5 text-indigo-600"
                          aria-hidden="true"
                        />
                        {feature.name}
                      </dt>{" "}
                      <dd className="inline">{feature.description}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
            <img
              src="config.png"
              alt="Config project"
              className="w-[50rem] max-w-none rounded-xl shadow-2xl ring-1 ring-gray-400/10 sm:w-[40rem] lg:mt-20 md:-ml-4 lg:-ml-12"
              width={2432}
              height={1442}
            />
            {/* Adorno */}
            <div className="relative isolate">
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
      </div>
      {/* Segunda parte */}
      {/* <div className="overflow-hidden sm:pb-32 pt-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            <div className="lg:pl-8 lg:pt-4">
              <div className="lg:max-w-lg">
                <h2 className="text-base font-semibold leading-7 text-indigo-600">
                  Deploy-tap
                </h2>
                <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  How do I set up my project?
                </p>
                <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none">
                  {features2.map((feature) => (
                    <div key={feature.name} className="relative pl-9">
                      <dt className="inline font-semibold text-gray-900">
                        <feature.icon
                          className="absolute left-1 top-1 h-5 w-5 text-indigo-600"
                          aria-hidden="true"
                        />
                        {feature.name}
                      </dt>{" "}
                      <dd className="inline">{feature.description}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
            <img
              src="config3.png"
              alt="Configure your project"
              className="w-[48rem] max-w-none lg:-ml-8 rounded-xl shadow-2xl ring-1 ring-gray-400/10 sm:w-[40rem] lg:mt-20 md:-mr-4 lg:-mr-0"
              width={2432}
              height={1442}
            />
          </div>
        </div>
      </div> */}
    </>
  );
}

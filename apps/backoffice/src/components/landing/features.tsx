import { ArrowPathIcon, ArrowUturnUpIcon, ArrowTrendingUpIcon, Cog6ToothIcon } from '@heroicons/react/24/outline'

const features = [
  {
    name: 'Automatic deployment of backend services',
    description:
      'It allows you to implement and update services quickly and efficiently, without the need for manual intervention at each step.',
    icon: ArrowUturnUpIcon,
  },
  {
    name: 'Automation and control through Git',
    description:
      'We ensure strong integration with Git to automate and control software development and deployment processes.',
    icon: ArrowPathIcon,
  },
  {
    name: 'Simple configuration management',
    description:
      'The configuration process is streamlined, providing a more fluid and efficient experience.',
    icon: Cog6ToothIcon,
  },
  {
    name: 'Scalability and performance',
    description:
      'Capable of automatically scaling to handle variable workloads and ensure optimal performance.',
    icon: ArrowTrendingUpIcon,
  },
]

export default function Features() {
  return (
    <div className="relative">
    <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
    <div className="py-20">
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <div className="mx-auto max-w-2xl lg:text-center">
        <h2 className="text-base font-semibold leading-7 text-customColor">Deploy faster</h2>
        <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Everything you need to deploy your app
        </p>
      </div>
      <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
        <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
          {features.map((feature, i) => <Feature key={i} name={feature.name} description={feature.description} icon={feature.icon}/>)}
        </dl>
      </div>
    </div>
  </div>
  <div
  className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
  aria-hidden="true"
>
  <div
    className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
    style={{
      clipPath:
        'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
    }}
  />
</div></div>
  )
}

interface feature{
    name: string
    description: string
    icon: React.ElementType,
}

function Feature({name, description, icon: Icon}:feature){
    return (
        <div key={name} className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-customColor">
                    <Icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  {name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">{description}</dd>
              </div>
    )
}

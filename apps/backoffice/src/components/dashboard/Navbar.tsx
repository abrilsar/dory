'use client'
import { Fragment, useEffect, useState } from 'react'
import { Disclosure, Menu, Transition, } from '@headlessui/react'
import { DashBoardPageUrl, LandingPageUrl, SignInPageUrl } from '@/constants/urls'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'


function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Navbar() {
  const { data: session } = useSession()
  const router = useRouter()
  const [isLandingPage, setIsLandingPage] = useState(false)
    
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      setIsLandingPage(currentPath ===  LandingPageUrl)     
    }
  }, []);
  return (
    <header>
      <Disclosure as="nav" className="bg-bgColor">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 pt-3 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <Link href={LandingPageUrl}>
                    <img
                      className="h-8 w-auto cursor-pointer"
                      src="logoDT.png"
                      alt="Deploy-tap"
                    />
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">

                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    {isLandingPage&&!session?
                    <div className='flex gap-x-3'>
                      <button onClick={()=>{
                        router.push(SignInPageUrl);
                      setIsLandingPage(false)}} 
                        className="rounded-md bg-customColor px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-customColor"
                      >Sign in</button>
                      <button onClick={()=>{
                        router.push(SignInPageUrl);
                      setIsLandingPage(false)}} 
                        className="rounded-md bg-white border border-customColor text-black px-3.5 py-2.5 text-sm font-semibold shadow-sm hover:bg-customColor focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-customColor"
                      >Sign up</button>
                    </div>
                    :
                    <Link href={session?DashBoardPageUrl:SignInPageUrl}>
                    <Menu.Button className="relative flex items-center rounded-full bg-bgColor text-sm" disabled={session?false:true}>
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">Open user menu</span>
                      <p className={`${session ? 'hidden sm:inline' : 'hidden'}`}>Hola, {session?.user.name}!</p>
                      <img
                        className="h-8 w-8 ml-4 rounded-full focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-customColor"
                        src={session ? session?.user.image! : 'https://images.rawpixel.com/image_png_social_square/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTAxL3JtNjA5LXNvbGlkaWNvbi13LTAwMi1wLnBuZw.png'}
                        alt=""
                      />
                    </Menu.Button>
                      </Link>}
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-customColor ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href={DashBoardPageUrl}
                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                          >
                            Dashboard
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                            onClick={() => signOut({ callbackUrl: SignInPageUrl })}
                          >
                            Sign out
                          </a>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>
        </>
      )}
    </Disclosure>
    </header>
  )
}

'use client';
// import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { Dialog, RadioGroup, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'


function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}
type Deployment = {
    deployed: boolean,
    status: string
}

export default function Toast() {
    const [open, setOpen] = useState(false)
    const [isDeployed, setIsDeployed] = useState(false)


    function closeModal() {
        if (isDeployed) setOpen(false)
    }

    function openModal() {
        setOpen(true)
    }

    return (
        <>
            <div className="fixed inset-0 flex items-center justify-center">
                <button
                    type="button"
                    onClick={openModal}
                    className="rounded-md bg-black/20 px-4 py-2 text-sm font-medium text-white hover:bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
                >
                    Open dialog
                </button>
            </div>

            <Transition.Root show={open} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 hidden bg-transparent bg-opacity-75 transition-opacity md:block" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-10 flex items-center justify-center">
                        <div className="flex h-2/4 items-stretch justify-center text-center md:items-center md:px-2 lg:px-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
                                enterTo="opacity-100 translate-y-0 md:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 md:scale-100"
                                leaveTo="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
                            >
                                <Dialog.Panel className="flex flex-col items-center justify-center w-full h-screen">
                                    <div className="relative flex flex-col items-center overflow-hidden bg-white px-4 pb-8 pt-14 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8">
                                        <button
                                            type="button"
                                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
                                            hidden={!isDeployed}
                                            onClick={() => setOpen(false)}
                                        >
                                            <span className="sr-only">Cerrar</span>
                                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                        </button>

                                        <div className="flex flex-col items-center justify-center w-full">
                                            <div className="sm:col-span-8 lg:col-span-7 ">

                                                <p className="text-xl text-center font-bold text-gray-800 mb-2">{isDeployed ? 'Deployment Successful' : 'Deployment in process'}</p>
                                                <p className="text-sm font-light text-center mb-4">{isDeployed ? 'Congratulations! Your project has been successfully deployed to app' : 'Almost ready. wait a few minutes while the deployment finishes'}</p>

                                                <div className="aspect-h-1 aspect-w-2 overflow-hidden rounded-lg bg-gray-100 sm:col-span-4 lg:col-span-5">
                                                    {isDeployed ? <img src="https://media.geeksforgeeks.org/wp-content/cdn-uploads/20210401151214/What-is-Website.png" alt='imagen' className="object-cover object-center" /> : <div className="object-cover object-center rounded-md bg-gray-300 animate-pulse "></div>}
                                                </div>
                                                <div className="flex items-center justify-center w-2/3 mx-auto mt-10">
                                                    <button
                                                        type="submit"
                                                        disabled={!isDeployed}
                                                        className="flex items-center justify-center w-2/3 px-8 py-2 text-base font-medium text-white bg-customColor rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:text-gray-700 disabled:cursor-not-allowed"
                                                    >
                                                        View Site
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div >
                    </div >
                </Dialog >
            </Transition.Root >
        </>
    )
}

'use client'
import ConfigPage from '@/app/deploy-config/ConfigPage';
import GitImportPage from '@/app/git-import/GitImportPage';
import { useEnvContext } from '@/hooks/useEnvContext';
import { useState, Fragment, useEffect } from 'react'
import { useDataContex } from '@/hooks/useDataContext';
import { axios } from '@/lib/api';
import { Dialog, Transition, Menu } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useSession } from 'next-auth/react';
import { env } from 'process';
import { set } from 'zod';
import DetailVM from '../detail-vm/DetailVM';
import Link from 'next/link';
import { DashBoardPageUrl } from '@/constants/urls';
import { Deploy } from 'types/interfaces';

const steps: { step: number }[] = [
    { step: 1 },
    { step: 2 },
    { step: 3 }
];



export default function Steps() {
    const [activeStep, setActiveStep] = useState(1)
    const { data: session } = useSession()
    const { repoSelected, commitRepo, installation_id } = useDataContex()
    const [open, setOpen] = useState(false)
    const [isDeployed, setIsDeployed] = useState(false)
    const [successProcess, setSuccessProcess] = useState(false)
    const { envState } = useEnvContext()
    const [showValidation, setShowValidation] = useState(true);
    const [deploy, setDeploy] = useState<Deploy>()


    function getButtonName() {
        if (activeStep === steps.length - 1) {
            return 'Deploy'
        }
        return 'Next'
    }


    const handleNext = async () => {
        if (activeStep === 1 && repoSelected.repo_id === -1) {
            setShowValidation(true)
            return;
        }
        if (activeStep === 2 && envState.terraformVar.name_project === '') {
            setShowValidation(true)
            return;
        }
        if (activeStep === 1 && repoSelected.repo_id !== -1) setShowValidation(false)
        if (activeStep === 2 && envState.terraformVar.name_project !== '') setShowValidation(false)


        setActiveStep((prevStep) => prevStep + 1)

    }

    function getSectionComponent() {
        switch (activeStep) {
            case 1: return <GitImportPage />;
            case 2: return <ConfigPage />;
            case 3: return <DetailVM />;
            default: return null;
        }
    }

    const width = `${(100 / (steps.length - 1)) * (activeStep - 1)}%`


    return (
        <>
            <div className="px-4 pb-10">
                <div className="flex justify-between mt-6 relative before:bg-slate-200 before:absolute before:h-1 before:top-1/2 before:transform-y-1/2 before:w-full before:left-0 w-full max-w-xl mx-auto">
                    {steps.map(({ step }) => (
                        <div className="relative z-10" key={step}>
                            <div
                                className={`size-6 rounded-full  flex justify-center items-center transition-all ease-in delay-200 ${activeStep >= step ? 'border-slate-400 bg-customColor' : 'bg-slate-300'
                                    }`}>
                            </div>
                        </div>
                    ))}
                    <div
                        className="absolute h-1 bg-customColor w-full top-1/2 transform-y-1/2 transition-all ease-in delay-200 left-0"
                        style={{ width: width }}></div>
                </div>
                <div>
                    {getSectionComponent()}
                </div>
                <div className="flex justify-between mt-7 w-full max-w-xl mx-auto">
                    <button
                        className="h-8 flex items-center border disabled:bg-gray-300 disabled:text-gray-700 disabled:cursor-not-allowed bg-customColor hover:bg-violet-500 text-white px-8 py-1.5 rounded-md font-medium text-sm"
                        hidden={activeStep === steps.length}
                        onClick={() => {
                            setActiveStep((prevStep) => prevStep - 1)
                        }}
                        disabled={activeStep === 1 || activeStep === steps.length}>
                        Previous
                    </button>
                    <Menu as="div" className=' relative' >
                        <Menu.Button
                            className='h-8 flex items-center border disabled:bg-gray-300 disabled:text-gray-700 disabled:cursor-not-allowed bg-customColor hover:bg-violet-500 text-white px-8 py-1.5 rounded-md font-medium text-sm' onClick={handleNext}
                            disabled={activeStep === steps.length}
                            type={getButtonName() === 'Deploy' ? 'submit' : 'button'}>
                            {getButtonName()}
                        </Menu.Button>
                        {showValidation && <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"

                        >
                            <Menu.Items className="absolute right-0 z-10  rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none mb-2 origin-bottom bottom-full border-2 border-red-400 w-max">
                                <div className='block px-4 py-2 text-xs text-gray-900'>{activeStep === 2 ? 'Please enter a valid name' : (installation_id.length !== 0) ? 'Please select one repository' : 'Please install the app'}</div>
                            </Menu.Items>
                        </Transition>}
                    </Menu >
                </div>
            </div >

        </>

    )
}


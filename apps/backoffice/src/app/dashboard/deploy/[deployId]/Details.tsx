import { Menu, Transition } from '@headlessui/react';
import React, { Dispatch, Fragment, SetStateAction, useEffect, useState } from 'react';
import { useDataContex } from '@/hooks/useDataContext';
import { Deploy } from 'types/interfaces';
import { axios } from '@/lib/api';
import useAxiosAuth from "@/hooks/useAxiosAuth";
import { useGetDate } from '@/hooks/useDate';
import { DocumentCheckIcon, FolderOpenIcon, BackwardIcon, LinkIcon, MinusCircleIcon, WrenchIcon, PlusCircleIcon, ArrowLeftIcon, TrashIcon } from '@heroicons/react/24/outline'
import { DashBoardPageUrl } from '@/constants/urls';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Accordion } from 'flowbite-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface DetailsProps {
    deploy: Deploy,
    changes: boolean
    setChanges: Dispatch<SetStateAction<boolean>>
}

const WebPreview = ({ url, domain }: { url: string, domain: string }) => {
    const [screenshotUrl, setScreenshotUrl] = useState<string>('');
    const apiKey = process.env.NEXT_PUBLIC_API_SS as string

    useEffect(() => {
        const websiteUrl = encodeURIComponent(url);
        fetch(`https://api.screenshotmachine.com/?key=${apiKey}&url=${websiteUrl}&dimension=1024x768`)
            .then(response => response.blob())
            .then(blob => {
                const imageUrl = URL.createObjectURL(blob);
                setScreenshotUrl(imageUrl);
            })
            .catch(console.error);
    }, []);

    if (!screenshotUrl) {
        return <div className='h-full w-full object-cover object-center bg-gray-200 animate-pulse'></div>;
    }
    return (
        <a href={domain} target="_blank"><img src={screenshotUrl} alt="Web preview" className="h-full w-full object-cover object-center" /></a>
    );
};


const getRollBack = (deploy: Deploy) => {
    if (deploy.commits.length !== 1) {
        return deploy.commits[deploy.lastCommit]?.previous === -1 ? false : true
    }
    return false
}

export default function Details({ deploy, changes, setChanges }: DetailsProps) {
    const { infoUser } = useDataContex()
    const [last_commit, setLastCommit] = useState(deploy.commits[deploy.lastCommit]!.time)
    const [checkRollback, setCheckRollback] = useState(getRollBack(deploy))
    const { data: session } = useSession()
    const router = useRouter()
    const deleteProject = async () => {
        try {
            const data = await axios.post(`/v1/deployments/${deploy._id}`, { user_id: session?.user._id }).then(response => response.data)
            await axios.post('/v1/terraform/deleteDroplet', deploy)
            toast.success('Successfully deleted!')
            router.push(DashBoardPageUrl)

        } catch (error) { console.log(error); toast.error("This didn't work.") }
    }

    const getRollBackDate = () => {
        const idPrevious = deploy.commits[deploy.lastCommit]!.previous
        return deploy.commits[idPrevious]?.time
    }

    return (
        <div className=''>
            <div className="mt-4 bg-bgColor mb-96 xs:mb-4 sm:mb-2 md:mb-4 lg:mb-12">
                <div id='1' className="flex text-customColor justify-between items-center pb-3 mx-8">
                    <div className="flex items-center">
                        <ArrowLeftIcon className="h-4 w-4" />
                        <Link className="pl-1 font-bold text-sm" href={DashBoardPageUrl}>Back to dashboard</Link>
                    </div>
                </div>

                <div id='2' className="flex flex-wrap mt-2">
                    <div className="mx-auto w-full sm:w-1/2 md:w-1/2 px-4 sm:px-4 lg:px-8">
                        <div className="relative h-56 w-full overflow-hidden rounded-lg bg-white sm:aspect-h-3 sm:aspect-w-3 md:aspect-h-3 md:aspect-w-3 lg:aspect-h-2 lg:aspect-w-3 group-hover:opacity-75 sm:h-64 pb-4">
                            <WebPreview url={deploy.domain} domain={deploy.domain} />
                        </div>
                    </div>
                    <div className="w-full sm:w-1/2 md:w-1/2 px-3 relative h-32 rounded-lg bg-bgColor sm:aspect-h-2 sm:aspect-w-3 lg:aspect-h-1 lg:aspect-w-3 group-hover:opacity-75 sm:h-64">
                        <div className="lg:pr-4">
                            <div className="w-full text-base leading-7 text-gray-700">
                                <div className="pt-4 md:pt-0">
                                    <div className="flex justify-center lg:justify-between">
                                        <h2 className="text-center text-2xl lg:3xl font-bold text-gray-900">{deploy.name_project}</h2>
                                    </div>

                                    <div className="flex py-2 mt-2 items-center justify-center lg:justify-normal">
                                        <p className="pr-2 font-light text-sm hidden lg:inline">{(deploy.status === 'Failed') ? 'Deployment could not be completed' : "Deployment has been completed"}</p>
                                        <a className="pl-1 font-bold text-sm text-customColor" href="">{(deploy.status === 'Failed') ? 'View Error' : "View Console"}</a>
                                        <div className="inline lg:hidden px-2 items-center">
                                            <InfoItemStatus icon={MinusCircleIcon} name='Status' text={deploy.status} />
                                        </div>
                                    </div>
                                </div>
                                <div className="text-gray-600 px-3 sm:pl-0">
                                    <div className='grid grid-cols-1 lg:grid-cols-3 mt-6 gap-x-5 space-y-0'>
                                        <InfoItemLink icon={LinkIcon} name='Domain' text={deploy.domain} />
                                        <div className="hidden lg:inline">
                                            <InfoItemStatus icon={MinusCircleIcon} name='Status' text={deploy.status} />
                                        </div>
                                    </div>
                                    <div className='grid grid-cols-1 lg:grid-cols-3 mt-6 gap-x-5 space-y-0'>
                                        <InfoItemLink icon={FolderOpenIcon} name='Repository' text={deploy.repository_link} />
                                        <div className="hidden lg:grid lg:items-center">
                                            <InfoItem icon={WrenchIcon} name='Source' text={deploy.source} />
                                        </div>
                                    </div>
                                    <div className='lg:hidden grid grid-cols-2 gap-x-5 space-y-0 mt-6'>
                                        <InfoItem icon={WrenchIcon} name='Source' text={deploy.source} />
                                    </div>
                                </div>
                                <div className='lg:hidden grid grid-cols-2 gap-x-5 space-y-0 mt-6'>
                                    <InfoItem icon={WrenchIcon} name='Source' text={deploy.source} />
                                    <InfoItem icon={BackwardIcon} name='Rollback to' text={!getRollBack(deploy) ? "No previous version" : getRollBackDate()!.split("T")[0] as string} right={true} />
                                </div>
                                <div className='grid grid-cols-2 lg:grid-cols-3 gap-x-5 space-y-0 mt-6'>
                                    <InfoItem icon={DocumentCheckIcon} name='Last commit' text={deploy.commits[deploy.lastCommit]!.time.split("T")[0] as string} />
                                    <InfoItem icon={PlusCircleIcon} name='Created at' text={deploy.createdAt.split("T")[0] as string} right={true} />
                                    <div className="hidden lg:inline">
                                        <InfoItem icon={BackwardIcon} name='Rollback to' text={!getRollBack(deploy) ? "No previous version" : getRollBackDate()!.split("T")[0] as string} right={true} />
                                    </div>
                                </div>
                                <div className="flex gap-x-4 pt-5 md:pt-8 lg:pt-8 pb-5 pr-3">
                                    <Link
                                        type="submit"
                                        href={deploy.domain}
                                        target='_blank'
                                        className={`flex items-center justify-center ${changes ? 'w-2/3' : 'w-full'} px-8 py-2 text-base font-semibold text-white bg-customColor rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2  focus:ring-offset-2`}
                                    >
                                        View Site
                                    </Link>
                                    {changes && <Drop deploy={deploy} setChanges={setChanges} setLastCommit={setLastCommit} pull={true} />}
                                </div>
                                {/* <div className="flex justify-end pr-3">
                                    <Dropdown
                                        className="flex items-center justify-center w-2/5 px-8 py-2 text-base font-semibold rounded-md bg-white border-2 border-red-400 text-black hover:bg-red-400 focus:outline-none focus:ring-1 focus:ring-red-400 focus:ring-offset-2 active:bg-white"
                                        title='Delete'
                                        text='This will stop your deploy and delete your project. Are you sure?'
                                        handleYes={deleteProject}
                                        handleNo={async () => { }} />
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div >
            <div id='3' className='mr-8 ml-3 gap-1 mt-96 pt-10 sm:ml-8 sm:pt-0 md:mt-28 '>
                <h2 className="text-start pl-2 text-2xl lg:3xl font-bold text-gray-900">Deployment</h2>
                <AcordionDetail output={deploy.terraform_output} />

            </div>
            <div className="flex justify-end px-8 pb-6">
                {checkRollback && <Drop deploy={deploy} setChanges={setChanges} setLastCommit={setLastCommit} pull={false} setCheckRollback={setCheckRollback} />}
                <Dropdown
                    className="flex items-center justify-center w-2/5 px-8 py-2 text-base font-semibold rounded-md bg-white border-2 border-red-400 text-black hover:bg-red-400 focus:outline-none focus:ring-1 focus:ring-red-400 focus:ring-offset-2 active:bg-white"
                    title='Delete'
                    text='This will stop your deploy and delete your project. Are you sure?'
                    handleYes={deleteProject}
                    handleNo={async () => { }}
                />
            </div >
        </div >
    );
}

type InfoProps = {
    icon: React.ElementType,
    name: string,
    text: string,
    right?: boolean,
}

function InfoItemLink({ icon: Icon, text, name, }: InfoProps) {
    return (
        <div className="col-span-1 lg:col-span-2 truncate">
            <div className='flex gap-x-3'>
                <Icon className="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" />
                <h1 className='font-semibold text-md text-gray-700'>{name}</h1>
            </div>
            <Link href={text} target='_blank' className='font-base text-sm text-gray-900 pl-8'>{text}</Link>
        </div>)

}

function InfoItem({ icon: Icon, text, name, right = false }: InfoProps) {
    return (
        <div className={`${right ? "flex-col lg:block" : ""} col-span-1 truncate ${right ? "items-center lg:items-start" : ""}`}>
            <div className='flex gap-x-3'>
                <Icon className="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" />
                <h1 className='font-semibold text-base text-gray-700'>{name}</h1>
            </div>
            <a className='font-base text-sm text-gray-900 pl-8'>{text}</a>
        </div>)

}

function InfoItemStatus({ icon: Icon, text, name }: InfoProps) {
    return (
        <div className="col-span-1 truncate">
            <div className='flex gap-x-3 items-center'>
                <Icon className={`mt-0 lg:mt-1 h-5 w-5 flex-none ${text === 'Failed' ? 'text-red-400' : 'text-green-400'}`} aria-hidden="true" />
                <h1 className={`flex lg:hidden font-semibold text-md ${text === 'Failed' ? 'text-red-400' : 'text-green-400'}`}>{text}</h1>
                <h1 className='hidden lg:flex font-semibold text-md text-gray-700'>{name}</h1>
            </div>
            <h2 className='hidden lg:flex mt-1 font-base text-sm text-gray-900 pl-8'>{text === 'Failed' ? 'Failed' : 'Deployed'}</h2>
        </div>)

}

function classNames(...classes: (string | undefined)[]): string {
    return classes.filter(Boolean).join(' ');
}

interface DropProps {
    deploy: Deploy
    setChanges: Dispatch<SetStateAction<boolean>>
    setLastCommit: Dispatch<SetStateAction<string>>
    pull: boolean
    setCheckRollback?: Dispatch<SetStateAction<boolean>>
}
function Drop({ deploy, setChanges, setLastCommit, pull, setCheckRollback }: DropProps) {
    const axiosAuth = useAxiosAuth()
    const router = useRouter()
    const handleYes = async () => {
        try {
            await axios.post(`/v1/terraform/pullRequest/${pull}`, deploy)
            await axios.post('/v1/terraform/delete', './terraform/pull_request/terraform.tfstate')
            const response = await axios.post('/v1/terraform/deployPullRequest', 'pull_request')
            checkCommit('yes', pull, response.status === 500 ? 'Failed' : 'Deployed')
            // checkCommit('yes', pull, 'Deployed')
            // toast.success("Successfully updated!")
        } catch (error) {
            toast.error("This didn't work.")
            router.push(DashBoardPageUrl)
        }
    }

    const updateDB = async (update: any, type: string) => {
        const args = {
            project: { _id: deploy._id },
            update: update,
            type: type
        }
        try {
            await axios.post('/v1/update-deployment', args)
        } catch (error) { }
    }

    const checkCommit = async (type: string, pull: boolean, text?: string) => {
        try {
            // Cuando es rollbak y dice que no
            if (!pull && type === 'no') return

            // Acutalizar el estado si es si change o rollback
            if (text) await updateDB({ status: text }, 'updateStatus')

            const newLastCommit: Number = !pull ? (deploy.commits[deploy.lastCommit]!.previous) : type === 'yes' ? (deploy.commits.length) : deploy.lastCommit

            if (pull) {
                const infoRepo = deploy.repository_link.split("https://github.com/")[1]
                const commit = await axiosAuth.post('/v1/github-app/get-data', {
                    url: `/repos/${infoRepo}/branches/${deploy.source}`,
                }).then((response: { data: any; }) => response.data).then((data) => data.commit)

                const date = commit.commit.committer.date
                const auxPrevious = (type === 'yes') ? deploy.lastCommit : -1
                await updateDB({ _id: commit.sha, time: date, previous: auxPrevious }, 'updateCommits').then(() => setChanges(false))
            }


            await updateDB({ lastCommit: newLastCommit }, 'updateLastCommit')

            if (pull && type === 'yes') toast.success("Successfully updated!")

            if (!pull) {
                if (setCheckRollback) setCheckRollback(false)
                toast.success("Successfull rollback!")
            }

            if (type !== 'no') router.push(DashBoardPageUrl)

        } catch (error) { console.log(error); toast.error("This didn't work.") }
    }

    const handleNo = async () => {
        checkCommit('no', pull)
    }

    if (pull) {
        return <Dropdown className='flex items-center justify-center w-full text-base font-semibold h-full bg-white rounded-md border-2 border-customColor hover:bg-gray-100 focus:outline-none' title='View Changes' text='New changes are available. Do you want to accept them?' handleYes={handleYes} handleNo={handleNo} />
    } else {
        return <Dropdown
            className="flex items-center justify-center w-3/5 xs:w-2/5 px-8 py-2 text-base font-semibold rounded-md bg-white border-2 border-red-400 text-black hover:bg-red-400 focus:outline-none focus:ring-1 focus:ring-red-400 focus:ring-offset-2 active:bg-white"
            title='Rollback'
            text='This will stop your project and rollback to the last commit. Are you sure?'
            handleYes={handleYes}
            handleNo={handleNo}
        />
    }
}

interface DropdownInt {
    title: string
    text: string
    handleYes: () => Promise<void>
    handleNo: () => Promise<void>
    className: string
}

function Dropdown({ title, text, handleYes, handleNo, className }: DropdownInt) {
    const [isLoading, setIsLoading] = useState(false)

    return (
        <Menu as="div" className={`relative w-2/3 flex ${title === "Rollback" ? "justify-start" : "justify-end"}`} >
            <Menu.Button className={className}>
                {isLoading && (
                    <svg className="animate-spin w-6 h-6 mr-2" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 24 24" id="spinner-alt"><path fill="#000000" d="M6.804 15a1 1 0 0 0-1.366-.366l-1.732 1a1 1 0 0 0 1 1.732l1.732-1A1 1 0 0 0 6.804 15ZM3.706 8.366l1.732 1a1 1 0 1 0 1-1.732l-1.732-1a1 1 0 0 0-1 1.732ZM6 12a1 1 0 0 0-1-1H3a1 1 0 0 0 0 2h2a1 1 0 0 0 1-1Zm11.196-3a1 1 0 0 0 1.366.366l1.732-1a1 1 0 1 0-1-1.732l-1.732 1A1 1 0 0 0 17.196 9ZM15 6.804a1 1 0 0 0 1.366-.366l1-1.732a1 1 0 1 0-1.732-1l-1 1.732A1 1 0 0 0 15 6.804Zm5.294 8.83-1.732-1a1 1 0 1 0-1 1.732l1.732 1a1 1 0 0 0 1-1.732Zm-3.928 1.928a1 1 0 1 0-1.732 1l1 1.732a1 1 0 1 0 1.732-1ZM21 11h-2a1 1 0 0 0 0 2h2a1 1 0 0 0 0-2Zm-9 7a1 1 0 0 0-1 1v2a1 1 0 0 0 2 0v-2a1 1 0 0 0-1-1Zm-3-.804a1 1 0 0 0-1.366.366l-1 1.732a1 1 0 0 0 1.732 1l1-1.732A1 1 0 0 0 9 17.196ZM12 2a1 1 0 0 0-1 1v2a1 1 0 0 0 2 0V3a1 1 0 0 0-1-1Z"></path></svg>
                )
                }
                {title}
            </Menu.Button>
            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className={`absolute ${title === "Rollback" ? "left-0" : "right-0"} z-10 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none mb-2 origin-bottom bottom-full`}>
                    <ul className="py-1">
                        <div className='block px-4 py-2 text-sm text-gray-900'>{text}</div>
                        {/* < MenuItems name='Yes' callback={handleYes} />
                        < MenuItems name='No' callback={handleNo} /> */}
                        < MenuItems name='Yes' callback={handleYes} setIsLoading={setIsLoading} />
                        < MenuItems name='No' callback={handleNo} setIsLoading={setIsLoading} />
                    </ul>
                </Menu.Items>
            </Transition>
        </Menu >
    )
}

interface MenuItemProps {
    name: string,
    callback: () => Promise<void>,
    setIsLoading: Dispatch<SetStateAction<boolean>>
}


function MenuItems({ name, callback, setIsLoading }: MenuItemProps) {
    const handleClick = async () => {
        setIsLoading(true)
        await callback()
        setIsLoading(false)
    }
    return (<Menu.Item>
        {({ active }: { active: boolean }) => (
            < div
                className={classNames(
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'block px-4 py-2 text-sm',
                    'overflow-hidden',
                    'whitespace-nowrap',
                    'overflow-ellipsis',
                )}
                onClick={handleClick}
            >
                {name}
            </div>
        )
        }
    </Menu.Item >);
}

interface AcordionProps {
    output: string
}

function AcordionDetail({ output }: AcordionProps) {
    return (
        // <div className="flex justify-center items-center ">
        <Accordion className="mt-4 mb-8 rounded-t-md">
            <Accordion.Panel className=" h-96 justify-center items-center rounded-t-md w-full">
                <Accordion.Title className="bg-gray-100 h-16 px-6 rounded-t-md">Details Deployment Process</Accordion.Title>
                <Accordion.Content className='px-6 py-4 h-96 overflow-y-auto overflow-x-hidden whitespace-pre-wrap text-gray-700'>
                    {output}
                </Accordion.Content>
            </Accordion.Panel>
        </Accordion>
        // </div>
    )
}

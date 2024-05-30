'use client'

import { Fragment, useEffect, useState } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { useDataContex } from '@/hooks/useDataContext';
import useAxiosAuth from '@/hooks/useAxiosAuth';
import { useEnvContext } from '@/hooks/useEnvContext';
import { Aprops } from 'types/interfaces';


function classNames(...classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export interface BranchVariable {
  name: string,
}

export default function Dropdown() {
  const { repoSelected, setCommitRepo, commitRepo } = useDataContex()
  const axiosAuth = useAxiosAuth()
  const [branchesList, setBrachesList] = useState<BranchVariable[]>([])
  const [selectedBranch, setSelectedBranch] = useState<string>(repoSelected.repo_info.default_branch);
  const { changeValue } = useEnvContext()

  const getCommit = async () => {
    try {
      const infoRepo = repoSelected.repo_info.svn_url.split("https://github.com/")[1]
      await axiosAuth.post('/v1/github-app/get-data', {
        url: `/repos/${infoRepo}/branches/${selectedBranch}`,
      }).then(response => response.data).then(data => data.commit).then(commit => (
        setCommitRepo({ 'sha': commit.sha, 'date': commit.commit.committer.date })
      )
      )
    } catch (error) { console.log(error) }
  }

  useEffect(() => {
    getCommit()
  }, [selectedBranch])

  useEffect(() => {
    setCommitRepo({ 'sha': '', date: new Date() })
    const getBranchesList = async () => {
      try {
        await axiosAuth.post('/v1/github-app/get-data', { url: `${repoSelected.repo_info.branches_url}` },
        ).then(response => response.data).then(data => { setBrachesList(data) })
      } catch (error) { }
    }
    getBranchesList();
    getCommit()
    changeValue({ k: 'github_branch', v: selectedBranch })
  }, [])

  return (
    <Menu as="div" className="relative w-full inline-block text-left">
      <Menu.Button className="flex items-center justify-between h-6 min-w-32 rounded-md bg-white px-3 py-2 text-sm font-light text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
        <div className="overflow-hidden whitespace-nowrap overflow-ellipsis truncate text-sm text-gray-700" >
          {selectedBranch}
        </div>
        <div>
          <ChevronDownIcon className='h-5 w-5 text-gray-500' />
        </div>
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
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <ul className="py-1">
            {branchesList.map((b, index) => (
              <MenuItems key={index} branch={b.name} setSelectedBranch={setSelectedBranch} changeValue={changeValue} getCommit={getCommit} />))}
          </ul>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}


interface menuItemsProps {
  branch: string,
  setSelectedBranch: React.Dispatch<React.SetStateAction<string>>;
  changeValue: (value: Aprops) => void,
  getCommit: () => void
}

function MenuItems({ branch, setSelectedBranch, changeValue, getCommit }: menuItemsProps) {
  return (<Menu.Item>
    {({ active }: { active: boolean }) => (
      <div
        className={classNames(
          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
          'block px-4 py-2 text-sm',
          'overflow-hidden',
          'whitespace-nowrap',
          'overflow-ellipsis',
        )}
        onClick={() => {
          setSelectedBranch(branch)
          changeValue({ k: 'github_branch', v: branch });
        }}
      >
        {branch}
      </div>
    )}
  </Menu.Item>);
}
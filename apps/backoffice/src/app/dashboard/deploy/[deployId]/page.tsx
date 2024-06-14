'use client'
import CardDB, { CardDBSkeleton } from '@/components/dashboard/CardDB'
import SearchFieldDB from '@/components/dashboard/SearchFieldDB'
import { ConfigProjectPageUrl } from '@/constants/urls'
import { useDataContex } from '@/hooks/useDataContext'
import { axios } from '@/lib/api'
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { useSearchContex } from '@/hooks/useSearchContext'
import { PlusCircleIcon } from '@heroicons/react/20/solid'
import Illustration from '@/components/dashboard/Illustration'
import { INITIAL_VALUE_REPO } from '@/context/data-provider'
import Link from 'next/link'

export default function Dashboard() {
  const { data: session } = useSession()
  const { infoUser, setInfoUser, setRepoSelected } = useDataContex()
  const [IsLoading, setIsLoading] = useState(true)
  const { filterList, setText } = useSearchContex()

  useEffect(() => {
    setText('')
    setRepoSelected(INITIAL_VALUE_REPO)
  }, [])

  useEffect(() => {
    const getUser = async () => {
      try {
        await axios.get(`/v1/users/${session?.user._id}`).then(response => response.data).then(
          data => setInfoUser(data)
        )
        setIsLoading(false)
      } catch (error) { console.log(error) }
    }
    if (session) getUser()
  }, [session]);

  return (
    <>
      <div className='py-8 pt-12'>
        <div className='flex justify-center'>
          <SearchFieldDB />
          <Link
            href={ConfigProjectPageUrl}
            className="h-8 ml-3 shadow-lg z-5 flex items-center border disabled:bg-gray-300 disabled:text-gray-700 disabled:cursor-not-allowed bg-customColor hover:bg-violet-500 text-white px-6 py-1.5 rounded-md font-medium text-sm">
            <PlusCircleIcon className="w-5 inline sm:hidden" />
            <span className="hidden md:inline">New Project</span>
          </Link>
        </div>
        {IsLoading ?
          <div className="px-4 py-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0 auto-rows-fr">
            {Array.from({ length: 8 }).map((_, index) => (<div key={index} className='px-2'>
              <CardDBSkeleton />
            </div>))}
          </div>
          : (infoUser.deployments.length === 0) ?
            <Illustration alt={"No projects"} text1={"Looks like you don't have any projects"} text2={"Click 'New Project' to start"} />
            : (filterList(infoUser.deployments, 'deploy').length === 0) ?
              <Illustration alt={"Search Not Found"} text1={"Result not found"} text2={""} />
              :
              <div className="px-4 py-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0 auto-rows-fr">
                {
                  filterList(infoUser.deployments, 'deploy').map((deploy, index) => (
                    <div key={index} className='px-2'>
                      <CardDB deploy={deploy} index={index} />
                      {/* <BookingCard deploy={deploy} index={index} /> */}
                    </div>
                  )
                  )}
              </div>}
      </div>
    </>
  )
}
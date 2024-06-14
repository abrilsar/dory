import { Deploy } from "types/interfaces";
import { RocketLaunchIcon, LinkIcon } from '@heroicons/react/20/solid'
import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useAxiosAuth from "@/hooks/useAxiosAuth";
import { useGetDate } from "@/hooks/useDate";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface props {
  deploy: Deploy,
  index: number,
}

export default function CardDB({ deploy, index }: props) {
  const router = useRouter()
  const { data: session } = useSession()
  const axiosAuth = useAxiosAuth()
  const [update, setUpdate] = useState(false)
  const [color, setColor] = useState('bg-gray-200')
  const [infoRepo, setInfoRepo] = useState('')
  const handleClick = () => {
    router.push(
      `/dashboard/deploy/${deploy._id}?extras=${index}/${update}`
    );
  };

  const getColor = () => {
    if (update) return setColor('bg-orange-500')
    if (deploy.status === 'Failed') setColor('bg-red-500')
    else setColor('bg-green-500')
  }
  useEffect(() => {
    update && getColor()
  }, [update])


  useEffect(() => {
    const getCommit = async () => {
      try {
        const auxCommit = deploy.commits.length
        const infoRepo = deploy.repository_link.split("https://github.com/")[1]
        if (infoRepo) setInfoRepo(infoRepo)

        await axiosAuth.post('/v1/github-app/get-data', {
          url: `/repos/${infoRepo}/branches/${deploy.source}`,
        }).then((response: { data: any; }) => response.data).then((data: { commit: { sha: any; }; }) => data.commit.sha).then((commit: string | undefined) => {
          commit != deploy?.commits[auxCommit! - 1]?._id ? setUpdate(true) : setUpdate(false);
        })
        getColor()

      } catch (error) { console.log(error) }
      return false
    }

    if (deploy && session) getCommit()
  }, [])

  return (
    <div className="w-full max-w-[26rem] h-72 bg-white mt-6 rounded-2xl mx-0 sm:mx-4 md:mx-2 lg:mx-3 shadow-xl z-10 overflow-hidden" onClick={handleClick}>
      <div className="px-6 py-4">
        <div className="relative flex space-x-4 items-center mb-6 justify-between">
          <div className="flex items-center gap-4 ml-1 pt-2">
            <RocketLaunchIcon className="w-12 float-start text-customColor pl-1" />
            <div className="">
              <div className="font-bold text-lg pr-2 text-black">
                {deploy.name_project}
              </div>
              <div className="font-light text-xs pr-2 text-black pt-1">
                <strong className="font-bold">Status:</strong> {deploy.status}
              </div>
            </div>
          </div>
          <div className={`absolute top-0 right-0 w-2.5 h-2.5 ${color} rounded-full`}></div>
        </div>
        <div>
          <div className="flex justify-between pb-4 items-center">
            <div className='flex flex-wrap'>
              <h2 className="text-sm font-bold text-gray-900 mr-2">Last commit</h2>
              <p className="text-sm text-gray-600">
                {/* {useGetDate(deploy.last_commit)} */}
                {useGetDate(deploy.commits[deploy.lastCommit]!.time)}
                {/* 12 months ago */}
              </p>

            </div>
            <button className="bg-gray-100 rounded-2xl px-2 py-1 text-xs flex items-center font-light">
              <InformationCircleIcon className="w-5" />
              <span className="hidden sm:inline ml-0 sm:ml-1">Details</span>
            </button>
          </div>
          <div className="flex justify-between items-center">
            <div className='flex flex-wrap'>
              <h2 className="text-sm font-bold text-gray-900 mr-2">Created</h2>
              <p className="text-sm text-gray-600">
                {useGetDate(deploy.createdAt)}
                {/* 12 months ago */}
              </p>

            </div>

            <div className="col-span-0"></div>
            <div className="flex items-center justify-center">
              <svg className="w-4 mr-1" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 24 24" id="code-branch"><path fill="#000000" d="M17 6.06a3 3 0 0 0-1.15 5.77A2 2 0 0 1 14 13.06h-4a3.91 3.91 0 0 0-2 .56V7.88a3 3 0 1 0-2 0v8.36a3 3 0 1 0 2.16.05A2 2 0 0 1 10 15.06h4a4 4 0 0 0 3.91-3.16A3 3 0 0 0 17 6.06Zm-10-2a1 1 0 1 1-1 1 1 1 0 0 1 1-1Zm0 16a1 1 0 1 1 1-1 1 1 0 0 1-1 1Zm10-10a1 1 0 1 1 1-1 1 1 0 0 1-1 1Z"></path></svg>
              <p className="text-sm text-gray-600 truncate overflow-ellipsis max-w-18">
                {deploy.source}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center pt-1 px-4 py-8">
        <Link className="flex mb-5 text-sm" href={deploy.domain} target="_blank"
          onClick={(event) => {
            event.stopPropagation(); // prevent event bubbling
            // perform action when inner a tag is clicked
          }}>
          <LinkIcon className="w-4 mr-2" />
          View your site here!
        </Link>
        <button className="flex bg-gray-100 rounded-2xl px-3 py-1 text-xs items-center"
          onClick={(event) => {
            window.open(deploy.repository_link, '_blank')
            event.stopPropagation(); // prevent event bubbling
            // perform action when inner a tag is clicked
          }}

        // onClick={() => window.open(deploy.repository_link, '_blank')}
        >
          <svg className="mr-3" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
          {infoRepo}
        </button>
      </div>
    </div>
  );
}

export function CardDBSkeleton() {
  return (<div className="w-full mt-6 h-72 rounded-2xl px-2 sm:px-4 md:px-2 lg:px-3 shadow-lg z-10 bg-gray-200 animate-pulse"></div>)
}

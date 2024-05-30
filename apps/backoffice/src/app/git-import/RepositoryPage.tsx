import Field from "@/components/deploy-config/Field";
import AccountField from "@/components/git-project/AccountField";
import ProjectField from "@/components/git-project/ProjectField";
import ProjectFieldSkeleton from "@/components/git-project/ProjectFieldSkeleton";
import SearchField from "@/components/search/SearchField";
import useAxiosAuth from "@/hooks/useAxiosAuth";
import { useDataContex } from "@/hooks/useDataContext";
import { useSearchContex } from "@/hooks/useSearchContext";
import { useSession } from "next-auth/react";
import { SetStateAction, use, useEffect, useRef, useState } from "react";
import { RepoVariable } from "types/interfaces";
import { PaperAirplaneIcon } from '@heroicons/react/20/solid'
import Illustration from "@/components/dashboard/Illustration";
import { INITIAL_VALUE_REPO } from "@/context/data-provider";


export default function RepositoryPage() {
  const { repoList, setRepoList, installation_id, repoSelected, setRepoSelected } = useDataContex()
  const axiosAuth = useAxiosAuth()
  const [isLoading, setIsLoading] = useState(true)
  const { data: session } = useSession()
  const linkRepo = useRef<HTMLInputElement>(null)
  const { filterList, setText } = useSearchContex()
  const [allowSumbit, setAllowSumbit] = useState(false)
  const [auxAllow, setAuxAllow] = useState(true)
  const [invalidText, setInvalidText] = useState('* Please enter repository link')
  const [showValidation, setShowValidation] = useState(false)


  const handleCheckRepo = async () => {
    setAuxAllow(false)
    setRepoSelected(INITIAL_VALUE_REPO)
    if (repoSelected.repo_id === -2) {
      setAllowSumbit(true)
      setShowValidation(false)
      // if (linkRepo.current) linkRepo.current.value = ''
    } else if (linkRepo.current?.value !== '') {
      const endPoint = linkRepo.current?.value!.split("https://github.com/")[1]
      const response = await axiosAuth.post('/v1/github-app/get-data', { url: `/repos/${endPoint}` })


      if (response.status === 404) {
        setShowValidation(true)
        setInvalidText('* The repository has not been found')


      } else {

        const repo = await response.data

        if (repo.visibility === 'public') {
          setRepoSelected({ repo_info: repo as RepoVariable, repo_id: -2 })
          setInvalidText('* The repository is valid')
          setShowValidation(true)

        } else {
          setShowValidation(true)
          setInvalidText('* The repository has to be public')

        }

      }
    } else {
      setShowValidation(true)
      setInvalidText('* Please enter repository link')
      // setRepoSelected(INITIAL_VALUE_REPO)

    }


  }

  useEffect(() => {
    if (repoSelected.repo_id > -1) {
      setShowValidation(false)
      setAllowSumbit(false)
    }

  }, [repoSelected])

  useEffect(() => {
    setText('')
  }, [])


  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getRepoList = async () => {
      let newRepoList: RepoVariable[] = []
      try {
        for (const id of installation_id) {
          const response = await axiosAuth.post('/v1/github-app/get-data', { url: `/user/installations/${id}/repositories` }).then(response => response.data).then(data => data.repositories).then(repos => newRepoList.push(...repos))
        }
        setRepoList(newRepoList)
        setIsLoading(false)

      } catch (error) { }
    }
    if (repoList.length === 0) {
      getRepoList();
    } else {
      setIsLoading(false)
    }

    return () => {
      isMounted = false;
      controller.abort();
    }
  }, [session, installation_id])

  return (
    <div className="flex flex-col justify-center items-center mt-6 overflow-y-auto h-96 w-full">
      <p className="text-lg font-semibold w-full sm:w-3/4 md:w-2/3 lg:w-2/4 xl:w-2/4 text-center justify-start items-start py-4">Import Repository</p>
      <div className="items-center flex flex-row gap-x-3 sm:w-3/4 md:w-2/3 lg:w-5/12 xl:w-5/12 pt-4 mb-8 sm:flex-wrap">
        <AccountField />
        <SearchField />
      </div>
      <div className="w-11/12 sm:w-3/4 md:w-3/5 lg:w-6/12 xl:w-6/12 flex-col overflow-y-scroll border-1 border-gray-700 h-96">
        {isLoading ?
          Array.from({ length: 10 }).map((_, index) => (
            <ProjectFieldSkeleton key={index} />
          ))
          : repoList.length === 0 ? <Illustration pt={"pt-4"} size={"w-20 h-20"} alt={"No Projects"} text1={"Looks like you don't have any repos"} text2={""} />
            : filterList(repoList, 'github').length === 0 ?
              <div className="justify-center content-start"><Illustration pt={"pt-4"} size={"w-20 h-20"} alt={"Search Not Found"} text1={"Result not found"} text2={""} /></div>
              : filterList(repoList, 'github')
                // .filter((repository: RepoVariable) => repository.visibility === 'public')
                .map((repository: RepoVariable, key: number) => (
                  <ProjectField repo={repository} _id={key} key={key} />
                ))}

      </div>
      <div className="flex items-center pt-2">
        <div className="mr-4 px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt className="text-xs font-medium leading-6 text-gray-900">Import from a 3rd party</dt>
          <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 relative"> {/* Agregamos la clase 'relative' aquí */}
            <input
              type="text"
              placeholder={`${repoSelected.repo_id === -2 ? `${repoSelected.repo_info.svn_url}` : 'https://github.com/github-account/example.git'}`}
              className={`w-full border-gray-300 rounded-lg py-1 px-2 focus:outline-none focus:ring-2 text-xs focus:ring-customColor border`}
              ref={linkRepo}
              onClick={() => {
                setRepoSelected(INITIAL_VALUE_REPO); setAllowSumbit(true)
              }}
            />
            <p hidden={!showValidation} className={`mt-2 text-xs ${repoSelected.repo_id === -2 ? 'text-green-500' : 'text-red-500'} font-medium absolute top-full`}>{invalidText}</p>
          </dd>
        </div>
        <div className="self-end sm:self-center py-6 sm:py-0">
          <button
            className={`h-6 flex justify-center items-center border-2 mr-4 rounded-md py-1.5 text-center font-medium text-xs shadow-sm w-16 ${repoSelected.repo_id === -2 ? 'border-blue-800' : 'border-customColor'} ${repoSelected.repo_id === -2 ? 'bg-blue-800' : 'bg-customColor'} text-white disabled:bg-gray-300 disabled:border-gray-300 disabled:text-gray-700 disabled:cursor-not-allowed`}
            onClick={handleCheckRepo}
            disabled={repoSelected.repo_id >= -1 && !allowSumbit}
          >
            {repoSelected.repo_id === -2 ? 'Selected' : 'Import'}
          </button>
        </div>
        {/* <div className="">
          <dt className="text-xs font-medium leading-6 text-gray-900 ">Import from a 3rd party</dt>
        </div> */}
      </div>
    </div>
  );
}



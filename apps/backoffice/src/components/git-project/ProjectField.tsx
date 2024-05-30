import useAxiosAuth from "@/hooks/useAxiosAuth";
import { useDataContex } from "@/hooks/useDataContext";
import { useGetDate } from "@/hooks/useDate";
import { useEnvContext } from "@/hooks/useEnvContext";
import { useEffect } from "react";
import { RepoState, RepoVariable } from "types/interfaces";
import { INITIAL_VALUE_REPO } from "@/context/data-provider";

type RepositoryPageProps = {
    repo: RepoVariable,
    _id: number
}


export default function ProjectField({ repo, _id }: RepositoryPageProps) {
    const { repoSelected, setRepoSelected } = useDataContex()
    const axiosAuth = useAxiosAuth();

    function handleOnClick(key: number) {
        if (repoSelected.repo_id === key) {
            setRepoSelected(INITIAL_VALUE_REPO)
        } else {
            setRepoSelected({ repo_info: repo as RepoVariable, repo_id: key })
        }
    }

    const date = useGetDate(repo.created_at)
    const name = repo.name

    return (
        <div className={`w-full border-b-2 border-gray-300 p-3 flex justify-between ${(_id === 0) ? 'border-t-2' : ''}`}>
            <div className="flex items-center space-x-2">
                <img className="w-5 h-5 rounded-full" src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/GitHub_Invertocat_Logo.svg/800px-GitHub_Invertocat_Logo.svg.png" alt="Imagen" />
                <p className="text-gray-500 text-xs ">{name}</p>
                <div className="w-1 h-1 bg-gray-500 rounded-full hidden sm:inline"></div>
                <p className="text-xs text-gray-500 hidden sm:inline">{date}</p>
            </div>
            <div >
                <button key={_id} onClick={() => { handleOnClick(_id) }} className={`w-16 h-6 ${repoSelected.repo_id === _id ? 'bg-blue-800' : 'bg-customColor'} text-white text-xs rounded-md font-medium`}>{repoSelected.repo_id === _id ? 'Selected' : 'Import'}</button>
            </div>
        </div >
    )
}


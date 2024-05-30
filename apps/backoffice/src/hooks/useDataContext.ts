import { DataContext } from "@/context/data-provider"
import { useContext } from "react"

export const useDataContex = () => {
    const { repoList, setRepoList, installation_id, setInstallationID, repoSelected, setRepoSelected, infoUser, setInfoUser, commitRepo, setCommitRepo } = useContext(DataContext);
    return {
        repoList,
        setRepoList,
        installation_id,
        setInstallationID,
        repoSelected,
        setRepoSelected,
        infoUser,
        setInfoUser,
        commitRepo,
        setCommitRepo
    }
}
'use client'

import { RepoState, RepoVariable, InfoUser, CommitVariable } from "types/interfaces";
import { Dispatch, SetStateAction, createContext, useState } from "react";

export type DataContextProps = {
    repoList: RepoVariable[]
    setRepoList: Dispatch<SetStateAction<RepoVariable[]>>
    installation_id: string[];
    setInstallationID: Dispatch<SetStateAction<string[]>>
    repoSelected: RepoState;
    setRepoSelected: Dispatch<SetStateAction<RepoState>>;
    infoUser: InfoUser;
    setInfoUser: Dispatch<SetStateAction<InfoUser>>
    commitRepo: CommitVariable,
    setCommitRepo: Dispatch<SetStateAction<CommitVariable>>
}

export const DataContext = createContext<DataContextProps>({} as DataContextProps);


type props = {
    children: React.ReactNode;
};

export const INITIAL_VALUE_REPO: RepoState = {
    repo_info: {
        name: "",
        created_at: new Date(),
        branches_url: "",
        clone_url: "",
        update_at: "",
        svn_url: "",
        default_branch: "",
        visibility: ""
    },
    repo_id: -1,
};
const INITIAL_VALUE_INFO: InfoUser = {
    user: {
        githubId: "",
        name: "",
        email: "",
        deployments: [],
        refresh_token: "",
    },
    deployments: []
};
const INITIAL_VALUE_COMMIT: CommitVariable = {
    sha: '',
    date: new Date()
}



export const DataProvider = ({ children }: props) => {

    const [repoList, setRepoList] = useState<RepoVariable[]>([]);
    const [installation_id, setInstallationID] = useState<string[]>([]);
    const [repoSelected, setRepoSelected] = useState<RepoState>(INITIAL_VALUE_REPO)
    const [infoUser, setInfoUser] = useState<InfoUser>(INITIAL_VALUE_INFO)
    const [commitRepo, setCommitRepo] = useState<CommitVariable>(INITIAL_VALUE_COMMIT)

    return (<DataContext.Provider value={{ repoList, setRepoList, installation_id, setInstallationID, repoSelected, setRepoSelected, infoUser, setInfoUser, commitRepo, setCommitRepo }}>
        {children}
    </DataContext.Provider>);
}


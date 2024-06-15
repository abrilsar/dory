'use client'

import { Aprops, EnvState, AppVariable } from "types/interfaces";
import { createContext, useReducer } from "react";
import { envReducer } from "../lib/env-reducer";

export type EnvContextProps = {
    envState: EnvState,
    addEnv: (envVariable: AppVariable) => void,
    deleteEnv: (index: number) => void,
    changeValue: (value: Aprops) => void,
}

export const EnvContext = createContext<EnvContextProps>({} as EnvContextProps);

const INITIAL_STATE: EnvState = {
    appList: [],
    terraformVar: {
        do_token: process.env.NEXT_PUBLIC_DO_TOKEN as string,
        pub_key: "",
        pvt_key: "",
        region: "sfo3",
        size: "s-4vcpu-8gb-amd",
        docker_link: "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable",
        domain: "deploytap.site",
        pwd: process.env.NEXT_PUBLIC_PWD as string,
        email: "paola.marquez@correo.unimet.edu.ve",
        name_project: "",
        github_link: "",
        github_repo: "",
        github_branch: "",
        env: false,
        docker_command: "",
    },
    envString: "",
}

interface props {
    children: React.ReactNode;
};

export const EnvProvider = ({ children }: props) => {
    const [envState, dispatch] = useReducer(envReducer, INITIAL_STATE)
    const addEnv = (envVar: AppVariable) => {
        dispatch({ type: 'addEnv', payload: envVar })
    }
    const deleteEnv = (index: number) => {
        dispatch({ type: 'deleteEnv', payload: { index } })
    }
    const changeValue = (value: Aprops) => {
        dispatch({ type: 'changeValue', payload: value })
    }
    return (
        <EnvContext.Provider value={{ envState, addEnv, deleteEnv, changeValue }}>
            {children}
        </EnvContext.Provider>
    )
}
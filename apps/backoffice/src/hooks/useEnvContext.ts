import { EnvContext } from "@/context/env-provider"
import { useContext } from "react"

export const useEnvContext=()=>{
    const {envState, addEnv, deleteEnv, changeValue} = useContext(EnvContext);
    return {
        envState,
        addEnv,
        deleteEnv,
        changeValue,
    }
}
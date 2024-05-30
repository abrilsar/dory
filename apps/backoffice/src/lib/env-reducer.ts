'use client'

import { Aprops, EnvState, AppVariable } from "types/interfaces";

type EnvAction =
    | { type: 'addEnv', payload: AppVariable }
    | { type: 'deleteEnv', payload: { index: number } }
    | { type: 'changeValue', payload: Aprops }

export const envReducer = (state: EnvState, action: EnvAction): EnvState => {
    switch (action.type) {
        case "addEnv":
            return {
                ...state,
                appList: [...state.appList, action.payload]
            }
        case "deleteEnv":
            const newappList = [...state.appList]
            newappList.reverse().splice(action.payload.index, 1);
            newappList.reverse()

            return {
                ...state,
                appList: newappList
            }
        case "changeValue":
            return {
                ...state,
                terraformVar: {
                    ...state.terraformVar,
                    [action.payload.k]: action.payload.v,
                },
            }
        default:
            return state
    }
}
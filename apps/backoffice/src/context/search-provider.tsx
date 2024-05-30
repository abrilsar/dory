'use client'

import { Deploy, RepoVariable } from "types/interfaces";
import { Dispatch, SetStateAction, createContext, useState } from "react";

export type SearchContextProps = {
    text: string
    setText: Dispatch<SetStateAction<string>>
    filterList: (list: any[], type: string) => any[],
}

export const SearchContext = createContext<SearchContextProps>({} as SearchContextProps);


type props = {
    children: React.ReactNode;
};


export const SearchProvider = ({ children }: props) => {
    const [text, setText] = useState('');

    const filterList = (list: any[], type: string) => {
        let list_aux = list
        if (type === 'github') {
            list_aux = list.filter((repository: RepoVariable) => repository.visibility === 'public')
        }
        const newList = list_aux.filter((project) => {
            const name = type === 'github' ? project.name : project.name_project

            if (text == "") {
                return project;
            }
            else if (name.toLowerCase().includes(text.toLowerCase())) {
                return project;
            }
        })
        return newList
    }


    return (<SearchContext.Provider value={{ text, setText, filterList }}>
        {children}
    </SearchContext.Provider>);
}


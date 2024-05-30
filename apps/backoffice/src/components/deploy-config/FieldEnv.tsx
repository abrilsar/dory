'use client'

import { useEnvContext } from "@/hooks/useEnvContext";
import { Menu, Transition } from "@headlessui/react";
import { Fragment, useRef, useState } from "react";

interface FieldEnvType {
    numero: number
    keyEnv: string
    valueEnv: string
    msjButton: string
    firstInput?: boolean
}

export default function FieldEnv({ numero, keyEnv, valueEnv, msjButton, firstInput }: FieldEnvType) {
    const { envState, addEnv, deleteEnv, changeValue } = useEnvContext()
    const inputRef1 = useRef<HTMLInputElement>(null);
    const { appList } = envState
    const inputRef2 = useRef<HTMLInputElement>(null);
    const [showValidation, setShowValidation] = useState(false)
    // const [msjButton, setMsjButton] = useState(msjButton)

    // function obtenerArrayDesdeURL(url: string): string[] {
    //     const regex = /^https?:\/\/[^:]+:(\d+)\/?(.*)$/;
    //     const matches = url.match(regex);
    //     if (matches && matches.length === 3) {
    //         const port = matches[1];
    //         const path = matches[2];
    //         return [port!, path!];
    //     }
    //     return [];
    // }

    const getNames = () => {
        if (appList.length === 0) return false
        const names: string[] = appList.map((env: { name: string; }) => env.name)
        console.log("Names: ", names)
        const result = (names.includes(inputRef1.current!.value)) ? true : false
        console.log("Result", result)
        return result
    }

    function handleClick() {
        if (msjButton == 'add') {
            if (inputRef1.current!.value === '' || inputRef2.current!.value === '') return
            if (!getNames()) {
                setShowValidation(false)
                addEnv({ id: numero, name: inputRef1.current!.value.toLocaleLowerCase(), port: inputRef2.current!.value });
                // const result = obtenerArrayDesdeURL(inputRef2.current!.value)
                // changeValue({ k: 'puerto_back', v: result[0]! })
                // changeValue({ k: 'endpoint', v: `/${result[1]!}` })
                // changeValue({ k: 'api_url', v: inputRef1.current!.value })
                inputRef1.current!.value = ''
                inputRef2.current!.value = ''
            } else {
                setShowValidation(true)
            }

            // setMsjButton('delete')
        } else {
            deleteEnv(numero)
            // setMsjButton('add')
        }
    }

    return (
        <div className={`flex justify-end items-center ${(showValidation && firstInput) && 'pb-2'}`} >
            <div className={`mr-2 sm:mr-4 py-0 sm:flex sm:gap-4 sm:px-0 ${(showValidation && firstInput) && 'pt-6 lg:mt-0'}`}>
                <div className="text-sm font-medium leading-6 text-gray-900">Name</div>
                <div className="mt-1 text-sm leading-6 text-gray-700 sm:mt-0">
                    <input
                        type="text"
                        defaultValue={keyEnv}
                        className="w-36 border border-gray-300 rounded-lg py-1 px-2 focus:outline-none focus:ring-2 focus:ring-customColor text-xs"
                        ref={inputRef1}
                        disabled={msjButton == "delete" ? true : false}
                        // disabled={msjButton == "delete" || appList.length === 0 ? true : false}
                    />
                    {(showValidation && firstInput) && <div hidden={!showValidation} className={`mt-2 text-xs text-red-500 font-medium `}>Type another name</div>}
                </div>
            </div>
            <div className="mr-2 sm:mr-4 py-6 sm:flex sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">Port</dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-0">
                    <input
                        type="text"
                        defaultValue={valueEnv}
                        className="w-36 border border-gray-300 rounded-lg py-1 px-2 focus:outline-none focus:ring-2 focus:ring-customColor text-xs"
                        ref={inputRef2}
                        disabled={msjButton == "delete" ? true : false}
                    />
                </dd>
            </div>
            <button
                type="submit"
                // mt-6 sm:mt-0 rounded-md px-2.5 py-1.5  Valores de antess
                className={`mt-6 sm:mt-0 sm:mb-0.5 rounded-md text-sm font-semibold shadow-sm ${msjButton === 'add' ? 'py-0.5 px-5' : 'py-0.5 px-2.5'} ${msjButton === 'delete' ? 'bg-white border-2 border-red-400 text-black hover:bg-red-400' : 'bg-customColor border-2 border-customColor text-white hover:bg-customColor'} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-customColor`}
                onClick={handleClick}
            >
                {msjButton}
            </button>
        </div >
    )
}

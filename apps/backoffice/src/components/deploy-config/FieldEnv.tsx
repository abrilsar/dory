'use client'

import { useEnvContext } from "@/hooks/useEnvContext";
import { Menu, Transition } from "@headlessui/react";
import { Fragment, SetStateAction, useEffect, useId, useRef, useState } from "react";
import Field from "./Field";
import { useDataContex } from "@/hooks/useDataContext";
import { PlusCircleIcon, TrashIcon } from "@heroicons/react/24/outline";

interface FieldEnvType {
    numero: number
    keyEnv: string
    valueEnv: string
    msjButton: string
    firstInput: boolean
}

export default function FieldEnv({ numero, keyEnv, valueEnv, msjButton, firstInput }: FieldEnvType) {
    const { envState, addEnv, deleteEnv, changeValue } = useEnvContext()
    const inputRef1 = useRef<HTMLInputElement>(null);
    const { appList } = envState
    const inputRef2 = useRef<HTMLInputElement>(null);
    const [showValidation, setShowValidation] = useState(false)
    const [inputValue, setInputValue] = useState('')
    const [nameApp, setNameApp] = useState('')

    const getNames = () => {
        if (appList.length === 0) return false
        const names: string[] = appList.map((env: { name: string; }) => env.name)
        const result = (names.includes(inputRef1.current!.value)) ? true : false
        return result
    }

    const addApp = (name: string) => {
        setShowValidation(false)
        addEnv({ id: numero, name: name.toLocaleLowerCase(), port: inputRef2.current!.value })
        inputRef1.current!.value = ''
        inputRef2.current!.value = ''
        setInputValue('')
    }
    function handleClick() {
        if (msjButton == 'add') {
            if (envState.terraformVar.name_project.length === 0) return
            if (inputRef2.current!.value === '' || isNaN(Number(inputRef2.current!.value))) return
            if (inputRef1.current!.value === '') {
                const nameOcupado = appList.some((env) => (env.name === envState.terraformVar.name_project))
                if (nameOcupado) {
                    setShowValidation(true)
                    return
                }
                addApp(envState.terraformVar.name_project)
                return
            }
            if (!getNames()) {
                addApp(inputRef1.current!.value + "." + envState.terraformVar.name_project)
            } else {
                setShowValidation(true)
            }
        } else {
            deleteEnv(numero)
        }
    }

    const handleInputChange = (e: any) => {
        const value = e.target.value
        if (value === '') return setInputValue(`${value}`);
        setInputValue(`${value}.`);

    };

    useEffect(() => {
        if (appList.length > 0) {
            setNameApp(`${keyEnv}`)
        }
    }, [envState.terraformVar.name_project])

    return (
        <>
            <div className={`pt-2 sm:pt-0 flex justify-end items-center sm:flex-row sm:justify-between  ${(showValidation && firstInput) && 'pb-2'}`} >
                <div className={`mt-2 sm:mt-0 mr-2 sm:mr-8 py-0 flex items-center gap-2 sm:gap-4 sm:px-0 ${(showValidation && firstInput) && 'pt-6 lg:mt-0'}`}>
                    <div className="text-sm font-medium leading-6 text-gray-900">Name</div>
                    <div className={`mt-1 text-sm leading-6 text-gray-700 sm:mt-0 ${showValidation && 'relative'}`}>
                        <input
                            type="text"
                            defaultValue={firstInput ? '' : nameApp}
                            className="w-full min-w-[3.75rem] sm:w-36 border border-gray-300 rounded-lg py-1 px-2 focus:outline-none focus:ring-2 focus:ring-customColor text-xs"
                            ref={inputRef1}
                            onChange={handleInputChange}
                            disabled={msjButton == "delete"}
                        />
                        {(showValidation && firstInput) && <div hidden={!showValidation} className={`mt-2 text-xs ${appList.length === 0 ? "text-gray-700" : "text-red-500"} font-medium absolute top-full`}>{appList.length === 0 ? 'Leave blank for domain to match project name' : '*Type another name'}</div>}
                    </div>
                </div>
                <div className={`mt-2 sm:mt-0 mr-2 sm:mr-6 ${msjButton === "delete" ? '' : 'py-6'} flex items-center sm:grid-cols-3 gap-2 sm:gap-4 sm:px-0`}>
                    <dt className="text-sm font-medium leading-6 text-gray-900">Port</dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-0">
                        <input
                            type="text"
                            defaultValue={firstInput ? '' : valueEnv.toLocaleLowerCase()}
                            className="w-full min-w-[3.75rem] sm:w-36 border border-gray-300 rounded-lg py-1 px-2 focus:outline-none focus:ring-2 focus:ring-customColor text-xs"
                            ref={inputRef2}
                            disabled={msjButton == "delete" ? true : false}
                        />
                    </dd>
                </div>
                <button
                    type="submit"
                    // mt-6 sm:mt-0 rounded-md px-2.5 py-1.5  Valores de antess
                    className={`sm:mt-0 sm:mb-0.5 rounded-md text-sm font-semibold shadow-sm ${msjButton === 'add' ? 'py-0.5 px-2 md:px-5 mt-2' : 'py-0.5 px-2.5 mt-3'} ${msjButton === 'delete' ? 'bg-white border-2 border-red-400 text-black hover:bg-red-400' : 'bg-customColor border-2 border-customColor text-white hover:bg-customColor'} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-customColor`}
                    onClick={handleClick}
                >
                    {/* {msjButton} */}
                    <TrashIcon className={`w-5 ${msjButton === 'delete' ? 'inline' : 'hidden'} md:hidden`} />
                    <PlusCircleIcon className={`w-5 ${msjButton === 'add' ? 'inline' : 'hidden'} md:hidden`} />
                    <span className="hidden md:inline">{msjButton}</span>
                </button>
            </div >
            <Field title="Domain" disabled={true} hidden={firstInput ? false : true} defaultValue={`${keyEnv}.deploytap.site`} name="domain" min="sm:min-w-32" inputName={firstInput === undefined ? undefined : inputValue.toLocaleLowerCase()} />
        </>
    )
}

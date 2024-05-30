import { useDataContex } from "@/hooks/useDataContext";
import { useEnvContext } from "@/hooks/useEnvContext";
import { axios } from "@/lib/api";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

type FieldProps = {
    title: string;
    defaultValue: string;
    name: string;
    min?: string
    listNames?: string[]
};

export default function Field({ title, defaultValue, name, min, listNames }: FieldProps) {
    const [projectField, setProjectField] = useState(title === 'Project name' ? true : false)
    const [nameAllow, setNameAllow] = useState(true)
    const [showValidation, setShowValidation] = useState(false)
    const { envState, changeValue } = useEnvContext()
    const inputRef = useRef<HTMLInputElement>(null);
    const [projectNames, setProjecNames] = useState<string[]>([])


    const handleDeploy = () => {
        const value = inputRef.current!.value

        if (projectField) {
            if (projectNames.includes(value)) {
                setNameAllow(false)
                setShowValidation(true)
                changeValue({ k: name, v: '' })
                return;
            }
            setNameAllow(true)
            setShowValidation(false)
            changeValue({ k: name, v: value })
            return;
        }
        changeValue({ k: name, v: value })
    }

    useEffect(() => {
        changeValue({ k: name, v: inputRef.current!.value })

        if (projectField) {
            const getNamesProjects = async () => {
                try {
                    const deployments = await axios.get('/v1/deployments').then(response => response.data)
                    const names: string[] = deployments.map((deploy: { name_project: string; }) => deploy.name_project)
                    return names

                } catch (error) { }
            }

            getNamesProjects().then(names => names ? setProjecNames(names) : [])
        }
    }, [])


    useEffect(() => {
        if (projectNames.length !== 0) {
            if (projectNames.includes(defaultValue)) {
                setNameAllow(false)
                changeValue({ k: name, v: '' })
                setShowValidation(true)
            }
        }
    }, [projectNames])

    return (
        <div className={`flex py-6 ${showValidation ? "items-start" : "items-center"}`}>
            <dt className="text-sm font-medium leading-6 text-gray-900 whitespace-nowrap mr-2 sm:mr-12">{title}</dt>
            <dd className={`w-full ${min} mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0`}>
                <input
                    type="text"
                    defaultValue={defaultValue}
                    className={`w-full border  rounded-lg py-1 px-2 focus:outline-none focus:ring-2 focus:ring-customColor text-xs ${!projectField ? 'border-gray-300' : !nameAllow ? 'border-red-500' : 'border-gray-300'}`}
                    ref={inputRef}
                    onBlur={handleDeploy}
                />
                {projectField && <div hidden={!showValidation} className={`mt-2 text-xs text-red-500 font-medium `}>Sorry! This name has already been used</div>}
            </dd >
        </div >

    );
}
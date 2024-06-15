import { useEnvContext } from "@/hooks/useEnvContext";
import { axios } from "@/lib/api";
import React, { useEffect, useRef, useState } from "react";

type FieldProps = {
    title: string;
    defaultValue: string;
    name: string;
    min?: string;
    listNames?: string[];
    disabled?: boolean;
    hidden: boolean;
    inputName?: string;
};

export default function Field({
    title,
    defaultValue,
    name,
    min,
    listNames,
    disabled,
    hidden,
    inputName,
}: FieldProps) {
    const [projectField, setProjectField] = useState(
        title === "Your project's name" ? true : false
    );
    const [nameAllow, setNameAllow] = useState(true);
    const [showValidation, setShowValidation] = useState(false);
    const { envState, changeValue } = useEnvContext();
    const { appList } = envState;
    const inputRef = useRef<HTMLInputElement>(null);
    const [projectNames, setProjecNames] = useState<string[]>([]);
    //   const [domainValue, setDomainValue] = useState("");
    //   const [countappList, setCountappList] = useState(appList.length);
    // const [hasSpecialChars, setHasSpecialChars] = useState<boolean>(true);

    useEffect(() => {
        if (name === "domain") {
            if (inputRef.current?.value && envState.terraformVar.name_project) {
                inputRef.current.value = `${inputName}${envState.terraformVar.name_project.toLocaleLowerCase()}.deploytap.site`;
            }
            if (
                envState.terraformVar.name_project.length === 0 &&
                inputRef.current?.value
            ) {
                inputRef.current.value = `${inputName}.deploytap.site`;
            }
        }
    }, [inputName, envState.terraformVar.name_project]);

    const handleDeploy = () => {
        const value = inputRef.current!.value;
        // const specialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value);
        // setHasSpecialChars(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value));
        if (title === "Domain") return;
        if (projectField) {
            if (projectNames.includes(value.toLowerCase())) {
                // if (projectNames.includes(value.toLowerCase()) || specialChar) {
                setNameAllow(false);
                setShowValidation(true);
                changeValue({ k: name, v: "" });
                return;
            }
            setNameAllow(true);
            setShowValidation(false);
            changeValue({ k: name, v: value });
            return;
        }
        changeValue({ k: name, v: value });
    };

    useEffect(() => {
        if (title !== "Domain") {
            changeValue({ k: name, v: inputRef.current!.value });

            if (projectField) {
                const getNamesProjects = async () => {
                    try {
                        const deployments = await axios
                            .get("/v1/deployments")
                            .then((response) => response.data);
                        const names: string[] = deployments.map(
                            (deploy: { name_project: string }) => deploy.name_project
                        );
                        return names;
                    } catch (error) { }
                };
                getNamesProjects().then((names) =>
                    names ? setProjecNames(names) : []
                );
            }
        }
    }, []);

    useEffect(() => {
        if (projectNames.length !== 0) {
            if (projectNames.includes(defaultValue)) {
                // if (projectNames.includes(defaultValue) || hasSpecialChars) {
                if (name !== "domain") {
                    setNameAllow(false);
                    changeValue({ k: name, v: "" });
                    setShowValidation(true);
                }
            }
        }
    }, [projectNames]);

    // useEffect(() => {
    //   if (inputRef.current) {
    //     if (
    //       /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(inputRef.current!.value)
    //     ) {
    //       if (name !== "domain") {
    //         setNameAllow(false);
    //         changeValue({ k: name, v: "" });
    //         setShowValidation(true);
    //       }
    //     }
    //   }
    // }, []);

    const changeAppDomain = (value: string) => {
        if (appList.length > 0) {
            const previewsName = envState.terraformVar.name_project;
            appList.map((env) => {
                if (env.name === previewsName) {
                    env.name = value;
                } else {
                    if (env.name.includes(`.${previewsName}`)) {
                        env.name = env.name.split(".")[0] + `.${value}`;
                    }
                }
            });
        }
    };
    const handleNameProjectChange = (e: any) => {
        if (name === "name_project") {
            if (inputRef.current!.value.length === 0) {
                changeAppDomain(" ");
                return changeValue({ k: name, v: " " });
            }
            const aux = inputRef.current!.value.toLocaleLowerCase();
            changeAppDomain(aux);
            changeValue({ k: name, v: aux });
        }
    };

    return (
        !hidden && (
            <div
                className={`flex py-6 ${title === "Domain" ? "sm:pt-2" : ""} ${showValidation ? "items-start" : "items-center"}`}
            >
                <dt
                    className={`text-sm font-medium leading-6 text-gray-900 whitespace-nowrap ${title === "Domain" ? "mr-2" : "mr-2 sm:mr-7"}`}
                >
                    {title}
                </dt>
                <dd
                    className={`w-full ${min} mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0`}
                >
                    <input
                        type="text"
                        defaultValue={defaultValue}
                        className={`${title === "Domain" ? "w-full sm:w-[22.75rem]" : "w-full sm:w-[12.5rem]"} border rounded-lg py-1 px-2 focus:outline-none focus:ring-2 focus:ring-customColor text-xs ${!projectField ? "border-gray-300" : !nameAllow ? "border-red-500" : "border-gray-300"}`}
                        ref={inputRef}
                        onChange={handleNameProjectChange}
                        onBlur={handleDeploy}
                        disabled={disabled}
                    />
                    {projectField && (
                        <div
                            hidden={!showValidation}
                            className={`mt-2 text-xs text-red-500 font-medium `}
                        >
                            Sorry! This name has already been used
                            {/* {hasSpecialChars
                ? "It can't contain special characters"
                : "Sorry! This name has already been used"} */}
                        </div>
                    )}
                </dd>
            </div>
        )
    );
}

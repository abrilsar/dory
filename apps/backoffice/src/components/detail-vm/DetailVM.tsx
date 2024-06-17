"use client";

import { useDataContex } from "@/hooks/useDataContext";
import { useEnvContext } from "@/hooks/useEnvContext";
import { axios } from "@/lib/api";
import { Dialog, Transition } from "@headlessui/react";
import { Accordion } from "flowbite-react";
import Link from "next/link";
import { Fragment, useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { Deploy } from "types/interfaces";
import { DashBoardPageUrl } from "@/constants/urls";
import { XMarkIcon } from "@heroicons/react/24/outline";
// import { useHtmlEscape } from "@/hooks/useHtlmEscape";
import { Terminal } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";
import { FitAddon } from "@xterm/addon-fit";

export default function DetailVM() {
    const [output, setOutput] = useState("");
    const { data: session } = useSession();
    const [hasFetchedData, setHasFetchedData] = useState(false);
    const { repoSelected, commitRepo } = useDataContex();
    const { envState } = useEnvContext();
    const [successProcess, setSuccessProcess] = useState<boolean>();
    const [deploy, setDeploy] = useState<Deploy>();
    // const [isDeployed, setIsDeployed] = useState(false)
    const [open, setOpen] = useState(false);
    // const outputRef = useRef<HTMLDivElement>(null);
    const terminalRef = useRef<HTMLDivElement>(null);
    const xterm = useRef<Terminal | null>(null);
    const [allow, setAllow] = useState(true);
    // const { getHtmlEscape } = useHtmlEscape()
    const privateWords = ["dns_digitalocean_token", "myuser", "password"];
    const [allowSaveInfo, setAllowSaveInfo] = useState("");

    useEffect(() => {
        console.log("Output: ", output);
    }, [output]);

    const WebPreview = ({ url }: { url: string }) => {
        const [screenshotUrl, setScreenshotUrl] = useState<string>("");
        const apiKey = process.env.NEXT_PUBLIC_API_SS as string;

        useEffect(() => {
            const websiteUrl = encodeURIComponent(url);
            fetch(
                `https://api.screenshotmachine.com/?key=${apiKey}&url=${websiteUrl}&dimension=1024x768`
            )
                .then((response) => response.blob())
                .then((blob) => {
                    const imageUrl = URL.createObjectURL(blob);
                    setScreenshotUrl(imageUrl);
                })
                .catch(console.error);
        }, []);

        if (!screenshotUrl) {
            return (
                <div className="h-full w-full object-cover object-center bg-gray-200 animate-pulse"></div>
            );
        }

        return (
            // <div>
            <img
                src={screenshotUrl}
                alt="Web preview"
                className="h-full w-full object-cover object-center"
            />
            // </div>
        );
    };

    function openModal() {
        setOpen(true);
    }

    const getDomain = () => {
        const verifyDomain = envState.appList.some(
            (env) => env.name === envState.terraformVar.name_project
        );
        return `https://www.${verifyDomain ? envState.terraformVar.name_project.toLowerCase() : envState.appList[0]?.name}.deploytap.site`;
    };

    const handleCreateDeployment = async (success: boolean) => {
        let idFile: string = "";
        try {
            idFile = await axios
                .post("/v1/drive/create", {
                    name: envState.terraformVar.name_project,
                    info: output,
                })
                .then((response) => response.data);
        } catch (error) { }

        const info = {
            user_id: session?.user._id,
            project: {
                nameProject: envState.terraformVar.name_project,
                status: success ? "Deployed" : "Failed",
                createdAt: new Date(),
                terraform_output: idFile,
                deploy: null,
            },
            deploy: {
                terraformVar: "66468c047007ad7c0513c725",
                config: {
                    domain: getDomain(),
                    env: envState.terraformVar.env,
                    apps: envState.appList,
                },
                repository: {
                    nameRepo: repoSelected.repo_info.name,
                    source: envState.terraformVar.github_branch,
                    repositoryLink: repoSelected.repo_info.svn_url,
                    lastCommit: 0,
                    commits: [
                        {
                            _id: commitRepo.sha,
                            time: commitRepo.date,
                            previous: -1,
                        },
                    ],
                },
            },
        };
        try {
            await axios
                .post("/v1/create-deployment", info)
                .then((response) => response.data)
                .then((data) => setDeploy(data));
        } catch (error) { }
    };

    const handleApplyTerraform = async () => {
        try {
            const state = envState.terraformVar;
            state.github_repo = repoSelected.repo_info.name;
            state.github_link = repoSelected.repo_info.clone_url;
            if (process.env.NEXT_PUBLIC_PATH_SSH === "C:/Users/Hp 830 G6/.ssh") {
                state.pub_key =
                    "ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBMTUKr+3dcz0x6zRHv6wTW/tLU43/AlpuEH7zsSCbbIAj1R4s95QcVThjcisy2TbClh1tBQ7abL6Hz4zYN21hPY= paola@VenP";
                state.pvt_key = `C:/Users/Hp 830 G6/.ssh/id_ecdsa`;
            } else {
                const path = `${process.env.NEXT_PUBLIC_PATH_SSH}/${state.name_project}`;
                const publicKey = await axios.post("/v1/terraform/ssh", path);
                state.pub_key = publicKey.data;
                state.pvt_key = `${path}/id_rsa`;
                await axios.post("/v1/terraform/registerSSH", envState);
            }
            await axios.post(
                "/v1/terraform/delete",
                "./terraform/create/terraform.tfstate"
            );
            state.env =
                envState.appList.length === 0 && envState.envString === ""
                    ? false
                    : true;
            state.docker_command = state.env
                ? "docker-compose --env-file /etc/.env up -d"
                : "docker-compose up -d";
            await axios.post("/v1/terraform/var", envState);
            await axios.post("/v1/terraform/env", envState);

            const eventSource = new EventSource(
                `${process.env.NEXT_PUBLIC_API_URL}/v1/terraform/deploy`
            );

            eventSource.onopen = () => {
                console.log("EventSource connection established");
            };

            eventSource.onmessage = (event) => {
                if (
                    event.data === "Terraform process completed successfully" ||
                    event.data === "Terraform process failed"
                ) {
                    eventSource.close();
                    //   setOutput((prevOutput) => `${prevOutput}\n${event.data}`);
                    event.data === "Terraform process completed successfully"
                        ? setSuccessProcess(true)
                        : setSuccessProcess(false);
                    // afterTerraform(event.data === 'Terraform process completed successfully' ? true : false)
                }
                if (!privateWords.some((word) => event.data.includes(word))) {
                    xterm.current?.writeln(event.data);
                    setOutput((prevOutput) => `${prevOutput}\n${event.data}`);
                }
            };
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (successProcess !== undefined) {
            setAllow(false);
            handleCreateDeployment(successProcess).then(() => openModal());
        }
    }, [successProcess]);

    useEffect(() => {
        // prettier-ignore
        if (terminalRef.current) {
            xterm.current = new Terminal();
            const fitAddon = new FitAddon();
            xterm.current.loadAddon(fitAddon);
            const newValue = xterm.current.options.theme;
            newValue!.foreground = "#000000";
            xterm.current.options.theme = { ...newValue };

            const newValue2 = xterm.current.options.theme;
            newValue2!.background = "#ffffff";
            xterm.current.options.theme = { ...newValue2 };

            xterm.current.options = {
                fontSize: 16,
                fontWeight: 200,
            };
            xterm.current.open(terminalRef.current);
            xterm.current.textarea?.setAttribute("readonly", "true"); // Establecer el atributo readonly
            fitAddon.fit();
            xterm.current?.writeln("Building...\n");
        }

        return () => {
            xterm.current?.dispose();
            xterm.current = null;
        };
    }, []);

    useEffect(() => {
        allow && handleApplyTerraform();
    }, []);

    return (
        <>
            <div className="flex justify-center items-center">
                <Accordion className="mt-8 rounded-t-md w-11/12 sm:w-3/4 md:w-3/4 lg:w-10/12 xl:w-10/12">
                    <Accordion.Panel className=" h-96 justify-center items-center rounded-t-md w-full pb-4 px-2">
                        <Accordion.Title
                            onClick={(e) => e.stopPropagation()}
                            className="h-16 px-4 rounded-t-md bg-gray-100"
                        >
                            Deployment Progress
                        </Accordion.Title>
                        {/* <div className="pb-4 w-full whitespace-normal overflow-x-hidden px-2"> */}
                        <div
                            ref={terminalRef}
                            className="w-full pl-4 pr-1 py-4 h-96 bg-white overflow-y-hidden whitespace-normal"
                        />
                        {/* </div> */}
                        {/* <div className="whitespace-pre-wrap text-gray-700">{output}</div> */}
                    </Accordion.Panel>
                </Accordion>
            </div>

            <Transition.Root show={open} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={openModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 hidden bg-transparent bg-opacity-75 transition-opacity md:block" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-10 flex items-center justify-center ">
                        <div className="flex h-2/4 items-stretch justify-center text-center md:items-center md:px-2 lg:px-4 ">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
                                enterTo="opacity-100 translate-y-0 md:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 md:scale-100"
                                leaveTo="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
                            >
                                <Dialog.Panel className="flex flex-col items-center justify-center w-full h-screen">
                                    <div className="relative flex flex-col items-center overflow-hidden bg-white rounded-lg px-4 pb-8 pt-14 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8">
                                        <Link
                                            href={DashBoardPageUrl}
                                            type="button"
                                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
                                            onClick={() => setOpen(false)}
                                        >
                                            <span className="sr-only">Cerrar</span>
                                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                        </Link>

                                        <div className="flex flex-col items-center justify-center w-full">
                                            <div className="sm:col-span-8 lg:col-span-7 ">
                                                <p className="text-xl text-center font-bold text-gray-800 mb-2">
                                                    {successProcess
                                                        ? "Deployment Successful"
                                                        : "Deployment Failed"}
                                                </p>
                                                <p className="text-sm font-light text-center mb-4">
                                                    {successProcess
                                                        ? "Congratulations! Your project has been successfully deployed to app"
                                                        : "Error! The project could not be deployed. Check the details for more information"}
                                                </p>

                                                <div className="aspect-h-1 aspect-w-2 overflow-hidden rounded-lg bg-gray-100 sm:col-span-4 lg:col-span-5">
                                                    <WebPreview url={deploy?.domain!} />
                                                </div>
                                                <div className="flex items-center justify-center w-full mx-auto mt-7 gap-6">
                                                    <Link
                                                        href={`${DashBoardPageUrl}/deploy/${deploy?._id}`}
                                                        type="submit"
                                                        className="flex items-center justify-center w-2/3 px-8 py-2 text-base font-medium text-white bg-customColor rounded-md hover:bg-indigo-500  disabled:bg-gray-300 disabled:text-gray-700 disabled:cursor-not-allowed"
                                                    >
                                                        View details
                                                    </Link>
                                                    <Link
                                                        href={DashBoardPageUrl}
                                                        type="submit"
                                                        className="flex items-center justify-center w-2/3 px-8 py-2 text-base font-medium text-black bg-white border-2 border-customColor rounded-md hover:bg-indigo-500 focus:outline-none disabled:bg-gray-300 disabled:text-gray-700 disabled:cursor-not-allowed"
                                                    >
                                                        DashBoard
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </>
    );
}

"use client";

import Dropdown from "@/components/deploy-config/Dropdown";
import EnvItem from "@/components/deploy-config/EnvItem";
import Field from "@/components/deploy-config/Field";
import FieldEnv from "@/components/deploy-config/FieldEnv";
import { useDataContex } from "@/hooks/useDataContext";
import { useEnvContext } from "@/hooks/useEnvContext";
import { useRef, useState } from "react";
import { TooltipWithHelperIcon } from "@/components/deploy-config/ToolTip";

export default function ConfigPage() {
  const { envState } = useEnvContext();
  const { appList } = envState;
  const { repoSelected } = useDataContex();
  const [textArea, setTextArea] = useState<boolean>(false);
  const textAreaRef1 = useRef<HTMLTextAreaElement>(null);
  const [saved, setSaved] = useState<boolean>(false);
  const [isBlur, setIsBlur] = useState(false);
  const handleSaveEnv = () => {
    if (!isBlur) {
      if (saved) return setSaved(false);
      if (textAreaRef1.current?.value! === "") return setSaved(false);
      envState.envString = textAreaRef1.current?.value!;
      return setSaved(true);
    }
    setIsBlur(false);
    return;
  };

  const handleOnBlur = () => {
    if (textAreaRef1.current?.value! === "") return setSaved(false);
    envState.envString = textAreaRef1.current?.value!;
    setSaved(true);
  };

  const handleOnFocus = () => {
    setSaved(false);
  };

  return (
    <div className="h-full flex items-center justify-center bg-bgColor mt-6">
      <div className="w-full max-w-2xl px-2 sm:px-0">
        <div className="justify-center items-center">
          <p className="text-lg font-semibold text-center justify-start items-start py-4">
            Configure your deploy
          </p>
        </div>
        <div className="mt-3 border-t border-gray-100">
          <dl className="divide-y divide-gray-100">
            {/* <Field title="Project name" defaultValue={repoSelected.repo_info.name} name="name_project" /> */}
            <div className="sm:flex sm:flex-row sm:justify-between items-start">
              <Field
                title="Your project's name"
                defaultValue={
                  envState.appList.length === 0
                    ? repoSelected.repo_info.name
                    : envState.terraformVar.name_project
                }
                name="name_project"
                min="sm:min-w-32"
                hidden={false}
              />
              {/* <div className="flex justify-start w-full"> */}
              <div className="flex pt-6 pb-6 sm:pb-0 justify-between">
                <dt className="pr-6 mr-0 sm:mr-2 text-sm font-medium leading-6 text-gray-900 whitespace-nowrap">
                  Branch to clone
                </dt>
                <Dropdown />
                {/* </div> */}
              </div>
            </div>
            <div className="">
              <div className="sm:flex items-start justify-between">
                {/* <div className="flex items-center"> */}
                <div className="flex gap-2 mt-6 sm:mr-0 lg:mr-9">
                  <dt className="text-sm font-medium leading-6 text-gray-900 truncate">
                    Add your apps
                  </dt>
                  <TooltipWithHelperIcon />
                </div>

                <div className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  <FieldEnv
                    numero={appList.length}
                    msjButton={"add"}
                    keyEnv={repoSelected.repo_info.name}
                    valueEnv={"3000"}
                    firstInput={true}
                  />
                </div>
              </div>
            </div>
            {/* </div> */}

            <ul>
              {[...appList].reverse().map((env, index) => (
                <EnvItem key={env.id} index={index} env={env} />
              ))}
            </ul>
          </dl>
        </div>
        <div className="flex justify-between pt-4">
          <div className="flex-row">
            <button
              className="py-0 text-sm mr-3 mt-6 font-medium text-customColor text-left"
              onClick={() => setTextArea(!textArea)}
            >
              Paste your environment variables here!
            </button>
            <div className={`flex justify-center pt-6`}>
              <button
                className={`border-2 ${saved ? "border-red-400" : "border-customColor"}  mr-4 rounded-md px-4 py-1 text-sm font-semibold shadow-sm ${textArea ? "inline" : "hidden"}  bg-white text-black `}
                onClick={handleSaveEnv}
              >
                {saved ? "Saved" : "Save"}
              </button>
            </div>
          </div>
          <textarea
            onBlur={() => {
              setIsBlur(true);
              handleOnBlur();
            }}
            onFocus={handleOnFocus}
            ref={textAreaRef1}
            className={`${textArea ? "inline" : "hidden"} max-w-48 sm:max-w-full mt-3 text-sm text-gray-700 ${textArea ? "mb-6" : "mb-0"}`}
            rows={4}
            cols={42}
          ></textarea>
        </div>
      </div>
    </div>
  );
}

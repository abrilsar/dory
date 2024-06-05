'use client'

import Dropdown from "@/components/deploy-config/Dropdown";
import EnvItem from "@/components/deploy-config/EnvItem";
import Field from "@/components/deploy-config/Field";
import FieldEnv from "@/components/deploy-config/FieldEnv";
import { useDataContex } from "@/hooks/useDataContext";
import { useEnvContext } from "@/hooks/useEnvContext";
import { axios } from "@/lib/api";
import { useEffect, useRef, useState } from "react";
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline'
import { TooltipWithHelperIcon } from "@/components/deploy-config/ToolTip";


export default function ConfigPage() {
  const { envState } = useEnvContext()
  const { appList } = envState
  const { repoSelected } = useDataContex()
  const [textArea, setTextArea] = useState<boolean>(false);
  const textAreaRef1 = useRef<HTMLTextAreaElement>(null);
  const [saved, setSaved] = useState<boolean>(false)
  const handleSaveEnv = () => {
    envState.envString = textAreaRef1.current?.value!
    setSaved(true)
  }

  return (
    <div className="h-full flex items-center justify-center bg-bgColor mt-6">
      <div className="w-full max-w-2xl px-2 sm:px-0">
        <div className="justify-center items-center">
          <p className="text-lg font-semibold text-center justify-start items-start py-4">Configure your deploy</p>

        </div>
        <div className="mt-3 border-t border-gray-100">
          <dl className="divide-y divide-gray-100">
            {/* <Field title="Project name" defaultValue={repoSelected.repo_info.name} name="name_project" /> */}
            <div className="sm:flex sm:flex-row sm:justify-between items-center">
              <Field title="Project name" defaultValue={repoSelected.repo_info.name} name="name_project" min="sm:min-w-32" />
              {/* <div className="flex justify-start w-full"> */}
              <div className="flex items-center pb-6 sm:pb-0 justify-between">
                <dt className="pr-6 mr-0 sm:mr-6 text-sm font-medium leading-6 text-gray-900 whitespace-nowrap">Branch to clone</dt>
                <Dropdown />
                {/* </div> */}
              </div>
            </div>
            <div className="sm:px-0 py-6 sm:py-0 sm:flex items-center justify-between">
              {/* <div className="flex items-center"> */}
              <div className="flex gap-2 mr-3">
                <dt className="text-sm font-medium leading-6 text-gray-900 truncate">Add your app</dt>
                <TooltipWithHelperIcon />
              </div>

              <div className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                <FieldEnv numero={appList.length} msjButton={"add"} keyEnv={repoSelected.repo_info.name} valueEnv={"3000"} firstInput={true} />
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
        <div className='flex justify-between pt-4'>
          <div className="flex-row">
            <button className="py-0 text-sm mr-3 mt-6 font-medium text-customColor text-left" onClick={() => setTextArea(!textArea)}>Paste your environment variables here!</button>
            <div className={`flex justify-center pt-6`}>
              <button
                className={`border-2 ${saved ? "border-red-300" : "border-customColor"}  mr-4 rounded-md px-4 py-1 text-sm font-semibold shadow-sm ${textArea ? 'inline' : 'hidden'}  bg-white text-black `}
                onClick={handleSaveEnv}
                disabled={saved}
              >
                {saved ? "Saved" : "Save"}
              </button>
            </div>
          </div>
          <textarea disabled={saved} ref={textAreaRef1} className={`${textArea ? 'inline' : 'hidden'} mt-3 text-sm text-gray-700 ${textArea ? 'mb-6' : 'mb-0'}`} rows={4} cols={42}></textarea>
        </div>
      </div>
    </div>
  );
}


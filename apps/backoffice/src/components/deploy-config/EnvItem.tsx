import { useEnvContext } from "@/hooks/useEnvContext";
import FieldEnv from "./FieldEnv";
import { AppVariable } from "types/interfaces";

interface props {
    index: number
    env: AppVariable
}

export default function EnvItem({ index, env }: props) {
    const { envState } = useEnvContext()
    return (
        // <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 items-center">
        //     <dt className="text-sm font-medium leading-6 text-gray-900"></dt>
        //     <div className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
        //     </div>
        // </div>
        <div className="sm:px-0 py-0 sm:pt-6 sm:flex items-center justify-end">
            {/* <div className="flex items-center"> */}
            <div className=" hidden sm:flex gap-2 mr-12">
                <dt className="text-sm font-medium leading-6 text-white truncate w-12"></dt>
            </div>

            <div className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                <FieldEnv key={env.id} msjButton="delete" numero={index} keyEnv={env.name} valueEnv={env.port} firstInput={false} />
            </div>
        </div>
    );
}
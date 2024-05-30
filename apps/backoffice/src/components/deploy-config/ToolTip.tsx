import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { Tooltip,} from "@material-tailwind/react";

export function TooltipWithHelperIcon() {
    return (
        <Tooltip
            className='bg-gray-100'
            content={
                <div className="w-52 p-2 rounded-md">
                    <p className="font-medium text-sm text-gray-800 pb-2" >
                        What is Back API_URL?
                    </p>
                    <p className="font-light opacity-80 text-sm text-gray-800 text-justify">
                    Here you must put the environment variable that refers to the URL that connects the front to the back. <br></br> <br></br>If you don't have a back, don't worry, you can leave it blank                    </p>
                </div>
            }
        >
            <QuestionMarkCircleIcon className="w-5 cursor-pointer text-blue-gray-500 items-center justify-center" />
        </Tooltip>
    );
}
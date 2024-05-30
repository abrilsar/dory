import { useSession } from "next-auth/react"


export default function AccountField() {
    const { data: session } = useSession()

    return (
        <div className="h-7 flex items-center rounded mx-auto border border-gray-400 py-1">
            <img className="hidden sm:inline w-4 h-4 rounded-full ml-3" src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/GitHub_Invertocat_Logo.svg/800px-GitHub_Invertocat_Logo.svg.png" alt="Imagen" />
            <p className="px-3 py-1 overflow-hidden text-center whitespace-nowrap overflow-ellipsis text-gray-500 text-xs font-medium">{session?.user.name}</p>
        </div>
    )
}
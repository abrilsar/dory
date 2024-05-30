import { useSearchContex } from "@/hooks/useSearchContext"

export default function SearchFieldDB() {
  const { setText } = useSearchContex()
  return (
    <div className="w-1/2 h-8 shadow-lg z-5 flex items-center rounded border bg-white  border-gray-400 focus-within:border-purple-600 py-1">
      <svg className="w-4 h-5 bg-white rounded-full ml-3 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
      </svg>
      <input className="w-full h-7 border-none rounded focus:ring-0 focus:outline-none text-xs" type="text" placeholder="Search ..." onChange={(event) => { setText(event.target.value) }} />
    </div>
  )
}
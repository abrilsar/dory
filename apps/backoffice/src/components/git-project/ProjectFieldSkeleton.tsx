'use client'

export default function ProjectFieldSkeleton() {
    return (
        <div className='w-full  p-3 flex justify-between animate-pulsess border-b-2 border-slate-100 rounded-md'>
            <div className="flex items-center space-x-2 w-2/4">
                <div className="w-5 h-5 rounded-full bg-gray-200 animate-pulse"></div>
                <div className="w-24 h-5 rounded-md bg-gray-200 animate-pulse flex-grow-0"></div>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <div className="w-24 h-5 rounded-md bg-gray-200 animate-pulse flex-grow-0"></div>
            </div>
            <div >
                <div className='w-16 h-6 rounded-md font-medium bg-gray-100 animate-pulsess'></div>
            </div>
        </div >
    )

}


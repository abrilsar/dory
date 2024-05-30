import React from 'react'

interface infoProp{
    title: string,
    value: string
}

function InfoField({title, value}:infoProp) {
  return (
    <div className='flex'>
        <h2 className="text-xs sm:text-sm font-bold text-gray-900 mr-2">{title}</h2>
          <p className="text-xs sm:text-sm text-gray-600">
            {value}
          </p>

    </div>
  )
}

export default InfoField
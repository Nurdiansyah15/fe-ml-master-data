import React from 'react'

const Card = ({ children, className }) => {
  return (
    <div className={`flex flex-col space-y-3 bg-[#1F1F21] border border-[#454545] px-5 py-3 rounded-xl ${className}`}>
        {children}
    </div>
  )
}

export default Card
import React from 'react'

const DividerBtn = ({label}) => {
  return (
    <h2 className="text-sm m-auto flex text-center font-[manrope] bg-[#FFFFFF0F] font-semibold mb-8 tracking-[3px] text-[#a7aabb] py-3 px-7 rounded=[100px] w-fit rounded-[100px] gap-1 uppercase">
              <img src="/images/icon-sparkle.svg" alt="" />
              {label}
              <img src="/images/icon-sparkle.svg" alt="" />
            </h2>
  )
}

export default DividerBtn
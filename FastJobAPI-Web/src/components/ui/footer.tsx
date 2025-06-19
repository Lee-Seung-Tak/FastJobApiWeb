import React, { useState } from 'react';

export default function Footer() {

  return (
    <footer className="w-full mt-20 border-t border-[#3C3C3C]" >
      <div className="h-[45px] flex items-center justify-center">
        <p className="mt-[25px] [font-family:'Pretendard-Medium',Helvetica] font-medium text-[#767676] text-sm text-center tracking-[0] leading-[19.6px]">
          ⓒ FastJobAPI All Rights Reserved.
        </p>
      </div>
    </footer>

  )
}
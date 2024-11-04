import React from 'react';
import Image from 'next/image';
import whiteOutlineLogo from '../images/headerLogo.png';

export default function Banner() {
    return ( 
      <>
        <div className="relative w-full h-[150px] bg-[#24593D] flex items-center justify-center shadow-2xl">
          <div className="absolute left-0 bottom-0 mr-5">
              <Image
                  src={whiteOutlineLogo}
                  alt="logo"
                  width={196}
                  height={150}
              />
          </div>
          <div className="text-center">
            <h1 className="text-[64px] font-crimson font-bold text-white">Demographic Survey</h1>
          </div>
        </div>
      </>
    );
}
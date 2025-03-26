import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import whiteOutlineLogo from '@app/images/headerLogo.png';

export default function UpdateInventoryBanner() {
    return ( 
      <>
        <div className="relative w-full h-[120px] bg-banner-green flex items-center justify-center shadow-xl">
          <div className="absolute left-0 bottom-0 mr-5">
            <Link href="/volunteer-landing">
              <Image
                  src={whiteOutlineLogo}
                  alt="logo"
                  width={160}
                  height={130}
              />
            </Link>
          </div>
          <div className="text-center">
            <h1 className="text-[54px] font-crimson font-bold text-white">Update Inventory</h1>
          </div>
        </div>
      </>
    );
}
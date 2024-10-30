import React from 'react';
import Image from 'next/image'
import whiteOutlineLogo from '../images/headerLogo.png'

export default function Banner() {
    const myStyles: React.CSSProperties = {
        position: 'absolute',
        width: '100%',
        height: '150px',
        left: '0px',
        top: '0px',
        background: '#24593D',
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
   };

    const imageStyles: React.CSSProperties = {
        marginRight: '20px',
        position: 'absolute',
        left: '0px',
        bottom: '0px',
    };
    
   const textStyles: React.CSSProperties =  {
      fontSize: 64,
      textAlign: 'center',
      fontFamily: "'Crimson Text', serif",
      fontWeight: '700',
    };
    
    return ( 
      <div style={myStyles} className="banner">
        <div style={imageStyles}>
            <Image
                src={whiteOutlineLogo}
                alt="logo"
                width={196}
                height={150}
            />
        </div>
        <div className="banner-content">
          <h1 style={textStyles}>Demographic Survey</h1>
        </div>
      </div>
    );
}
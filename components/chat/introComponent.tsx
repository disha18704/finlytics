import './style.css'
import Image from "next/image";
import React from "react";
import logo from "../../app/assets/image/logo.png";

type Props = {};

const IntroComponent = (props: Props) => {
  return (
    <div className="flex flex-1 mt-36 flex-col items-center justify-center">
      <div className="flex flex-1">
        {/* <Image
          alt="Finlytics Logo"
          src={logo}
          width={200}
          height={200}
          style={{ borderRadius: 20 }}
        /> */}
      </div>
      <h1 style={{fontSize: 40, color: 'white', fontWeight: '100'}}>Ready to Chat?</h1>
      {/* <div className="rotating-phrases mt-3">
        {diagnosisPageContent.phrases.map((item) =>{
            return(
                <span key= {item} style={{fontFamily: '500', color: siteConfig.colorSchemes.secondary}}>{item}</span>
            )
        })}
      </div> */}
    </div>
  );
};

export default IntroComponent;

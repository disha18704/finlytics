"use client";

import React, { useState } from "react";
import Arrow from "../../app/assets/image/app_logo.png";
import Image from "next/image";
import {Input} from "@nextui-org/input";
import { Button } from "@nextui-org/button";

type Props = {
  handleSubmit: (text: string)=>void;
  isLoading: boolean
};

const InputBubble = ({handleSubmit, isLoading}: Props) => {
  const [currentText, setCurrentText] = useState("");


  const buttonClick=()=>{
    setCurrentText("");
    handleSubmit(currentText);
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isLoading) {
      buttonClick();
    }
  };

  return (
    <div className="flex flex-1 w-full h-full rounded-3xl p-3 shadow-lg z-10">
      <Input
        type="text"
        value={currentText}
        variant="bordered"
        onChange={(e) => setCurrentText(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex flex-1 rounded-md focus:outline-none"  
        style={{ color: 'white'}}
        size="lg"
        placeholder="Ask ClinGraph"
      />

      <Button className="focus:outline-none hover:bg-[#e4e6eb] p-2 rounded-full" onClick={buttonClick} disabled={isLoading} >
        <Image alt="orange-arrow" src={Arrow} height={35} width={35} />
      </Button>
    </div>
  );
};

export default InputBubble;

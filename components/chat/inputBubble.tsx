"use client";

import React, { useState } from "react";
import {Input} from "@nextui-org/input";
import { ChevronRight } from "lucide-react"

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
    <div className="flex flex-1 w-full h-full shadow-lg z-10">
      <Input
        type="text"
        value={currentText}
        variant="bordered"
        onChange={(e) => setCurrentText(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex flex-1 rounded-md focus:outline-none"  
        style={{ color: 'white'}}
        size="lg"
        placeholder="Write a message"
        endContent={
          <ChevronRight onClick={buttonClick}/> 
        }
      />


    </div>
  );
};

export default InputBubble;

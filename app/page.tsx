'use client'

import Navbar from "@/components/navbar";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from 'lucide-react';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner"; 

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleInput = (event: any) => {
    setSearchQuery(event.target.value);
  };

  const handleSubmitButton = () => {
    const stock_arr = ["ATOM", "NATH", "HBIO", "MYFW", "IBEX"];

    if (stock_arr.includes(searchQuery.toUpperCase())) {

     const stock_name =searchQuery.toUpperCase()

      router.push(`/stock?name=${stock_name}`);
    } else {
      // Show an error toast if the stock is not found
      toast.error(`${searchQuery} not found.`);
    }
  };

  return (
    <div
      style={{
        height: "70vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center", // Center vertically
        alignItems: "center", // Center horizontally
        backgroundColor: "#000", // Black background for contrast
      }}
    >
      {/* Toaster for Notifications */}
      <Toaster />

      <p
        style={{
          fontSize: 200,
          textAlign: "center",
          marginBottom: 50,
          color: "white",
        }}
      >
        FINLYTICS
      </p>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "10px", // Space between Input and Button
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Input for Stock Name */}
        <Input
          placeholder="Stock name"
          style={{ width: "700px" }}
          onChange={handleInput}
        />
        {/* Button to Trigger Search */}
        <Button onClick={handleSubmitButton}>
          <Search />
        </Button>
      </div>
    </div>
  );
}


"use client";

import FinlyticsHoverLogo from "@/components/FinlyticsHoverLogo";
import SearchBox from "@/components/SearchBox";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const router = useRouter();

  const handleSubmitButton = (query: string) => {
    const stock_arr = ["ATOM", "NATH", "HBIO", "MYFW", "IBEX"];

    console.log(query);

    if (query.length === 0) {
      toast.error("Please enter a stock symbol.");
      return;
    }

    if (stock_arr.includes(query.toUpperCase())) {
      const stock_name = query.toUpperCase();
      router.push(`/stock?name=${stock_name}`);
    } else {
      // toast.error(`${query} not found.`);
      toast.error(
        "Currently available stocks: ATOM, NATH, HBIO, MYFW, IBEX."
      );
    }
  };

  return (
    <div className="main-container">
      <FinlyticsHoverLogo />
      <SearchBox
        handleSubmitButton={handleSubmitButton}
        placeholder="Enter stock symbol"
      />
    </div>
  );
}

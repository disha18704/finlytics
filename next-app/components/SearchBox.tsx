"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface SearchBoxProps {
  handleSubmitButton: (query: string) => void;
  placeholder?: string;
  loading?: boolean;
}

export default function SearchBox({
  handleSubmitButton,
  placeholder = "Enter stock symbol",
  loading = false,
}: SearchBoxProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) {
      handleSubmitButton(searchQuery);
      setSearchQuery("");
    }
  };

  const handleSubmit = () => {
    if (!loading) {
      handleSubmitButton(searchQuery);
      setSearchQuery("");
    }
  };

  return (
    <div className="search-box-container">
      <div className="search-box-wrapper">
        <input
          type="text"
          placeholder={placeholder}
          className="search-box-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <div
          className={`search-icon ${
            loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          }`}
          onClick={() => !loading && handleSubmitButton(searchQuery)}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 15L12 9L6 15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

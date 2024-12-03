import React, { useState, useEffect } from "react";
import CharSplitterRegex from "../utils/char_splitter_regex";
import { motion } from "framer-motion";

type Props = {
  fromUser: boolean;
  message: string;
};

const containerVariants = {
  hidden: {
    scale: 0.8,
    opacity: 0,
  },
  reveal: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.3,
    },
  },
};

const ChatBubble = ({ fromUser, message }: Props) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(!fromUser);

  useEffect(() => {
    if (!fromUser) {
      let currentIndex = 0;
      const trimmedMessage = message.trim();
      const characters = CharSplitterRegex(trimmedMessage);

      const typingInterval = setInterval(() => {
        if (currentIndex < characters.length) {
          setDisplayedText((prev) => prev + characters[currentIndex]);
          currentIndex++;
        } else {
          setIsTyping(false);
          clearInterval(typingInterval);
        }
      }, 15);

      return () => clearInterval(typingInterval);
    } else {
      setDisplayedText(message.trim());
    }
  }, [message, fromUser]);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="reveal"
      className={`flex ${fromUser ? "ml-auto mt-10 mr-24" : "ml-3"}`}
      style={{
        maxWidth: fromUser ? "50%" : "fit-content",
        minWidth: "fit-content",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        display: "inline-block",
        borderWidth: 1,
        borderColor: fromUser ? "#27272a" : "#27272a",
        borderRadius: 20,
        padding: "8px 16px",
        backgroundColor: fromUser ? "#18181b" : "transparent",
      }}
    >
      <p
        style={{
          direction: "ltr",
          whiteSpace: "pre-wrap",
          display: "block",
          maxWidth: "100%",
          overflowWrap: "break-word",
          wordBreak: "break-word",
          margin: 0,
          color: fromUser ? "#ffffff" : "#e4e4e7",
        }}
      >
        {displayedText}
        {isTyping && <span className="animate-pulse">|</span>}
      </p>
    </motion.div>
  );
};

export default ChatBubble;

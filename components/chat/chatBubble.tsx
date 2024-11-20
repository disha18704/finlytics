import React from "react";
import CharSplitterRegex from "./charSplitterRegex";
import { motion } from "framer-motion";

type Props = {
  messageType: string;
  message: string;
};

const charVariants = {
  hidden: { opacity: 0 },
  reveal: { opacity: 1 },
};

const ChatBubble = ({ messageType, message }: Props) => {
  const charactersList = CharSplitterRegex(message);

  return (
    <div
      className={`flex ${messageType === "user" ? "ml-auto mt-10 mr-24" : "ml-3"} p-2 rounded-lg`}
      style={{
        maxWidth: messageType === "user" ? "50%" : "",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        display: "inline-block",
      }}
    >
      {messageType === "user" ? (
        <p>{message}</p>
      ) : (
        <motion.p
          initial="hidden"
          animate="reveal"
          transition={{ staggerChildren: 0.015 }}
          style={{
            display: "block",
            maxWidth: "100%",
            whiteSpace: "normal",
            overflowWrap: "break-word",
            wordBreak: "break-word",
            margin: 0,
          }}
        >
          {charactersList.map((char, index) => (
            <motion.span
              key={index}
              transition={{ duration: 0.35 }}
              variants={charVariants}
              style={{ display: "inline", marginLeft: -10 }}
            >
              {char}
            </motion.span>
          ))}
        </motion.p>
      )}
    </div>
  );
};

export default ChatBubble;

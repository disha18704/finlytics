"use client";

import InputBubble from "@/components/chat/inputBubble";
import React, { useState, useEffect, useRef } from "react";
import { Spinner } from "@nextui-org/spinner";
import logo from "../assets/image/logo.png";
import Image from "next/image";
import IntroComponent from "@/components/chat/introComponent";
import ChatBubble from "@/components/chat/chatBubble";
import axios from "axios";

type Props = {};

const Page = (props: Props) => {
  const [conversation, updateConversation] = useState<{ id: number; userMessage: string; llmResponse: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const lastMessageRef = useRef<HTMLDivElement | null>(null);

  const formatConversationIntoContext = () => {
    return conversation.map((item) => {
      return `user: "${item.userMessage}"\n       finBot (You): "${item.llmResponse}"\n`;
    }).join('');
  };

  const apiRequest = async (query: string, context: string) => {
    const modifiedStr = query.replace(/[^\w]+$/, '');
    const url = `http://0.0.0.0:2000/query-rag/${modifiedStr}`;

    try {
      const response = await axios.get(url, {
        headers: {
          "ngrok-skip-browser-warning": "69420",
        }
      });

      const data = await response.data;
      console.log(response)
      return data.result; 

    } catch (error) {
      console.log(error);
    }
  };

  const queryRag = async (query: string) => {
    try {
      const api_url = `http://0.0.0.0:2000/query-rag/${query}`

      const response = await fetch(api_url)

      if (response.ok) {
        const jsonData = await response.json()
        return jsonData.message.response
      }

    } catch (err) {
      console.log(err)
    }
  }



  async function handleInputSubmit(text: string) {
    const nextId = conversation.length > 0 ? conversation[conversation.length - 1].id + 1 : 1;

    updateConversation((prevConversation) => [
      ...prevConversation,
      { id: nextId, userMessage: text, llmResponse: "null" },
    ]);

    setLoading(true);

    const context = formatConversationIntoContext();
    
    // const llmReply = await apiRequest(text, context);

    const llmReply = await queryRag(text)
    
    updateLlmResponse(text, llmReply);
    
    setLoading(false);
  }

  const updateLlmResponse = (userQuery: string, llmResponse: string) => {
    updateConversation((prevConversation) =>
      prevConversation.map((item) =>
        item.userMessage === userQuery ? { ...item, llmResponse: llmResponse } : item
      )
    );
  };

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 mx-24">
      <div className="fixed bottom-8" style={{ width: "50%", zIndex: 10 }}>
        <InputBubble handleSubmit={handleInputSubmit} isLoading={loading} />
      </div>

      {/* {conversation.length > 0 ? null : <IntroComponent />} */}

      {conversation.map((item, index) => (
        <React.Fragment key={index}>
          <ChatBubble messageType="user" message={item.userMessage} />

          <div
            ref={index === conversation.length - 1 ? lastMessageRef : null}
            className="flex flex-1 mr-auto ml-24 mt-10 p-3 rounded-lg items-center"
            style={{
              maxWidth: "50%",
              wordBreak: "break-word",
              whiteSpace: "normal",
              marginBottom: conversation.length === item.id ? 100 : 0,
            }}
          >

            <Image
              alt="Finlytics Logo"
              src={logo}
              width={40}
              height={40}
              style={{ borderRadius: 80, backgroundColor:"#27272a", padding: 5, paddingTop: 11, paddingBottom: 11 }}
            />
            {item.llmResponse === "null" ? (
              <div
                className="flex flex-1 ml-3 items-center p-3 rounded-lg"
                style={{ boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)" }}
              >
                <p style={{ marginRight: 15 }}>Analyzing</p>
                <Spinner color="default" size="sm" />
              </div>
            ) : (
              <ChatBubble messageType="llm" message={item.llmResponse} />
            )}
          </div>
        </React.Fragment>
      ))}
    </section>
  );
};

export default Page;

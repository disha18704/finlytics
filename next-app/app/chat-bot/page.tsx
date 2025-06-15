"use client";

import { Spinner } from "@nextui-org/spinner";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import ChatBubble from "../../components/ChatBubble";
import SearchBox from "../../components/SearchBox";

interface ConversationItem {
  id: number;
  userMessage: string;
  llmResponse: string;
}

const ChatPage = () => {
  const [conversation, updateConversation] = useState<ConversationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const lastMessageRef = useRef<HTMLDivElement | null>(null);

  const formatConversationIntoContext = () => {
    return conversation
      .map(
        (item) =>
          `user: "${item.userMessage}"\n       finBot (You): "${item.llmResponse}"\n`
      )
      .join("");
  };

  const queryRag = async (query: string) => {
    try {
      const response = await fetch(`http://localhost:8000/query-rag/${query}`);
      // const response = await fetch(`https://finlytics-gcp-188865275452.europe-west1.run.app/query-rag/${query}`);
      if (response.ok) {
        const jsonData = await response.json();
        return jsonData.message.response;
      }
    } catch (err) {
      console.error("Error querying RAG:", err);
    }
  };

  const updateLlmResponse = (userQuery: string, llmResponse: string) => {
    updateConversation((prev) =>
      prev.map((item) =>
        item.userMessage === userQuery
          ? { ...item, llmResponse: llmResponse }
          : item
      )
    );
  };

  async function handleInputSubmit(query: string) {
    if (query.length === 0) {
      toast.error("Oops! Looks like you didn't enter anything.");
      return;
    }

    const nextId =
      conversation.length > 0
        ? conversation[conversation.length - 1].id + 1
        : 1;

    updateConversation((prev) => [
      ...prev,
      { id: nextId, userMessage: query, llmResponse: "null" },
    ]);

    setLoading(true);
    const llmReply = await queryRag(query);
    updateLlmResponse(query, llmReply);
    setLoading(false);
  }

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  return (
    <div className="relative min-h-screen">
      <section className="relative flex flex-col items-center justify-center gap-4 py-8 md:py-10 mx-24 pb-32">
        <SearchBox
          handleSubmitButton={handleInputSubmit}
          placeholder="Ask me anything about microcap stocks"
          loading={loading}
        />

        {conversation.map((item, index) => (
          <React.Fragment key={index}>
            <ChatBubble fromUser={true} message={item.userMessage} />
            <div
              ref={index === conversation.length - 1 ? lastMessageRef : null}
              className="flex flex-1 mr-auto ml-24 mt-10 p-3 rounded-lg items-center max-w-[50%] break-words"
              style={{ zIndex: 2 }}
            >
              {item.llmResponse === "null" ? (
                <div className="flex flex-1 ml-3 items-center p-3 rounded-lg shadow-md">
                  <p className="mr-4">Analyzing</p>
                  <Spinner color="default" size="sm" />
                </div>
              ) : (
                <ChatBubble fromUser={false} message={item.llmResponse} />
              )}
            </div>
          </React.Fragment>
        ))}
      </section>
    </div>
  );
};

export default ChatPage;

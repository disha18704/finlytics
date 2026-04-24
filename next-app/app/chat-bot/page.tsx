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

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000"
).replace(/\/$/, "");

const sanitizeMessage = (value: string) =>
  (value || "").replace(/undefined/g, "").trim();

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

  const queryRag = async (query: string): Promise<string> => {
    try {
      const response = await fetch(`${API_BASE_URL}/query-rag`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          conversation_context: formatConversationIntoContext(),
        }),
      });
      if (response.ok) {
        const jsonData = await response.json();
        if (typeof jsonData?.message === "string" && jsonData.message.trim()) {
          return sanitizeMessage(jsonData.message);
        }
        return "I could not generate a valid response. Please try rephrasing your question.";
      }
      const errorText = await response.text();
      console.error("Error querying RAG:", errorText);
      return "I could not fetch a response from the backend right now. Please try again.";
    } catch (err) {
      console.error("Error querying RAG:", err);
      return "Backend is unreachable. Please check if the server is running.";
    }
  };

  const updateLlmResponse = (userQuery: string, llmResponse: string) => {
    updateConversation((prev) =>
      prev.map((item) =>
        item.userMessage === userQuery
          ? {
              ...item,
              llmResponse:
                sanitizeMessage(llmResponse) ||
                "I could not generate a response. Please try again.",
            }
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

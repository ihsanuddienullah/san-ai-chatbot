"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import {
  db,
  createChat,
  getChat,
  deleteChat,
  updateChatTitle,
  getChatMessages,
  saveMessage,
} from "@/lib/db";
import { useRouter } from "next/navigation";
import { useLiveQuery } from "dexie-react-hooks";
import { SendHorizonal, MinusCircle } from "lucide-react";

import "@/styles/page.css";

const Chat = () => {
  const router = useRouter();
  const chatThreadRef = useRef(null);

  const [currentChatId, setCurrentChatId] = useState<number | null>(null);

  const fetchedChats = useLiveQuery(() =>
    db.chats.orderBy("createdAt").reverse().toArray()
  );

  const currentChat = useLiveQuery(
    () => db.chats.get(Number(currentChatId)),
    [currentChatId]
  );

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setMessages,
    status,
  } = useChat({
    onFinish: async (message) => {
      if (currentChatId && message.role === "assistant") {
        await saveMessage(currentChatId, message.role, message.content);
      }
    },
  });

  const navigateToChat = useCallback(
    (chatId: number) => {
      router.push(`/?chatId=${chatId}`);
      setCurrentChatId(chatId);
    },
    [router]
  );

  const initializeChat = useCallback(async () => {
    const chatId = await createChat();
    navigateToChat(chatId);
  }, [navigateToChat]);

  const setActiveChat = useCallback(
    async (requestedChatId: number | null = null) => {
      if (fetchedChats && fetchedChats.length > 0) {
        return initializeChat();
      }

      if (requestedChatId) navigateToChat(requestedChatId);
      else navigateToChat((fetchedChats || [])[0].id);
    },
    [navigateToChat, fetchedChats, initializeChat]
  );

  return <></>;
};

export default Chat;

'use client'

import { createChat, saveMessage, updateChatTitle } from '@/lib/db'
import { useChat } from '@ai-sdk/react'
import { Message, UIMessage } from 'ai'
import { useRouter } from 'next/navigation'
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from 'react'

type ContextType = {
  currentChatId: number | null
  messages: UIMessage[]
  input: string
  status: 'submitted' | 'streaming' | 'ready' | 'error'
  generateTitle: (message: string, chatId?: number) => void
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSubmit: () => void
  initializeNewChat: (welcomeCallback?: (chatId: number) => void) => void
  setCurrentChatId: React.Dispatch<React.SetStateAction<number | null>>
  setMessages: (
    messages: Message[] | ((messages: Message[]) => Message[])
  ) => void
}

const Context = createContext<ContextType | undefined>(undefined)

type ContextProviderProps = {
  children: ReactNode
}

export const ContextProvider = ({ children }: ContextProviderProps) => {
  const router = useRouter()

  const [currentChatId, setCurrentChatId] = useState<number | null>(null)

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setMessages,
    status,
  } = useChat({
    onFinish: async (message) => {
      if (currentChatId && message.role === 'assistant') {
        await saveMessage(currentChatId, message.role, message.content)
      } else {
        const chatId = await createChat()
        await saveMessage(chatId, message.role, message.content)
        navigateToChat(chatId)
        generateTitle(input, chatId)
      }
    },
  })

  const navigateToChat = useCallback(
    (chatId: number) => {
      router.push(`/chat?chatId=${chatId}`)

      setCurrentChatId(chatId)
    },
    [router, setCurrentChatId]
  )

  const initializeNewChat = useCallback(async () => {
    const chatId = await createChat()
    navigateToChat(chatId)
  }, [navigateToChat])

  const generateTitle = useCallback(
    async (message: string, chatId?: number) => {
      try {
        const response = await fetch('/api/generate-title', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message }),
        })

        if (!response.ok) {
          throw new Error('Failed to generate title')
        }

        const { title } = await response.json()

        const newChatId = chatId || currentChatId

        if (title && newChatId) {
          await updateChatTitle(newChatId, title)
        }
      } catch (error) {
        console.error('Error generating title:', error)
      }
    },
    [currentChatId]
  )

  return (
    <Context.Provider
      value={{
        currentChatId,
        messages,
        input,
        status,
        generateTitle,
        handleInputChange,
        handleSubmit,
        initializeNewChat,
        setCurrentChatId,
        setMessages,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useGlobalContext = (): ContextType => {
  const context = useContext(Context)
  if (context === undefined) {
    throw new Error('useGlobalContext must be used within a ContextProvider')
  }
  return context
}

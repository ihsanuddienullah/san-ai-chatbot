import { useState, useEffect, useCallback, useRef } from 'react'
import { useChat } from '@ai-sdk/react'
import {
  db,
  createChat,
  getChat,
  deleteChat,
  updateChatTitle,
  getChatMessages,
  saveMessage,
} from '@/lib/db'
import { useRouter } from 'next/navigation'
import { useLiveQuery } from 'dexie-react-hooks'

const useCustom = () => {
  const router = useRouter()
  const chatThreadRef = useRef<HTMLDivElement>(null)

  const [currentChatId, setCurrentChatId] = useState<number | null>(null)

  const fetchedChats = useLiveQuery(() =>
    db.chats.orderBy('createdAt').reverse().toArray()
  )

  const currentChat = useLiveQuery(
    () => db.chats.get(Number(currentChatId)),
    [currentChatId]
  )

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
      }
    },
  })

  const navigateToChat = useCallback(
    (chatId: number) => {
      router.push(`/?chatId=${chatId}`)
      setCurrentChatId(chatId)
    },
    [router]
  )

  const initializeNewChat = useCallback(async () => {
    const chatId = await createChat()
    navigateToChat(chatId)
  }, [navigateToChat])

  const setActiveChat = useCallback(
    async (requestedChatId: number | null = null) => {
      if (fetchedChats && fetchedChats.length === 0) {
        return initializeNewChat()
      }

      if (requestedChatId) navigateToChat(requestedChatId)
      else navigateToChat((fetchedChats || [])[0].id)
    },
    [navigateToChat, fetchedChats, initializeNewChat]
  )

  const handleChatSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault()

      if (!input.trim()) return

      await saveMessage(Number(currentChatId), 'user', input)
      handleSubmit()
    },
    [input, handleSubmit, currentChatId]
  )

  const handleDeleteChat = useCallback(async () => {
    if (!currentChatId) return

    if (window.confirm('Are you sure you want to delete this chat?')) {
      await deleteChat(currentChatId)
      setCurrentChatId(null)
      router.push('/')
    }
  }, [currentChatId, router])

  useEffect(() => {
    if (!fetchedChats) return

    if (!currentChatId) {
      const chatId = new URLSearchParams(window.location.search).get('chatId')
      setActiveChat(Number(chatId))
    }

    const loadChatMessages = async () => {
      try {
        const loadedMessages = await getChatMessages(Number(currentChatId))
        setMessages(
          loadedMessages.map((msg) => ({
            ...msg,
            id: String(msg.id),
            createdAt: new Date(msg.createdAt),
          }))
        )
      } catch (error) {
        console.error('Error loading chat messages:', error)
      }
    }

    loadChatMessages()
  }, [currentChatId, fetchedChats, setActiveChat, setMessages])

  useEffect(() => {
    if (chatThreadRef.current && messages.length > 0) {
      chatThreadRef.current.scrollTop = chatThreadRef.current.scrollHeight
    }
  }, [currentChatId, messages])

  return {
    data: {
      currentChat,
      currentChatId,
      fetchedChats,
      input,
      messages,
      status,
    },
    ref: {
      chatThreadRef,
    },
    methods: {
      handleChatSubmit,
      handleDeleteChat,
      handleInputChange,
      initializeNewChat,
      setCurrentChatId,
    },
  }
}

export default useCustom

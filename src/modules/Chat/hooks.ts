import { useEffect, useCallback, useRef } from 'react'
import { db, deleteChat, getChatMessages, saveMessage } from '@/lib/db'
import { useRouter } from 'next/navigation'
import { useLiveQuery } from 'dexie-react-hooks'
import { useGlobalContext } from '@/context'

const useCustom = () => {
  const router = useRouter()
  const chatThreadRef = useRef<HTMLDivElement>(null)

  const {
    currentChatId,
    input,
    messages,
    status,
    setCurrentChatId,
    handleInputChange,
    handleSubmit,
    initializeNewChat,
    navigateToChat,
    generateTitle,
    setMessages,
  } = useGlobalContext()

  const fetchedChats = useLiveQuery(() =>
    db.chats.orderBy('createdAt').reverse().toArray()
  )

  const currentChat = useLiveQuery(
    () => db.chats.get(Number(currentChatId)),
    [currentChatId]
  )

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

      const isFirstMessage =
        (await getChatMessages(Number(currentChatId))).length === 0

      await saveMessage(Number(currentChatId), 'user', input)

      if (isFirstMessage) await generateTitle(input)

      handleSubmit()
    },
    [input, currentChatId, generateTitle, handleSubmit]
  )

  const handleDeleteChat = useCallback(async () => {
    if (!currentChatId) return

    if (window.confirm('Are you sure you want to delete this chat?')) {
      await deleteChat(currentChatId)
      setCurrentChatId(null)
      router.push('/chat')
    }
  }, [currentChatId, router, setCurrentChatId])

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

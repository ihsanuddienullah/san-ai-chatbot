import { useCallback, useEffect, useState } from 'react'
import { useGlobalContext } from '@/context'
import { saveMessage } from '@/lib/db'

const useCustom = () => {
  const {
    input,
    generateTitle,
    handleInputChange,
    handleSubmit,
    initializeNewChat,
    setCurrentChatId,
  } = useGlobalContext()

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChatSubmit = useCallback(
    async (event: React.FormEvent) => {
      setIsSubmitting(true)
      event.preventDefault()

      if (!input.trim()) return

      initializeNewChat(async (chatId) => {
        await saveMessage(chatId, 'user', input)
        generateTitle(input, chatId)
      })

      handleSubmit()

      setIsSubmitting(false)
    },
    [input, handleSubmit, initializeNewChat, generateTitle]
  )

  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      const event = {
        target: { value: suggestion },
      } as React.ChangeEvent<HTMLInputElement>

      handleInputChange(event)
    },
    [handleInputChange]
  )

  useEffect(() => {
    setCurrentChatId(null)
  }, [])

  return {
    data: {
      input,
      isSubmitting,
    },
    methods: {
      handleInputChange,
      handleChatSubmit,
      handleSuggestionClick,
    },
  }
}

export default useCustom

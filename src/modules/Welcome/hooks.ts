import { useCallback, useEffect } from 'react'
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

  const handleChatSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault()

      if (!input.trim()) return

      handleSubmit()
    },
    [input, handleSubmit]
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
    },
    methods: {
      handleInputChange,
      handleChatSubmit,
      handleSuggestionClick,
    },
  }
}

export default useCustom

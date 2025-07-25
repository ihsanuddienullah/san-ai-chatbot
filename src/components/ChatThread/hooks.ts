import { UIMessage } from 'ai'

const useCustom = () => {
  const welcomeMessage: UIMessage = {
    id: 'welcome-message',
    role: 'assistant',
    parts: [
      {
        type: 'text',
        text: '',
      },
    ],
    content: '👋🏻 Hello, I am San! How can I assist you today?',
  }

  return {
    data: {
      welcomeMessage,
    },
  }
}

export default useCustom

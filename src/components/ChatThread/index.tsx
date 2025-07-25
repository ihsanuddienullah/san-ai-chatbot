import { Ref } from 'react'
import Message from './_components/Message'
import useCustom from './hooks'
import { UIMessage } from 'ai'

interface ChatThreadProps {
  messages: UIMessage[]
  status: 'submitted' | 'streaming' | 'ready' | 'error'
  chatThreadRef: Ref<HTMLDivElement>
}

const ChatThread = ({ messages, status, chatThreadRef }: ChatThreadProps) => {
  const { data } = useCustom()

  return (
    <div className="message-container" ref={chatThreadRef}>
      {messages.length === 0 ? (
        <Message {...data.welcomeMessage} />
      ) : (
        messages.map((message, index) => <Message key={index} {...message} />)
      )}

      {status === 'submitted' && (
        <div className="thinking-row">
          <div className="ai-avatar">AI</div>
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatThread

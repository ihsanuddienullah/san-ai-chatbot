'use client'
import { MinusCircle, SendHorizonal, SendHorizonalIcon } from 'lucide-react'
import useCustom from './hooks'
import ChatThread from '@/components/ChatThread'

import '@/styles/page.css'

const Chat = () => {
  const { data, ref, methods } = useCustom()

  if (!data.fetchedChats) {
    return <div>Loading chats...</div>
  }

  return (
    <div className="chat-container">
      <div className="chat-main">
        <div className="chat-header">
          <div className="title-group">
            <h1 className="chat-title">
              {data.currentChat?.title || 'New Chat'}
            </h1>
            <button
              aria-label="Delete Chat"
              className="delete-button"
              onClick={methods.handleDeleteChat}
            >
              <MinusCircle className="delete-icon" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        <ChatThread
          messages={data.messages}
          status={data.status}
          chatThreadRef={ref.chatThreadRef}
        />

        <div className="input-area">
          <form onSubmit={methods.handleSubmit} className="input-form">
            <input
              value={data.input}
              placeholder="Message AI Assistant"
              onChange={methods.handleInputChange}
              className="input-field"
              disabled={data.status !== 'ready' && data.status !== undefined}
              aria-label="Chat Input"
            />
            <button
              type="submit"
              className="submit-button"
              disabled={
                !data.input.trim() ||
                data.status === 'submitted' ||
                data.status === 'streaming'
              }
              aria-label="Send Message"
            >
              <SendHorizonal className="submit-icon" strokeWidth={1.5} />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Chat

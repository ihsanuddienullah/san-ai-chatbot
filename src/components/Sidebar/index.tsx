'use client'

import Link from 'next/link'
import { PenLine, Menu } from 'lucide-react'
import '@/styles/sidebar.css'
import useCustom from './hooks'
import { Chat } from '@/lib/types'

interface SidebarProps {
  fetchedChats: Chat[]
  currentChatId: number | null
  setCurrentChatId: (id: number | null) => void
  initializeNewChat: () => void
}

const Sidebar = ({
  fetchedChats,
  currentChatId,
  setCurrentChatId,
  initializeNewChat,
}: SidebarProps) => {
  const { data, methods } = useCustom()

  return (
    <>
      <button
        onClick={methods.toggleSidebar}
        className="mobile-menu-button"
        aria-label="Open menu"
      >
        <Menu className="mobile-menu-icon" strokeWidth={1.5} />
      </button>

      <div
        className={`sidebar-overlay ${data.isSeidebarOpen ? 'active' : ''}`}
        onClick={methods.toggleSidebar}
      />

      <div className={`sidebar ${data.isSeidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">Chats</h2>
          <button
            onClick={() => {
              initializeNewChat()
              methods.toggleSidebar()
            }}
            className="new-chat-button"
            aria-label="New chat"
          >
            <PenLine className="new-chat-icon" strokeWidth={2} />
          </button>
        </div>

        <div className="chat-list flex flex-col justify-between">
          <div>
            {fetchedChats.map((chat) => (
              <Link
                key={chat.id}
                href={`/chat?chatId=${chat.id}`}
                className={`chat-item ${currentChatId === chat.id ? 'chat-item-active' : ''}`}
                onClick={() => {
                  setCurrentChatId(chat.id)
                  methods.toggleSidebar()
                }}
              >
                <span
                  className={`chat-item-text ${currentChatId === chat.id ? 'chat-item-text-active' : 'chat-item-text-inactive'}`}
                >
                  {chat.title || 'New Chat'}
                </span>
              </Link>
            ))}

            {fetchedChats.length === 0 && (
              <p className="empty-chats">
                No chats available. Start a new chat!
              </p>
            )}
          </div>

          <div className="sidebar-footer">
            <div className="ai-status">
              <div className="ai-status-indicator">
                <div className="ai-status-dot"></div>
                <div className="ai-status-text">Ai Assistant</div>
              </div>
              <div className="ai-status-subtext">Here to help, 24/7</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar

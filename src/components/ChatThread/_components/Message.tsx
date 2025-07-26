import { UIMessage } from 'ai'
import { User } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

const Message = ({ role, content }: UIMessage) => (
  <div
    className={`message-wrapper ${role === 'user' ? 'flex-row-reverse' : ''}`}
  >
    {role === 'user' ? (
      <div className="user-avatar">
        <User className="user-avatar-icon" strokeWidth={1.5} />
      </div>
    ) : (
      <div className="ai-avatar">AI</div>
    )}

    <div
      className={`message-content-wrapper ${role === 'user' ? 'items-end' : ''}`}
    >
      <span className="message-sender">{role === 'user' ? 'You' : 'AI'}</span>

      <div
        className={`message-content ${
          role === 'user' ? 'user-message-bg' : 'ai-message-bg'
        }`}
      >
        <div className="markdown-content">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  </div>
)

export default Message

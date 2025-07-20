import { User } from "lucide-react";
import ReactMarkdown from "react-markdown";

export interface MessageProps {
  role: "user" | "assistant";
  content: string;
}

const Message = ({ role, content }: MessageProps) => (
  <div className="message-wrapper">
    {role === "user" ? (
      <div className="user-avatar">
        <User className="user-avatar-icon" strokeWidth={1.5} />
      </div>
    ) : (
      <div className="ai-avatar">AI</div>
    )}

    <div className="message-content-wrapper">
      <span className="message-sender">{role === "user" ? "You" : "AI"}</span>

      <div
        className={`message-content ${
          role === "user" ? "user-message-bg" : "ai-message-bg"
        }`}
      >
        <div className="markdown-content">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  </div>
);

export default Message;

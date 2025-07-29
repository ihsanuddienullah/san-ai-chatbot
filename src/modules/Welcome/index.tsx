import '@/styles/welcome.css'
import { SendHorizonalIcon } from 'lucide-react'

const Welcome = () => {
  return (
    <div className="welcome-container">
      <div className="flex flex-col items-center md:justify-center gap-4 w-full md:w-1/2 h-1/2 md:h-full justify-between">
        Welcome to San AI Chatbot
        <div className="w-full">
          <form
            onSubmit={() => console.log('submit')}
            className="h-28 relative"
          >
            <textarea
              // value=""
              placeholder="How can I help you today?"
              onChange={() => console.log('input change')}
              className="input-field"
              aria-label="Chat Input"
            />
            <button
              type="submit"
              className="submit-button absolute right-2 bottom-2"
              aria-label="Send Message"
            >
              <SendHorizonalIcon className="submit-icon" strokeWidth={1.5} />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Welcome

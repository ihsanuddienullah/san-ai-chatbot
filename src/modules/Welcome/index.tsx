import { Loader, Send, Sparkles } from 'lucide-react'
import React from 'react'
import useCustom from './hooks'

const Welcome = () => {
  const { data, methods } = useCustom()

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-10">
          <div className="inline-flex items-center bg-green-950 gap-2 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6 backdrop-blur-sm">
            <Sparkles className="size-3 sm:size-4" />
            Welcome to San AI Chatbot
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-green-600 font-bold bg-clip-text mb-4 sm:mb-6 leading-tight tracking-tight">
            Unleash Your
            <br />
            AI Potential
          </h1>

          <p className="text-base sm:text-lg lg:text-xl max-w-2xl mx-auto mb-6 sm:mb-8 px-4 leading-relaxed">
            Experience the future of artificial intelligence. Ask questions and
            explore endless possibilities with our advanced AI assistant.
          </p>
        </div>

        {/* AI Prompt Form */}
        <div className="max-w-2xl mx-auto p-4 sm:p-6 border border-primary/20 rounded-xl shadow-lg">
          <form
            onSubmit={methods.handleChatSubmit}
            className="space-y-3 sm:space-y-4"
          >
            <div className="relative group">
              <input
                type="text"
                placeholder="Ask me anything... What would you like to create today?"
                value={data.input}
                onChange={methods.handleInputChange}
                className="w-full pr-12 h-12 sm:h-14 text-base sm:text-lg bg-background/50 border border-primary/30 rounded-lg px-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300 placeholder:text-muted-foreground/60"
              />
              <button
                type="submit"
                disabled={false}
                className="absolute right-1.5 sm:right-2 top-1.5 sm:top-2 size-9 sm:size-10 rounded-lg bg-gradient-to-r from-primary to-primary/80 text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
              >
                {data.isSubmitting ? (
                  <Loader className="size-3 sm:size-4 animate-spin" />
                ) : (
                  <Send className="size-3 sm:size-4 cursor-pointer" />
                )}
              </button>
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              {[
                'Write a story',
                'Explain quantum physics',
                'Create a business plan',
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => methods.handleSuggestionClick(suggestion)}
                  className="cursor-pointer text-xs sm:text-sm px-3 sm:px-4 py-2 border border-primary/30 rounded-lg bg-transparent text-foreground hover:border-primary hover:bg-primary/10 transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Welcome

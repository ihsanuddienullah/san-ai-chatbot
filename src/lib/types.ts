export interface Chat {
  id: number
  title: string
  createdAt: string
}

export interface Message {
  id: number
  chatId: number
  role: 'system' | 'user' | 'assistant' | 'data'
  content: string
  createdAt: string
}

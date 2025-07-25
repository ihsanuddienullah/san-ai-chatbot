export interface Chat {
  id: number
  title: string
  createdAt: string
}

export interface Message {
  id: number
  chatId: number
  role: 'user' | 'assistant'
  content: string
  createdAt: string
}

import Dexie, { EntityTable } from 'dexie'
import { Chat, Message } from './types'

export const db = new Dexie('ChatAppDB') as Dexie & {
  chats: EntityTable<Chat, 'id'>
  messages: EntityTable<Message, 'id'>
}

db.version(1).stores({
  chats: '++id, title, createdAt',
  messages: '++id, chatId, role, content, createdAt',
})

export const createChat = (title = 'New Chat') =>
  db.chats.add({
    title,
    createdAt: new Date().toISOString(),
  })

export const getChat = async (id: number) => db.chats.get(id)

export const updateChatTitle = async (chatId: number, title: string) => {
  await db.chats.update(chatId, { title })
}

export const saveMessage = async (
  chatId: number,
  role: 'system' | 'user' | 'assistant' | 'data',
  content: string
) => {
  const data = {
    chatId,
    role,
    content,
    createdAt: new Date().toISOString(),
  }

  await db.messages.add(data)

  return data
}

export const getChatMessages = async (chatId: number) => {
  if (!chatId) return Promise.resolve([])

  return db.messages.where('chatId').equals(chatId).sortBy('createdAt')
}

export const deleteChat = async (chatId: number) => {
  await db.messages.where('chatId').equals(chatId).delete()
  await db.chats.delete(chatId)
}

export const getFirstChat = async () => {
  return await db.chats.orderBy('id').last()
}

import { createOpenAI } from '@ai-sdk/openai'
import { generateText } from 'ai'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

const openai = createOpenAI({
  baseURL: 'https://models.inference.ai.azure.com',
  apiKey: process.env.GITHUB_TOKEN,
})

export const POST = async (req: Request) => {
  try {
    const { message } = await req.json()

    const { text } = await generateText({
      model: openai('gpt-4.1'),
      system:
        'You are a helpful AI assistant that generates titles for conversations.',
      prompt:
        'Generate a concise and relevant title for the following conversation (max 5 words): ' +
        message,
    })

    return NextResponse.json({ title: text })
  } catch (error) {
    console.error('Error in test route:', error)

    return NextResponse.json(
      { error: 'Failed to generate title' },
      { status: 500 }
    )
  }
}

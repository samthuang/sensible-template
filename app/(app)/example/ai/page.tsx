'use client'

import { handleGenerateText, handleStreamText } from '@/app/lib/example/actions'
import { readStreamableValue } from 'ai/rsc'
import { useState } from 'react'

export default function Page() {
  const [generatedText, setGeneratedText] = useState('')
  const [streamedText, setStreamedText] = useState('')

  const [isGenerating, setIsGenerating] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)

  const generateText = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsGenerating(true)

    try {
      const formData = new FormData(e.currentTarget)
      const result = await handleGenerateText(formData)

      setGeneratedText(result)
    } catch (e) {
      console.error('Failed to generate text:', e)
      throw new Error('Failed to generate text.')
    } finally {
      setIsGenerating(false)
    }
  }

  const streamText = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsStreaming(true)

    try {
      const formData = new FormData(e.currentTarget)
      const result = await handleStreamText(formData)

      for await (const content of readStreamableValue(result)) {
        setStreamedText(content as string)
      }
    } catch (e) {
      console.error('Failed to stream text:', e)
      throw new Error('Failed to stream text.')
    } finally {
      setIsStreaming(false)
    }
  }

  return (
    <div className="prose">
      <h1>AI Page</h1>
      <h2>Generate Text</h2>
      <section>
        <form onSubmit={generateText}>
          <label htmlFor="prompt">Prompt</label>
          <input type="text" name="prompt" className="form-input" />
          <button type="submit" disabled={isGenerating}>
            {isGenerating ? 'Generating...' : 'Generate'}
          </button>
        </form>
        <p>{generatedText}</p>
      </section>

      <section>
        <h2>Stream Text</h2>
        <form onSubmit={streamText}>
          <label htmlFor="prompt">Prompt</label>
          <input type="text" name="prompt" className="form-input" />
          <button type="submit" disabled={isStreaming}>
            {isStreaming ? 'Streaming...' : 'Stream'}
          </button>
        </form>
        <p>{streamedText}</p>
      </section>
    </div>
  )
}

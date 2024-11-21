'use server'

import db from '@/app/lib/db'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { generateText, streamText } from 'ai'
import { createStreamableValue } from 'ai/rsc'
import { anthropic } from '@ai-sdk/anthropic'

// See server-side validation with zod, see:
// https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#server-side-validation-and-error-handling
const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string(),
})

export async function createUser(formData: FormData) {
  const { email, name } = CreateUserSchema.parse({
    email: formData.get('email'),
    name: formData.get('name'),
  })

  try {
    await db.user.create({ data: { id: crypto.randomUUID(), email, name } })

    revalidatePath('/example/users')
  } catch (error) {
    console.error('Failed to create user:', error)
    throw new Error('Failed to create user.')
  }

  redirect('/example/users')
}

const UpdateUserSchema = z.object({
  email: z.string().email(),
  name: z.string(),
})

export async function updateUser(id: string, formData: FormData) {
  const { email, name } = UpdateUserSchema.parse({
    email: formData.get('email'),
    name: formData.get('name'),
  })

  try {
    await db.user.update({ where: { id }, data: { email, name } })

    revalidatePath('/example/users')
  } catch (error) {
    console.error('Failed to update user:', error)
    throw new Error('Failed to update user.')
  }

  redirect('/example/users')
}

export async function deleteUser(id: string) {
  try {
    await db.user.delete({ where: { id } })

    revalidatePath('/example/users')
  } catch (error) {
    console.error('Failed to delete user:', error)
    throw new Error('Failed to delete user.')
  }

  redirect('/example/users')
}

// export async function uploadUserImage(userId: string, formData: FormData) {
//   const imageFile = formData.get('image') as File

//   const isDevelopment = process.env.NODE_ENV === 'development'
//   const prefix = isDevelopment ? 'development' : ''

//   const pathname = `${prefix}/users/${userId}/${imageFile.name}`

//   const blob = await put(pathname, imageFile, {
//     access: 'public',
//   })

//   revalidatePath(`/example/users/${userId}`)

//   return blob
// }

const HandleGenerateTextSchema = z.object({
  prompt: z.string(),
})
export async function handleGenerateText(formData: FormData) {
  const { prompt } = HandleGenerateTextSchema.parse({
    prompt: formData.get('prompt'),
  })

  // https://sdk.vercel.ai/docs/ai-sdk-core/generating-text#generatetext
  const result = await generateText({
    model: anthropic('claude-3-5-sonnet-20240620'),
    prompt,
  })

  return result.text
}

const HandleStreamTextSchema = z.object({
  prompt: z.string(),
})
export async function handleStreamText(formData: FormData) {
  const { prompt } = HandleStreamTextSchema.parse({
    prompt: formData.get('prompt'),
  })

  // https://sdk.vercel.ai/docs/ai-sdk-core/generating-text#streamtext
  const result = await streamText({
    model: anthropic('claude-3-5-sonnet-20240620'),
    prompt,
  })

  const stream = createStreamableValue(result.textStream)

  return stream.value
}

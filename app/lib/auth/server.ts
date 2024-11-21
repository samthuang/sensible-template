import db from '@/app/lib/db'
import { auth } from '@clerk/nextjs/server'
import { Prisma } from '@prisma/client'

export type CurrentUser = Prisma.UserGetPayload<{
  select: { id: true; email: true; name: true }
}>
export async function fetchCurrentUser() {
  const { userId } = await auth()
  if (!userId) return null

  try {
    const currentUser = await db.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true },
    })

    return currentUser
  } catch (error) {
    console.error('Failed to fetch current user:', error)
    throw new Error('Failed to fetch current user.')
  }
}

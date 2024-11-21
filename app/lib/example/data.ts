import db from '@/app/lib/db'
import { Prisma } from '@prisma/client'
import { list, ListBlobResultBlob } from '@vercel/blob'

export type User = Prisma.UserGetPayload<{
  select: { id: true; email: true; name: true }
}>
export async function fetchUser(id: string): Promise<User | null> {
  try {
    const user = await db.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
      },
    })

    return user
  } catch (error) {
    console.error('Failed to fetch user:', error)
    throw new Error('Failed to fetch user.')
  }
}

export type Users = Prisma.UserGetPayload<{
  select: { id: true; email: true; name: true }
}>[]
export async function fetchUsers(): Promise<Users> {
  try {
    const users = await db.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
      },
    })

    return users
  } catch (error) {
    console.error('Failed to fetch users:', error)
    throw new Error('Failed to fetch users.')
  }
}

export async function fetchUserImageBlob(
  userId: string
): Promise<ListBlobResultBlob | null> {
  const isDevelopment = process.env.NODE_ENV === 'development'
  const prefix = isDevelopment ? 'development' : ''

  const data = await list({ prefix: `${prefix}/users/${userId}` })
  const sortedBlobs = data.blobs.sort(
    (a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime()
  )
  const latestBlobs = sortedBlobs[0]

  return latestBlobs
}

import chalk from 'chalk'
import db from '@/app/lib/db'
import { clerkClient } from '@clerk/nextjs/server'
import { faker } from '@faker-js/faker'

export const info = chalk.cyan
export const error = chalk.redBright
export const success = chalk.greenBright

const clerkCurrentUserId = process.env.DEV_CLERK_CURRENT_USER_ID

const seedCurrentUser = async () => {
  const client = await clerkClient()

  if (!clerkCurrentUserId) {
    console.log(error('DEV_CLERK_CURRENT_USER_ID is not defined in .env'))
    throw new Error('DEV_CLERK_CURRENT_USER_ID is not defined in .env')
  }

  const user = await client.users.getUser(clerkCurrentUserId)
  if (!user) {
    console.log(error('No user found with the current user ID'))
    throw new Error('No user found with the current user ID')
  }

  console.log(info('Seeding current user...'))

  const currentUser = await db.user.create({
    data: {
      id: user.id,
      email: user.emailAddresses[0].emailAddress,
      name: user.fullName || user.id,
    },
  })

  console.log(
    success(`Seeded the current db user: ${clerkCurrentUserId}`, '\n')
  )

  return currentUser
}

const seedRandomUsers = async (count: number) => {
  console.log(info('Seeding users...'))
  for (let i = 0; i < count; i++) {
    const id = faker.string.uuid()
    const name = faker.person.firstName()
    const email = faker.internet.email({ firstName: name })

    await db.user.create({ data: { id, email, name } })

    console.log(success(`Seeded user ${name} with email ${email}`))
  }
  console.log(success(`Seeded ${count} users`, '\n'))
}

// NOTE(Sam): Uncomment when you are using Vercel Blob Storage
// const resetBlobStorageForDevelopment = async () => {
//   console.log(info('Resetting blob storage for development...'))
//   const images = await list({ prefix: 'development' })

//   if (images.blobs.length === 0) {
//     console.log(success('No blobs to reset', '\n'))
//     return
//   }

//   images.blobs.forEach(async (image) => {
//     await del(image.url)
//   })

//   console.log(success('Reset the blob storage for development', '\n'))
// }

async function main() {
  // Manually seed via `npm run prisma:db:seed`
  // Seeds automatically with `npm run prisma:migrate:dev` and `npm run prisma:migrate:reset`
  // NOTE(Sam): Uncomment when you are using Vercel Blob Storage
  // await resetBlobStorageForDevelopment()

  await seedCurrentUser()
  await seedRandomUsers(10)
  try {
  } catch (error) {
    console.error(error)
  }
}

main()
  .then(async () => {
    await db.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await db.$disconnect()
    process.exit(1)
  })

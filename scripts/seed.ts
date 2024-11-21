import chalk from 'chalk'
import db from '@/app/lib/db'

export const info = chalk.cyan
export const error = chalk.redBright
export const success = chalk.greenBright

async function main() {
  // Manually seed via `npm run prisma:db:seed`
  // Seeds automatically with `npm run prisma:migrate:dev` and `npm run prisma:migrate:reset`
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

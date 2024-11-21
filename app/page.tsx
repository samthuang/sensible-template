import { auth } from '@clerk/nextjs/server'
import { fetchCurrentUser } from '@/app/lib/auth/server'
import { SignedIn } from '@clerk/nextjs'

export default async function Page() {
  // Get the user ID of the currently signed-in user
  const { userId } = await auth()
  // Get the db user record of the currently signed-in user
  const currentUser = await fetchCurrentUser()

  return (
    <div>
      <h1>A Sensible Template</h1>
      <SignedIn>
        <h2>Authenticated</h2>
        <ul>
          <li>user id from clerkJS auth helper: {userId}</li>
          <li>user from db: {JSON.stringify(currentUser, null, 2)}</li>
        </ul>
      </SignedIn>
    </div>
  )
}

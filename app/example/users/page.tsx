import { Metadata } from 'next'
import { fetchUsers } from '@/app/lib/example/data'
import Link from 'next/link'
import { deleteUser } from '@/app/lib/example/actions'
import { fetchCurrentUser } from '@/app/lib/auth/server'

export const metadata: Metadata = {
  title: 'Users',
}

export default async function UsersPage() {
  const users = await fetchUsers()
  const currentUser = await fetchCurrentUser()

  return (
    <div>
      <h1>Users Page</h1>
      <Link href="/example/users/create">+create new user</Link>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <Link href={`/example/users/${user.id}`}>
              {user.name} - {user.email}
            </Link>
            {/* Note(Sam): Alternatively, create a client component with a onClick */}
            {/* event handler to call await deleteUser(user.id) */}
            {/* hint: one can abstract this <form /> as a separate component */}
            {currentUser?.id !== user.id && (
              <form action={deleteUser.bind(null, user.id)}>
                <button>
                  <span>delete</span>
                </button>
              </form>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

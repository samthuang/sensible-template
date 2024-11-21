import { notFound } from 'next/navigation'
import { fetchUser, fetchUserImageBlob } from '@/app/lib/example/data'
import UpdateUserForm from '@/app/ui/users/update-user-form'
import { UpdateUserImageForm } from '@/app/ui/users/update-user-image-form'

interface Props {
  params: Promise<{ id: string }>
}

export default async function UserPage(props: Props) {
  const params = await props.params
  const { id } = params

  const user = await fetchUser(id)
  // NOTE(Sam): Uncomment when you are using Vercel Blob Storage
  // const userImageBlob = await fetchUserImageBlob(id)

  if (!user) {
    notFound()
  }

  return (
    <main>
      <h1>{user.name}</h1>
      <UpdateUserForm user={user} />
      {/* // NOTE(Sam): Uncomment when you are using Vercel Blob Storage */}
      {/* <UpdateUserImageForm user={user} blob={userImageBlob} /> */}
    </main>
  )
}

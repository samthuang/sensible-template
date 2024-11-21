import CreateUserForm from '@/app/ui/users/create-user-form'

export const metadata = {
  title: 'Create User',
}

export default async function CreateUserPage() {
  return (
    <main>
      <h1>Create User</h1>
      <CreateUserForm />
    </main>
  )
}

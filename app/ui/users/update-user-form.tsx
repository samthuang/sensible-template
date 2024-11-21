'use client'

import { User } from '@/app/lib/example/data'
import { updateUser } from '@/app/lib/example/actions'
import { useState } from 'react'

interface Props {
  user: User
}

export default function UpdateUserForm({ user }: Props) {
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData()
    formData.append('name', name)
    formData.append('email', email)

    try {
      await updateUser(user.id, formData)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">Name</label>
      <input
        id="name"
        type="text"
        // NOTE: input field with tailwindcss form input style
        className="form-input"
        defaultValue={user.name}
        onChange={(event) => setName(event.target.value)}
        required
      />
      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        className="form-input"
        defaultValue={user.email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />
      <button type="submit">Save</button>
    </form>
  )
}

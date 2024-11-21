'use client'

import { createUser } from '@/app/lib/example/actions'
import { useState } from 'react'

export default function CreateUserForm() {
  // Note(Sam): NextJS purposes to use useFormState and useFormStatus
  // to manage form state and status, respectively. However, I find
  // them unstable as they are still in experimental phase.

  // Note(Sam): For client-side form validation, I recommend using
  // React Hook Form (https://react-hook-form.com/).
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData()
    formData.append('name', name)
    formData.append('email', email)

    try {
      await createUser(formData)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name
        <input
          type="text"
          placeholder="Name"
          onChange={(event) => setName(event.target.value)}
          required
        />
      </label>
      <label>
        Email
        <input
          type="email"
          placeholder="Email"
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </label>
      <button type="submit">Create</button>
    </form>
  )
}

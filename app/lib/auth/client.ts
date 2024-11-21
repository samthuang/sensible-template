'use client'

import { useAtom, useAtomValue } from 'jotai'
import { CurrentUser } from '@/app/lib/auth/server'
import { useEffect } from 'react'
import { currentUserAtom } from '@/app/lib/store'

export const useCurrentUser = () => {
  const currentUser = useAtomValue(currentUserAtom)

  return { currentUser }
}

export const AuthProvider = ({ user }: { user: CurrentUser | null }) => {
  const [, setValue] = useAtom(currentUserAtom)
  useEffect(() => {
    setValue(user)
  }, [user, setValue])
  return null
}

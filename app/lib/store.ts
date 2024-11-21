/**
 * The `store.ts` file is used to manage global state in the
 * application using Jotai, a primitive and flexible state management
 * library for React.
 *
 * In this file, an atom is created to hold the current user's data.
 * An atom represents a piece of state in Jotai. The `currentUserAtom`
 * is initialized with a null value and it will hold the state of the
 * current user throughout the application.
 *
 * Alternatively, you can use other global state management library
 * to your liking such as Zustand.
 */

import { atom } from 'jotai'
import { CurrentUser } from '@/app/lib/auth/server'

export const currentUserAtom = atom<CurrentUser | null>(null)

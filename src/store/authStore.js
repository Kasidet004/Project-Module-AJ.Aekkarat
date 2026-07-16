import { create } from 'zustand'
import { authService } from '@/services/authService'

export const useAuthStore = create((set, get) => ({
  session: null,
  profile: null,
  isLoading: true,
  isInitialized: false,

  get isAuthenticated() {
    return !!get().session
  },
  get role() {
    return get().profile?.role || 'guest'
  },
  get isAdmin() {
    return get().profile?.role === 'admin'
  },

  async initialize() {
    try {
      const session = await authService.getSession()
      let profile = null
      if (session) profile = await authService.getProfile(session.user.id)
      set({ session, profile, isLoading: false, isInitialized: true })
    } catch {
      set({ isLoading: false, isInitialized: true })
    }

    authService.onAuthStateChange(async (_event, session) => {
      if (session) {
        const profile = await authService.getProfile(session.user.id)
        set({ session, profile })
      } else {
        set({ session: null, profile: null })
      }
    })
  },

  async signIn(credentials) {
    const data = await authService.signIn(credentials)
    const profile = await authService.getProfile(data.user.id)
    set({ session: data.session, profile })
    return profile
  },

  async signUp(payload) {
    return authService.signUp(payload)
  },

  async signOut() {
    await authService.signOut()
    set({ session: null, profile: null })
  },
}))

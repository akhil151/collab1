import { create } from "zustand"
import axios from "axios"

export const useUserStore = create((set) => ({
  user: null,
  token: null,
  loading: false,

  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),

  checkAuth: async () => {
    const token = localStorage.getItem("token")
    if (!token) return

    try {
      set({ loading: true })
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      set({ user: response.data, token })
    } catch (error) {
      console.error("Auth check failed:", error)
      localStorage.removeItem("token")
      set({ user: null, token: null })
    } finally {
      set({ loading: false })
    }
  },

  logout: () => {
    set({ user: null, token: null })
  },
}))

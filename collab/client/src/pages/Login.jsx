import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useUserStore } from "../store/userStore"
import axios from "axios"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const { setUser, setToken } = useUserStore()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        email,
        password,
      })

      setToken(response.data.token)
      setUser(response.data.user)
      localStorage.setItem("token", response.data.token)
      navigate("/dashboard")
    } catch (err) {
      setError(err.response?.data?.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black relative overflow-hidden flex items-center justify-center p-4">
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-0 right-1/3 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 right-0 w-96 h-96 bg-pink-500/15 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-slide-in-up">
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-cyan-600 to-pink-600 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
          <div className="glass rounded-2xl shadow-2xl p-8 backdrop-blur-xl relative">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-cyan-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">CB</span>
                </div>
                <span className="text-2xl font-bold gradient-text">CollabBoard</span>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
              <p className="text-slate-300">Sign in to your collaboration workspace</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text text-transparent mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all duration-300 hover:border-slate-600/50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold bg-gradient-to-r from-cyan-300 to-pink-300 bg-clip-text text-transparent mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all duration-300 hover:border-slate-600/50"
                />
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-300 text-sm animate-slide-in-up flex items-center gap-2">
                  <span>⚠️</span>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 gradient-bg-primary hover:shadow-xl hover:shadow-purple-500/30 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-slate-400">
                Don't have an account?{" "}
                <a
                  href="/register"
                  className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-semibold hover:opacity-80 transition-opacity"
                >
                  Sign up
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

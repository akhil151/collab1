import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import PropTypes from "prop-types"
import { User, Bell } from "lucide-react"
import axios from "axios"

export default function Navbar({ user, onLogout, boardTitle }) {
  const navigate = useNavigate()
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (user) {
      fetchUnreadCount()
      // Poll for unread messages every 30 seconds
      const interval = setInterval(fetchUnreadCount, 30000)
      return () => clearInterval(interval)
    }
  }, [user])

  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/messages/unread-count`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setUnreadCount(response.data.count)
    } catch (error) {
      console.error("Failed to fetch unread count:", error)
    }
  }

  const handleLogout = () => {
    onLogout()
    localStorage.removeItem("token")
    navigate("/login")
  }

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
      <div className="max-w-full mx-auto px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <div className="cursor-pointer hover:scale-105 transition-transform" onClick={() => navigate("/dashboard")}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-cyan-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">CB</span>
                </div>
                <span className="text-2xl font-bold gradient-text">CollabBoard</span>
              </div>
            </div>
            {boardTitle && (
              <div className="flex items-center gap-3">
                <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                  {boardTitle}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <>
                <button
                  onClick={() => navigate("/messages")}
                  className="relative flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-slate-100 transition-all"
                  title="View Messages"
                >
                  <Bell className="w-5 h-5 text-slate-700" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => navigate("/profile")}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-slate-100 transition-all"
                  title="View Profile"
                >
                  <User className="w-5 h-5 text-slate-700" />
                  <span className="text-sm font-semibold text-slate-700">{user.name}</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all duration-200 font-semibold border border-slate-200"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

Navbar.propTypes = {
  user: PropTypes.object,
  onLogout: PropTypes.func,
  boardTitle: PropTypes.string
}

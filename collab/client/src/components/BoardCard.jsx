import { useNavigate } from "react-router-dom"
import PropTypes from "prop-types"
import axios from "axios"

export default function BoardCard({ board, onRefresh }) {
  const navigate = useNavigate()

  if (!board || !board._id) {
    console.error("Invalid board data:", board)
    return null
  }

  const boardGradients = [
    "from-purple-500 to-purple-700 hover:from-purple-400 hover:to-purple-600 border-purple-400 hover:border-purple-300",
    "from-cyan-500 to-cyan-700 hover:from-cyan-400 hover:to-cyan-600 border-cyan-400 hover:border-cyan-300",
    "from-pink-500 to-pink-700 hover:from-pink-400 hover:to-pink-600 border-pink-400 hover:border-pink-300",
    "from-emerald-500 to-emerald-700 hover:from-emerald-400 hover:to-emerald-600 border-emerald-400 hover:border-emerald-300",
    "from-orange-500 to-orange-700 hover:from-orange-400 hover:to-orange-600 border-orange-400 hover:border-orange-300",
    "from-blue-500 to-blue-700 hover:from-blue-400 hover:to-blue-600 border-blue-400 hover:border-blue-300",
  ]

  const gradient = board._id && board._id.charCodeAt 
    ? boardGradients[board._id.charCodeAt(0) % boardGradients.length] 
    : boardGradients[0]

  const handleDelete = async (e) => {
    e.stopPropagation()

    if (!board._id) {
      console.error("No board ID to delete")
      return
    }

    if (window.confirm("Are you sure you want to delete this board?")) {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          console.error("No token found")
          return
        }

        await axios.delete(`${import.meta.env.VITE_API_URL}/api/boards/${board._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        
        if (onRefresh && typeof onRefresh === 'function') {
          onRefresh()
        }
      } catch (error) {
        console.error("Failed to delete board:", error)
        alert(error.response?.data?.message || "Failed to delete board")
      }
    }
  }

  return (
    <div
      onClick={() => navigate(`/board/${board._id}`)}
      className={`rounded-2xl p-6 cursor-pointer transition-all duration-300 transform hover:scale-105 hover-lift group border-2 bg-gradient-to-br ${gradient} animate-slide-in-up shadow-lg hover:shadow-2xl`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 pr-4">
          <h3 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-300 group-hover:to-cyan-300 group-hover:bg-clip-text transition-all">
            {board.title || "Untitled Board"}
          </h3>
          <p className="text-slate-300 text-sm mt-2 line-clamp-2">{board.description || "No description"}</p>
        </div>
        <button
          onClick={handleDelete}
          className="opacity-0 group-hover:opacity-100 transition-all duration-200 p-2 text-red-400 hover:bg-red-500/20 hover:scale-110 rounded-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 group-hover:scale-125 transition-transform"></div>
          <span className="text-slate-300 text-xs font-semibold">{board.lists?.length || 0} Lists</span>
        </div>
        <div className="flex -space-x-2">
          {board.members && Array.isArray(board.members) && board.members.slice(0, 3).map((member) => {
            if (!member) return null
            const memberId = typeof member === 'string' ? member : (member._id || member.id)
            const memberName = typeof member === 'string' ? "?" : (member.name || "?")
            
            return (
              <div
                key={memberId}
                className="w-7 h-7 rounded-full border-2 border-slate-900 bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white hover:scale-110 transition-transform"
                title={memberName}
              >
                {memberName.charAt(0).toUpperCase()}
              </div>
            )
          })}
          {board.members && board.members.length > 3 && (
            <div className="w-7 h-7 rounded-full bg-slate-700/50 border-2 border-slate-900 flex items-center justify-center text-xs font-bold text-white hover:scale-110 transition-transform">
              +{board.members.length - 3}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

BoardCard.propTypes = {
  board: PropTypes.object.isRequired,
  onRefresh: PropTypes.func.isRequired
}

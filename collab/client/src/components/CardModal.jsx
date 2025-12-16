import { useState } from "react"
import PropTypes from "prop-types"
import axios from "axios"

export default function CardModal({ card, onClose, onUpdate }) {
  const [title, setTitle] = useState(card.title)
  const [description, setDescription] = useState(card.description || "")
  const [loading, setLoading] = useState(false)

  const handleUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem("token")
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/cards/${card._id}`,
        { title, description },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      onUpdate()
      onClose()
    } catch (error) {
      console.error("Failed to update card:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="glass rounded-2xl border border-white/10 max-w-2xl w-full p-8 animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold gradient-text">Edit Card</h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleUpdate} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text text-transparent mb-2">
              Card Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all font-semibold"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold bg-gradient-to-r from-cyan-300 to-pink-300 bg-clip-text text-transparent mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all resize-none"
              rows="6"
              placeholder="Add a detailed description..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 glass hover:bg-white/10 text-slate-300 hover:text-white rounded-lg font-semibold transition-all border border-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 gradient-bg-primary hover:shadow-lg text-white rounded-lg font-semibold transition-all transform hover:scale-105 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

CardModal.propTypes = {
  card: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired
}

import { useState } from "react"
import PropTypes from "prop-types"
import axios from "axios"

export default function CreateBoardModal({ onClose, onBoardCreated }) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [color, setColor] = useState("from-purple-600 to-cyan-600")
  const [loading, setLoading] = useState(false)

  const colors = [
    { name: "Purple-Cyan", value: "from-purple-600 to-cyan-600" },
    { name: "Purple-Pink", value: "from-purple-600 to-pink-600" },
    { name: "Cyan-Emerald", value: "from-cyan-600 to-emerald-600" },
    { name: "Pink-Red", value: "from-pink-600 to-red-600" },
    { name: "Blue-Purple", value: "from-blue-600 to-purple-600" },
    { name: "Emerald-Cyan", value: "from-emerald-600 to-cyan-600" },
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem("token")
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/boards`,
        { title, description, color },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      onBoardCreated()
    } catch (error) {
      console.error("Failed to create board:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="glass rounded-2xl border border-white/10 max-w-md w-full p-8 animate-scale-in">
        <div className="mb-8">
          <h2 className="text-3xl font-bold gradient-text mb-2">Create Board</h2>
          <p className="text-slate-400">Start a new collaboration space</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text text-transparent mb-2">
              Board Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Q1 Marketing"
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all font-semibold"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold bg-gradient-to-r from-cyan-300 to-pink-300 bg-clip-text text-transparent mb-2">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your board..."
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all resize-none"
              rows="3"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold bg-gradient-to-r from-pink-300 to-emerald-300 bg-clip-text text-transparent mb-3">
              Board Theme
            </label>
            <div className="grid grid-cols-3 gap-3">
              {colors.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  className={`h-10 rounded-lg transition-all transform hover:scale-110 ${
                    color === c.value ? "ring-2 ring-white scale-105" : ""
                  } bg-gradient-to-r ${c.value}`}
                  title={c.name}
                />
              ))}
            </div>
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
              disabled={loading || !title}
              className="flex-1 px-4 py-3 gradient-bg-primary hover:shadow-lg text-white rounded-lg font-semibold transition-all transform hover:scale-105 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

CreateBoardModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onBoardCreated: PropTypes.func.isRequired
}

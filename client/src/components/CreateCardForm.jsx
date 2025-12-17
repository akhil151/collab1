import { useState } from "react"
import PropTypes from "prop-types"
import axios from "axios"

export default function CreateCardForm({ listId, boardId, onClose, onCreated }) {
  const [title, setTitle] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem("token")
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/cards`,
        { title, list: listId, board: boardId },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      onCreated()
    } catch (error) {
      console.error("Failed to create card:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-4 space-y-3 border border-slate-200 shadow-lg animate-slide-in-up">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter card title..."
        className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all text-sm font-semibold"
        autoFocus
        required
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg text-white rounded-lg text-sm font-semibold transition-all transform hover:scale-105 disabled:opacity-50 active:scale-95"
        >
          {loading ? "Adding..." : "Add Card"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 rounded-lg text-sm font-semibold transition-all border border-slate-300"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

CreateCardForm.propTypes = {
  listId: PropTypes.string.isRequired,
  boardId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onCreated: PropTypes.func.isRequired
}

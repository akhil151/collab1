import { useState } from "react"
import { X, Send } from "lucide-react"
import axios from "axios"

export default function CollaborationModal({ onClose, onSuccess }) {
  const [boardId, setBoardId] = useState("")
  const [message, setMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!boardId.trim()) {
      setError("Please enter a Board ID")
      return
    }

    setSending(true)
    try {
      const token = localStorage.getItem("token")
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/collaboration-requests`,
        { boardId: boardId.trim(), message },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      alert("Collaboration request sent successfully!")
      onSuccess?.()
      onClose()
    } catch (error) {
      console.error("Failed to send collaboration request:", error)
      setError(error.response?.data?.message || "Failed to send collaboration request")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 animate-slide-in-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-2xl">
          <div>
            <h2 className="text-2xl font-bold">Request Collaboration</h2>
            <p className="text-sm text-white/80 mt-1">Collaborate with another admin's board</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Board ID *
            </label>
            <input
              type="text"
              value={boardId}
              onChange={(e) => setBoardId(e.target.value)}
              placeholder="Enter the Board ID you want to collaborate on"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter the Board ID from another admin. You'll join as a member once approved.
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Message (Optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Why would you like to collaborate on this board?"
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={sending || !boardId.trim()}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {sending ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send Request
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

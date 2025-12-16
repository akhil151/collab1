import { useState } from "react"
import PropTypes from "prop-types"
import { X, Plus, Trash2 } from "lucide-react"
import axios from "axios"

export default function ListModal({ list, onClose, onCardClick, onRefresh }) {
  const [showCreateCard, setShowCreateCard] = useState(false)
  const [cardTitle, setCardTitle] = useState("")
  const [cardDescription, setCardDescription] = useState("")
  const [loading, setLoading] = useState(false)

  const handleCreateCard = async (e) => {
    e.preventDefault()
    if (!cardTitle.trim()) return

    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/cards`,
        {
          title: cardTitle,
          description: cardDescription,
          list: list._id,
          board: list.board,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      setCardTitle("")
      setCardDescription("")
      setShowCreateCard(false)
      onRefresh()
    } catch (error) {
      console.error("Failed to create card:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCard = async (cardId) => {
    if (!window.confirm("Delete this card?")) return

    try {
      const token = localStorage.getItem("token")
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/cards/${cardId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      onRefresh()
    } catch (error) {
      console.error("Failed to delete card:", error)
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-6 z-50 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl border-2 border-slate-700/50 max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slide-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-700/50 flex items-center justify-between bg-gradient-to-r from-purple-900/20 to-pink-900/20">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              {list.title}
            </h2>
            <p className="text-slate-400 mt-1 font-medium">{list.cards?.length || 0} cards</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-xl transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Cards Grid */}
        <div className="p-8 overflow-y-auto" style={{ maxHeight: "calc(90vh - 180px)", minHeight: "500px" }}>
          <div className="grid grid-cols-3 gap-6">
            {list.cards && list.cards.length > 0 ? (
              list.cards.map((card) => (
                <div
                  key={card._id}
                  className="group relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border-2 border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20"
                  onClick={() => onCardClick(card)}
                >
                  {/* Delete Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteCard(card._id)
                    }}
                    className="absolute top-3 right-3 p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <h4 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-2 pr-8">
                    {card.title}
                  </h4>
                  {card.description && (
                    <p className="text-sm text-slate-400 mt-3 line-clamp-3">
                      {card.description}
                    </p>
                  )}
                  
                  {/* Card Footer */}
                  <div className="mt-4 pt-4 border-t border-slate-700/50 flex items-center justify-between">
                    {card.assignees?.length > 0 && (
                      <div className="flex -space-x-2">
                        {card.assignees.slice(0, 3).map((assignee) => (
                          <div
                            key={assignee._id}
                            className="w-8 h-8 rounded-full border-2 border-slate-800 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white"
                            title={assignee.name}
                          >
                            {assignee.name?.charAt(0).toUpperCase()}
                          </div>
                        ))}
                      </div>
                    )}
                    {card.dueDate && (
                      <span className="text-xs text-slate-400 bg-slate-700/50 px-3 py-1 rounded-full">
                        {new Date(card.dueDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-16">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-xl font-bold text-slate-400 mb-2">No cards yet</h3>
                <p className="text-slate-500">Create your first card to get started!</p>
              </div>
            )}

            {/* Add Card Button */}
            {!showCreateCard && (
              <div
                className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 border-2 border-dashed border-slate-600 hover:border-purple-500 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-3 min-h-[200px] group"
                onClick={() => setShowCreateCard(true)}
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <p className="text-slate-400 font-semibold group-hover:text-purple-400 transition-colors">
                  Add Card
                </p>
              </div>
            )}
          </div>

          {/* Create Card Form */}
          {showCreateCard && (
            <div className="mt-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border-2 border-purple-500/50 animate-scale-in">
              <form onSubmit={handleCreateCard} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-purple-400 mb-2">
                    Card Title *
                  </label>
                  <input
                    type="text"
                    value={cardTitle}
                    onChange={(e) => setCardTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all"
                    placeholder="Enter card title..."
                    autoFocus
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-cyan-400 mb-2">
                    Description
                  </label>
                  <textarea
                    value={cardDescription}
                    onChange={(e) => setCardDescription(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all resize-none"
                    placeholder="Add a description..."
                    rows="3"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateCard(false)
                      setCardTitle("")
                      setCardDescription("")
                    }}
                    className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-semibold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !cardTitle.trim()}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Creating..." : "Create Card"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

ListModal.propTypes = {
  list: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onCardClick: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
}

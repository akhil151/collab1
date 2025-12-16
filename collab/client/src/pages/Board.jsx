import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useUserStore } from "../store/userStore"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { ArrowLeft, Plus, Trash2, MoreVertical, Users } from "lucide-react"
import ListModal from "../components/ListModal"
import ParticipantsPanel from "../components/ParticipantsPanel"
import axios from "axios"
import io from "socket.io-client"

export default function Board() {
  const { id } = useParams()
  const { user } = useUserStore()
  const navigate = useNavigate()

  const [board, setBoard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [socket, setSocket] = useState(null)
  const [error, setError] = useState(null)
  const [selectedList, setSelectedList] = useState(null)
  const [showCreateList, setShowCreateList] = useState(false)
  const [newListTitle, setNewListTitle] = useState("")
  const [showParticipants, setShowParticipants] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate("/login")
      return
    }

    fetchBoard()
    setupSocket()
  }, [id, user, navigate])

  const setupSocket = () => {
    try {
      const socketUrl = import.meta.env.VITE_API_URL || "http://localhost:5000"
      const newSocket = io(socketUrl, {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
        transports: ["websocket", "polling"],
      })

      newSocket.on("connect", () => {
        if (id && user && user.id) {
          newSocket.emit("join-board", id, user.id)
        }
      })

      newSocket.on("connect_error", (error) => {
        console.error("Socket connection error:", error)
      })

      newSocket.on("card:created", (data) => {
        if (data) fetchBoard()
      })
      newSocket.on("card:updated", (data) => {
        if (data) fetchBoard()
      })
      newSocket.on("card:moved", (data) => {
        if (data) fetchBoard()
      })
      newSocket.on("list:created", (data) => {
        if (data) fetchBoard()
      })
      newSocket.on("list:deleted", (data) => {
        if (data) fetchBoard()
      })

      setSocket(newSocket)

      return () => {
        if (newSocket) {
          newSocket.close()
        }
      }
    } catch (error) {
      console.error("Failed to setup socket:", error)
    }
  }

  const fetchBoard = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        console.error("No token found")
        navigate("/login")
        return
      }

      if (!id) {
        console.error("No board ID provided")
        setError("Invalid board ID")
        setLoading(false)
        return
      }

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/boards/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.data) {
        setBoard(response.data)
        setError(null)
      } else {
        console.error("No board data received")
        setError("Failed to load board data")
      }
      setLoading(false)
    } catch (error) {
      console.error("Failed to fetch board:", error)
      setError(error.response?.data?.message || "Failed to load board")
      if (error.response?.status === 401) {
        localStorage.removeItem("token")
        navigate("/login")
      } else if (error.response?.status === 404) {
        setError("Board not found")
      }
      setLoading(false)
    }
  }

  const handleDragEnd = async (result) => {
    const { source, destination, type, draggableId } = result

    if (!destination) return
    if (source.index === destination.index && source.droppableId === destination.droppableId) return

    if (type === "list") {
      const listIds = board.lists?.map((l) => l._id) || []
      const newListIds = Array.from(listIds)
      newListIds.splice(source.index, 1)
      newListIds.splice(destination.index, 0, listIds[source.index])

      try {
        const token = localStorage.getItem("token")
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/lists/reorder`,
          { lists: newListIds },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        if (socket) socket.emit("list:update", { boardId: board._id })
        fetchBoard()
      } catch (error) {
        console.error("Failed to reorder lists:", error)
      }
    } else if (type === "card") {
      const fromListId = source.droppableId
      const toListId = destination.droppableId

      try {
        const token = localStorage.getItem("token")
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/cards/${draggableId}/move`,
          {
            fromList: fromListId,
            toList: toListId,
            position: destination.index,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        if (socket) socket.emit("card:move", { boardId: board._id })
        fetchBoard()
      } catch (error) {
        console.error("Failed to move card:", error)
      }
    }
  }

  const handleCreateList = async (e) => {
    e.preventDefault()
    if (!newListTitle.trim()) return

    try {
      const token = localStorage.getItem("token")
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/lists`,
        { title: newListTitle, board: id },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      setNewListTitle("")
      setShowCreateList(false)
      fetchBoard()
    } catch (error) {
      console.error("Failed to create list:", error)
    }
  }

  const handleDeleteList = async (listId) => {
    if (!window.confirm("Delete this list and all its cards?")) return

    try {
      const token = localStorage.getItem("token")
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/lists/${listId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      fetchBoard()
    } catch (error) {
      console.error("Failed to delete list:", error)
      alert(error.response?.data?.message || "Failed to delete list")
    }
  }

  const handleCardClick = (card) => {
    const list = board.lists.find((l) => l.cards?.some((c) => c._id === card._id))
    if (list) {
      navigate(`/board/${id}/list/${list._id}/card/${card._id}`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center">
        <div className="text-center max-w-md">
          <p className="text-red-400 font-semibold mb-4">{error}</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:scale-105 transition-transform"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-xl transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                {board?.title}
              </h1>
              <p className="text-slate-400 mt-1">{board?.lists?.length || 0} lists</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowParticipants(true)}
              className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold transition-all hover:scale-105 border border-slate-600"
            >
              <Users className="w-5 h-5" />
              Participants
              {board?.participants?.length > 0 && (
                <span className="px-2 py-0.5 bg-purple-500 text-white text-xs font-bold rounded-full">
                  {board.participants.length}
                </span>
              )}
            </button>
            
            <button
              onClick={() => setShowCreateList(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-semibold transition-all hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              Add List
            </button>
          </div>
        </div>
      </div>

      {/* Board Content */}
      <div className="p-8">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="board" type="list" direction="horizontal">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="grid grid-cols-3 gap-6"
                style={{
                  background: snapshot.isDraggingOver
                    ? "linear-gradient(to right, rgba(147, 51, 234, 0.1), rgba(236, 72, 153, 0.1))"
                    : "transparent",
                  transition: "background 0.3s ease",
                  borderRadius: "24px",
                  padding: snapshot.isDraggingOver ? "16px" : "0",
                }}
              >
                {board?.lists && board.lists.length > 0 ? (
                  board.lists.map((list, index) => (
                    <Draggable key={String(list._id)} draggableId={String(list._id)} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          style={{
                            ...provided.draggableProps.style,
                            opacity: snapshot.isDragging ? 0.5 : 1,
                          }}
                        >
                          {/* List Card */}
                          <div
                            className={`group relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl border-2 border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 overflow-hidden ${
                              snapshot.isDragging ? "shadow-2xl shadow-purple-500/50" : "hover:shadow-xl hover:shadow-purple-500/20"
                            }`}
                            style={{ 
                              width: "100%", 
                              height: "600px", 
                              display: "flex", 
                              flexDirection: "column" 
                            }}
                          >
                            {/* Drag Handle */}
                            <div
                              {...provided.dragHandleProps}
                              className="absolute top-4 right-4 p-2 bg-slate-700/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
                            >
                              <MoreVertical className="w-4 h-4 text-slate-400" />
                            </div>

                            {/* List Header */}
                            <div
                              onClick={() => setSelectedList(list)}
                              className="p-6 cursor-pointer"
                            >
                              <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors pr-12">
                                {list.title}
                              </h3>
                              <p className="text-sm text-slate-400 mt-2 font-medium">
                                {list.cards?.length || 0} cards
                              </p>
                            </div>

                            {/* Cards Preview (Drag & Drop) */}
                            <Droppable droppableId={String(list._id)} type="card">
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.droppableProps}
                                  className="px-6 pb-6 space-y-3 flex-1"
                                  style={{
                                    overflowY: "auto",
                                    background: snapshot.isDraggingOver
                                      ? "rgba(147, 51, 234, 0.1)"
                                      : "transparent",
                                    borderRadius: "12px",
                                    transition: "background 0.2s",
                                  }}
                                >
                                  {list.cards && list.cards.length > 0 ? (
                                    list.cards
                                      .filter((card) => card && card._id)
                                      .slice(0, 3)
                                      .map((card, cardIndex) => (
                                        <Draggable
                                          key={String(card._id)}
                                          draggableId={String(card._id)}
                                          index={cardIndex}
                                        >
                                          {(provided, snapshot) => (
                                            <div
                                              ref={provided.innerRef}
                                              {...provided.draggableProps}
                                              {...provided.dragHandleProps}
                                              onClick={(e) => {
                                                e.stopPropagation()
                                                handleCardClick(card)
                                              }}
                                              className={`bg-slate-700/50 rounded-xl p-4 border border-slate-600 hover:border-purple-500 transition-all cursor-pointer ${
                                                snapshot.isDragging ? "opacity-50 scale-95" : "hover:scale-105"
                                              }`}
                                            >
                                              <h4 className="text-sm font-bold text-white line-clamp-1">
                                                {card.title}
                                              </h4>
                                              {card.description && (
                                                <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                                                  {card.description}
                                                </p>
                                              )}
                                            </div>
                                          )}
                                        </Draggable>
                                      ))
                                  ) : (
                                    <div className="text-center py-8">
                                      <p className="text-slate-500 text-sm">No cards yet</p>
                                    </div>
                                  )}
                                  {provided.placeholder}
                                  
                                  {list.cards && list.cards.length > 3 && (
                                    <div className="text-center pt-2">
                                      <span className="text-xs text-slate-400">
                                        +{list.cards.length - 3} more
                                      </span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </Droppable>

                            {/* List Actions */}
                            <div className="px-6 pb-6 pt-4 border-t border-slate-700/50 flex gap-3">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setSelectedList(list)
                                }}
                                className="flex-1 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 hover:text-purple-300 rounded-xl font-semibold transition-all text-sm"
                              >
                                View All
                              </button>
                              {/* Only board owner can delete lists */}
                              {board?.owner?._id === user?._id && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleDeleteList(list._id)
                                  }}
                                  className="p-2 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white rounded-xl transition-all"
                                  title="Delete List"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center py-20">
                    <div className="text-6xl mb-4">📋</div>
                    <h3 className="text-2xl font-bold text-slate-400 mb-2">No lists yet</h3>
                    <p className="text-slate-500 mb-6">Create your first list to get started!</p>
                    <button
                      onClick={() => setShowCreateList(true)}
                      className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:scale-105 transition-transform"
                    >
                      Create List
                    </button>
                  </div>
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      {/* Create List Modal */}
      {showCreateList && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-6 z-50"
          onClick={() => setShowCreateList(false)}
        >
          <div
            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 max-w-md w-full border-2 border-purple-500/50 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-white mb-6">Create New List</h2>
            <form onSubmit={handleCreateList} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-purple-400 mb-2">List Title *</label>
                <input
                  type="text"
                  value={newListTitle}
                  onChange={(e) => setNewListTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all"
                  placeholder="Enter list title..."
                  autoFocus
                  required
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateList(false)
                    setNewListTitle("")
                  }}
                  className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-semibold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-semibold transition-all"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* List Modal */}
      {selectedList && (
        <ListModal
          list={selectedList}
          onClose={() => setSelectedList(null)}
          onCardClick={handleCardClick}
          onRefresh={fetchBoard}
        />
      )}

      {/* Participants Panel */}
      <ParticipantsPanel
        isOpen={showParticipants}
        onClose={() => {
          setShowParticipants(false)
          fetchBoard() // Refresh board to update participants count
        }}
        boardId={id}
      />
    </div>
  )
}

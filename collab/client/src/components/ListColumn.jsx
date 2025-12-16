import { Droppable, Draggable } from "@hello-pangea/dnd"
import PropTypes from "prop-types"
import CardItem from "./CardItem"
import CreateCardForm from "./CreateCardForm"
import { useState } from "react"
import axios from "axios"

export default function ListColumn({ list, boardId, socket, onRefresh, colorClass }) {
  const [showCreateCard, setShowCreateCard] = useState(false)
  const [showListMenu, setShowListMenu] = useState(false)

  const handleDeleteList = async () => {
    if (window.confirm("Delete this list?")) {
      try {
        const token = localStorage.getItem("token")
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/lists/${list._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        onRefresh()
      } catch (error) {
        console.error("Failed to delete list:", error)
      }
    }
  }

  return (
    <div
      className={`flex-shrink-0 rounded-3xl p-6 border-2 transition-all duration-300 hover-lift group shadow-lg animate-slide-in-up ${colorClass}`}
      style={{ 
        width: "384px", 
        height: "600px", 
        display: "flex", 
        flexDirection: "column" 
      }}
    >
      {/* List Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex-1">
          <h3 className="font-bold text-lg text-slate-800 group-hover:text-slate-900 transition-colors">
            {list.title}
          </h3>
          <p className="text-xs text-slate-500 mt-1 font-medium">{list.cards?.length || 0} cards</p>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowListMenu(!showListMenu)}
            className="p-2 text-slate-500 hover:bg-black/10 hover:text-slate-700 rounded-lg transition-all duration-200 hover:scale-110"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </button>
          {showListMenu && (
            <div className="absolute right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-50 animate-scale-in">
              <button
                onClick={handleDeleteList}
                className="w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 transition-all text-sm font-semibold rounded-lg m-1"
              >
                🗑️ Delete List
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Cards Container */}
      <Droppable droppableId={String(list._id)} type="card">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`space-y-3 rounded-2xl transition-all duration-200 p-3 flex-1 ${
              snapshot.isDraggingOver ? "bg-white/60 ring-2 ring-offset-2 ring-slate-400" : "bg-white/30"
            }`}
            style={{ overflowY: "auto" }}
          >
            {list.cards && list.cards.length > 0 ? (
              list.cards
                .filter((card) => card && card._id)
                .map((card, index) => (
                  <Draggable key={String(card._id)} draggableId={String(card._id)} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`transition-all duration-150 ${snapshot.isDragging ? "opacity-40 scale-95 shadow-2xl" : ""}`}
                      >
                        <CardItem card={card} />
                      </div>
                    )}
                  </Draggable>
                ))
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-slate-400 text-sm font-medium">Drop cards here</p>
              </div>
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {/* Add Card Button */}
      {showCreateCard ? (
        <div className="mt-4 animate-slide-in-up">
          <CreateCardForm
            listId={list._id}
            boardId={boardId}
            onClose={() => setShowCreateCard(false)}
            onCreated={() => {
              setShowCreateCard(false)
              onRefresh()
            }}
          />
        </div>
      ) : (
        <button
          onClick={() => setShowCreateCard(true)}
          className="w-full mt-4 p-3 text-slate-600 hover:text-slate-800 hover:bg-black/5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 group font-semibold border border-slate-300/50 hover:border-slate-400"
        >
          <svg
            className="w-5 h-5 group-hover:scale-125 transition-all"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Card
        </button>
      )}
    </div>
  )
}

ListColumn.propTypes = {
  list: PropTypes.object.isRequired,
  boardId: PropTypes.string.isRequired,
  socket: PropTypes.object,
  onRefresh: PropTypes.func.isRequired,
  colorClass: PropTypes.string
}

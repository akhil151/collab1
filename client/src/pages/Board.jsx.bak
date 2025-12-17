import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useUserStore } from "../store/userStore"
import Navbar from "../components/Navbar"
import BoardList from "../components/BoardList"
import CardModal from "../components/CardModal"
import Sidebar from "../components/sidebar"
import TextToolPanel from "../components/ToolsPanel/TextTool"
import ShapesToolPanel from "../components/ToolsPanel/ShapesTool"
import ImageToolPanel from "../components/ToolsPanel/ImageTool"
import ConnectToolPanel from "../components/ToolsPanel/ConnectTool"
import axios from "axios"
import io from "socket.io-client"
import { ArrowLeft } from "lucide-react"

export default function Board() {
  const { id } = useParams()
  const { user, logout } = useUserStore()
  const navigate = useNavigate()
  const canvasRef = useRef(null)

  const [board, setBoard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedCard, setSelectedCard] = useState(null)
  const [socket, setSocket] = useState(null)
  const [error, setError] = useState(null)
  const [activeToolPanel, setActiveToolPanel] = useState(null)
  const [canvasElements, setCanvasElements] = useState([])
  const [selectedElement, setSelectedElement] = useState(null)
  const [connectors, setConnectors] = useState([])

  useEffect(() => {
    if (!user) {
      navigate("/login")
      return
    }

    fetchBoard()
    fetchConnectors()
  }, [id, user, navigate])

  useEffect(() => {
    if (!user?.id) return

    const socketUrl = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000"

    const newSocket = io(socketUrl, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    })

    newSocket.on("connect", () => {
      newSocket.emit("join-board", id, user?.id)
    })

    setSocket(newSocket)

    return () => {
      newSocket.close()
    }
  }, [id, user?.id])

  useEffect(() => {
    if (!socket) return

    socket.on("card:created", () => fetchBoard())
    socket.on("card:updated", () => fetchBoard())
    socket.on("card:moved", () => fetchBoard())
    socket.on("list:created", () => fetchBoard())
    socket.on("connector:created", (connector) => {
      setConnectors((prev) => [...prev, connector])
    })
    socket.on("connector:updated", (connector) => {
      setConnectors((prev) => prev.map((c) => (c._id === connector._id ? connector : c)))
    })
    socket.on("connector:deleted", ({ connectorId }) => {
      setConnectors((prev) => prev.filter((c) => c._id !== connectorId))
    })

    return () => {
      socket.off("card:created")
      socket.off("card:updated")
      socket.off("card:moved")
      socket.off("list:created")
      socket.off("connector:created")
      socket.off("connector:updated")
      socket.off("connector:deleted")
    }
  }, [socket])

  const fetchBoard = async () => {
    try {
      const token = localStorage.getItem("token")

      if (!token) {
        navigate("/login")
        return
      }

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/boards/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      setBoard(response.data)
      setError(null)
      setLoading(false)
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load board")

      if (error.response?.status === 401) {
        localStorage.removeItem("token")
        navigate("/login")
      }
      setLoading(false)
    }
  }

  const fetchConnectors = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/connectors/board/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setConnectors(response.data)
    } catch (error) {
      console.error("Failed to fetch connectors:", error)
    }
  }

  const handleAddText = (textData) => {
    const newElement = {
      id: Date.now().toString(),
      ...textData,
    }
    setCanvasElements([...canvasElements, newElement])
    setActiveToolPanel(null)
  }

  const handleAddShape = (shapeData) => {
    const newElement = {
      id: Date.now().toString(),
      ...shapeData,
    }
    setCanvasElements([...canvasElements, newElement])
  }

  const handleAddImage = (imageData) => {
    const newElement = {
      id: Date.now().toString(),
      ...imageData,
    }
    setCanvasElements([...canvasElements, newElement])
    setActiveToolPanel(null)
  }

  const handleAddConnector = async (connectorData) => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/connectors`,
        { ...connectorData, board: id },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      // Socket will handle adding to state via connector:created event
    } catch (error) {
      console.error("Failed to create connector:", error)
    }
  }

  const handleDeleteElement = (elementId) => {
    setCanvasElements(canvasElements.filter((el) => el.id !== elementId))
    setSelectedElement(null)
  }

  const handleToolClick = (toolId) => {
    if (toolId === "text") {
      setActiveToolPanel(activeToolPanel === "text" ? null : "text")
    } else if (toolId === "shapes") {
      setActiveToolPanel(activeToolPanel === "shapes" ? null : "shapes")
    } else if (toolId === "image") {
      setActiveToolPanel(activeToolPanel === "image" ? null : "image")
    } else if (toolId === "connection") {
      setActiveToolPanel(activeToolPanel === "connection" ? null : "connection")
    } else {
      setActiveToolPanel(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center">
        <div className="w-16 h-16">
          <div className="w-12 h-12 border-3 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
        </div>
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Navbar user={user} onLogout={logout} boardTitle={board?.title} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar boardTitle={board?.title} user={user} onToolClick={handleToolClick} />

        <div className="flex-1 flex gap-6 overflow-hidden p-6">
          {/* Main Board Canvas */}
          <div className="flex-1 overflow-auto relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border border-slate-200 shadow-lg">
            <button
              onClick={() => navigate("/dashboard")}
              className="absolute top-4 left-4 z-40 p-2 bg-white rounded-lg shadow-md hover:shadow-lg hover:bg-slate-50 transition-all"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-5 h-5 text-slate-700" />
            </button>

            <div ref={canvasRef} className="w-full h-full relative p-8 pt-16">
              {/* SVG Connectors Layer */}
              <svg
                className="absolute inset-0 pointer-events-none"
                style={{ width: '100%', height: '100%', zIndex: 1 }}
              >
                {connectors.map((connector) => {
                  const fromEl = canvasElements.find((el) => el.id === connector.fromElement)
                  const toEl = canvasElements.find((el) => el.id === connector.toElement)
                  
                  if (!fromEl || !toEl) return null

                  const fromX = fromEl.x + (fromEl.width || 50) / 2
                  const fromY = fromEl.y + (fromEl.height || 50) / 2
                  const toX = toEl.x + (toEl.width || 50) / 2
                  const toY = toEl.y + (toEl.height || 50) / 2

                  return (
                    <g key={connector._id || connector.id}>
                      <line
                        x1={fromX}
                        y1={fromY}
                        x2={toX}
                        y2={toY}
                        stroke={connector.color || '#9333ea'}
                        strokeWidth="3"
                        markerEnd={connector.arrowStyle === 'arrow' ? 'url(#arrowhead)' : ''}
                      />
                      {connector.arrowStyle === 'arrow' && (
                        <defs>
                          <marker
                            id="arrowhead"
                            markerWidth="10"
                            markerHeight="10"
                            refX="9"
                            refY="3"
                            orient="auto"
                          >
                            <polygon
                              points="0 0, 10 3, 0 6"
                              fill={connector.color || '#9333ea'}
                            />
                          </marker>
                        </defs>
                      )}
                    </g>
                  )
                })}
              </svg>

              {/* Canvas Elements */}
              {canvasElements.map((element) => (
                <div
                  key={element.id}
                  onClick={() => setSelectedElement(element.id)}
                  onDoubleClick={() => handleDeleteElement(element.id)}
                  className={`canvas-element ${
                    selectedElement === element.id ? "selected" : ""
                  }`}
                  style={{
                    position: 'absolute',
                    left: `${element.x}px`,
                    top: `${element.y}px`,
                    backgroundColor: element.type === "text" ? "transparent" : element.color || "#fff",
                    width: element.width || "auto",
                    height: element.height || "auto",
                    cursor: 'move',
                    zIndex: 2,
                    transition: 'box-shadow 0.2s',
                    boxShadow: selectedElement === element.id ? '0 0 0 3px rgba(147, 51, 234, 0.5)' : 'none',
                  }}
                  draggable
                  onDragEnd={async (e) => {
                    const rect = canvasRef.current.getBoundingClientRect()
                    const newX = e.clientX - rect.left
                    const newY = e.clientY - rect.top
                    
                    const newElements = canvasElements.map((el) =>
                      el.id === element.id 
                        ? { ...el, x: newX, y: newY } 
                        : el,
                    )
                    setCanvasElements(newElements)
                    
                    // Update connectors that reference this element
                    const updatedConnectors = connectors.map((conn) => {
                      if (conn.fromElement === element.id || conn.toElement === element.id) {
                        // Force connector re-render by updating timestamp
                        return { ...conn, updatedAt: Date.now() }
                      }
                      return conn
                    })
                    setConnectors(updatedConnectors)
                  }}
                >
                  {element.type === "text" && (
                    <div
                      style={{
                        fontSize: `${element.fontSize}px`,
                        color: element.color,
                        fontWeight: element.bold ? "bold" : "normal",
                        fontStyle: element.italic ? "italic" : "normal",
                        textDecoration: element.underline ? "underline" : "none",
                        textAlign: element.align,
                        whiteSpace: "pre-wrap",
                        padding: "8px",
                      }}
                    >
                      {element.text}
                    </div>
                  )}
                  {element.type === "shape" && (
                    <div
                      style={{
                        width: "100px",
                        height: "100px",
                        backgroundColor: element.color,
                        borderRadius:
                          element.shapeType === "circle" ? "50%" : element.shapeType === "hexagon" ? "10px" : "4px",
                      }}
                    />
                  )}
                  {element.type === "image" && (
                    <img
                      src={element.src}
                      alt="Canvas element"
                      style={{
                        width: element.width || "200px",
                        height: element.height || "150px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                      onError={(e) => {
                        e.target.style.display = "none"
                      }}
                    />
                  )}
                </div>
              ))}

              {/* Board Lists - Always render BoardList component */}
              {board && (
                <div className="mt-8">
                  <BoardList board={board} socket={socket} onRefresh={fetchBoard} />
                </div>
              )}
            </div>
          </div>

          {/* Tools Panel */}
          {activeToolPanel === "text" && <TextToolPanel onAddText={handleAddText} />}
          {activeToolPanel === "shapes" && <ShapesToolPanel onAddShape={handleAddShape} />}
          {activeToolPanel === "image" && <ImageToolPanel onAddImage={handleAddImage} />}
          {activeToolPanel === "connection" && (
            <ConnectToolPanel 
              onAddConnector={handleAddConnector} 
              canvasElements={canvasElements}
            />
          )}
        </div>
      </div>

      {selectedCard && <CardModal card={selectedCard} onClose={() => setSelectedCard(null)} onUpdate={fetchBoard} />}
    </div>
  )
}

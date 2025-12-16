import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useUserStore } from "../store/userStore"
import { ArrowLeft, Type, Shapes, ImageIcon, Link2, Trash2, Save } from "lucide-react"
import axios from "axios"
import io from "socket.io-client"

export default function CardWorkspace() {
  const { boardId, listId, cardId } = useParams()
  const { user } = useUserStore()
  const navigate = useNavigate()
  const canvasRef = useRef(null)

  const [card, setCard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [socket, setSocket] = useState(null)
  const [activeTool, setActiveTool] = useState(null)
  
  // Canvas elements
  const [elements, setElements] = useState([])
  const [selectedElement, setSelectedElement] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  
  // Text tool
  const [textContent, setTextContent] = useState("")
  const [textPosition, setTextPosition] = useState({ x: 100, y: 100 })
  
  // Shape tool
  const [selectedShape, setSelectedShape] = useState("rectangle")
  const [shapeSize, setShapeSize] = useState({ width: 150, height: 100 })
  
  // Image tool
  const [imageUrl, setImageUrl] = useState("")
  
  // Connector tool
  const [connectorStart, setConnectorStart] = useState(null)
  const [connectorEnd, setConnectorEnd] = useState(null)
  const [connectors, setConnectors] = useState([])

  useEffect(() => {
    if (!user) {
      navigate("/login")
      return
    }

    fetchCard()
    setupSocket()
  }, [cardId, user])

  const setupSocket = () => {
    const socketUrl = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000"
    const newSocket = io(socketUrl, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      transports: ["websocket", "polling"],
    })

    newSocket.on("connect", () => {
      newSocket.emit("join-card", cardId)
    })

    newSocket.on("element:added", (element) => {
      setElements((prev) => [...prev, element])
    })

    newSocket.on("element:updated", (updatedElement) => {
      setElements((prev) => prev.map((el) => (el.id === updatedElement.id ? updatedElement : el)))
    })

    newSocket.on("element:deleted", ({ elementId }) => {
      setElements((prev) => prev.filter((el) => el.id !== elementId))
    })

    setSocket(newSocket)

    return () => newSocket.close()
  }

  const fetchCard = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/cards/${cardId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setCard(response.data)
      
      // Load saved elements from card metadata
      if (response.data.elements) {
        setElements(response.data.elements)
      }
      if (response.data.connectors) {
        setConnectors(response.data.connectors)
      }
      
      setLoading(false)
    } catch (error) {
      console.error("Failed to fetch card:", error)
      setLoading(false)
    }
  }

  const saveElements = async () => {
    try {
      const token = localStorage.getItem("token")
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/cards/${cardId}`,
        { elements, connectors },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      alert("Workspace saved successfully!")
    } catch (error) {
      console.error("Failed to save workspace:", error)
      alert("Failed to save workspace")
    }
  }

  const handleAddText = () => {
    if (!textContent.trim()) return

    const newElement = {
      id: Date.now().toString(),
      type: "text",
      content: textContent,
      position: textPosition,
      fontSize: 16,
      color: "#ffffff",
    }

    setElements([...elements, newElement])
    if (socket) socket.emit("element:add", { cardId, element: newElement })
    
    setTextContent("")
    setActiveTool(null)
  }

  const handleAddShape = () => {
    const newElement = {
      id: Date.now().toString(),
      type: "shape",
      shape: selectedShape,
      position: { x: 200, y: 200 },
      size: shapeSize,
      strokeColor: "#8b5cf6",
      strokeWidth: 2,
      fill: "none",
      text: "",
    }

    setElements([...elements, newElement])
    if (socket) socket.emit("element:add", { cardId, element: newElement })
    
    setActiveTool(null)
  }

  const handleAddImage = () => {
    if (!imageUrl.trim()) return

    const newElement = {
      id: Date.now().toString(),
      type: "image",
      url: imageUrl,
      position: { x: 150, y: 150 },
      size: { width: 200, height: 200 },
    }

    setElements([...elements, newElement])
    if (socket) socket.emit("element:add", { cardId, element: newElement })
    
    setImageUrl("")
    setActiveTool(null)
  }

  const handleElementClick = (element, e) => {
    e.stopPropagation()
    setSelectedElement(element)
  }

  const handleCanvasMouseDown = (e) => {
    if (activeTool === "connect" && selectedElement) {
      setConnectorStart(selectedElement.id)
      return
    }

    if (!selectedElement) return

    const rect = canvasRef.current.getBoundingClientRect()
    const offsetX = e.clientX - rect.left - selectedElement.position.x
    const offsetY = e.clientY - rect.top - selectedElement.position.y

    setIsDragging(true)
    setDragOffset({ x: offsetX, y: offsetY })
  }

  const handleCanvasMouseMove = (e) => {
    if (!isDragging || !selectedElement) return

    const rect = canvasRef.current.getBoundingClientRect()
    const newX = e.clientX - rect.left - dragOffset.x
    const newY = e.clientY - rect.top - dragOffset.y

    const updatedElements = elements.map((el) =>
      el.id === selectedElement.id ? { ...el, position: { x: newX, y: newY } } : el
    )

    setElements(updatedElements)
    setSelectedElement({ ...selectedElement, position: { x: newX, y: newY } })
  }

  const handleCanvasMouseUp = (e) => {
    if (activeTool === "connect" && connectorStart && selectedElement && connectorStart !== selectedElement.id) {
      const newConnector = {
        id: Date.now().toString(),
        from: connectorStart,
        to: selectedElement.id,
        color: "#8b5cf6",
        width: 2,
      }
      setConnectors([...connectors, newConnector])
      setConnectorStart(null)
      setActiveTool(null)
    }

    setIsDragging(false)
  }

  const handleDeleteElement = () => {
    if (!selectedElement) return

    const updatedElements = elements.filter((el) => el.id !== selectedElement.id)
    setElements(updatedElements)
    
    if (socket) socket.emit("element:delete", { cardId, elementId: selectedElement.id })
    
    setSelectedElement(null)
  }

  const handleUpdateElementText = (text) => {
    if (!selectedElement || selectedElement.type !== "shape") return

    const updatedElements = elements.map((el) =>
      el.id === selectedElement.id ? { ...el, text } : el
    )

    setElements(updatedElements)
    setSelectedElement({ ...selectedElement, text })
  }

  const renderElement = (element) => {
    switch (element.type) {
      case "text":
        return (
          <div
            key={element.id}
            onClick={(e) => handleElementClick(element, e)}
            style={{
              position: "absolute",
              left: element.position.x,
              top: element.position.y,
              fontSize: element.fontSize,
              color: element.color,
              cursor: "move",
              userSelect: "none",
              padding: "8px",
              border: selectedElement?.id === element.id ? "2px solid #8b5cf6" : "none",
              borderRadius: "4px",
            }}
            className="font-semibold"
          >
            {element.content}
          </div>
        )

      case "shape":
        const ShapeSVG = {
          rectangle: (
            <rect
              x="0"
              y="0"
              width={element.size.width}
              height={element.size.height}
              stroke={element.strokeColor}
              strokeWidth={element.strokeWidth}
              fill={element.fill}
              rx="8"
            />
          ),
          circle: (
            <ellipse
              cx={element.size.width / 2}
              cy={element.size.height / 2}
              rx={element.size.width / 2}
              ry={element.size.height / 2}
              stroke={element.strokeColor}
              strokeWidth={element.strokeWidth}
              fill={element.fill}
            />
          ),
          triangle: (
            <polygon
              points={`${element.size.width / 2},0 ${element.size.width},${element.size.height} 0,${element.size.height}`}
              stroke={element.strokeColor}
              strokeWidth={element.strokeWidth}
              fill={element.fill}
            />
          ),
          diamond: (
            <polygon
              points={`${element.size.width / 2},0 ${element.size.width},${element.size.height / 2} ${element.size.width / 2},${element.size.height} 0,${element.size.height / 2}`}
              stroke={element.strokeColor}
              strokeWidth={element.strokeWidth}
              fill={element.fill}
            />
          ),
        }

        return (
          <div
            key={element.id}
            onClick={(e) => handleElementClick(element, e)}
            style={{
              position: "absolute",
              left: element.position.x,
              top: element.position.y,
              cursor: "move",
              border: selectedElement?.id === element.id ? "2px dashed #8b5cf6" : "none",
              padding: "4px",
            }}
          >
            <svg width={element.size.width} height={element.size.height}>
              {ShapeSVG[element.shape]}
            </svg>
            {element.text && (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  color: "#ffffff",
                  fontSize: "14px",
                  fontWeight: "600",
                  pointerEvents: "none",
                  textAlign: "center",
                  maxWidth: element.size.width - 20,
                }}
              >
                {element.text}
              </div>
            )}
          </div>
        )

      case "image":
        return (
          <div
            key={element.id}
            onClick={(e) => handleElementClick(element, e)}
            style={{
              position: "absolute",
              left: element.position.x,
              top: element.position.y,
              cursor: "move",
              border: selectedElement?.id === element.id ? "2px solid #8b5cf6" : "none",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <img
              src={element.url}
              alt="Workspace element"
              style={{
                width: element.size.width,
                height: element.size.height,
                objectFit: "cover",
              }}
            />
          </div>
        )

      default:
        return null
    }
  }

  const getElementCenter = (elementId) => {
    const element = elements.find((el) => el.id === elementId)
    if (!element) return { x: 0, y: 0 }

    if (element.type === "shape" || element.type === "image") {
      return {
        x: element.position.x + element.size.width / 2,
        y: element.position.y + element.size.height / 2,
      }
    }

    return { x: element.position.x, y: element.position.y }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
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
              onClick={() => navigate(`/board/${boardId}`)}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-xl transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                {card?.title}
              </h1>
              <p className="text-sm text-slate-400 mt-1">{card?.description || "No description"}</p>
            </div>
          </div>

          <button
            onClick={saveElements}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-semibold transition-all"
          >
            <Save className="w-4 h-4" />
            Save Workspace
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Tools Sidebar */}
        <div className="w-20 bg-slate-900/50 border-r border-slate-700/50 flex flex-col items-center py-6 gap-4">
          <button
            onClick={() => setActiveTool(activeTool === "text" ? null : "text")}
            className={`p-4 rounded-xl transition-all ${
              activeTool === "text"
                ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white"
                : "text-slate-400 hover:text-white hover:bg-slate-700"
            }`}
            title="Text Tool"
          >
            <Type className="w-6 h-6" />
          </button>

          <button
            onClick={() => setActiveTool(activeTool === "shape" ? null : "shape")}
            className={`p-4 rounded-xl transition-all ${
              activeTool === "shape"
                ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white"
                : "text-slate-400 hover:text-white hover:bg-slate-700"
            }`}
            title="Shape Tool"
          >
            <Shapes className="w-6 h-6" />
          </button>

          <button
            onClick={() => setActiveTool(activeTool === "image" ? null : "image")}
            className={`p-4 rounded-xl transition-all ${
              activeTool === "image"
                ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white"
                : "text-slate-400 hover:text-white hover:bg-slate-700"
            }`}
            title="Image Tool"
          >
            <ImageIcon className="w-6 h-6" />
          </button>

          <button
            onClick={() => setActiveTool(activeTool === "connect" ? null : "connect")}
            className={`p-4 rounded-xl transition-all ${
              activeTool === "connect"
                ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white"
                : "text-slate-400 hover:text-white hover:bg-slate-700"
            }`}
            title="Connect Tool"
          >
            <Link2 className="w-6 h-6" />
          </button>

          {selectedElement && (
            <button
              onClick={handleDeleteElement}
              className="mt-auto p-4 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all"
              title="Delete Selected"
            >
              <Trash2 className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Tool Panels */}
        {activeTool && (
          <div className="w-80 bg-slate-900/50 border-r border-slate-700/50 p-6 overflow-y-auto">
            {activeTool === "text" && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">Add Text</h3>
                <textarea
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 resize-none"
                  rows="4"
                  placeholder="Enter text content..."
                />
                <button
                  onClick={handleAddText}
                  className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold"
                >
                  Add Text
                </button>
              </div>
            )}

            {activeTool === "shape" && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">Add Shape</h3>
                <div className="grid grid-cols-2 gap-3">
                  {["rectangle", "circle", "triangle", "diamond"].map((shape) => (
                    <button
                      key={shape}
                      onClick={() => setSelectedShape(shape)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        selectedShape === shape
                          ? "border-purple-500 bg-purple-500/20"
                          : "border-slate-700 hover:border-slate-600"
                      }`}
                    >
                      <span className="text-white capitalize">{shape}</span>
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleAddShape}
                  className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold"
                >
                  Add Shape
                </button>
              </div>
            )}

            {activeTool === "image" && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">Add Image</h3>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  placeholder="Enter image URL..."
                />
                <button
                  onClick={handleAddImage}
                  className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold"
                >
                  Add Image
                </button>
              </div>
            )}

            {activeTool === "connect" && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">Connect Elements</h3>
                <p className="text-sm text-slate-400">
                  Click on two elements to connect them with a line.
                </p>
                {connectorStart && (
                  <div className="px-4 py-3 bg-purple-500/20 border border-purple-500/50 rounded-xl text-purple-300 text-sm">
                    First element selected. Click on another element to connect.
                  </div>
                )}
              </div>
            )}

            {selectedElement?.type === "shape" && (
              <div className="mt-6 space-y-4 pt-6 border-t border-slate-700">
                <h3 className="text-lg font-bold text-white">Edit Shape Text</h3>
                <input
                  type="text"
                  value={selectedElement.text || ""}
                  onChange={(e) => handleUpdateElementText(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  placeholder="Add text inside shape..."
                />
              </div>
            )}
          </div>
        )}

        {/* Canvas */}
        <div className="flex-1 p-8 overflow-auto">
          <div
            ref={canvasRef}
            className="relative min-h-[800px] bg-slate-800/30 rounded-3xl border-2 border-slate-700/50 p-8"
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onClick={() => setSelectedElement(null)}
          >
            {/* Render connectors */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
              {connectors.map((connector) => {
                const start = getElementCenter(connector.from)
                const end = getElementCenter(connector.to)
                return (
                  <g key={connector.id}>
                    <line
                      x1={start.x}
                      y1={start.y}
                      x2={end.x}
                      y2={end.y}
                      stroke={connector.color}
                      strokeWidth={connector.width}
                    />
                    <polygon
                      points={`${end.x},${end.y} ${end.x - 8},${end.y - 4} ${end.x - 8},${end.y + 4}`}
                      fill={connector.color}
                    />
                  </g>
                )
              })}
            </svg>

            {/* Render elements */}
            {elements.map((element) => renderElement(element))}

            {elements.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">🎨</div>
                  <h3 className="text-xl font-bold text-slate-400 mb-2">Empty Canvas</h3>
                  <p className="text-slate-500">Use the tools on the left to start creating!</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

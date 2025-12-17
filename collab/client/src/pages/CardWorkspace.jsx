import { useState, useEffect, useRef, useCallback } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useUserStore } from "../store/userStore"
import { 
  ArrowLeft, Type, Shapes, ImageIcon, Link2, Trash2, Save, 
  Bold, Italic, Underline, Upload, AlertCircle
} from "lucide-react"
import axios from "axios"
import io from "socket.io-client"

// Debounce utility
const debounce = (func, wait) => {
  let timeout
  return (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Clean elements before saving - remove base64 data
const cleanElementsForSave = (elements) => {
  return elements.map(el => {
    if (el.type === 'image' && el.url && el.url.startsWith('data:')) {
      // Only send storageKey reference, not full base64
      return {
        ...el,
        url: el.storageKey || 'image-placeholder'
      }
    }
    return el
  })
}

export default function CardWorkspace() {
  const { boardId, listId, cardId } = useParams()
  const { user } = useUserStore()
  const navigate = useNavigate()
  const canvasRef = useRef(null)
  const fileInputRef = useRef(null)
  const textInputRef = useRef(null)

  const [card, setCard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [socket, setSocket] = useState(null)
  const [activeTool, setActiveTool] = useState(null)
  
  // Canvas elements
  const [elements, setElements] = useState([])
  const [selectedElement, setSelectedElement] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [resizeHandle, setResizeHandle] = useState(null)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [elementStart, setElementStart] = useState({ x: 0, y: 0, width: 0, height: 0 })
  
  // Text tool
  const [editingTextId, setEditingTextId] = useState(null)
  
  // Shape tool
  const [selectedShape, setSelectedShape] = useState("rectangle")
  
  // Image tool
  const [imageUrl, setImageUrl] = useState("")
  
  // Connector tool
  const [connectorMode, setConnectorMode] = useState(false)
  const [connectorStart, setConnectorStart] = useState(null)
  const [tempConnectorEnd, setTempConnectorEnd] = useState(null)
  const [connectors, setConnectors] = useState([])
  const [selectedConnectorStyle, setSelectedConnectorStyle] = useState({
    type: "straight",
    color: "#8b5cf6",
    width: 2
  })

  // Canvas bounds
  const CANVAS_WIDTH = 1600
  const CANVAS_HEIGHT = 1200
  const MIN_ELEMENT_SIZE = 50

  useEffect(() => {
    if (!user) {
      navigate("/login")
      return
    }

    fetchCard()
    setupSocket()

    return () => {
      socket?.close()
    }
  }, [cardId, user])

  const setupSocket = () => {
    const socketUrl = import.meta.env.VITE_API_URL
    const newSocket = io(socketUrl, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      transports: ["websocket", "polling"],
    })

    newSocket.on("connect", () => {
      newSocket.emit("join-card", cardId)
    })

    newSocket.on("workspace:update", (data) => {
      if (data.elements) {
        // Restore image URLs from localStorage
        const restoredElements = data.elements.map(el => {
          if (el.type === 'image' && el.storageKey) {
            const storedUrl = localStorage.getItem(el.storageKey)
            return { ...el, url: storedUrl || el.url }
          }
          return el
        })
        setElements(restoredElements)
      }
      if (data.connectors) setConnectors(data.connectors)
    })

    newSocket.on("element:added", (element) => {
      setElements((prev) => {
        const filtered = prev.filter(el => el.id !== element.id)
        // Restore image from localStorage if needed
        if (element.type === 'image' && element.storageKey) {
          const storedUrl = localStorage.getItem(element.storageKey)
          if (storedUrl) element.url = storedUrl
        }
        return [...filtered, element]
      })
    })

    newSocket.on("element:updated", (updatedElement) => {
      setElements((prev) => prev.map((el) => {
        if (el.id === updatedElement.id) {
          // Restore image from localStorage if needed
          if (updatedElement.type === 'image' && updatedElement.storageKey) {
            const storedUrl = localStorage.getItem(updatedElement.storageKey)
            if (storedUrl) updatedElement.url = storedUrl
          }
          return updatedElement
        }
        return el
      }))
    })

    newSocket.on("element:deleted", ({ elementId }) => {
      setElements((prev) => prev.filter((el) => el.id !== elementId))
    })

    newSocket.on("connector:added", (connector) => {
      setConnectors((prev) => [...prev.filter(c => c.id !== connector.id), connector])
    })

    newSocket.on("connector:deleted", ({ connectorId }) => {
      setConnectors((prev) => prev.filter((c) => c.id !== connectorId))
    })

    setSocket(newSocket)
  }

  const fetchCard = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/cards/${cardId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setCard(response.data)
      
      // Restore elements with image URLs from localStorage
      if (response.data.elements) {
        const restoredElements = response.data.elements.map(el => {
          if (el.type === 'image' && el.storageKey) {
            const storedUrl = localStorage.getItem(el.storageKey)
            return { ...el, url: storedUrl || el.url }
          }
          return el
        })
        setElements(restoredElements)
      }
      
      if (response.data.connectors) setConnectors(response.data.connectors)
      
      setLoading(false)
      setError(null)
    } catch (error) {
      console.error("Failed to fetch card:", error)
      setError(error.response?.status === 404 
        ? "Card not found. It may have been deleted."
        : "Failed to load workspace. Please try again.")
      setLoading(false)
    }
  }

  // Debounced autosave with clean data
  const debouncedSave = useCallback(
    debounce(async (elementsToSave, connectorsToSave) => {
      if (error) return // Don't autosave if card failed to load
      
      try {
        const token = localStorage.getItem("token")
        const cleanedElements = cleanElementsForSave(elementsToSave)
        
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/cards/${cardId}`,
          { elements: cleanedElements, connectors: connectorsToSave },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      } catch (error) {
        console.error("Autosave failed:", error)
        if (error.response?.status === 404) {
          setError("Card was deleted. Autosave disabled.")
        }
      }
    }, 2000),
    [cardId, error]
  )

  useEffect(() => {
    if (!error && (elements.length > 0 || connectors.length > 0)) {
      debouncedSave(elements, connectors)
    }
  }, [elements, connectors, debouncedSave, error])

  const saveWorkspace = async () => {
    if (error) {
      alert("Cannot save: " + error)
      return
    }

    try {
      const token = localStorage.getItem("token")
      const cleanedElements = cleanElementsForSave(elements)
      
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/cards/${cardId}`,
        { elements: cleanedElements, connectors },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      if (socket) {
        socket.emit("workspace:save", { cardId, elements: cleanedElements, connectors })
      }
      
      alert("Workspace saved successfully!")
    } catch (error) {
      console.error("Failed to save workspace:", error)
      alert("Failed to save workspace: " + (error.response?.data?.message || error.message))
    }
  }

  // ===== UTILITY FUNCTIONS =====
  
  const constrainToBounds = (x, y, width, height) => {
    const constrainedX = Math.max(0, Math.min(x, CANVAS_WIDTH - width))
    const constrainedY = Math.max(0, Math.min(y, CANVAS_HEIGHT - height))
    return { x: constrainedX, y: constrainedY }
  }

  const getResizeHandle = (element, mouseX, mouseY) => {
    if (!element.size) return null
    
    const { position, size } = element
    const handleSize = 10
    
    const handles = {
      'nw': { x: position.x, y: position.y },
      'ne': { x: position.x + size.width, y: position.y },
      'sw': { x: position.x, y: position.y + size.height },
      'se': { x: position.x + size.width, y: position.y + size.height },
      'n': { x: position.x + size.width / 2, y: position.y },
      's': { x: position.x + size.width / 2, y: position.y + size.height },
      'e': { x: position.x + size.width, y: position.y + size.height / 2 },
      'w': { x: position.x, y: position.y + size.height / 2 },
    }

    for (const [handle, pos] of Object.entries(handles)) {
      if (Math.abs(mouseX - pos.x) < handleSize && Math.abs(mouseY - pos.y) < handleSize) {
        return handle
      }
    }
    
    return null
  }

  const handleResize = (element, handle, deltaX, deltaY) => {
    // Calculate new size first
    let newWidth = element.size.width
    let newHeight = element.size.height
    let newX = element.position.x
    let newY = element.position.y

    switch (handle) {
      case 'se':
        newWidth = Math.max(MIN_ELEMENT_SIZE, element.size.width + deltaX)
        newHeight = Math.max(MIN_ELEMENT_SIZE, element.size.height + deltaY)
        break
      case 'sw':
        newWidth = Math.max(MIN_ELEMENT_SIZE, element.size.width - deltaX)
        newHeight = Math.max(MIN_ELEMENT_SIZE, element.size.height + deltaY)
        newX = element.position.x + element.size.width - newWidth
        break
      case 'ne':
        newWidth = Math.max(MIN_ELEMENT_SIZE, element.size.width + deltaX)
        newHeight = Math.max(MIN_ELEMENT_SIZE, element.size.height - deltaY)
        newY = element.position.y + element.size.height - newHeight
        break
      case 'nw':
        newWidth = Math.max(MIN_ELEMENT_SIZE, element.size.width - deltaX)
        newHeight = Math.max(MIN_ELEMENT_SIZE, element.size.height - deltaY)
        newX = element.position.x + element.size.width - newWidth
        newY = element.position.y + element.size.height - newHeight
        break
      case 'n':
        newHeight = Math.max(MIN_ELEMENT_SIZE, element.size.height - deltaY)
        newY = element.position.y + element.size.height - newHeight
        break
      case 's':
        newHeight = Math.max(MIN_ELEMENT_SIZE, element.size.height + deltaY)
        break
      case 'e':
        newWidth = Math.max(MIN_ELEMENT_SIZE, element.size.width + deltaX)
        break
      case 'w':
        newWidth = Math.max(MIN_ELEMENT_SIZE, element.size.width - deltaX)
        newX = element.position.x + element.size.width - newWidth
        break
    }

    // Constrain to canvas bounds
    newX = Math.max(0, Math.min(newX, CANVAS_WIDTH - newWidth))
    newY = Math.max(0, Math.min(newY, CANVAS_HEIGHT - newHeight))
    
    // Adjust size if position was clamped
    if (newX === 0 && (handle.includes('w') || handle === 'nw' || handle === 'sw')) {
      newWidth = element.position.x + element.size.width
    }
    if (newY === 0 && (handle.includes('n') || handle === 'ne' || handle === 'nw')) {
      newHeight = element.position.y + element.size.height
    }
    
    return {
      position: { x: newX, y: newY },
      size: { width: newWidth, height: newHeight }
    }
  }

  // ===== SHAPE FUNCTIONS =====
  
  const handleAddShape = () => {
    const newElement = {
      id: `shape-${Date.now()}`,
      type: "shape",
      shape: selectedShape,
      position: { x: 300, y: 200 },
      size: { width: 200, height: 150 },
      strokeColor: "#8b5cf6",
      strokeWidth: 3,
      fill: "rgba(139, 92, 246, 0.1)",
      text: "",
      rotation: 0,
    }

    setElements([...elements, newElement])
    if (socket) socket.emit("element:add", { cardId, element: newElement })
    setActiveTool(null)
  }

  // ===== TEXT FUNCTIONS =====
  
  const handleAddText = (x = 200, y = 200) => {
    const newElement = {
      id: `text-${Date.now()}`,
      type: "text",
      content: "Double-click to edit",
      position: { x, y },
      size: { width: 250, height: 80 },
      fontSize: 16,
      color: "#ffffff",
      bold: false,
      italic: false,
      underline: false,
    }

    setElements([...elements, newElement])
    if (socket) socket.emit("element:add", { cardId, element: newElement })
    setActiveTool(null)
  }

  const updateTextElement = (elementId, updates) => {
    const updatedElements = elements.map((el) =>
      el.id === elementId ? { ...el, ...updates } : el
    )
    setElements(updatedElements)
    
    const updatedElement = updatedElements.find(el => el.id === elementId)
    if (socket && updatedElement) {
      socket.emit("element:update", { cardId, element: updatedElement })
    }
  }

  const handleTextFormatChange = (format) => {
    if (!selectedElement || selectedElement.type !== "text") return
    
    const newValue = !selectedElement[format]
    updateTextElement(selectedElement.id, { [format]: newValue })
    setSelectedElement({ ...selectedElement, [format]: newValue })
  }

  const handleFontSizeChange = (delta) => {
    if (!selectedElement || selectedElement.type !== "text") return
    
    const newSize = Math.max(8, Math.min(72, selectedElement.fontSize + delta))
    updateTextElement(selectedElement.id, { fontSize: newSize })
    setSelectedElement({ ...selectedElement, fontSize: newSize })
  }

  const handleColorChange = (color) => {
    if (!selectedElement || selectedElement.type !== "text") return
    
    updateTextElement(selectedElement.id, { color })
    setSelectedElement({ ...selectedElement, color })
  }

  // ===== IMAGE FUNCTIONS =====
  
  const handleAddImage = () => {
    if (!imageUrl.trim()) return

    const newElement = {
      id: `image-${Date.now()}`,
      type: "image",
      url: imageUrl,
      position: { x: 200, y: 200 },
      size: { width: 300, height: 300 },
    }

    setElements([...elements, newElement])
    if (socket) socket.emit("element:add", { cardId, element: newElement })
    
    setImageUrl("")
    setActiveTool(null)
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const imageData = event.target.result
      
      // Store in localStorage
      const storageKey = `img-${cardId}-${Date.now()}`
      localStorage.setItem(storageKey, imageData)

      const newElement = {
        id: `image-${Date.now()}`,
        type: "image",
        url: imageData, // Full URL for display
        storageKey,     // Reference for storage
        position: { x: 200, y: 200 },
        size: { width: 300, height: 300 },
      }

      setElements([...elements, newElement])
      if (socket) {
        // Send only reference, not base64
        socket.emit("element:add", { 
          cardId, 
          element: { ...newElement, url: storageKey }
        })
      }
      
      setActiveTool(null)
    }
    reader.readAsDataURL(file)
  }

  // ===== CONNECTOR FUNCTIONS =====
  
  const getAnchorPoints = (element) => {
    if (!element.position || !element.size) return []
    
    const { x, y } = element.position
    const { width, height } = element.size
    
    return [
      { id: 'top', x: x + width / 2, y: y, position: 'top' },
      { id: 'right', x: x + width, y: y + height / 2, position: 'right' },
      { id: 'bottom', x: x + width / 2, y: y + height, position: 'bottom' },
      { id: 'left', x: x, y: y + height / 2, position: 'left' },
    ]
  }

  const handleConnectorClick = (element) => {
    if (!connectorMode) return

    if (!connectorStart) {
      const anchorPoints = getAnchorPoints(element)
      setConnectorStart({
        elementId: element.id,
        anchor: anchorPoints[0]
      })
    } else if (connectorStart.elementId !== element.id) {
      const anchorPoints = getAnchorPoints(element)
      const newConnector = {
        id: `connector-${Date.now()}`,
        from: {
          elementId: connectorStart.elementId,
          anchor: connectorStart.anchor
        },
        to: {
          elementId: element.id,
          anchor: anchorPoints[0]
        },
        style: selectedConnectorStyle
      }
      
      setConnectors([...connectors, newConnector])
      if (socket) socket.emit("connector:add", { cardId, connector: newConnector })
      
      setConnectorStart(null)
      setConnectorMode(false)
    }
  }

  const deleteConnector = (connectorId) => {
    setConnectors(connectors.filter(c => c.id !== connectorId))
    if (socket) socket.emit("connector:delete", { cardId, connectorId })
  }

  // ===== MOUSE HANDLERS =====
  
  const getMousePosition = (e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }
  }

  const handleCanvasMouseDown = (e) => {
    if (e.target !== canvasRef.current && !e.target.classList.contains('canvas-bg')) return
    
    const { x, y } = getMousePosition(e)
    
    if (activeTool === "text") {
      handleAddText(x, y)
    } else {
      setSelectedElement(null)
      setEditingTextId(null)
    }
  }

  const handleElementMouseDown = (e, element) => {
    e.stopPropagation()
    
    const { x, y } = getMousePosition(e)
    
    // Check for resize handle
    const handle = getResizeHandle(element, x, y)
    
    if (handle) {
      setIsResizing(true)
      setResizeHandle(handle)
      setElementStart({
        x: element.position.x,
        y: element.position.y,
        width: element.size.width,
        height: element.size.height
      })
    } else {
      // Check for connector mode
      if (connectorMode) {
        handleConnectorClick(element)
        return
      }
      
      setIsDragging(true)
      setElementStart({
        x: element.position.x,
        y: element.position.y
      })
    }
    
    setDragStart({ x, y })
    setSelectedElement(element)
    setEditingTextId(null)
  }

  const handleMouseMove = (e) => {
    if (!isDragging && !isResizing) return
    
    const { x, y } = getMousePosition(e)
    const deltaX = x - dragStart.x
    const deltaY = y - dragStart.y
    
    if (isResizing && selectedElement) {
      const baseElement = {
        position: { x: elementStart.x, y: elementStart.y },
        size: { width: elementStart.width, height: elementStart.height }
      }
      
      const resized = handleResize(baseElement, resizeHandle, deltaX, deltaY)
      
      const updatedElement = {
        ...selectedElement,
        position: resized.position,
        size: resized.size
      }
      
      setElements(elements.map(el => el.id === selectedElement.id ? updatedElement : el))
      setSelectedElement(updatedElement)
    } else if (isDragging && selectedElement) {
      const newX = elementStart.x + deltaX
      const newY = elementStart.y + deltaY
      
      const constrained = constrainToBounds(newX, newY, selectedElement.size.width, selectedElement.size.height)
      
      const updatedElement = {
        ...selectedElement,
        position: constrained
      }
      
      setElements(elements.map(el => el.id === selectedElement.id ? updatedElement : el))
      setSelectedElement(updatedElement)
    }
  }

  const handleMouseUp = () => {
    if ((isDragging || isResizing) && selectedElement && socket) {
      socket.emit("element:update", { cardId, element: selectedElement })
    }
    
    setIsDragging(false)
    setIsResizing(false)
    setResizeHandle(null)
  }

  const handleElementDoubleClick = (element) => {
    if (element.type === "text") {
      setEditingTextId(element.id)
      setTimeout(() => textInputRef.current?.focus(), 0)
    } else if (element.type === "shape") {
      setEditingTextId(element.id)
      setTimeout(() => textInputRef.current?.focus(), 0)
    }
  }

  const updateShapeText = (elementId, text) => {
    const updatedElements = elements.map((el) =>
      el.id === elementId ? { ...el, text } : el
    )
    setElements(updatedElements)
    
    const updatedElement = updatedElements.find(el => el.id === elementId)
    if (socket && updatedElement) {
      socket.emit("element:update", { cardId, element: updatedElement })
    }
  }

  const handleDeleteElement = () => {
    if (!selectedElement) return
    
    setElements(elements.filter(el => el.id !== selectedElement.id))
    if (socket) socket.emit("element:delete", { cardId, elementId: selectedElement.id })
    setSelectedElement(null)
  }

  // ===== RENDER FUNCTIONS =====
  
  const renderElement = (element) => {
    const isSelected = selectedElement?.id === element.id

    switch (element.type) {
      case "text":
        return (
          <div
            key={element.id}
            className="canvas-element absolute"
            onMouseDown={(e) => handleElementMouseDown(e, element)}
            onDoubleClick={() => handleElementDoubleClick(element)}
            style={{
              left: element.position.x,
              top: element.position.y,
              width: element.size.width,
              height: element.size.height,
              cursor: editingTextId === element.id ? "text" : (isDragging ? "grabbing" : "grab"),
              border: isSelected ? "2px solid #8b5cf6" : "2px solid transparent",
              borderRadius: "4px",
              padding: "12px",
              backgroundColor: "rgba(30, 41, 59, 0.9)",
              color: element.color,
              fontSize: `${element.fontSize}px`,
              fontWeight: element.bold ? "bold" : "normal",
              fontStyle: element.italic ? "italic" : "normal",
              textDecoration: element.underline ? "underline" : "none",
              overflow: "auto",
              wordWrap: "break-word",
              whiteSpace: "pre-wrap",
              lineHeight: "1.5",
            }}
          >
            {editingTextId === element.id ? (
              <textarea
                ref={textInputRef}
                autoFocus
                value={element.content}
                onChange={(e) => updateTextElement(element.id, { content: e.target.value })}
                onBlur={() => setEditingTextId(null)}
                onMouseDown={(e) => e.stopPropagation()}
                className="w-full h-full bg-transparent border-none outline-none resize-none"
                style={{
                  color: element.color,
                  fontSize: `${element.fontSize}px`,
                  fontWeight: element.bold ? "bold" : "normal",
                  fontStyle: element.italic ? "italic" : "normal",
                  textDecoration: element.underline ? "underline" : "none",
                  lineHeight: "1.5",
                }}
              />
            ) : (
              element.content
            )}
          </div>
        )

      case "shape":
        return (
          <div
            key={element.id}
            className="canvas-element absolute"
            onMouseDown={(e) => handleElementMouseDown(e, element)}
            onDoubleClick={() => handleElementDoubleClick(element)}
            style={{
              left: element.position.x,
              top: element.position.y,
              width: element.size.width,
              height: element.size.height,
              cursor: isDragging ? "grabbing" : "grab",
              pointerEvents: "auto",
            }}
          >
            <svg width={element.size.width} height={element.size.height} style={{ overflow: "visible" }}>
              <g key={`shape-${element.id}`}>
                {element.shape === "rectangle" && (
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
                )}
                {element.shape === "circle" && (
                  <ellipse
                    cx={element.size.width / 2}
                    cy={element.size.height / 2}
                    rx={element.size.width / 2 - element.strokeWidth}
                    ry={element.size.height / 2 - element.strokeWidth}
                    stroke={element.strokeColor}
                    strokeWidth={element.strokeWidth}
                    fill={element.fill}
                  />
                )}
                {element.shape === "triangle" && (
                  <polygon
                    points={`${element.size.width / 2},${element.strokeWidth} ${element.size.width - element.strokeWidth},${element.size.height - element.strokeWidth} ${element.strokeWidth},${element.size.height - element.strokeWidth}`}
                    stroke={element.strokeColor}
                    strokeWidth={element.strokeWidth}
                    fill={element.fill}
                  />
                )}
                {element.shape === "diamond" && (
                  <polygon
                    points={`${element.size.width / 2},${element.strokeWidth} ${element.size.width - element.strokeWidth},${element.size.height / 2} ${element.size.width / 2},${element.size.height - element.strokeWidth} ${element.strokeWidth},${element.size.height / 2}`}
                    stroke={element.strokeColor}
                    strokeWidth={element.strokeWidth}
                    fill={element.fill}
                  />
                )}
                {isSelected && (
                  <rect
                    x="-2"
                    y="-2"
                    width={element.size.width + 4}
                    height={element.size.height + 4}
                    stroke="#8b5cf6"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="5,5"
                  />
                )}
              </g>
            </svg>
            {editingTextId === element.id ? (
              <input
                ref={textInputRef}
                autoFocus
                type="text"
                value={element.text || ""}
                onChange={(e) => updateShapeText(element.id, e.target.value)}
                onBlur={() => setEditingTextId(null)}
                onMouseDown={(e) => e.stopPropagation()}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-transparent border-none outline-none text-center text-white font-semibold px-2"
                style={{
                  width: element.size.width - 40,
                  fontSize: Math.min(16, element.size.width / 8) + "px",
                }}
                placeholder="Add text"
              />
            ) : element.text ? (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  color: "#ffffff",
                  fontSize: Math.min(16, element.size.width / 8) + "px",
                  fontWeight: "600",
                  pointerEvents: "none",
                  textAlign: "center",
                  maxWidth: element.size.width - 20,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {element.text}
              </div>
            ) : null}
          </div>
        )

      case "image":
        return (
          <div
            key={element.id}
            className="canvas-element absolute"
            onMouseDown={(e) => handleElementMouseDown(e, element)}
            style={{
              left: element.position.x,
              top: element.position.y,
              width: element.size.width,
              height: element.size.height,
              cursor: isDragging ? "grabbing" : "grab",
              border: isSelected ? "3px solid #8b5cf6" : "none",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <img
              src={element.url}
              alt="Workspace element"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                pointerEvents: "none",
              }}
            />
          </div>
        )

      default:
        return null
    }
  }

  const renderConnectors = () => {
    return connectors.map((connector) => {
      const fromElement = elements.find(el => el.id === connector.from.elementId)
      const toElement = elements.find(el => el.id === connector.to.elementId)
      
      if (!fromElement || !toElement) return null

      const fromPoints = getAnchorPoints(fromElement)
      const toPoints = getAnchorPoints(toElement)
      
      const fromAnchor = fromPoints.find(p => p.id === connector.from.anchor.id) || fromPoints[0]
      const toAnchor = toPoints.find(p => p.id === connector.to.anchor.id) || toPoints[0]

      return (
        <g key={connector.id}>
          <line
            x1={fromAnchor.x}
            y1={fromAnchor.y}
            x2={toAnchor.x}
            y2={toAnchor.y}
            stroke={connector.style.color}
            strokeWidth={connector.style.width}
            markerEnd="url(#arrowhead)"
          />
          <circle
            cx={(fromAnchor.x + toAnchor.x) / 2}
            cy={(fromAnchor.y + toAnchor.y) / 2}
            r="8"
            fill="#ef4444"
            cursor="pointer"
            onClick={() => deleteConnector(connector.id)}
          />
        </g>
      )
    })
  }

  const renderResizeHandles = () => {
    if (!selectedElement || !selectedElement.size || editingTextId === selectedElement.id) return null

    const { position, size } = selectedElement
    const handles = [
      { id: 'nw', x: position.x, y: position.y, cursor: 'nwse-resize' },
      { id: 'ne', x: position.x + size.width, y: position.y, cursor: 'nesw-resize' },
      { id: 'sw', x: position.x, y: position.y + size.height, cursor: 'nesw-resize' },
      { id: 'se', x: position.x + size.width, y: position.y + size.height, cursor: 'nwse-resize' },
      { id: 'n', x: position.x + size.width / 2, y: position.y, cursor: 'ns-resize' },
      { id: 's', x: position.x + size.width / 2, y: position.y + size.height, cursor: 'ns-resize' },
      { id: 'e', x: position.x + size.width, y: position.y + size.height / 2, cursor: 'ew-resize' },
      { id: 'w', x: position.x, y: position.y + size.height / 2, cursor: 'ew-resize' },
    ]

    return handles.map(handle => (
      <div
        key={`handle-${handle.id}`}
        style={{
          position: 'absolute',
          left: handle.x - 6,
          top: handle.y - 6,
          width: '12px',
          height: '12px',
          backgroundColor: '#8b5cf6',
          border: '2px solid white',
          borderRadius: '50%',
          cursor: handle.cursor,
          pointerEvents: 'auto',
          zIndex: 1000,
        }}
      />
    ))
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="bg-red-500/10 border border-red-500 rounded-lg p-8 max-w-md">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="text-red-500" size={32} />
            <h2 className="text-xl font-bold text-red-500">Workspace Error</h2>
          </div>
          <p className="text-slate-300 mb-6">{error}</p>
          <button
            onClick={() => navigate(`/board/${boardId}`)}
            className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft size={20} />
            Return to Board
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-slate-300">Loading workspace...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/board/${boardId}`)}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">{card?.title || "Card Workspace"}</h1>
            <p className="text-sm text-slate-400">{card?.description || "Collaborative canvas"}</p>
          </div>
        </div>

        <button
          onClick={saveWorkspace}
          className="px-4 py-2 bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors flex items-center gap-2"
        >
          <Save size={20} />
          Save
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-slate-800 border-b border-slate-700 px-6 py-3">
        <div className="flex items-center gap-4 flex-wrap">
          {/* Basic Tools */}
          <button
            onClick={() => setActiveTool(activeTool === "text" ? null : "text")}
            className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              activeTool === "text" ? "bg-violet-600" : "bg-slate-700 hover:bg-slate-600"
            }`}
          >
            <Type size={20} />
            Text
          </button>

          <button
            onClick={() => setActiveTool(activeTool === "shapes" ? null : "shapes")}
            className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              activeTool === "shapes" ? "bg-violet-600" : "bg-slate-700 hover:bg-slate-600"
            }`}
          >
            <Shapes size={20} />
            Shapes
          </button>

          <button
            onClick={() => setActiveTool(activeTool === "image" ? null : "image")}
            className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              activeTool === "image" ? "bg-violet-600" : "bg-slate-700 hover:bg-slate-600"
            }`}
          >
            <ImageIcon size={20} />
            Image
          </button>

          <button
            onClick={() => {
              setConnectorMode(!connectorMode)
              setConnectorStart(null)
            }}
            className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              connectorMode ? "bg-violet-600" : "bg-slate-700 hover:bg-slate-600"
            }`}
          >
            <Link2 size={20} />
            Connect
          </button>

          <div className="w-px h-8 bg-slate-600"></div>

          {/* Text Formatting Toolbar */}
          {selectedElement?.type === "text" && (
            <>
              <button
                onClick={() => handleTextFormatChange("bold")}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  selectedElement.bold ? "bg-violet-600" : "bg-slate-700 hover:bg-slate-600"
                }`}
                title="Bold (Ctrl+B)"
              >
                <Bold size={20} />
              </button>

              <button
                onClick={() => handleTextFormatChange("italic")}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  selectedElement.italic ? "bg-violet-600" : "bg-slate-700 hover:bg-slate-600"
                }`}
                title="Italic (Ctrl+I)"
              >
                <Italic size={20} />
              </button>

              <button
                onClick={() => handleTextFormatChange("underline")}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  selectedElement.underline ? "bg-violet-600" : "bg-slate-700 hover:bg-slate-600"
                }`}
                title="Underline (Ctrl+U)"
              >
                <Underline size={20} />
              </button>

              <div className="flex items-center gap-1 bg-slate-700 rounded-lg px-2">
                <button
                  onClick={() => handleFontSizeChange(-2)}
                  className="px-2 py-1 hover:bg-slate-600 rounded"
                  title="Decrease font size"
                >
                  -
                </button>
                <span className="text-sm px-2 min-w-[3ch] text-center">{selectedElement.fontSize}</span>
                <button
                  onClick={() => handleFontSizeChange(2)}
                  className="px-2 py-1 hover:bg-slate-600 rounded"
                  title="Increase font size"
                >
                  +
                </button>
              </div>

              <input
                type="color"
                value={selectedElement.color}
                onChange={(e) => handleColorChange(e.target.value)}
                className="w-10 h-10 rounded cursor-pointer bg-slate-700"
                title="Text color"
              />

              <div className="w-px h-8 bg-slate-600"></div>
            </>
          )}

          {selectedElement && (
            <button
              onClick={handleDeleteElement}
              className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center gap-2"
            >
              <Trash2 size={20} />
              Delete
            </button>
          )}
        </div>

        {/* Shape Selector */}
        {activeTool === "shapes" && (
          <div className="mt-3 p-3 bg-slate-700 rounded-lg flex items-center gap-3">
            <span className="text-sm text-slate-300">Select shape:</span>
            {["rectangle", "circle", "triangle", "diamond"].map((shape) => (
              <button
                key={shape}
                onClick={() => setSelectedShape(shape)}
                className={`px-3 py-2 rounded-lg capitalize transition-colors ${
                  selectedShape === shape ? "bg-violet-600" : "bg-slate-600 hover:bg-slate-500"
                }`}
              >
                {shape}
              </button>
            ))}
            <button
              onClick={handleAddShape}
              className="ml-auto px-4 py-2 bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors"
            >
              Add {selectedShape}
            </button>
          </div>
        )}

        {/* Image Tools */}
        {activeTool === "image" && (
          <div className="mt-3 p-3 bg-slate-700 rounded-lg">
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Enter image URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-600 rounded-lg border border-slate-500 focus:outline-none focus:border-violet-500"
              />
              <button
                onClick={handleAddImage}
                disabled={!imageUrl.trim()}
                className="px-4 py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
              >
                Add URL
              </button>
              <div className="w-px h-8 bg-slate-600"></div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors flex items-center gap-2"
              >
                <Upload size={20} />
                Upload
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>
        )}
      </div>

      {/* Canvas */}
      <div className="p-6 overflow-auto">
        <div
          ref={canvasRef}
          className="canvas-bg relative bg-slate-800 rounded-lg shadow-2xl"
          style={{
            width: CANVAS_WIDTH,
            height: CANVAS_HEIGHT,
            cursor: activeTool === "text" ? "crosshair" : "default",
          }}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Grid pattern */}
          <svg className="absolute inset-0 pointer-events-none" width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(148, 163, 184, 0.1)" strokeWidth="1" />
              </pattern>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 10 3, 0 6" fill="#8b5cf6" />
              </marker>
            </defs>
            <rect width={CANVAS_WIDTH} height={CANVAS_HEIGHT} fill="url(#grid)" />
            {renderConnectors()}
          </svg>

          {/* Elements */}
          {elements.map(renderElement)}

          {/* Resize Handles */}
          {renderResizeHandles()}

          {/* Connector preview */}
          {connectorMode && connectorStart && tempConnectorEnd && (
            <svg className="absolute inset-0 pointer-events-none" width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
              <line
                x1={connectorStart.anchor.x}
                y1={connectorStart.anchor.y}
                x2={tempConnectorEnd.x}
                y2={tempConnectorEnd.y}
                stroke="#8b5cf6"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
            </svg>
          )}
        </div>
      </div>
    </div>
  )
}

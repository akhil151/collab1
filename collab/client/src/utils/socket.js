import io from "socket.io-client"

let socket = null
let connectionAttempts = 0
const MAX_CONNECTION_ATTEMPTS = 5
let eventQueue = []
let isProcessingQueue = false

export const connectSocket = (url = "http://localhost:5000") => {
  if (!socket || !socket.connected) {
    try {
      if (connectionAttempts >= MAX_CONNECTION_ATTEMPTS) {
        console.warn("Max socket connection attempts reached")
        return null
      }

      socket = io(url, {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
        transports: ['websocket', 'polling'],
      })

      socket.on('connect', () => {
        console.log('Socket connected successfully')
        connectionAttempts = 0
        processEventQueue()
      })

      socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error.message)
        connectionAttempts++
      })

      socket.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason)
      })

    } catch (error) {
      console.error("Failed to connect socket:", error)
      connectionAttempts++
      return null
    }
  }
  return socket
}

const processEventQueue = () => {
  if (isProcessingQueue || !socket || !socket.connected) return
  
  isProcessingQueue = true
  
  while (eventQueue.length > 0 && socket && socket.connected) {
    const { eventName, args } = eventQueue.shift()
    try {
      socket.emit(eventName, ...args)
    } catch (error) {
      console.error(`Error emitting queued event ${eventName}:`, error)
    }
  }
  
  isProcessingQueue = false
}

export const getSocket = () => socket

export const disconnectSocket = () => {
  if (socket) {
    try {
      socket.disconnect()
      socket = null
      connectionAttempts = 0
    } catch (error) {
      console.error("Error disconnecting socket:", error)
    }
  }
}

export const emitEvent = (eventName, ...args) => {
  if (socket && socket.connected) {
    try {
      socket.emit(eventName, ...args)
    } catch (error) {
      console.error(`Error emitting event ${eventName}:`, error)
    }
  } else {
    // Queue event for when socket connects
    eventQueue.push({ eventName, args })
    
    // Try to process queue if socket exists but not connected yet
    if (socket && !isProcessingQueue) {
      setTimeout(() => {
        if (socket && socket.connected) {
          processEventQueue()
        }
      }, 100)
    }
  }
}

export const onEvent = (eventName, callback) => {
  if (socket) {
    try {
      socket.on(eventName, callback)
    } catch (error) {
      console.error(`Error setting up listener for ${eventName}:`, error)
    }
  } else {
    console.warn(`Cannot listen to ${eventName}: socket not initialized`)
  }
}

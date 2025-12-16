import io from "socket.io-client"

let socket = null
let connectionAttempts = 0
const MAX_CONNECTION_ATTEMPTS = 5

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
    console.warn(`Cannot emit ${eventName}: socket not connected`)
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

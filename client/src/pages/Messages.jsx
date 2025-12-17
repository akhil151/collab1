import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useUserStore } from "../store/userStore"
import { 
  Bell, Mail, CheckCircle, XCircle, UserPlus, Trash2, 
  ArrowLeft, Circle, MessageSquare, UserCheck 
} from "lucide-react"
import axios from "axios"
import Navbar from "../components/Navbar"
import { connectSocket, onEvent, emitEvent } from "../utils/socket"

export default function Messages() {
  const { user, logout } = useUserStore()
  const navigate = useNavigate()
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all") // all, unread, invitations, requests
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (!user) {
      navigate("/login")
      return
    }

    fetchMessages()
    fetchUnreadCount()
    
    // Connect to socket for real-time message updates
    const socket = connectSocket(import.meta.env.VITE_API_URL)
    emitEvent("join-user", user._id)
    
    // Listen for new messages
    onEvent("message:received", (data) => {
      console.log("New message received:", data)
      fetchMessages()
      fetchUnreadCount()
    })
    
    // Listen for message updates (status changes)
    onEvent("message:updated", (data) => {
      console.log("Message updated:", data)
      // Refetch messages to get the updated status
      fetchMessages()
    })
  }, [user])

  const fetchMessages = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/messages`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setMessages(response.data)
    } catch (error) {
      console.error("Failed to fetch messages:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/messages/unread-count`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setUnreadCount(response.data.count)
    } catch (error) {
      console.error("Failed to fetch unread count:", error)
    }
  }

  const markAsRead = async (messageId) => {
    if (!messageId) {
      console.error("No message ID provided")
      return
    }

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        console.error("No token found")
        navigate("/login")
        return
      }

      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/messages/${messageId}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      setMessages(messages.map(msg => 
        msg && msg._id === messageId ? { ...msg, read: true } : msg
      ))
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error("Failed to mark as read:", error)
      if (error.response?.status === 401) {
        localStorage.removeItem("token")
        navigate("/login")
      }
    }
  }

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        console.error("No token found")
        navigate("/login")
        return
      }

      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/messages/read-all`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      setMessages(messages.map(msg => msg ? { ...msg, read: true } : msg))
      setUnreadCount(0)
    } catch (error) {
      console.error("Failed to mark all as read:", error)
      if (error.response?.status === 401) {
        localStorage.removeItem("token")
        navigate("/login")
      }
    }
  }

  const acceptInvitation = async (messageId, invitationId) => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/invitations/${invitationId}/accept`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      // Socket event will trigger message refetch to show updated status
      alert("Invitation accepted! You can now access the board.")
      fetchMessages()
    } catch (error) {
      console.error("Failed to accept invitation:", error)
      alert(error.response?.data?.message || "Failed to accept invitation")
    }
  }

  const rejectInvitation = async (messageId, invitationId) => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/invitations/${invitationId}/reject`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      // Socket event will trigger message refetch to show updated status
      alert("Invitation rejected")
      fetchMessages()
    } catch (error) {
      console.error("Failed to reject invitation:", error)
      alert(error.response?.data?.message || "Failed to reject invitation")
    }
  }

  const acceptCollaborationRequest = async (messageId, requestId) => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/collaboration-requests/${requestId}/accept`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      // Socket event will trigger message refetch to show updated status
      alert("Collaboration request accepted!")
      fetchMessages()
    } catch (error) {
      console.error("Failed to accept collaboration request:", error)
      alert(error.response?.data?.message || "Failed to accept request")
    }
  }

  const rejectCollaborationRequest = async (messageId, requestId) => {
    const reason = prompt("Reason for rejection (optional):")
    
    try {
      const token = localStorage.getItem("token")
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/collaboration-requests/${requestId}/reject`,
        { reason },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      // Socket event will trigger message refetch to show updated status
      alert("Collaboration request rejected")
      fetchMessages()
    } catch (error) {
      console.error("Failed to reject collaboration request:", error)
      alert(error.response?.data?.message || "Failed to reject request")
    }
  }

  const acceptJoinRequest = async (messageId, requestId) => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/join-requests/${requestId}/accept`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      // Socket event will trigger message refetch to show updated status
      alert("Join request accepted!")
      fetchMessages()
    } catch (error) {
      console.error("Failed to accept join request:", error)
      alert(error.response?.data?.message || "Failed to accept request")
    }
  }

  const rejectJoinRequest = async (messageId, requestId) => {
    const reason = prompt("Reason for rejection (optional):")
    
    try {
      const token = localStorage.getItem("token")
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/join-requests/${requestId}/reject`,
        { reason },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      // Socket event will trigger message refetch to show updated status
      alert("Join request rejected")
      fetchMessages()
    } catch (error) {
      console.error("Failed to reject join request:", error)
      alert(error.response?.data?.message || "Failed to reject request")
    }
  }

  const getMessageIcon = (type) => {
    switch (type) {
      case "invitation":
        return <Mail className="w-5 h-5 text-blue-600" />
      case "join_request":
        return <UserPlus className="w-5 h-5 text-purple-600" />
      case "request_accepted":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "request_rejected":
        return <XCircle className="w-5 h-5 text-red-600" />
      case "removed_from_board":
        return <Trash2 className="w-5 h-5 text-orange-600" />
      case "collaboration_request":
        return <UserCheck className="w-5 h-5 text-purple-600" />
      case "collaboration_accepted":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "collaboration_rejected":
        return <XCircle className="w-5 h-5 text-red-600" />
      default:
        return <MessageSquare className="w-5 h-5 text-gray-600" />
    }
  }

  const getMessageTitle = (type) => {
    switch (type) {
      case "invitation":
        return "Board Invitation"
      case "join_request":
        return "Join Request"
      case "request_accepted":
        return "Request Accepted"
      case "request_rejected":
        return "Request Rejected"
      case "removed_from_board":
        return "Removed from Board"
      case "collaboration_request":
        return "Collaboration Request"
      case "collaboration_accepted":
        return "Collaboration Accepted"
      case "collaboration_rejected":
        return "Collaboration Rejected"
      default:
        return "Notification"
    }
  }

  const filteredMessages = messages.filter(msg => {
    if (filter === "all") return true
    if (filter === "unread") return !msg.read
    if (filter === "invitations") return msg.type === "invitation"
    if (filter === "requests") return [
      "join_request", 
      "request_accepted", 
      "request_rejected", 
      "collaboration_request", 
      "collaboration_accepted", 
      "collaboration_rejected"
    ].includes(msg.type)
    return true
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Navbar user={user} onLogout={logout} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-gray-600 hover:text-purple-600 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
                <p className="text-gray-600">
                  {unreadCount > 0 ? `${unreadCount} unread message${unreadCount > 1 ? 's' : ''}` : 'No unread messages'}
                </p>
              </div>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
              >
                Mark all as read
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: "all", label: "All Messages" },
            { id: "unread", label: "Unread" },
            { id: "invitations", label: "Invitations" },
            { id: "requests", label: "Requests" }
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setFilter(id)}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                filter === id
                  ? "bg-purple-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Messages List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-3 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="bg-white rounded-2xl p-20 text-center shadow-lg border border-gray-200">
            <Bell className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No messages</h3>
            <p className="text-gray-600">
              {filter === "all" 
                ? "You don't have any messages yet" 
                : `No ${filter} messages`}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredMessages.map((message) => (
              <div
                key={message._id}
                onClick={() => !message.read && markAsRead(message._id)}
                className={`bg-white rounded-xl p-6 shadow-lg border transition-all cursor-pointer hover:shadow-xl ${
                  message.read 
                    ? "border-gray-200" 
                    : "border-purple-300 bg-purple-50/50"
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {getMessageIcon(message.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {getMessageTitle(message.type)}
                        </h3>
                        {message.board && message.board.title && (
                          <p className="text-sm text-purple-600 font-medium">
                            Board: {message.board.title}
                          </p>
                        )}
                        {message.board && !message.board.title && (
                          <p className="text-sm text-gray-500 font-medium">
                            Board: [Deleted Board]
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {!message.read && (
                          <Circle className="w-3 h-3 fill-purple-600 text-purple-600" />
                        )}
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {new Date(message.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-3">{message.content}</p>

                    {message.sender && (
                      <p className="text-sm text-gray-600">
                        From: <span className="font-semibold">{message.sender.name}</span> ({message.sender.email})
                      </p>
                    )}

                    {/* Status Display or Action Buttons for Invitations */}
                    {message.type === "invitation" && message.metadata?.invitationId && (
                      <div className="mt-4">
                        {message.status === "pending" ? (
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                acceptInvitation(message._id, message.metadata.invitationId)
                              }}
                              className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Accept
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                rejectInvitation(message._id, message.metadata.invitationId)
                              }}
                              className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                            >
                              <XCircle className="w-4 h-4" />
                              Reject
                            </button>
                          </div>
                        ) : message.status === "accepted" ? (
                          <div className="px-4 py-2 bg-green-100 text-green-800 font-semibold rounded-lg flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Accepted
                          </div>
                        ) : message.status === "rejected" ? (
                          <div className="px-4 py-2 bg-red-100 text-red-800 font-semibold rounded-lg flex items-center gap-2">
                            <XCircle className="w-4 h-4" />
                            Rejected
                          </div>
                        ) : null}
                      </div>
                    )}

                    {/* Status Display or Action Buttons for Collaboration Requests */}
                    {message.type === "collaboration_request" && message.metadata?.collaborationRequestId && (
                      <div className="mt-4">
                        {message.status === "pending" ? (
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                acceptCollaborationRequest(message._id, message.metadata.collaborationRequestId)
                              }}
                              className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Accept
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                rejectCollaborationRequest(message._id, message.metadata.collaborationRequestId)
                              }}
                              className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                            >
                              <XCircle className="w-4 h-4" />
                              Reject
                            </button>
                          </div>
                        ) : message.status === "accepted" ? (
                          <div className="px-4 py-2 bg-green-100 text-green-800 font-semibold rounded-lg flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Accepted
                          </div>
                        ) : message.status === "rejected" ? (
                          <div className="px-4 py-2 bg-red-100 text-red-800 font-semibold rounded-lg flex items-center gap-2">
                            <XCircle className="w-4 h-4" />
                            Rejected
                            {message.metadata?.reason && (
                              <span className="text-sm">({message.metadata.reason})</span>
                            )}
                          </div>
                        ) : null}
                      </div>
                    )}

                    {/* Status Display or Action Buttons for Join Requests */}
                    {message.type === "join_request" && message.metadata?.joinRequestId && (
                      <div className="mt-4">
                        {message.status === "pending" ? (
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                acceptJoinRequest(message._id, message.metadata.joinRequestId)
                              }}
                              className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Accept
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                rejectJoinRequest(message._id, message.metadata.joinRequestId)
                              }}
                              className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                            >
                              <XCircle className="w-4 h-4" />
                              Reject
                            </button>
                          </div>
                        ) : message.status === "accepted" ? (
                          <div className="px-4 py-2 bg-green-100 text-green-800 font-semibold rounded-lg flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Accepted
                          </div>
                        ) : message.status === "rejected" ? (
                          <div className="px-4 py-2 bg-red-100 text-red-800 font-semibold rounded-lg flex items-center gap-2">
                            <XCircle className="w-4 h-4" />
                            Rejected
                            {message.metadata?.reason && (
                              <span className="text-sm">({message.metadata.reason})</span>
                            )}
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

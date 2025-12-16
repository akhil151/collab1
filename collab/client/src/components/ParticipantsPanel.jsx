import { useState, useEffect } from "react"
import { X, UserPlus, Users, Mail, Check, XCircle, Trash2, Shield, User as UserIcon, Crown } from "lucide-react"
import axios from "axios"
import { useUserStore } from "../store/userStore"
import { connectSocket, onEvent, emitEvent } from "../utils/socket"

export default function ParticipantsPanel({ isOpen, onClose, boardId }) {
  const { user } = useUserStore()
  const [activeTab, setActiveTab] = useState("participants")
  const [participants, setParticipants] = useState([])
  const [joinRequests, setJoinRequests] = useState([])
  const [loading, setLoading] = useState(false)
  
  // Invitation form
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteMessage, setInviteMessage] = useState("")
  const [inviteSending, setInviteSending] = useState(false)

  // Board details for role checking
  const [board, setBoard] = useState(null)

  useEffect(() => {
    if (isOpen && boardId) {
      fetchBoard()
      fetchParticipants()
      if (isAdmin) {
        fetchJoinRequests()
      }
      
      // Connect to socket for real-time updates
      try {
        const socket = connectSocket(import.meta.env.VITE_API_URL || "http://localhost:5000")
        if (user && user.id) {
          emitEvent("join-board", boardId, user.id)
        }
        
        // Listen for participant added
        onEvent("participant:added", (data) => {
          if (data) {
            console.log("Participant added:", data)
            fetchParticipants()
          }
        })
        
        // Listen for participant removed
        onEvent("participant:removed", (data) => {
          if (data) {
            console.log("Participant removed:", data)
            fetchParticipants()
          }
        })
      } catch (error) {
        console.error("Socket connection error:", error)
      }
    }
  }, [isOpen, boardId])

  const fetchBoard = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/boards/${boardId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setBoard(response.data)
    } catch (error) {
      console.error("Failed to fetch board:", error)
    }
  }

  const fetchParticipants = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      if (!token) {
        console.error("No token found")
        return
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/boards/${boardId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      // Get participants from board members
      const boardData = response.data
      if (!boardData) {
        console.error("No board data received")
        setParticipants([])
        return
      }

      const participantList = Array.isArray(boardData.participants) 
        ? boardData.participants.filter(p => p && p.user) 
        : []
      setParticipants(participantList)
    } catch (error) {
      console.error("Failed to fetch participants:", error)
      setParticipants([])
    } finally {
      setLoading(false)
    }
  }

  const fetchJoinRequests = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        console.error("No token found")
        return
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/join-requests/board/${boardId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      if (response.data && Array.isArray(response.data)) {
        setJoinRequests(response.data.filter(req => req && req._id))
      } else {user && (
    (typeof board.owner === 'string' && board.owner === user.id) ||
    (board.owner._id && board.owner._id === user.id) ||
    (board.owner.id && board.owner.id === user.id)
  )
        console.error("Invalid join requests data")
        setJoinRequests([])
      }
    } catch (error) {
      console.error("Failed to fetch join requests:", error)
      setJoinRequests([])
    }
  }

  const isAdmin = board && board.owner && board.owner._id === user?._id

  const sendInvitation = async (e) => {
    e.preventDefault()
    
    if (!inviteEmail.trim()) {
      alert("Please enter an email address")
      return
    }

    setInviteSending(true)
    try {
      const token = localStorage.getItem("token")
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/invitations`,
        {
          recipientEmail: inviteEmail,
          boardId,
          message: inviteMessage
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      alert("Invitation sent successfully!")
      setInviteEmail("")
      setInviteMessage("")
    } catch (error) {
      console.error("Failed to send invitation:", error)
      alert(error.response?.data?.message || "Failed to send invitation")
    } finally {
      setInviteSending(false)
    }
  }

  const acceptJoinRequest = async (requestId) => {
    try {
      const token = localStorage.getItem("token")
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/join-requests/${requestId}/accept`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      alert("Join request accepted!")
      fetchJoinRequests()
      fetchParticipants()
    } catch (error) {
      console.error("Failed to accept request:", error)
      alert(error.response?.data?.message || "Failed to accept request")
    }
  }

  const rejectJoinRequest = async (requestId) => {
    const reason = prompt("Reason for rejection (optional):")
    
    try {
      const token = localStorage.getItem("token")
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/join-requests/${requestId}/reject`,
        { reason },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      alert("Join request rejected")
      fetchJoinRequests()
    } catch (error) {
      console.error("Failed to reject request:", error)
      alert(error.response?.data?.message || "Failed to reject request")
    }
  }

  const removeParticipant = async (participantId) => {
    if (!confirm("Are you sure you want to remove this participant?")) {
      return
    }

    const reason = prompt("Reason for removal (optional):")
    
    try {
      const token = localStorage.getItem("token")
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/boards/${boardId}/members/${participantId}`,
        { 
          headers: { Authorization: `Bearer ${token}` },
          data: { reason }
        }
      )
      
      alert("Participant removed")
      fetchParticipants()
    } catch (error) {
      console.error("Failed to remove participant:", error)
      alert(error.response?.data?.message || "Failed to remove participant")
    }
  }

  const getRoleBadge = (role) => {
    switch (role) {
      case "owner":
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
            <Crown className="w-3 h-3" />
            Owner
          </span>
        )
      case "admin":
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
            <Shield className="w-3 h-3" />
            Admin
          </span>
        )
      case "member":
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
            <UserIcon className="w-3 h-3" />
            Member
          </span>
        )
      default:
        return null
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50">
      <div className="w-full max-w-2xl h-full bg-white shadow-2xl overflow-hidden animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6" />
            <h2 className="text-2xl font-bold">Manage Participants</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 bg-gray-50">
          <button
            onClick={() => setActiveTab("participants")}
            className={`flex-1 px-6 py-4 font-semibold transition-colors ${
              activeTab === "participants"
                ? "border-b-2 border-purple-600 text-purple-600 bg-white"
                : "text-gray-600 hover:text-purple-600"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Users className="w-5 h-5" />
              Participants
            </div>
          </button>
          {isAdmin && (
            <>
              <button
                onClick={() => setActiveTab("invite")}
                className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                  activeTab === "invite"
                    ? "border-b-2 border-purple-600 text-purple-600 bg-white"
                    : "text-gray-600 hover:text-purple-600"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <UserPlus className="w-5 h-5" />
                  Send Invite
                </div>
              </button>
              <button
                onClick={() => setActiveTab("requests")}
                className={`flex-1 px-6 py-4 font-semibold transition-colors relative ${
                  activeTab === "requests"
                    ? "border-b-2 border-purple-600 text-purple-600 bg-white"
                    : "text-gray-600 hover:text-purple-600"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Mail className="w-5 h-5" />
                  Requests
                  {joinRequests.length > 0 && (
                    <span className="absolute top-2 right-2 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {joinRequests.length}
                    </span>
                  )}
                </div>
              </button>
            </>
          )}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto h-[calc(100vh-180px)]">
          {/* Participants Tab */}
          {activeTab === "participants" && (
            <div>
              <p className="text-gray-600 mb-6">
                {participants.length} {participants.length === 1 ? "participant" : "participants"} on this board
              </p>

              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="w-8 h-8 border-3 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
                </div>
              ) : participants.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No participants yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {participants.map((participant) => {
                    if (!participant || !participant.user) {
                      console.warn("Invalid participant data:", participant)
                      return null
                    }

                    const userId = typeof participant.user === 'string' 
                      ? participant.user 
                      : (participant.user._id || participant.user.id)
                    
                    const userName = typeof participant.user === 'string' 
                      ? "Unknown" 
                      : (participant.user.name || "Unknown")
                    
                    const userEmail = typeof participant.user === 'string' 
                      ? "" 
                      : (participant.user.email || "")

                    return (
                      <div
                        key={userId}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                            {userName[0] || "?"}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{userName}</p>
                            <p className="text-sm text-gray-600">{userEmail}</p>
                            {participant.joinedAt && (
                              <p className="text-xs text-gray-400 mt-1">
                                Joined {new Date(participant.joinedAt).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {getRoleBadge(participant.role)}
                          {isAdmin && participant.role !== "owner" && (
                            <button
                              onClick={() => removeParticipant(userId)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Remove participant"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* Send Invitation Tab */}
          {activeTab === "invite" && isAdmin && (
            <div>
              <p className="text-gray-600 mb-6">
                Invite users to collaborate on this board. They will receive an email notification.
              </p>

              <form onSubmit={sendInvitation} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Message (Optional)
                  </label>
                  <textarea
                    value={inviteMessage}
                    onChange={(e) => setInviteMessage(e.target.value)}
                    placeholder="Add a personal message to your invitation..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={inviteSending || !inviteEmail.trim()}
                  className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {inviteSending ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="w-5 h-5" />
                      Send Invitation
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Join Requests Tab */}
          {activeTab === "requests" && isAdmin && (
            <div>
              <p className="text-gray-600 mb-6">
                Review and manage join requests for this board
              </p>

              {joinRequests.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Mail className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No pending join requests</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {joinRequests.map((request) => (
                    <div
                      key={request._id}
                      className="p-4 bg-gray-50 rounded-xl border border-gray-200"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                            {request.requester?.name?.[0] || "?"}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{request.requester?.name}</p>
                            <p className="text-sm text-gray-600">{request.requester?.email}</p>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {request.message && (
                        <p className="text-sm text-gray-700 mb-4 p-3 bg-white rounded-lg border border-gray-200">
                          {request.message}
                        </p>
                      )}

                      <div className="flex gap-2">
                        <button
                          onClick={() => acceptJoinRequest(request._id)}
                          className="flex-1 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <Check className="w-4 h-4" />
                          Accept
                        </button>
                        <button
                          onClick={() => rejectJoinRequest(request._id)}
                          className="flex-1 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

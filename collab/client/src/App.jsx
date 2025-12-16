import { useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { useUserStore } from "./store/userStore"
import ProtectedRoute from "./components/ProtectedRoute"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import Board from "./pages/Board"
import Profile from "./pages/profile"
import CardWorkspace from "./pages/CardWorkspace"
import Messages from "./pages/Messages"


function App() {
  const { user, checkAuth } = useUserStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute user={user} />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/board/:id" element={<Board />} />
          <Route path="/board/:boardId/list/:listId/card/:cardId" element={<CardWorkspace />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/messages" element={<Messages />} />
        </Route>
        <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  )
}

export default App

import { Navigate, Outlet } from "react-router-dom"
import PropTypes from "prop-types"

export default function ProtectedRoute({ user }) {
  if (!user) {
    return <Navigate to="/login" replace />
  }
  return <Outlet />
}

ProtectedRoute.propTypes = {
  user: PropTypes.oneOfType([PropTypes.object, PropTypes.string])
}

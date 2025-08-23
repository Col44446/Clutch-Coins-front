import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const token = localStorage.getItem("token"); // admin login ke baad store hua token

  if (!token) {
    return <Navigate to="/login" replace />; // token nahi hai to login page pe bhej do
  }

  return children; // token hai to page dikhao
}

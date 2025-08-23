import Sidebar from "./sidebar";
import { Navigate } from "react-router-dom";

export default function AdminDashboard() {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />; // 🔹 Token guard

  return (
    <div className="p-6">
      <Sidebar />
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p className="mt-2">Yaha se blogs manage karo.</p>
    </div>
  );
}

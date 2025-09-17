import axios from "axios";

export const uploadFile = async (file, roomId, user) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("roomId", roomId);
  formData.append("userId", user.id);
  formData.append("userName", user.name);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
  const res = await axios.post(`${API_BASE_URL}/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    withCredentials: true,
  });

  return res.data;
};

import axios from "axios";

export const uploadFile = async (file, roomId, user) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("roomId", roomId);
  formData.append("userId", user.id);
  formData.append("userName", user.name);

  const res = await axios.post("http://localhost:5000/api/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    withCredentials: true,
  });

  return res.data;
};

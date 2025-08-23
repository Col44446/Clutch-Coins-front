import io from "socket.io-client";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

let socket;

export const initSocket = (user, roomId, handlers) => {
  socket = io(API_BASE_URL.replace("/api", ""), {
    withCredentials: true,
  });

  socket.on("connect", () => socket.emit("joinRoom", { roomId, user }));
  socket.on("connect_error", (err) => handlers.onError("Failed to connect to server"));
  socket.on("messageHistory", handlers.onMessageHistory);
  socket.on("message", handlers.onMessage);
  socket.on("readUpdate", handlers.onReadUpdate);
  socket.on("typing", handlers.onTyping);
  socket.on("stopTyping", handlers.onStopTyping);
  socket.on("users", handlers.onUsers);
  socket.on("error", handlers.onError);

  return socket;
};

export const sendMessage = ({ text, file }) => socket && socket.emit("chatMessage", { text, file });
export const sendTyping = () => socket && socket.emit("typing");
export const sendStopTyping = () => socket && socket.emit("stopTyping");
export const disconnectSocket = () => socket && socket.disconnect();
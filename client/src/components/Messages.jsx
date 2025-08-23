import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, User, Users, LogOut, Upload, Check, Mic, Smile } from "lucide-react";
import { initSocket, sendMessage, sendTyping, sendStopTyping, disconnectSocket } from "../socket/chatSocket";
import debounce from "lodash/debounce";
import EmojiPicker from "emoji-picker-react";

let BadWords;
import("bad-words").then((module) => {
  BadWords = module.default;
});

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const [typingUsers, setTypingUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [roomId] = useState("gameZoneChat");
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);
  const audioChunksRef = useRef([]);
  const emojiPickerRef = useRef(null);
  const badWordsFilter = BadWords ? new BadWords() : { isProfane: () => false };

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

  const restrictedKeywords = [
    "top-up", "topup", "diamonds", "uc", "cp", "vbucks", "robux",
    "free fire", "pubg", "valorant", "cod points",
  ];
  const urlRegex = /(https?:\/\/[^\s]+)/gi;

  useEffect(() => {
    const user = {
      id: localStorage.getItem("userId") || `guest_${Math.random().toString(36).substr(2, 9)}`,
      name: localStorage.getItem("userName") || "Guest",
    };

    try {
      socketRef.current = initSocket(user, roomId, {
        onMessageHistory: (history) => setMessages(history),
        onMessage: (message) => setMessages((prev) => [...prev, message]),
        onReadUpdate: ({ messageId, readBy }) => {
          setMessages((prev) =>
            prev.map((msg) => (msg._id === messageId ? { ...msg, readBy } : msg))
          );
        },
        onTyping: (user) => setTypingUsers((prev) => [...new Set([...prev, user.name])]),
        onStopTyping: (user) => setTypingUsers((prev) => prev.filter((name) => name !== user.name)),
        onUsers: (users) => setOnlineUsers(users.map((u) => ({ ...u, status: u.status || "online" }))),
        onError: (msg) => setErrorMessage(msg),
      });
    } catch (err) {
      setErrorMessage("Failed to connect to chat server.");
    }

    return () => disconnectSocket(roomId);
  }, [roomId]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && socketRef.current) {
            const messageId = entry.target.dataset.messageId;
            socketRef.current.emit("readMessage", { messageId });
          }
        });
      },
      { threshold: 0.5 }
    );

    const messageElements = document.querySelectorAll(".message-article");
    messageElements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (errorMessage) setTimeout(() => setErrorMessage(""), 3000);
  }, [errorMessage]);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const startRecording = async () => {
    try {
      // Check microphone permission
      const permissionStatus = await navigator.permissions.query({ name: "microphone" });
      console.log("🎙️ Microphone permission status:", permissionStatus.state);
      if (permissionStatus.state === "denied") {
        setErrorMessage("Microphone access denied. Please allow in browser settings.");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      let mimeType = "audio/webm";
      if (!MediaRecorder.isTypeSupported("audio/webm")) {
        mimeType = MediaRecorder.isTypeSupported("audio/mp3") ? "audio/mp3" : "audio/ogg";
      }
      console.log("🎙️ Starting recording with MIME type:", mimeType);

      const recorder = new MediaRecorder(stream, { mimeType });
      audioChunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
          console.log("🎙️ Audio chunk received:", e.data.size);
        }
      };
      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        const fileName = `voice_message_${Date.now()}.${mimeType.split("/")[1]}`;
        const audioFile = new File([audioBlob], fileName, { type: mimeType });
        setFile(audioFile);
        console.log("🎙️ Audio file created:", { name: fileName, type: mimeType, size: audioFile.size });
        stream.getTracks().forEach((track) => track.stop());
      };
      recorder.onerror = (err) => {
        console.error("❌ Recorder error:", err);
        setErrorMessage("Recording failed. Try again or check device.");
      };
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (err) {
      console.error("❌ Recording error:", err.name, err.message);
      if (err.name === "NotFoundError") {
        setErrorMessage("No microphone found. Please connect a microphone.");
      } else if (err.name === "NotAllowedError") {
        setErrorMessage("Microphone access denied. Please allow in browser settings.");
      } else {
        setErrorMessage("Failed to start recording. Try again.");
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
      setMediaRecorder(null);
    }
  };

  const handleEmojiClick = (emojiObject) => {
    setInput((prev) => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const handleSend = async () => {
    if (!input.trim() && !file) return;

    if (badWordsFilter.isProfane(input)) {
      setErrorMessage("Inappropriate language detected!");
      setInput("");
      return;
    }

    const lowercaseInput = input.toLowerCase();
    if (urlRegex.test(input) || restrictedKeywords.some((keyword) => lowercaseInput.includes(keyword))) {
      setErrorMessage("Game top-up links or keywords not allowed.");
      setInput("");
      return;
    }

    let fileData = null;
    if (file) {
      if (!file.type.match(/^(image\/.*|video\/mp4|application\/pdf|audio\/(mp3|webm|ogg))$/)) {
        setErrorMessage(`Unsupported file type: ${file.type || "missing type"}`);
        console.log("❌ File validation failed:", { name: file.name, type: file.type });
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage("File size exceeds 10MB.");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await fetch(`${API_BASE_URL}/upload`, {
          method: "POST",
          body: formData,
        });
        if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
        const data = await res.json();
        console.log("📤 Upload response:", data);
        if (data.error || !data.file?.url || !data.file.mimeType) throw new Error(data.error || "Invalid response");
        fileData = {
          url: data.file.url,
          originalName: data.file.originalName,
          mimeType: data.file.mimeType,
          size: data.file.size,
        };
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 1000);
      } catch (err) {
        setErrorMessage(`File upload failed: ${err.message}`);
        return;
      }
    }

    if (socketRef.current) {
      sendMessage({ text: input, file: fileData });
      setInput("");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      sendStopTyping();
    } else {
      setErrorMessage("Not connected to chat server.");
    }
  };

  const debouncedSendTyping = useCallback(
    debounce(() => socketRef.current && sendTyping(), 500, { leading: true, trailing: false }),
    []
  );

  const handleTyping = (e) => {
    setInput(e.target.value);
    debouncedSendTyping();
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => socketRef.current && sendStopTyping(), 2000);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleLogout = () => {
    disconnectSocket(roomId);
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    window.location.href = "/";
  };

  const messageVariants = { hidden: { opacity: 0, y: 10, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2 } } };
  const typingVariants = { hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } }, pulse: { scale: [1, 1.05, 1], transition: { duration: 0.5, repeat: Infinity, repeatType: "reverse" } } };
  const userVariants = { hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0, transition: { duration: 0.3 } } };
  const chatWrapperVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.3 } } };
  const pulseVariants = {
    pulse: { scale: [1, 1.2, 1], transition: { duration: 0.6, repeat: Infinity, repeatType: "reverse" } }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full min-h-screen bg-transparent text-gray-800 font-sans overflow-hidden sm:p-2">
      <AnimatePresence>
        <motion.div className="flex flex-col sm:flex-row w-full max-w-[1200px] h-[90vh] sm:h-[80vh] bg-white shadow-lg rounded-xl overflow-hidden" variants={chatWrapperVariants} initial="visible" exit="hidden">
          <aside className="w-full sm:w-64 bg-gray-200 p-3 sm:p-4 flex flex-col border-b sm:border-r border-gray-300">
            <header className="flex items-center gap-2 mb-3 sm:mb-4">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" aria-hidden="true" />
              <h2 className="text-base sm:text-lg font-semibold text-blue-500">GameZone Chat</h2>
            </header>
            <section className="flex-1 overflow-y-auto">
              <h3 className="text-xs sm:text-sm font-medium text-gray-600 mb-2">Online ({onlineUsers.filter((u) => u.status === "online").length})</h3>
              <ul className="flex flex-col gap-1">
                <AnimatePresence>
                  {onlineUsers.map((user) => (
                    <motion.li key={user.id} variants={userVariants} initial="hidden" animate="visible" exit="hidden" className="flex items-center gap-2 text-gray-800 text-xs sm:text-sm p-1.5 rounded-md hover:bg-gray-300 transition-colors">
                      <User className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" aria-hidden="true" />
                      <span>{user.name}</span>
                      <span className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ml-auto shadow ${user.status === "online" ? "bg-green-500" : "bg-red-500"}`} title={user.status === "online" ? "Online" : "Offline"} />
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            </section>
            <motion.button onClick={handleLogout} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="mt-3 sm:mt-4 flex items-center gap-2 text-gray-600 text-xs sm:text-sm bg-transparent border-none p-2 rounded-md hover:text-red-600 hover:bg-red-100 transition-all" aria-label="Leave chat">
              <LogOut className="w-3 h-3 sm:w-4 sm:h-4" aria-hidden="true" />
              <span>Leave Chat</span>
            </motion.button>
          </aside>
          <main className="flex-1 flex flex-col p-3 sm:p-4 bg-gray-50">
            <section className="flex-1 overflow-y-auto flex flex-col gap-2 sm:gap-3 mb-3 sm:mb-4 pr-1 sm:pr-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-50">
              <AnimatePresence>
                {errorMessage && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-red-100 text-red-800 p-2 sm:p-3 rounded-lg text-xs sm:text-sm max-w-fit mx-auto font-semibold">
                    {errorMessage}
                  </motion.div>
                )}
                {messages.map((msg) => (
                  <motion.article
                    key={msg._id || `temp-${Date.now()}`}
                    data-message-id={msg._id}
                    variants={messageVariants}
                    initial="hidden"
                    animate="visible"
                    className={`message-article flex flex-col max-w-[85%] sm:max-w-[75%] p-2 sm:p-3 rounded-xl shadow-md hover:-translate-y-0.5 transition-transform ${msg.user?.id === (localStorage.getItem("userId") || "guest")
                        ? "bg-gradient-to-br from-blue-100 to-indigo-200 text-gray-800 ml-auto"
                        : "bg-gradient-to-br from-indigo-50 to-blue-100 text-gray-800 mr-auto"
                      }`}
                  >
                    <span className="text-xs font-semibold text-blue-500 mb-1">{msg.user?.name || "Unknown"}</span>
                    <p className="text-xs sm:text-sm break-words">{msg.text || ""}</p>
                    {msg.file?.url && (
                      <div className="mt-1 sm:mt-2">
                        {msg.file.mimeType && /image\/(jpg|jpeg|png|webp)/i.test(msg.file.mimeType) ? (
                          <img
                            src={msg.file.url}
                            alt={msg.file.originalName || "Image"}
                            className="max-w-[150px] sm:max-w-[200px] rounded-lg shadow-sm mt-1 sm:mt-2"
                          />
                        ) : msg.file.mimeType && /video\/mp4/i.test(msg.file.mimeType) ? (
                          <video src={msg.file.url} controls className="max-w-[150px] sm:max-w-[200px] rounded-lg shadow-sm mt-1 sm:mt-2" />
                        ) : msg.file.mimeType && /application\/pdf/i.test(msg.file.mimeType) ? (
                          <a
                            href={msg.file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-blue-500 text-xs sm:text-sm no-underline hover:underline"
                          >
                            <Upload className="w-3 h-3 sm:w-4 sm:h-4" /> {msg.file.originalName || "Document"}
                          </a>
                        ) : msg.file.mimeType && /audio\/(mp3|webm|ogg)/i.test(msg.file.mimeType) ? (
                          <audio
                            src={msg.file.url}
                            controls
                            className="max-w-[150px] sm:max-w-[200px] mt-1 sm:mt-2"
                          />
                        ) : (
                          <p className="text-xs text-red-500">
                            Unsupported file type: {msg.file.mimeType || "missing MIME type"}
                          </p>
                        )}
                      </div>
                    )}
                    <div className="flex items-center gap-1 sm:gap-2 mt-1 justify-end">
                      <time className="text-[10px] sm:text-xs text-gray-600">
                        {new Date(msg.ts || Date.now()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </time>
                      {msg.readBy?.length > 1 && (
                        <div className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-600">
                          <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-green-500" />
                          Seen by: {msg.readBy
                            .filter((read) => read?.userId !== msg.user?.id)
                            .map((read) => onlineUsers.find((u) => u.id === read?.userId)?.name || "Unknown")
                            .join(", ")}
                        </div>
                      )}
                    </div>
                  </motion.article>
                ))}
                {typingUsers.length > 0 && (
                  <motion.div variants={typingVariants} initial="hidden" animate={["visible", "pulse"]} exit="hidden" className="flex items-center gap-1 text-xs sm:text-sm italic p-2 bg-gradient-to-br from-indigo-50 to-blue-100 text-gray-800 rounded-xl max-w-fit">
                    {typingUsers.join(", ")} {typingUsers.length > 1 ? "are" : "is"} typing <span className="inline-flex gap-0.5 animate-dots">...</span>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} aria-hidden="true" />
            </section>
            <footer className="flex gap-1 sm:gap-2 p-2 sm:p-3 bg-gray-50 rounded-xl shadow-[0_-2px_4px_rgba(0,0,0,0.05)] sticky bottom-0 z-10 relative">
              <label className="flex items-center justify-center p-2 sm:p-3 bg-white border border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all touch-manipulation">
                <Upload className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                <input type="file" accept="image/*,video/mp4,application/pdf,audio/mp3,audio/webm,audio/ogg" onChange={handleFileChange} ref={fileInputRef} className="hidden" aria-label="File upload" />
              </label>
              <motion.button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-2 sm:p-3 bg-blue-500 hover:bg-blue-600 rounded-lg flex items-center justify-center border-none cursor-pointer transition-all touch-manipulation"
                aria-label="Toggle emoji picker"
                whileTap={{ scale: 0.95 }}
              >
                <Smile className="w-4 h-4 sm:w-5 sm:h-5 text-white" aria-hidden="true" />
              </motion.button>
              <motion.button
                onClick={isRecording ? stopRecording : startRecording}
                variants={pulseVariants}
                animate={isRecording ? "pulse" : uploadSuccess ? { backgroundColor: "#22c55e" } : {}}
                className={`p-2 sm:p-3 rounded-lg flex items-center justify-center border-none cursor-pointer transition-all touch-manipulation ${isRecording ? "bg-red-500 hover:bg-red-600" : uploadSuccess ? "bg-green-500 hover:bg-green-600" : "bg-blue-500 hover:bg-blue-600"}`}
                aria-label={isRecording ? "Stop recording" : "Start recording"}
                whileTap={{ scale: 0.95 }}
              >
                <Mic className="w-4 h-4 sm:w-5 sm:h-5 text-white" aria-hidden="true" />
              </motion.button>
              <div className="relative flex-1">
                <input
                  type="text"
                  value={input}
                  onChange={handleTyping}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className={`w-full p-2 sm:p-3 rounded-lg bg-white text-gray-800 text-xs sm:text-sm outline-none border ${badWordsFilter.isProfane(input) || restrictedKeywords.some((k) => input.toLowerCase().includes(k)) ? "border-red-500" : "border-gray-300 focus:border-blue-500"} focus:ring-1 focus:ring-blue-200 transition-all placeholder-gray-400 touch-manipulation`}
                  aria-label="Chat message input"
                />
                {showEmojiPicker && (
                  <div ref={emojiPickerRef} className="absolute bottom-12 sm:bottom-16 left-0 z-20 w-full sm:w-auto">
                    <EmojiPicker onEmojiClick={handleEmojiClick} width="100%" height={300} />
                  </div>
                )}
              </div>
              <motion.button
                onClick={handleSend}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-2 sm:p-3 rounded-lg flex items-center justify-center border-none cursor-pointer transition-all touch-manipulation ${uploadSuccess ? "bg-green-500 hover:bg-green-600" : "bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-800"} disabled:opacity-50 disabled:cursor-not-allowed`}
                aria-label="Send message"
                disabled={!input.trim() && !file}
                animate={uploadSuccess ? { scale: [1, 1.1, 1], transition: { duration: 0.3 } } : {}}
              >
                <Send className="w-4 h-4 sm:w-5 sm:h-5 text-white" aria-hidden="true" />
              </motion.button>
            </footer>
          </main>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Messages;
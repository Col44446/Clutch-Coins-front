const Message = require("../models/Message");
const BadWords = require("bad-words");

module.exports = (io) => {
  const badWordsFilter = new BadWords();
  const restrictedKeywords = [
    "top-up", "topup", "diamonds", "uc", "cp", "vbucks",
    "robux", "free fire", "pubg", "valorant", "cod points",
  ];
  const urlRegex = /(https?:\/\/[^\s]+)/gi;
  const allowedFileTypes = ["image/jpeg", "image/png", "image/webp", "video/mp4", "application/pdf", "audio/mp3", "audio/webm"];
  const maxFileSize = 10 * 1024 * 1024;

  const userStatus = new Map();

  io.on("connection", (socket) => {
    socket.on("joinRoom", async ({ roomId, user }) => {
      socket.data = { roomId, user };
      socket.join(roomId);
      userStatus.set(user.id, { name: user.name, status: "online" });

      try {
        const messages = await Message.find({ roomId }).sort({ ts: 1 }).limit(50).lean();
        socket.emit("messageHistory", messages);
      } catch (err) {
        socket.emit("error", "Failed to load message history");
      }

      const updateUserList = async () => {
        const sockets = await io.in(roomId).fetchSockets();
        const userList = Array.from(userStatus.entries()).map(([id, { name, status }]) => ({
          id,
          name,
          status,
        }));
        io.to(roomId).emit("users", userList);
      };
      updateUserList();

      socket.on("readMessage", async ({ messageId }) => {
        const { roomId, user } = socket.data;
        try {
          const message = await Message.findById(messageId);
          if (!message || message.roomId !== roomId) {
            socket.emit("error", "Invalid message ID");
            return;
          }
          if (!message.readBy.some((read) => read.userId === user.id)) {
            message.readBy.push({ userId: user.id, ts: new Date() });
            await message.save();
            io.to(roomId).emit("readUpdate", { messageId, readBy: message.readBy });
          }
        } catch (err) {
          socket.emit("error", "Failed to update read status");
        }
      });

      socket.on("chatMessage", async ({ text, file }) => {
        const { roomId, user } = socket.data;
        if (!roomId || !user || (!text && !file)) {
          socket.emit("error", "Invalid message data");
          return;
        }

        if (text && badWordsFilter.isProfane(text)) {
          socket.emit("error", "Inappropriate language detected");
          return;
        }

        const lowercaseText = text?.toLowerCase() || "";
        if (urlRegex.test(lowercaseText) || restrictedKeywords.some((word) => lowercaseText.includes(word))) {
          socket.emit("error", "Game top-up links or keywords not allowed");
          return;
        }

        if (file) {
          if (!allowedFileTypes.includes(file.mimeType)) {
            socket.emit("error", `Unsupported file type: ${file.mimeType || "missing MIME type"}`);
            return;
          }
          if (file.size > maxFileSize) {
            socket.emit("error", "File size exceeds 10MB limit");
            return;
          }
          const fileName = file.originalName?.toLowerCase() || "";
          if (restrictedKeywords.some((word) => fileName.includes(word))) {
            socket.emit("error", "File name contains restricted keywords");
            return;
          }
        }

        try {
          const message = new Message({
            roomId,
            user,
            text: text || "",
            file: file || null,
            readBy: [{ userId: user.id, ts: new Date() }],
            ts: new Date(),
          });
          await message.save();
          io.to(roomId).emit("message", {
            _id: message._id,
            user,
            text: message.text,
            file: message.file,
            readBy: message.readBy,
            ts: message.ts,
          });

          // Auto-delete messages if count exceeds 50
          const messageCount = await Message.countDocuments({ roomId });
          if (messageCount > 50) {
            const oldestMessages = await Message.find({ roomId }).sort({ ts: 1 }).limit(messageCount - 50);
            await Message.deleteMany({ _id: { $in: oldestMessages.map((m) => m._id) } });
          }
        } catch (err) {
          socket.emit("error", "Failed to send message");
        }
      });

      socket.on("typing", () => socket.to(roomId).emit("typing", socket.data.user));
      socket.on("stopTyping", () => socket.to(roomId).emit("stopTyping", socket.data.user));

      socket.on("disconnect", async () => {
        const { roomId, user } = socket.data;
        if (roomId && user) {
          userStatus.set(user.id, { name: user.name, status: "offline" });
          updateUserList();
          setTimeout(async () => {
            const sockets = await io.in(roomId).fetchSockets();
            if (!sockets.some((s) => s.data.user.id === user.id)) {
              userStatus.delete(user.id);
              updateUserList();
            }
          }, 30000);
        }
      });
    });
  });
};
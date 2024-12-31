import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("https://chat-backend-7jiw.onrender.com"); // Replace with your server's URL

function ChatPage() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState("");

  useEffect(() => {
    // Listen for incoming messages
    socket.on("receive-message", (newMessage) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        `${newMessage.sender || "Someone"}: ${newMessage.content}`,
      ]);
    });

    return () => {
      // Clean up socket connection on component unmount
      socket.off("receive-message");
    };
  }, []);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const messageData = {
      sender: "You", // Replace this with the actual user info in a real app
      content: message,
      room,
    };

    // Send message to server
    socket.emit("send-message", messageData);

    // Add your own message to the chat
    setMessages((prevMessages) => [...prevMessages, `You: ${message}`]);
    setMessage(""); // Clear input
  };

  const handleJoinRoom = () => {
    if (room.trim()) {
      socket.emit("join-room", room);
      alert(`You joined room: ${room}`);
    } else {
      alert("Please enter a room name.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Chat Page</h1>
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Enter room name (optional)"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          style={{ marginRight: "10px", padding: "5px" }}
        />
        <button onClick={handleJoinRoom} style={{ padding: "5px 10px" }}>
          Join Room
        </button>
      </div>
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Type your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ marginRight: "10px", padding: "5px" }}
        />
        <button onClick={handleSendMessage} style={{ padding: "5px 10px" }}>
          Send
        </button>
      </div>
      <div>
        <h3>Messages:</h3>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {messages.map((msg, index) => (
            <li key={index} style={{ margin: "5px 0" }}>
              {msg}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ChatPage;

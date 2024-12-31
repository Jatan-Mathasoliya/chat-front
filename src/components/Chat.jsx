import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import axios from "axios";

// Initialize Socket.IO client
const socket = io("https://chat-backend-7jiw.onrender.com"); // Replace with your server URL in production

function ChatPage({ currentUser, selectedUser }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (currentUser) {
      // Join the user's own room
      socket.emit("join-room", currentUser._id);
      console.log(`Joined room: ${currentUser._id}`);
    }

    // Listen for incoming messages
    socket.on("receive-message", (newMessage) => {
      console.log("Received message:", newMessage);
      // Check if the message is from or to the selected user
      if (
        (newMessage.sender === selectedUser._id && newMessage.receiver === currentUser._id) ||
        (newMessage.sender === currentUser._id && newMessage.receiver === selectedUser._id)
      ) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    });

    return () => {
      // Clean up socket listeners on component unmount
      socket.off("receive-message");
    };
  }, [currentUser, selectedUser]);

  useEffect(() => {
    if (currentUser && selectedUser) {
      // Fetch previous messages between currentUser and selectedUser
      axios
        .get(`/api/messages/${currentUser._id}/${selectedUser._id}`)
        .then((res) => {
          setMessages(res.data);
        })
        .catch((err) => console.error("Error fetching messages:", err));
    }
  }, [currentUser, selectedUser]);

  const handleSendMessage = () => {
    if (!message.trim()) return; // Prevent sending empty messages
    if (!selectedUser) return; // Ensure a user is selected

    const messageData = {
      sender: currentUser._id,
      receiver: selectedUser._id,
      content: message,
    };

    console.log("Sending message:", messageData);

    // Emit message to server
    socket.emit("send-message", messageData);

    // Add your own message to the chat
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: currentUser._id, receiver: selectedUser._id, content: message, createdAt: new Date() },
    ]);

    setMessage(""); // Clear input field
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Chat Page</h1>
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Type your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ marginRight: "10px", padding: "5px", width: "300px" }}
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
              <strong>{msg.sender === currentUser._id ? "You" : "Friend"}:</strong> {msg.content}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ChatPage;

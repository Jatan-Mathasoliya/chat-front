import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000");

const Chat = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!token) {
      navigate("/login");
    }

    // Fetch users
    axios
      .get("https://chat-backend-7jiw.onrender.com/api/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.log(err));

    // Join user's room
    socket.emit("join", userId);
  }, [navigate, token, userId]);

  useEffect(() => {
    if (selectedUser) {
      // Fetch messages
      axios
        .get(`https://chat-backend-7jiw.onrender.com/api/messages/${userId}/${selectedUser._id}`)
        .then((res) => setMessages(res.data))
        .catch((err) => console.log(err));
    }
  }, [selectedUser, userId]);

  useEffect(() => {
    socket.on("receive-message", (message) => {
      if (message.sender === selectedUser?._id) {
        setMessages((prev) => [...prev, message]);
      }
    });
  }, [selectedUser]);

  const sendMessage = () => {
    const message = { sender: userId, receiver: selectedUser._id, content: newMessage };
    socket.emit("send-message", message);
    axios.post("https://chat-backend-7jiw.onrender.com/api/messages", message);
    setMessages((prev) => [...prev, message]);
    setNewMessage("");
  };

  return (
    <div>
      <h2>Welcome to the Chat</h2>
      <div>
        <h3>Users</h3>
        {users.map((user) => (
          <div key={user._id} onClick={() => setSelectedUser(user)}>
            {user.email}
          </div>
        ))}
      </div>
      <div>
        <h3>Chat</h3>
        {selectedUser ? (
          <div>
            {messages.map((msg, idx) => (
              <div key={idx}>
                {msg.sender === userId ? `You: ${msg.content}` : `Friend: ${msg.content}`}
              </div>
            ))}
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        ) : (
          <p>Select a user to start chatting</p>
        )}
      </div>
    </div>
  );
};

export default Chat;

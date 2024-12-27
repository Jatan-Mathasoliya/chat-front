import React, { useState, useEffect } from "react";

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Connect to WebSocket server using environment variable
    const ws = new WebSocket(import.meta.env.VITE_WS_URL);
    ws.onmessage = (event) => {
      const newMessage = JSON.parse(event.data);
      setMessages((prev) => [...prev, newMessage]);
    };
    setSocket(ws);

    return () => ws.close(); // Clean up the WebSocket connection when the component is unmounted
  }, []);

  const sendMessage = () => {
    if (socket && message.trim()) {
      socket.send(JSON.stringify({ message }));
      setMessage("");
    }
  };

  return (
    <div>
      <h2>Chat</h2>
      <div>
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatPage;

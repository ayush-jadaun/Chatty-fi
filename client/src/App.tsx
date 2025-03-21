import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import crypto from "crypto-browserify";


const socket = io("http://localhost:3001");

const App: React.FC = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<string[]>([]);

  useEffect(() => {
    socket.on("chat message", (msg) => {
      setChat((prev) => [...prev, msg]);
    });

    socket.on("publicKey", ({ publicKey, prime, generator }) => {
      console.log("Received public key from server");

      const clientDH = crypto.createDiffieHellman(
        Buffer.from(prime, "base64"),
        Buffer.from(generator, "base64")
      );
      const clientPublicKey = clientDH.generateKeys("base64");

      socket.emit("clientPublicKey", clientPublicKey);
      console.log("Sent client public key to server");
    });

    return () => {
      socket.off("chat message");
      socket.off("publicKey");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("chat message", message);
      setMessage("");
    }
  };

  return (
    <div>
      <h1>Real-Time Chat</h1>
      <div>
        {chat.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default App;

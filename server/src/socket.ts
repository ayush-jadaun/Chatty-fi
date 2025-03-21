import { Server, Socket } from "socket.io";
import { generateKeyPair, computeSharedSecret } from "./deffieHellman.ts";

export const setupSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);


    const { dh, publicKey, prime, generator } = generateKeyPair();
    console.log(`Generated public key for ${socket.id}`);


    socket.emit("publicKey", { publicKey, prime, generator });


    socket.on("clientPublicKey", (clientPublicKey) => {
      const sharedSecret = computeSharedSecret(dh, clientPublicKey);
      console.log(`Shared secret established for ${socket.id}`);
      socket.emit("secretEstablished", { success: true });
    });

    socket.on("chat message", (msg) => {
      console.log(`Message from ${socket.id}: ${msg}`);
      io.emit("chat message", msg);
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};

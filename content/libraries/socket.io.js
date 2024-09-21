export const socketIO = `
import { Server } from 'socket.io';

export function initializeSocketIO(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "*",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Disconnect event
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });

    // Add more event listeners here as needed
  });

  return io;
}

// Helper function to emit events (can be used in other parts of the application)
export function emitEvent(io, event, data, room = null) {
  if (room) {
    io.to(room).emit(event, data);
  } else {
    io.emit(event, data);
  }
}
`;

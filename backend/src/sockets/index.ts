import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userEmail?: string;
}

export const setupSocketHandlers = (io: Server) => {
  // Authentication middleware for Socket.io
  io.use((socket: AuthenticatedSocket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as { userId: string; email: string };

      socket.userId = decoded.userId;
      socket.userEmail = decoded.email;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    logger.info(`User connected: ${socket.userId}`);

    // Join project room
    socket.on('join:project', (projectId: string) => {
      socket.join(`project:${projectId}`);
      logger.info(`User ${socket.userId} joined project ${projectId}`);
      
      // Notify others in the room
      socket.to(`project:${projectId}`).emit('user:joined', {
        userId: socket.userId,
        userEmail: socket.userEmail,
      });
    });

    // Leave project room
    socket.on('leave:project', (projectId: string) => {
      socket.leave(`project:${projectId}`);
      logger.info(`User ${socket.userId} left project ${projectId}`);
      
      socket.to(`project:${projectId}`).emit('user:left', {
        userId: socket.userId,
        userEmail: socket.userEmail,
      });
    });

    // Typing indicators
    socket.on('typing:start', ({ taskId, projectId }) => {
      socket.to(`project:${projectId}`).emit('user:typing', {
        taskId,
        userId: socket.userId,
        userEmail: socket.userEmail,
        isTyping: true,
      });
    });

    socket.on('typing:stop', ({ taskId, projectId }) => {
      socket.to(`project:${projectId}`).emit('user:typing', {
        taskId,
        userId: socket.userId,
        userEmail: socket.userEmail,
        isTyping: false,
      });
    });

    // Cursor position updates
    socket.on('cursor:update', ({ projectId, position }) => {
      socket.to(`project:${projectId}`).emit('cursor:move', {
        userId: socket.userId,
        userEmail: socket.userEmail,
        position,
      });
    });

    // Presence updates
    socket.on('presence:update', ({ projectId, status }) => {
      socket.to(`project:${projectId}`).emit('user:presence', {
        userId: socket.userId,
        userEmail: socket.userEmail,
        status, // online, away, busy
      });
    });

    // Disconnect
    socket.on('disconnect', () => {
      logger.info(`User disconnected: ${socket.userId}`);
      
      // Notify all rooms this user was in
      const rooms = Array.from(socket.rooms);
      rooms.forEach((room) => {
        if (room.startsWith('project:')) {
          socket.to(room).emit('user:disconnected', {
            userId: socket.userId,
            userEmail: socket.userEmail,
          });
        }
      });
    });

    // Error handling
    socket.on('error', (error) => {
      logger.error(`Socket error for user ${socket.userId}: ${error.message}`);
    });
  });

  return io;
};

// Helper function to emit events to a specific project
export const emitToProject = (io: Server, projectId: string, event: string, data: any) => {
  io.to(`project:${projectId}`).emit(event, data);
};

// Helper function to emit events to a specific user
export const emitToUser = (io: Server, userId: string, event: string, data: any) => {
  io.to(`user:${userId}`).emit(event, data);
};

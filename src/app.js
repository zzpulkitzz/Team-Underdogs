require('dotenv').config();
const express = require('express');
const db = require('./models');
const authRoutes = require('./routes/auth');
const consultationRoutes = require('./routes/consultations');
const http = require('http');
const socketio = require('socket.io');
const { Chat } = require('./models');
const chatRoutes = require('./routes/chat');
const dailyRoutes = require('./routes/daily');
const transcriptionRoutes = require('./routes/transcription')

const app = express();
app.use(express.json());
app.get("/health",(req,res)=>{
    res.send("ok")
})
app.use('/api/auth', authRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/chat', chatRoutes);
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "*", // Allow all origins for testing
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('joinConsultation', ({ consultationId }) => {
    console.log(`User ${socket.id} joining consultation ${consultationId}`);
    socket.join(`consultation_${consultationId}`);
    socket.emit('joinedConsultation', { consultationId });
  });

  socket.on('chatMessage', async ({ consultationId, senderId, message }) => {
    console.log(`Message from ${senderId} in consultation ${consultationId}: ${message}`);
    try {
      const chat = await Chat.create({ consultationId, senderId, message });
      io.to(`consultation_${consultationId}`).emit('chatMessage', {
        id: chat.id,
        consultationId: chat.consultationId,
        senderId: chat.senderId,
        message: chat.message,
        sentAt: chat.createdAt,
      });
    } catch (error) {
      console.error('Error saving chat message:', error);
      socket.emit('error', { message: 'Failed to save message' });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});
// Export the app and server for testing
module.exports = { app, server, io };

// Only start the server if this file is run directly (not imported)
if (require.main === module) {
  db.sequelize.sync({alter:true}).then(() => {
    server.listen(3000, () => {
      console.log('Server running on port 3000');
    });
app.use('/api/daily', dailyRoutes);
app.use('/api/transcription', transcriptionRoutes);
db.sequelize.sync({alter:true}).then(() => {
  app.listen(3000, () => {
    console.log('Server running on port 3000');
  });
}
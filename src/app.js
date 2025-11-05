require('dotenv').config();
const express = require('express');
const db = require('./models');
const authRoutes = require('./routes/auth');
const consultationRoutes = require('./routes/consultations');
const http = require('http');
const socketio = require('socket.io');
const { Chat } = require('./models');
const chatRoutes = require('./routes/chat');

console.log("d,",authRoutes)
const app = express();
app.use(express.json());
app.get("/health",(req,res)=>{
    res.send("ok")
})
app.use('/api/auth', authRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/chat', chatRoutes);
const server = http.createServer(app);
const io = socketio(server);

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('joinConsultation', ({ consultationId }) => {
    socket.join(`consultation_${consultationId}`);
  });

  socket.on('chatMessage', async ({ consultationId, senderId, message }) => {
    const chat = await Chat.create({ consultationId, senderId, message });
    io.to(`consultation_${consultationId}`).emit('chatMessage', {
      id: chat.id,
      consultationId: chat.consultationId,
      senderId: chat.senderId,
      message: chat.message,
      sentAt: chat.createdAt,
    });
  });
});
// Export the app for testing
module.exports = app;

// Only start the server if this file is run directly (not imported)
if (require.main === module) {
  db.sequelize.sync({alter:true}).then(() => {
    app.listen(3000, () => {
      console.log('Server running on port 3000');
    });
  });
}
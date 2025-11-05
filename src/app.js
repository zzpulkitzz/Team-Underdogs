require('dotenv').config();
const express = require('express');
const db = require('./models');
const authRoutes = require('./routes/auth');
const consultationRoutes = require('./routes/consultations');
const dailyRoutes = require('./routes/daily');
const transcriptionRoutes = require('./routes/transcription')

const app = express();
app.use(express.json());
app.get("/health",(req,res)=>{
    res.send("ok")
})
app.use('/api/auth', authRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/daily', dailyRoutes);
app.use('/api/transcription', transcriptionRoutes);
db.sequelize.sync({alter:true}).then(() => {
  app.listen(3000, () => {
    console.log('Server running on port 3000');
  });
});
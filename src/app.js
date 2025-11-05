require('dotenv').config();
const express = require('express');
const db = require('./models');
const authRoutes = require('./routes/auth');
const consultationRoutes = require('./routes/consultations');

console.log("d,",authRoutes)
const app = express();
app.use(express.json());
app.get("/health",(req,res)=>{
    res.send("ok")
})
app.use('/api/auth', authRoutes);
app.use('/api/consultations', consultationRoutes);

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
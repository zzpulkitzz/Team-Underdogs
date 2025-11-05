require('dotenv').config();
const express = require('express');
const db = require('./models');
const authRoutes = require('./routes/auth');
console.log("d,",authRoutes)
const app = express();
app.use(express.json());
app.get("/health",(req,res)=>{
    res.send("ok")
})
app.use('/api/auth', authRoutes);

db.sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('Server running on port 3000');
  });
});

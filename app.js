require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const authRouter = require('./routes/auth.js');
const notesRouter = require('./routes/notes.js');
var cors = require('cors');

const app = express();




const connectDB = async () => {
  try {
    await mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.xmntbhs.mongodb.net/keeperDB`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log("Mongoose connected successfully")
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
}

connectDB()



app.use(cors())
app.use(express.json())
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Credentials", true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
  next();
})
app.use("/api/auth", authRouter)
app.use("/api/notes", notesRouter)




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
})
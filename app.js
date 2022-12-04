require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const authRouter = require('./routes/auth.js');
const notesRouter = require('./routes/notes.js');
var cors = require('cors')
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
app.use("/api/auth", authRouter)
app.use("/api/notes", notesRouter)




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
})
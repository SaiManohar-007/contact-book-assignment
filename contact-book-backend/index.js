
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


const app = express();
app.use(express.json());
app.use(cors());

const contactRoutes = require('./routes/contactRoutes');
app.use('/contacts', contactRoutes);

const uri = "mongodb+srv://saimanoharvelaga007_db_user:Mcn8DtgQogwvnlgT@cluster0.vv4a9sg.mongodb.net/contactBookDB?retryWrites=true&w=majority&appName=Cluster0";


mongoose.connect(uri)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((error) => {
    console.error('MongoDB Atlas connection error:', error);
  });



app.get('/', (req, res) => {
  res.send('API is running');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});

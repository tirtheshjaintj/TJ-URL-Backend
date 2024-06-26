const express=require('express');
const app=express();
const userRoutes=require('./routes/userRoutes');
const urlRoutes=require('./routes/urlRoutes');
const { PORT } = require('./keys');
const cors=require('cors');
const connectDB = require('./db');
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());
app.get('/',(req,res)=>{
    return res.send('<h1>Working Nice</h1>');
})
app.use('/auth',userRoutes);
app.use('/url',urlRoutes);
connectDB();
app.listen(PORT,()=>console.log(`http://localhost:${PORT}`));
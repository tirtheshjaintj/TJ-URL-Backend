const mongoose=require('mongoose');
const { MONGO_URI } = require('./keys');
const connectDB=async()=>{
    const {connection}=await mongoose.connect(MONGO_URI);
    console.log(`MongoDB is connected ${connection.host}`);
};

module.exports=connectDB;

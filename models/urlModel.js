const mongoose = require("mongoose");
const urlSchema=new mongoose.Schema({
shortId:{
type:String,
required:true,
unique:true
},
redirect:{
type:String,
required:true
},
visits:[
    {
    timestamp:Number,
    os:String,
    browser:String,
    ip:String,
    language:String,
    country:String,
    state:String,
    city:String,
    coord:String,
    provider:String,
    postal:Number,
    timezone:String
}
],
createdBy:{
type:mongoose.Schema.Types.ObjectId,
ref:"users",
required:true
}
},{timestamps:true});

const model=mongoose.model("url",urlSchema);
module.exports=model;

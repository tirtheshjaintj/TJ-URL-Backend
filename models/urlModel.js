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
visits:[{timeStamp:{type:Number,required:true}}],
createdBy:{
type:mongoose.Schema.Types.ObjectId,
ref:"users"
}
},{timestamps:true});

const model=mongoose.model("url",urlSchema);
module.exports=model;

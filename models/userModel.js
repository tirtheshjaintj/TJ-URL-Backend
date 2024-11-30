const mongoose = require("mongoose");
const bcrypt=require('bcryptjs');

const userSchema=new mongoose.Schema(
{
name:{
    type:String,
    required:true
},
email:{
    type:String,
    required:true,
    unique:true
},
password:{
    type:String,
    required:true
},
google_id: {
  type: String,
  validate: {
    validator: function (v) {
      return v === null || /^\d{21}$/.test(v);
    },
    message: props => `Not Valid Google ID`
  },
  unique: true,
  sparse: true // Allows multiple `null` values
}

},{timestamps:true});

userSchema.pre("save",async function(next){
const user=this;
if(!user.isModified) return;
this.password=await bcrypt.hash(this.password,12);
next();
});

userSchema.methods.matchPassword=async function(password){
    return await bcrypt.compare(password,this.password);
};

const User=mongoose.model("user",userSchema);

module.exports=User;
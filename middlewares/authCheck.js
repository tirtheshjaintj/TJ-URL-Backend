const {getUser}=require("../services/auth");
async function restrictLoggedIn(req,res,next){
try{
const userId=req.headers["authorization"];
const token=userId.split('Bearer ')[1];
const user=getUser(token);
if(!user) return res.status(401).json({error:"Wrong Details"});
req.user=user;
next();
}
catch(error){
    return res.status(401).json({error:"Wrong Details"});
}
}
async function checkAuth(req,res,next){
    const userId=req.headers["authorization"];
    const token=userId.split('Bearer ')[1];
    const user=getUser(token);
    if(!user) return res.json({error:"Wrong Details"});
    next();
}

module.exports={restrictLoggedIn,checkAuth};
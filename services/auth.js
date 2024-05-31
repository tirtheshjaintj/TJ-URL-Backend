const jwt=require('jsonwebtoken');
const { JWT_SECRET } = require('../keys');
function setUser(user){
    return jwt.sign({user},JWT_SECRET);
}
function getUser(token){
    if(!token) return null;
    try{
        console.log(jwt.verify(token,JWT_SECRET));
        return jwt.verify(token,JWT_SECRET);
    }
    catch(err){
        console.log(err);
        return null;
    }
}

module.exports={
    setUser,
    getUser
}